import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Available candidate models in order of preference (working models prioritized)
const MODEL_CANDIDATES = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

// Helper to retry operations during transient 503 spikes
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 800
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const is503 =
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.status === 503;
      if (attempt < retries && is503) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Health & System status check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
    primaryModel: "gemini-3.8-flash",
    app: "OOPsMate AI",
  });
});

// Chat endpoint supporting both SSE streaming and regular JSON with model fallback
app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error:
          "Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in the server environment.",
      });
    }

    const { messages, mode = "learn", syllabusTopic, stream = true } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const modeInstructions: Record<string, string> = {
      learn:
        "Focus on clear conceptual understanding, intuitive real-world analogies, step-by-step breakdown, memory diagrams in ASCII if helpful, and clean C++ examples.",
      exam:
        "Format as high-scoring university examination answers (2-mark definition + syntax, 5-mark concept + working program + output, or 10-mark architectural explanation + diagrams + code + trade-offs). Highlight exact exam keywords professors look for.",
      code:
        "Provide complete, clean, modern C++ (C++17/20) programs with line-by-line explanation, compilation command (g++ -std=c++17 main.cpp), and exact expected terminal output.",
      debug:
        "Act as an expert C++ debugger. Identify the exact line of error, distinguish between syntax error, linker error, runtime error, memory leak, or undefined behavior (UB). Explain why it happens and provide the corrected code.",
      viva:
        "Act as a university oral viva examiner. Ask sharp follow-up questions, test core understanding of internals (vtable, vptr, memory footprint, stack vs heap, const correctness), and critique student answers.",
      quiz:
        "Present tricky C++ OOP MCQs with deceptive options, test operator precedence, constructor invocation order, and object slicing subtleties.",
      interview:
        "Adopt top-tier software engineering interview standards (Google, Microsoft, Amazon). Emphasize RAII, smart pointers, cache locality, rule of 0/3/5, noexcept, and move semantics.",
      revision:
        "Provide quick, high-yield revision summaries, comparison tables (e.g. Overloading vs Overriding, Virtual vs Pure Virtual, Deep vs Shallow Copy), and 5-minute pre-exam cheat sheets.",
    };

    const currentModeInstruction = modeInstructions[mode] || modeInstructions.learn;
    const topicContext = syllabusTopic ? `The current syllabus topic in focus is: "${syllabusTopic}".` : "";

    const systemInstruction = `You are OOPsMate AI — Your Personal C++ OOP Tutor for second-year B.Tech Computer Engineering students.
You have mastery over standard university computer engineering syllabi (SPPU, VTU, Mumbai University, AKTU, Anna University, and global equivalents).
Your goal is to build deep conceptual clarity, eliminate fear of C++, and ensure students score top marks in practicals, theory exams, viva, and technical interviews.

Pedagogical guidelines:
1. Always write modern, standard-compliant C++ (C++17/C++20). Avoid outdated C-style practices like raw "malloc/free" unless contrasting with "new/delete".
2. When writing code, provide:
   - Full compilable C++ code inside \`\`\`cpp code blocks.
   - Expected Output block.
   - Line-by-line explanation of crucial lines.
3. Highlight Common Pitfalls & Mistakes (e.g., Object Slicing, Dangling Pointers, Missing Virtual Destructor, Shallow Copying with raw pointers, Diamond problem without virtual inheritance).
4. Mode-specific instruction: ${currentModeInstruction}
${topicContext}
5. Maintain a supportive, enthusiastic, razor-sharp engineering mentor tone. Use structured Markdown with clear headings, bullet points, and tables.`;

    // Last 10 messages for conversation context
    const recentMessages = messages.slice(-10);
    const contents = recentMessages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Try candidates in order
    let lastError: any = null;

    for (const model of MODEL_CANDIDATES) {
      try {
        if (stream) {
          const responseStream = await withRetry(() =>
            ai.models.generateContentStream({
              model,
              contents,
              config: {
                systemInstruction,
              },
            })
          );

          // Set SSE headers only after stream is successfully created
          if (!res.headersSent) {
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders?.();
          }

          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }

          res.write("data: [DONE]\n\n");
          return res.end();
        } else {
          const response = await withRetry(() =>
            ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction,
              },
            })
          );

          return res.json({ text: response.text || "" });
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying fallback...`, err.message);
        lastError = err;
        if (res.headersSent) {
          break;
        }
      }
    }

    // If all candidates failed
    const errorMsg =
      lastError?.message ||
      "The AI model is currently busy. Please wait a moment and try asking again.";

    if (!res.headersSent) {
      return res.status(500).json({ error: errorMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      return res.end();
    }
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: error.message || "Failed to generate AI response. Please try again.",
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Streaming error occurred" })}\n\n`);
      return res.end();
    }
  }
});

// Viva Answer Evaluation Endpoint with fallback
app.post("/api/viva/evaluate", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    const { question, studentAnswer, topic } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: "Question and studentAnswer are required." });
    }

    const prompt = `You are a strict yet encouraging university external examiner evaluating a second-year B.Tech Computer Engineering student in an Object-Oriented Programming (C++) viva-voce exam.

Topic: ${topic || "C++ OOP"}
Viva Question: "${question}"
Student's Oral/Written Answer: "${studentAnswer}"

Evaluate the student's answer and return a JSON object with this exact schema:
{
  "score": <integer from 1 to 10>,
  "verdict": "<Exemplary | Good Attempt | Partially Correct | Needs Revision | Incorrect>",
  "strengths": "<what the student got right>",
  "missingKeywords": ["<technical term 1 that was missed>", "<technical term 2>"],
  "feedback": "<concise pedagogical feedback on what was missing or incorrect>",
  "idealAnswer": "<a punchy, high-scoring 2-3 sentence answer that external examiners love>"
}`;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await withRetry(() =>
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          })
        );

        const parsed = JSON.parse(response.text || "{}");
        return res.json(parsed);
      } catch (err: any) {
        console.warn(`Viva eval with ${model} failed, trying next...`, err.message);
      }
    }

    throw new Error("Evaluation service is temporarily busy. Please retry.");
  } catch (error: any) {
    console.error("Viva evaluation error:", error);
    return res.status(500).json({ error: error.message || "Failed to evaluate viva answer." });
  }
});

// Code Lab Semantic Analysis & Output Prediction Endpoint
app.post("/api/code/analyze", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    const { code, action = "trace" } = req.body;

    if (!code) {
      return res.status(400).json({ error: "C++ code is required." });
    }

    const prompt = `You are a C++ compiler internals & memory model tutor for B.Tech Computer Engineering students.
Analyze the following C++ code:

\`\`\`cpp
${code}
\`\`\`

Action requested: "${action}" (trace | debug | explain | memory_layout).

Return a JSON object with:
{
  "compilationStatus": "<Clean | Warnings | Syntax Error | Linker Error>",
  "predictedOutput": "<Exact standard output that running this binary would produce, or compiler error message if erroneous>",
  "memoryTrace": "<Step-by-step description of stack vs heap allocations, constructor/destructor execution order, and vtable pointer assignments>",
  "potentialBugs": ["<bug or warning 1 if any>", "<bug 2>"],
  "modernCppTips": ["<modern C++ improvement 1>", "<improvement 2>"],
  "summary": "<2-sentence conceptual summary of the OOP principles demonstrated in this code>"
}`;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await withRetry(() =>
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          })
        );

        const parsed = JSON.parse(response.text || "{}");
        return res.json(parsed);
      } catch (err: any) {
        console.warn(`Code analysis with ${model} failed, trying next...`, err.message);
      }
    }

    throw new Error("Code analysis service is temporarily busy. Please retry.");
  } catch (error: any) {
    console.error("Code analysis error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze code." });
  }
});

// Dedicated Code Generation & Code Lab Endpoint
app.post(["/api/code", "/api/code/generate"], async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    const { messages, prompt, code, topic, mode = "code" } = req.body;

    let contents: any[] = [];
    if (messages && Array.isArray(messages) && messages.length > 0) {
      contents = messages.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));
    } else {
      const userText =
        prompt ||
        code ||
        "Generate a complete, modern C++ OOP program demonstrating classes, objects, and core OOP principles.";
      contents = [{ role: "user", parts: [{ text: userText }] }];
    }

    const systemInstruction = `You are OOPsMate AI — Your Personal C++ OOP Tutor specializing in modern C++ code generation.
Requirements:
1. Generate complete, compilable, production-ready C++ (C++17/C++20) programs inside \`\`\`cpp code blocks.
2. Provide line-by-line engineering explanations of critical object-oriented patterns.
3. Include an Expected Terminal Output block.
4. Highlight common university exam pitfalls and runtime hazards (e.g. object slicing, memory leaks, vtable dynamic binding).
Topic context: ${topic || "C++ Object-Oriented Programming"}`;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await withRetry(() =>
          ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
            },
          })
        );

        const text = response.text || "";
        return res.json({ text });
      } catch (err: any) {
        console.warn(`Code generation with ${model} failed, trying next...`, err.message);
      }
    }

    throw new Error("Code generation service is temporarily busy. Please retry.");
  } catch (error: any) {
    console.error("Code endpoint error:", error);
    return res.status(500).json({ error: error.message || "Failed to process code request." });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OOPsMate AI] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
export { app };

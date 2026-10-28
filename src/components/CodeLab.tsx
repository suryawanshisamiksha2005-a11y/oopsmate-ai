import React, { useState } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Cpu,
  Layers,
  Terminal,
  Bug,
  Info,
} from "lucide-react";
import { CODE_SNIPPETS, CodeSnippet } from "../data/codeSnippets";

interface CodeLabProps {
  initialCode?: string;
  onAskAIWithCode: (code: string) => void;
}

interface AnalysisResult {
  compilationStatus?: string;
  predictedOutput?: string;
  memoryTrace?: string;
  potentialBugs?: string[];
  modernCppTips?: string[];
  summary?: string;
}

export const CodeLab: React.FC<CodeLabProps> = ({
  initialCode,
  onAskAIWithCode,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    CODE_SNIPPETS[0].id
  );
  const [code, setCode] = useState<string>(
    initialCode || CODE_SNIPPETS[0].code
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const snippet = CODE_SNIPPETS.find((s) => s.id === id);
    if (snippet) {
      setCode(snippet.code);
      setAnalysisResult(null);
      setErrorMessage(null);
    }
  };

  const handleReset = () => {
    const snippet = CODE_SNIPPETS.find((s) => s.id === selectedPresetId);
    if (snippet) {
      setCode(snippet.code);
    } else {
      setCode(CODE_SNIPPETS[0].code);
    }
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async (action: "trace" | "debug") => {
    if (!code.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/code/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to analyze C++ code.");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error("Code analysis error:", err);
      setErrorMessage(
        err.message || "An error occurred while analyzing C++ program."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
      {/* Top Toolbar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300">Preset Sample:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="rounded-lg border border-slate-700/80 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 max-w-xs truncate"
            >
              {CODE_SNIPPETS.map((snippet) => (
                <option key={snippet.id} value={snippet.id}>
                  {snippet.title}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Reset to original snippet"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => onAskAIWithCode(code)}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600/20 px-2.5 py-1 text-xs font-medium text-purple-300 hover:bg-purple-600/30 transition-colors border border-purple-500/30"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Ask in Chat</span>
            </button>

            <button
              onClick={() => handleAnalyze("debug")}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600/20 px-3 py-1 text-xs font-medium text-rose-300 hover:bg-rose-600/30 transition-colors border border-rose-500/30 disabled:opacity-50"
            >
              <Bug className="h-3.5 w-3.5" />
              <span>Debug</span>
            </button>

            <button
              onClick={() => handleAnalyze("trace")}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3.5 py-1 text-xs font-semibold text-white shadow-md shadow-indigo-950 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Tracing...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Analyze & Trace</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Output Split Deck */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left: Code Editor */}
        <div className="flex flex-1 flex-col border-b border-slate-800/80 bg-slate-950 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 px-4 py-2 text-[11px] text-slate-400">
            <span className="font-mono text-cyan-400">main.cpp (C++17)</span>
            <span>{lineCount} lines</span>
          </div>

          <div className="relative flex flex-1 overflow-hidden font-mono text-xs">
            {/* Line numbers column */}
            <div className="select-none bg-slate-950/80 px-3 py-4 text-right text-slate-400 border-r border-slate-900 overflow-hidden">
              {lineNumbers.map((num) => (
                <div key={num} className="h-5 leading-5 font-mono">
                  {num}
                </div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 resize-none bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Output & Semantic Analysis Deck */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-slate-950/60 p-4 lg:max-w-[48%]">
          {/* Transparent Environment Notice Banner */}
          <div className="mb-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3 text-xs text-indigo-200">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  Semantic Execution & Memory Trace Engine
                </span>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
                  Direct native OS binary execution is container-restricted. Output and stack/heap memory traces are synthesized via verified C++17/20 semantics powered by Gemini 3.8.
                </p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" />
                <span>Analysis Notice</span>
              </div>
              <p className="mt-1 text-[11px]">{errorMessage}</p>
            </div>
          )}

          {isAnalyzing ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <Cpu className="h-8 w-8 animate-pulse text-cyan-400 mb-3" />
              <p className="text-xs font-semibold text-slate-200">
                Tracing C++ AST, Memory Bounds & VTables...
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Checking virtual destructors, stack unwinding, and stdout
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4 text-xs">
              {/* Compilation Status & Summary */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Compilation Status
                  </span>
                  <span
                    className={`rounded font-mono px-2 py-0.5 text-[10px] font-semibold ${
                      analysisResult.compilationStatus?.includes("Error")
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {analysisResult.compilationStatus || "Clean (0 Errors)"}
                  </span>
                </div>
                {analysisResult.summary && (
                  <p className="mt-2 text-slate-300 leading-relaxed text-[11px]">
                    {analysisResult.summary}
                  </p>
                )}
              </div>

              {/* Predicted Output */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                    Standard Output (stdout)
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{analysisResult.predictedOutput || "(No stdout generated)"}</pre>
                </div>
              </div>

              {/* Memory & Allocation Trace */}
              {analysisResult.memoryTrace && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <div className="flex items-center gap-2 text-slate-300 mb-2">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                      Stack / Heap / VTable Memory Trace
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs whitespace-pre-wrap">
                    {analysisResult.memoryTrace}
                  </p>
                </div>
              )}

              {/* Potential Bugs / Pitfalls */}
              {analysisResult.potentialBugs && analysisResult.potentialBugs.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3.5">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-300">
                    Warnings & Runtime Pitfalls
                  </span>
                  <ul className="mt-2 space-y-1 pl-4 list-disc text-amber-200/90 text-xs">
                    {analysisResult.potentialBugs.map((bug, i) => (
                      <li key={i}>{bug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modern C++ Tips */}
              {analysisResult.modernCppTips && analysisResult.modernCppTips.length > 0 && (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-3.5">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-cyan-300">
                    Modern C++ (C++17/20) Improvements
                  </span>
                  <ul className="mt-2 space-y-1 pl-4 list-disc text-slate-300 text-xs">
                    {analysisResult.modernCppTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
              <Terminal className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-xs font-semibold text-slate-300">
                Ready to trace C++ Program
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Click "Analyze & Trace" to simulate stdout, check stack vs heap memory lifecycles, and evaluate object layout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

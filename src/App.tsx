import React, { useState, useEffect } from "react";
import {
  Menu,
  Terminal,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Code2,
  Award,
  Mic,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Sidebar, ActiveTab, ChatSession } from "./components/Sidebar";
import { ChatArea, Message, LearningMode } from "./components/ChatArea";
import { LearnOOP } from "./components/LearnOOP";
import { CodeLab } from "./components/CodeLab";
import { QuizArena } from "./components/QuizArena";
import { VivaArena } from "./components/VivaArena";
import { Dashboard } from "./components/Dashboard";
import { SettingsModal } from "./components/SettingsModal";
import { SYLLABUS_TOPICS } from "./data/syllabus";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<LearningMode>("learn");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [codeLabCode, setCodeLabCode] = useState<string>("");
  const [masteredTopicIds, setMasteredTopicIds] = useState<string[]>([]);
  const [quizStats, setQuizStats] = useState<{
    score: number;
    total: number;
    attempts: number;
  }>({ score: 0, total: 0, attempts: 0 });
  const [targetUniversity, setTargetUniversity] = useState(
    "SPPU (Pune University)"
  );
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hasApiKey, setHasApiKey] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize and load from localStorage
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem("oop_chat_sessions");
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          const lastSessionId = parsed[0].id;
          setActiveSessionId(lastSessionId);
          const storedMessages = localStorage.getItem(`oop_msg_${lastSessionId}`);
          if (storedMessages) {
            const rawMessages = JSON.parse(storedMessages);
            const validMessages = Array.isArray(rawMessages)
              ? rawMessages.filter((m: Message) => m && m.content && m.content.trim().length > 0)
              : [];
            setMessages(validMessages);
          }
        }
      }

      const storedMastery = localStorage.getItem("oop_mastered_topics");
      if (storedMastery) {
        setMasteredTopicIds(JSON.parse(storedMastery));
      }

      const storedQuiz = localStorage.getItem("oop_quiz_stats");
      if (storedQuiz) {
        setQuizStats(JSON.parse(storedQuiz));
      }

      const storedUni = localStorage.getItem("oop_target_uni");
      if (storedUni) {
        setTargetUniversity(storedUni);
      }

      const storedTheme = localStorage.getItem("oop_theme") as "dark" | "light";
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }

    // Check server health and API key presence
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasApiKey);
      })
      .catch((err) => {
        console.warn("Health check error:", err);
      });
  }, []);

  // Save session messages to localStorage
  const saveMessagesForSession = (sessionId: string, newMessages: Message[]) => {
    try {
      localStorage.setItem(`oop_msg_${sessionId}`, JSON.stringify(newMessages));
    } catch (e) {
      console.warn("Storage quota exceeded or error:", e);
    }
  };

  // Start new chat session
  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New C++ OOP Discussion",
      createdAt: Date.now(),
      mode: activeMode,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setMessages([]);
    localStorage.setItem("oop_chat_sessions", JSON.stringify(updated));
  };

  // Select existing session
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    try {
      const storedMessages = localStorage.getItem(`oop_msg_${id}`);
      if (storedMessages) {
        const raw = JSON.parse(storedMessages);
        const valid = Array.isArray(raw)
          ? raw.filter((m: Message) => m && m.content && m.content.trim().length > 0)
          : [];
        setMessages(valid);
      } else {
        setMessages([]);
      }
    } catch (e) {
      setMessages([]);
    }
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("oop_chat_sessions", JSON.stringify(updated));
    localStorage.removeItem(`oop_msg_${id}`);

    if (activeSessionId === id) {
      if (updated.length > 0) {
        handleSelectSession(updated[0].id);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    }
  };

  // Send message to Gemini API (SSE Streaming)
  const handleSendMessage = async (
    content: string,
    mode: LearningMode,
    topic?: string
  ) => {
    let currentSessionId = activeSessionId;

    // Create session if none exists
    if (!currentSessionId) {
      currentSessionId = `session_${Date.now()}`;
      const title =
        content.slice(0, 36) + (content.length > 36 ? "..." : "");
      const newSession: ChatSession = {
        id: currentSessionId,
        title,
        createdAt: Date.now(),
        mode,
      };
      const updated = [newSession, ...sessions];
      setSessions(updated);
      setActiveSessionId(currentSessionId);
      localStorage.setItem("oop_chat_sessions", JSON.stringify(updated));
    } else {
      // Update session title if first user message
      const session = sessions.find((s) => s.id === currentSessionId);
      if (session && messages.length === 0) {
        session.title =
          content.slice(0, 36) + (content.length > 36 ? "..." : "");
        setSessions([...sessions]);
        localStorage.setItem("oop_chat_sessions", JSON.stringify(sessions));
      }
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      mode,
      topic,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessagesForSession(currentSessionId, newMessages);
    setIsLoading(true);

    const assistantId = `assistant_${Date.now()}`;

    try {
      const endpoint = mode === "code" ? "/api/code" : "/api/chat";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          syllabusTopic: topic || selectedTopic,
          stream: false,
        }),
      });

      const data = await response.json().catch(() => ({}));

      let assistantContent = "";
      if (response.ok && data.text) {
        assistantContent = data.text;
      } else {
        assistantContent = `**AI Notice:** ${
          data.error || `Server returned status ${response.status}. Please try again.`
        }`;
      }

      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: assistantContent,
        mode,
        topic,
        timestamp: Date.now(),
      };

      const finalized = [...newMessages, assistantMessage];
      setMessages(finalized);
      saveMessagesForSession(currentSessionId, finalized);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorContent = `**AI Connection Notice:** ${
        err.message || "Failed to reach AI service. Please try again."
      }`;

      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: errorContent,
        mode,
        topic,
        timestamp: Date.now(),
      };

      const finalized = [...newMessages, assistantMessage];
      setMessages(finalized);
      saveMessagesForSession(currentSessionId, finalized);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate last response
  const handleRegenerateLast = async () => {
    if (messages.length < 2 || isLoading) return;
    const lastUserIndex = [...messages]
      .reverse()
      .findIndex((m) => m.role === "user");
    if (lastUserIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserIndex;
    const lastUserMsg = messages[actualIndex];

    // Remove assistant reply after it
    const trimmed = messages.slice(0, actualIndex);
    setMessages(trimmed);
    if (activeSessionId) {
      saveMessagesForSession(activeSessionId, trimmed);
    }

    handleSendMessage(lastUserMsg.content, lastUserMsg.mode || activeMode, lastUserMsg.topic);
  };

  // Code Lab handover
  const handleOpenInCodeLab = (code: string) => {
    setCodeLabCode(code);
    setActiveTab("codelab");
  };

  // Ask AI about syllabus topic
  const handleAskAIAboutTopic = (topicTitle: string, question: string) => {
    setSelectedTopic(topicTitle);
    setActiveTab("chat");
    handleSendMessage(question, "exam", topicTitle);
  };

  // Ask AI with code in debug mode
  const handleAskAIWithCode = (code: string) => {
    setActiveMode("debug");
    setActiveTab("chat");
    handleSendMessage(
      `Please analyze, debug, and explain this C++ code line-by-line:\n\n\`\`\`cpp\n${code}\n\`\`\``,
      "debug"
    );
  };

  // Toggle mastered topic
  const handleToggleMasterTopic = (topicId: string) => {
    setMasteredTopicIds((prev) => {
      const exists = prev.includes(topicId);
      const updated = exists
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem("oop_mastered_topics", JSON.stringify(updated));
      return updated;
    });
  };

  // Record quiz score
  const handleRecordQuizScore = (score: number, total: number) => {
    setQuizStats((prev) => {
      const updated = {
        score: prev.score + score,
        total: prev.total + total,
        attempts: prev.attempts + 1,
      };
      localStorage.setItem("oop_quiz_stats", JSON.stringify(updated));
      return updated;
    });
  };

  // Clear chat history
  const handleClearHistory = () => {
    sessions.forEach((s) => {
      localStorage.removeItem(`oop_msg_${s.id}`);
    });
    localStorage.removeItem("oop_chat_sessions");
    setSessions([]);
    setActiveSessionId(null);
    setMessages([]);
    setIsSettingsOpen(false);
  };

  // Reset progress
  const handleResetProgress = () => {
    localStorage.removeItem("oop_mastered_topics");
    localStorage.removeItem("oop_quiz_stats");
    setMasteredTopicIds([]);
    setQuizStats({ score: 0, total: 0, attempts: 0 });
    setIsSettingsOpen(false);
  };

  // Toggle theme
  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("oop_theme", nextTheme);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === "light" ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100"}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        masteredCount={masteredTopicIds.length}
        totalTopics={SYLLABUS_TOPICS.length}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Top Navigation Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950 px-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-sm text-white">OOPsMate AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* View Router */}
        {activeTab === "chat" && (
          <ChatArea
            messages={messages}
            onSendMessage={handleSendMessage}
            onRegenerateLast={handleRegenerateLast}
            isLoading={isLoading}
            onOpenInCodeLab={handleOpenInCodeLab}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            hasApiKey={hasApiKey}
          />
        )}

        {activeTab === "learn" && (
          <LearnOOP
            onOpenInCodeLab={handleOpenInCodeLab}
            onAskAIAboutTopic={handleAskAIAboutTopic}
            masteredTopicIds={masteredTopicIds}
            onToggleMasterTopic={handleToggleMasterTopic}
          />
        )}

        {activeTab === "codelab" && (
          <CodeLab
            initialCode={codeLabCode}
            onAskAIWithCode={handleAskAIWithCode}
          />
        )}

        {activeTab === "quiz" && (
          <QuizArena onRecordScore={handleRecordQuizScore} />
        )}

        {activeTab === "viva" && <VivaArena />}

        {activeTab === "dashboard" && (
          <Dashboard
            masteredTopicIds={masteredTopicIds}
            quizStats={quizStats}
            onNavigateTab={setActiveTab}
            onStudyTopic={(topicId) => {
              setActiveTab("learn");
            }}
          />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        targetUniversity={targetUniversity}
        setTargetUniversity={(uni) => {
          setTargetUniversity(uni);
          localStorage.setItem("oop_target_uni", uni);
        }}
        onClearHistory={handleClearHistory}
        onResetProgress={handleResetProgress}
        hasApiKey={hasApiKey}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}

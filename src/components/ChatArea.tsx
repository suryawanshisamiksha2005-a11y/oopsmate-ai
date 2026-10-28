import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  HelpCircle,
  Code2,
  Bug,
  GraduationCap,
  Briefcase,
  Layers,
  Flame,
  AlertCircle,
  StopCircle,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { SYLLABUS_TOPICS } from "../data/syllabus";

export type LearningMode =
  | "learn"
  | "exam"
  | "code"
  | "debug"
  | "viva"
  | "quiz"
  | "interview"
  | "revision";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: LearningMode;
  topic?: string;
  timestamp: number;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string, mode: LearningMode, topic?: string) => Promise<void>;
  onRegenerateLast: () => Promise<void>;
  isLoading: boolean;
  onOpenInCodeLab: (code: string) => void;
  activeMode: LearningMode;
  setActiveMode: (mode: LearningMode) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  hasApiKey: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  onRegenerateLast,
  isLoading,
  onOpenInCodeLab,
  activeMode,
  setActiveMode,
  selectedTopic,
  setSelectedTopic,
  hasApiKey,
}) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const content = input;
    setInput("");
    onSendMessage(content, activeMode, selectedTopic || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modes: { id: LearningMode; label: string; icon: any; desc: string }[] = [
    { id: "learn", label: "Learn", icon: BookOpen, desc: "Intuitive concepts & analogies" },
    { id: "exam", label: "Exam 2/5/10M", icon: GraduationCap, desc: "University scoring format" },
    { id: "code", label: "Code", icon: Code2, desc: "Modern C++ programs & explanations" },
    { id: "debug", label: "Debug", icon: Bug, desc: "Find bugs & compiler UB fixes" },
    { id: "viva", label: "Viva Voce", icon: HelpCircle, desc: "Examiner cross-examination" },
    { id: "interview", label: "Interview", icon: Briefcase, desc: "FAANG C++ best practices" },
    { id: "revision", label: "Revision", icon: Layers, desc: "Comparison tables & cheat sheets" },
  ];

  const suggestedPrompts = [
    {
      title: "Diamond Problem & Virtual Base Class",
      prompt: "Explain the Diamond Problem in C++ hybrid inheritance with a diagram in ASCII, explain why compiler ambiguity happens, and show how 'virtual public' resolves it.",
      mode: "exam" as LearningMode,
    },
    {
      title: "VTable & VPtr Memory Layout",
      prompt: "Explain step-by-step how runtime polymorphism works internally in C++ using VTable and VPtr. How does shape->draw() resolve dynamically at CPU runtime?",
      mode: "learn" as LearningMode,
    },
    {
      title: "Deep Copy vs Shallow Copy with Code",
      prompt: "Write a complete C++ program demonstrating why a shallow copy causes a 'double free' crash when a class contains dynamic raw pointers, and show the custom Deep Copy Constructor solution.",
      mode: "code" as LearningMode,
    },
    {
      title: "Debug C++ Object Slicing",
      prompt: "Why does passing a derived class object by value to a function taking Base cause Object Slicing? Show the broken code, output, and how passing by const reference fixes it.",
      mode: "debug" as LearningMode,
    },
    {
      title: "Smart Pointers & RAII Deep Dive",
      prompt: "Compare std::unique_ptr, std::shared_ptr, and std::weak_ptr with memory diagrams. Explain circular references and how weak_ptr breaks reference count deadlocks.",
      mode: "interview" as LearningMode,
    },
    {
      title: "Overload Stream Operator << and +",
      prompt: "Write a high-scoring university program to overload '+' and '<<' for a Complex number class, explaining why '<<' must be a friend non-member function.",
      mode: "exam" as LearningMode,
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
      {/* Top Learning Mode Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1.5 hidden md:inline">Mode:</span>
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  title={m.desc}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/90 to-cyan-600/90 text-white shadow-sm shadow-purple-900/50"
                      : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Topic Anchor Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Focus Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="rounded-lg border border-slate-700/80 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">General C++ OOP</option>
              {SYLLABUS_TOPICS.map((topic) => (
                <option key={topic.id} value={topic.title}>
                  Unit {topic.unit}: {topic.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 ? (
            <div className="py-8">
              {/* Hero Banner inside Empty State */}
              <div className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 shadow-lg shadow-purple-500/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                      Welcome to OOPsMate AI
                    </h1>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                      Your intelligent, university-aligned C++ Object-Oriented Programming tutor.
                      Ask theoretical queries, request line-by-line program traces, debug segmentation faults, or simulate a university viva exam.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Flame className="h-4 w-4" /> Gemini 3.8 Flash Powered
                      </span>
                      <span>·</span>
                      <span>Modern C++17 / C++20 Standards</span>
                      <span>·</span>
                      <span>SPPU / VTU / Mumbai / AKTU Syllabus Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Suggestions */}
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Popular Exam & Lab Questions to Start
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {suggestedPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveMode(item.mode);
                        onSendMessage(item.prompt, item.mode);
                      }}
                      className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800/80 hover:shadow-md hover:shadow-purple-950/30"
                    >
                      <h3 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                        {item.prompt}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="uppercase tracking-wider text-purple-400 font-mono">
                          {item.mode} mode
                        </span>
                        <span className="text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                          Ask Tutor →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages
              .filter((msg) => msg && msg.content && msg.content.trim().length > 0)
              .map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3 md:gap-4 ${
                    isAssistant ? "items-start" : "items-start flex-row-reverse"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${
                      isAssistant
                        ? "bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-950"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`relative max-w-[88%] md:max-w-[82%] rounded-2xl p-4 md:p-5 shadow-sm ${
                      isAssistant
                        ? "border border-slate-800/90 bg-slate-900/80 text-slate-200"
                        : "border border-cyan-500/30 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 text-slate-100"
                    }`}
                  >
                    {/* Header tags for assistant */}
                    {isAssistant && (
                      <div className="mb-2.5 flex items-center justify-between border-b border-slate-800/80 pb-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">OOPsMate Tutor</span>
                          {msg.mode && (
                            <span className="rounded bg-purple-500/10 px-1.5 py-0.5 font-mono text-[10px] text-purple-300 border border-purple-500/20 uppercase">
                              {msg.mode} mode
                            </span>
                          )}
                          {msg.topic && (
                            <span className="text-slate-400 truncate max-w-[150px]">
                              · {msg.topic}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-800 hover:text-slate-200"
                            title="Copy entire response"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="text-sm">
                      {isAssistant ? (
                        <MarkdownRenderer
                          content={msg.content}
                          onOpenInCodeLab={onOpenInCodeLab}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-slate-300">OOPsMate is synthesizing C++ explanation & code...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Composer */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask OOPsMate in ${activeMode.toUpperCase()} mode (e.g., "Explain virtual destructors", "Write code for copy constructor", "Debug my segmentation fault")...`}
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-700/80 bg-slate-950 px-4 py-3 pr-24 text-sm text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
              {messages.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={onRegenerateLast}
                  className="rounded-lg bg-slate-800/80 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  title="Regenerate last response"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-950 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Press <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send, <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 font-mono text-[10px]">Shift+Enter</kbd> for newline
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${hasApiKey ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-[10px]">
                {hasApiKey ? "Gemini 3.8 Connected" : "Connecting to Gemini"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import {
  MessageSquare,
  BookOpen,
  Code2,
  Award,
  Mic,
  LayoutDashboard,
  Settings,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  Terminal,
} from "lucide-react";

export type ActiveTab = "chat" | "learn" | "codelab" | "quiz" | "viva" | "dashboard";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  mode: string;
}

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  masteredCount: number;
  totalTopics: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
  masteredCount,
  totalTopics,
}) => {
  const navItems = [
    { id: "chat", label: "AI Tutor Chat", icon: MessageSquare, badge: "Gemini 3.8" },
    { id: "learn", label: "Learn OOP", icon: BookOpen, badge: `${masteredCount}/${totalTopics}` },
    { id: "codelab", label: "Interactive Code Lab", icon: Code2, badge: "C++17" },
    { id: "quiz", label: "Quiz Arena", icon: Award, badge: "32 MCQs" },
    { id: "viva", label: "Viva Practice", icon: Mic, badge: "AI Examiner" },
    { id: "dashboard", label: "Learning Dashboard", icon: LayoutDashboard },
  ];

  const masteryPercent = Math.round((masteredCount / totalTopics) * 100) || 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Terminal className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  OOPsMate<span className="text-cyan-400">.ai</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                C++ OOP Engineering Tutor
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              setActiveTab("chat");
              onCloseMobile();
            }}
            className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-[1px] font-medium shadow-lg shadow-indigo-950/40 transition-all hover:shadow-indigo-500/20 active:scale-[0.98]"
          >
            <span className="flex h-full w-full items-center justify-center gap-2 rounded-[11px] bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white transition-colors group-hover:bg-slate-900/50">
              <Plus className="h-4 w-4 text-cyan-400" />
              <span>New AI Chat</span>
              <Sparkles className="ml-auto h-3.5 w-3.5 text-purple-400" />
            </span>
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="space-y-1 px-3 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-slate-800/90 text-cyan-400 shadow-sm shadow-slate-900 border border-slate-700/60"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Chat History Section */}
        <div className="mt-4 flex flex-1 flex-col overflow-hidden border-t border-slate-800/80 px-3 pt-3">
          <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Recent Sessions</span>
            <span className="text-[10px] text-slate-400">{sessions.length} chats</span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <div className="px-2 py-4 text-center text-xs text-slate-400">
                No past chats yet. Start asking C++ questions!
              </div>
            ) : (
              sessions.map((session) => {
                const isSelected = activeSessionId === session.id && activeTab === "chat";
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      setActiveTab("chat");
                      onCloseMobile();
                    }}
                    className={`group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all ${
                      isSelected
                        ? "bg-slate-800 text-white font-medium border border-slate-700"
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-cyan-400" />
                      <span className="truncate">{session.title}</span>
                    </div>
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
                      title="Delete chat session"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Progress Footer Card */}
        <div className="border-t border-slate-800/80 p-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">B.Tech OOP Mastery</span>
              <span className="font-mono text-cyan-400 font-bold">{masteryPercent}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>{masteredCount} of {totalTopics} topics</span>
              <button
                onClick={() => {
                  setActiveTab("learn");
                  onCloseMobile();
                }}
                className="flex items-center gap-0.5 text-cyan-400 hover:underline"
              >
                Study <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className="mt-2 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Syllabus & Preferences</span>
            </div>
            <span className="text-[10px] text-slate-400">v2.4</span>
          </button>
        </div>
      </aside>
    </>
  );
};

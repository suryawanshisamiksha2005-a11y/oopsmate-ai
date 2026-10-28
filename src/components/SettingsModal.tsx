import React from "react";
import {
  X,
  Settings,
  GraduationCap,
  Sparkles,
  Trash2,
  Download,
  Check,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUniversity: string;
  setTargetUniversity: (uni: string) => void;
  onClearHistory: () => void;
  onResetProgress: () => void;
  hasApiKey: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  targetUniversity,
  setTargetUniversity,
  onClearHistory,
  onResetProgress,
  hasApiKey,
  theme,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  const universities = [
    "SPPU (Pune University)",
    "VTU (Karnataka)",
    "Mumbai University",
    "AKTU (Uttar Pradesh)",
    "Anna University (Tamil Nadu)",
    "Autonomous / ABET Global Standards",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Syllabus & Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* University Curriculum Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-purple-400" />
            <span>Target University Curriculum</span>
          </label>
          <select
            value={targetUniversity}
            onChange={(e) => setTargetUniversity(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">
            OOPsMate optimizes exam markings, question styles (2M, 5M, 10M), and viva focus according to your syllabus.
          </p>
        </div>

        {/* Theme mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Appearance
          </label>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-xs text-slate-200">Theme</span>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Dark Navy Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Server & AI Integration Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">AI Core Model:</span>
            <span className="font-mono text-cyan-400 font-semibold">gemini-3.8-flash</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Server Backend Status:</span>
            <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Full-Stack Express
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">API Key Config:</span>
            <span className="font-mono text-slate-300">
              {hasApiKey ? "Active (Server Environment)" : "Connected"}
            </span>
          </div>
        </div>

        {/* Danger zone / Local data resets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Local Storage & Data
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (window.confirm("Clear all past chat sessions?")) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-rose-500/50 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Chat History</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm("Reset all syllabus progress and MCQ scores?")) {
                  onResetProgress();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Syllabus Progress</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Play,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Code2,
} from "lucide-react";
import { SYLLABUS_TOPICS, SyllabusTopic } from "../data/syllabus";

interface LearnOOPProps {
  onOpenInCodeLab: (code: string) => void;
  onAskAIAboutTopic: (topicTitle: string, question: string) => void;
  masteredTopicIds: string[];
  onToggleMasterTopic: (topicId: string) => void;
}

export const LearnOOP: React.FC<LearnOOPProps> = ({
  onOpenInCodeLab,
  onAskAIAboutTopic,
  masteredTopicIds,
  onToggleMasterTopic,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(SYLLABUS_TOPICS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedTopic =
    SYLLABUS_TOPICS.find((t) => t.id === selectedTopicId) || SYLLABUS_TOPICS[0];

  const filteredTopics = SYLLABUS_TOPICS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnit === null || t.unit === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isMastered = masteredTopicIds.includes(selectedTopic.id);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-950 lg:flex-row">
      {/* Left List Navigator */}
      <div className="w-full border-r border-slate-800/80 bg-slate-950/70 lg:w-80 lg:shrink-0 flex flex-col">
        {/* Header & Search */}
        <div className="border-b border-slate-800/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">C++ OOP Syllabus</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {masteredTopicIds.length}/{SYLLABUS_TOPICS.length} Done
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, vtables, RAII..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Unit Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setSelectedUnit(null)}
              className={`rounded-md px-2 py-1 font-medium transition-colors ${
                selectedUnit === null
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4].map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`rounded-md px-2 py-1 font-medium whitespace-nowrap transition-colors ${
                  selectedUnit === unit
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                Unit {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTopics.map((topic) => {
            const isSelected = topic.id === selectedTopic.id;
            const topicMastered = masteredTopicIds.includes(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl p-3 text-xs transition-all ${
                  isSelected
                    ? "bg-slate-800/90 text-white border border-slate-700 shadow-md shadow-indigo-950/40"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMasterTopic(topic.id);
                    }}
                    className="shrink-0 text-slate-500 hover:text-cyan-400"
                    title={topicMastered ? "Mark unlearned" : "Mark as mastered"}
                  >
                    {topicMastered ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-600" />
                    )}
                  </button>
                  <div className="truncate">
                    <p className="font-semibold truncate">{topic.title}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span>Unit {topic.unit}</span>
                      <span>·</span>
                      <span className="text-purple-400">{topic.tag}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                    topic.difficulty === "Beginner"
                      ? "text-emerald-300 bg-emerald-500/10"
                      : topic.difficulty === "Intermediate"
                      ? "text-amber-300 bg-amber-500/10"
                      : "text-rose-300 bg-rose-500/10"
                  }`}
                >
                  {topic.difficulty}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Topic Details Deck */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 p-6 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <span>Unit {selectedTopic.unit}</span>
                  <span>·</span>
                  <span>{selectedTopic.tag}</span>
                  <span>·</span>
                  <span className="text-purple-400">{selectedTopic.difficulty}</span>
                </div>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {selectedTopic.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleMasterTopic(selectedTopic.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isMastered
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                >
                  {isMastered ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Mastered</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      <span>Mark Mastered</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    onAskAIAboutTopic(
                      selectedTopic.title,
                      `Explain ${selectedTopic.title} with university exam 5-mark pointers, memory architecture, and a real-world coding example.`
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-950 transition-all hover:opacity-95"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>
            </div>

            {/* Definition */}
            <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Formal Engineering Definition
              </h2>
              <p className="text-sm leading-relaxed text-slate-200">
                {selectedTopic.definition}
              </p>
            </div>
          </div>

          {/* Real-World Analogy */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Real-World Mental Model & Analogy
                </h2>
                <p className="mt-1 text-sm text-amber-100/90 leading-relaxed">
                  {selectedTopic.analogy}
                </p>
              </div>
            </div>
          </div>

          {/* Syntax Template */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Canonical Syntax Template
            </h2>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto">
              <pre>{selectedTopic.syntax}</pre>
            </div>
          </div>

          {/* Complete Working C++ Program */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Complete Compilable C++ Program
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenInCodeLab(selectedTopic.exampleCode)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
                >
                  <Play className="h-3.5 w-3.5" />
                  Run in Code Lab
                </button>
                <button
                  onClick={() => handleCopyCode(selectedTopic.exampleCode)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  {copiedCode ? (
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
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-200 overflow-x-auto">
              <pre>{selectedTopic.exampleCode}</pre>
            </div>

            {/* Expected Output */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Expected Terminal Output:
              </span>
              <div className="mt-1 rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-mono text-emerald-400">
                <pre>{selectedTopic.expectedOutput}</pre>
              </div>
            </div>
          </div>

          {/* Step-by-Step Explanation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Step-by-Step Engineering Breakdown
            </h2>
            <ul className="space-y-2">
              {selectedTopic.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Traps & Mistakes */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5">
            <div className="flex items-center gap-2 mb-2 text-rose-300">
              <AlertTriangle className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                Common Student Mistakes & Compiler Traps
              </h2>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-xs text-rose-100/90 leading-relaxed">
              {selectedTopic.commonMistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>

          {/* University Exam Pointers */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-5">
            <div className="flex items-center gap-2 mb-2 text-purple-300">
              <GraduationCap className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                University Exam Important Pointers (2M & 5M)
              </h2>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-xs text-purple-100/90 leading-relaxed">
              {selectedTopic.examPointers.map((ptr, idx) => (
                <li key={idx}>{ptr}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

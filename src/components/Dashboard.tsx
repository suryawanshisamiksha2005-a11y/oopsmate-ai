import React from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Award,
  BookOpen,
  Code2,
  Mic,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";
import { SYLLABUS_TOPICS } from "../data/syllabus";
import { ActiveTab } from "./Sidebar";

interface DashboardProps {
  masteredTopicIds: string[];
  quizStats: { score: number; total: number; attempts: number };
  onNavigateTab: (tab: ActiveTab) => void;
  onStudyTopic: (topicId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  masteredTopicIds,
  quizStats,
  onNavigateTab,
  onStudyTopic,
}) => {
  const totalTopics = SYLLABUS_TOPICS.length;
  const masteredCount = masteredTopicIds.length;
  const masteryPercentage = Math.round((masteredCount / totalTopics) * 100);

  // Calculate unit by unit progress
  const units = [1, 2, 3, 4];
  const unitStats = units.map((u) => {
    const unitTopics = SYLLABUS_TOPICS.filter((t) => t.unit === u);
    const unitMastered = unitTopics.filter((t) =>
      masteredTopicIds.includes(t.id)
    ).length;
    return {
      unit: u,
      title:
        u === 1
          ? "Core Foundations & Lifecycle"
          : u === 2
          ? "Inheritance & Friendship"
          : u === 3
          ? "Polymorphism & VTables"
          : "Memory, Templates & SOLID",
      total: unitTopics.length,
      mastered: unitMastered,
      percent: Math.round((unitMastered / unitTopics.length) * 100) || 0,
    };
  });

  // Find next recommended topic
  const nextRecommendedTopic =
    SYLLABUS_TOPICS.find((t) => !masteredTopicIds.includes(t.id)) ||
    SYLLABUS_TOPICS[0];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl w-full space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/30 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <LayoutDashboard className="h-4 w-4" />
                <span>B.Tech Computer Engineering</span>
                <span>·</span>
                <span className="text-purple-300">Year 2, Semester III/IV</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                OOP Learning Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Track your syllabus milestones, MCQ accuracy, and exam readiness in real time.
              </p>
            </div>

            {/* Quick action */}
            <button
              onClick={() => onNavigateTab("chat")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-950 hover:opacity-95 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>Ask Tutor Anything</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Syllabus Mastery */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Syllabus Progress</span>
              <BookOpen className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {masteryPercentage}%
              </span>
              <span className="text-xs text-slate-400">
                ({masteredCount}/{totalTopics} topics)
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>

          {/* Quiz Stats */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">MCQ Accuracy</span>
              <Award className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {quizStats.total > 0
                  ? Math.round((quizStats.score / quizStats.total) * 100)
                  : 0}
                %
              </span>
              <span className="text-xs text-slate-400">
                {quizStats.score}/{quizStats.total} correct
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              {quizStats.attempts} test session{quizStats.attempts !== 1 ? "s" : ""} completed
            </p>
          </div>

          {/* Code Lab & Viva Ready */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Lab Readiness</span>
              <Code2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                Active
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              All 6 lab programs ready with memory traces
            </p>
          </div>
        </div>

        {/* Recommended Next Step Card */}
        {nextRecommendedTopic && (
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/20 p-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                    <span>Recommended Next Topic</span>
                    <span>·</span>
                    <span>Unit {nextRecommendedTopic.unit}</span>
                  </div>
                  <h2 className="text-base font-bold text-white md:text-lg">
                    {nextRecommendedTopic.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    {nextRecommendedTopic.definition}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onStudyTopic(nextRecommendedTopic.id);
                  onNavigateTab("learn");
                }}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-950 hover:bg-cyan-400 transition-colors"
              >
                <span>Study Concept</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Unit-by-Unit Syllabus Progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span>University Syllabus Breakdown</span>
            </h2>
            <button
              onClick={() => onNavigateTab("learn")}
              className="text-xs text-cyan-400 hover:underline"
            >
              View Full Syllabus →
            </button>
          </div>

          <div className="space-y-4">
            {unitStats.map((u) => (
              <div
                key={u.unit}
                className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-white">
                      Unit {u.unit}: {u.title}
                    </span>
                    <span className="ml-2 text-slate-400 font-mono">
                      ({u.mastered}/{u.total} topics)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400">
                    {u.percent}%
                  </span>
                </div>

                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${u.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Hub Quick Launch */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={() => onNavigateTab("codelab")}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Interactive Code Lab</p>
              <p className="text-[11px] text-slate-400">Trace memory & VTables</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("quiz")}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">MCQ Practice Arena</p>
              <p className="text-[11px] text-slate-400">32 university-style MCQs</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("viva")}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Oral Viva Simulation</p>
              <p className="text-[11px] text-slate-400">AI Examiner scoring</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

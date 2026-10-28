import React, { useState } from "react";
import {
  Mic,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  RotateCcw,
  Send,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { VIVA_QUESTIONS, VivaQuestion } from "../data/vivaQuestions";

interface VivaEvaluation {
  score?: number;
  verdict?: string;
  strengths?: string;
  missingKeywords?: string[];
  feedback?: string;
  idealAnswer?: string;
}

export const VivaArena: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<VivaEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentQ: VivaQuestion = VIVA_QUESTIONS[currentIdx] || VIVA_QUESTIONS[0];

  const handleNext = () => {
    if (currentIdx < VIVA_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setStudentAnswer("");
      setShowHint(false);
      setEvaluation(null);
      setErrorMessage(null);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setStudentAnswer("");
      setShowHint(false);
      setEvaluation(null);
      setErrorMessage(null);
    }
  };

  const handleEvaluate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!studentAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/viva/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.question,
          studentAnswer: studentAnswer.trim(),
          topic: currentQ.topic,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to evaluate viva answer.");
      }

      const data = await response.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error("Viva evaluation error:", err);
      setErrorMessage(
        err.message || "Failed to connect to AI examiner. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl w-full space-y-6">
        {/* Viva Header */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/20 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Mic className="h-4 w-4" />
                <span>University Oral Exam Simulation</span>
                <span>·</span>
                <span className="text-purple-300">Viva-Voce Practice</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                C++ Engineering Viva Arena
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Practice answering external examiners one question at a time. Receive instant AI scoring, keyword gap analysis, and the ideal answer.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 font-mono text-xs text-slate-300">
              Question <span className="text-cyan-400 font-bold">{currentIdx + 1}</span> of{" "}
              {VIVA_QUESTIONS.length}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-purple-400">{currentQ.topic}</span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{showHint ? "Hide Examiner Hint" : "Need a Hint?"}</span>
            </button>
          </div>

          <h2 className="text-lg font-bold text-white md:text-xl leading-relaxed">
            "{currentQ.question}"
          </h2>

          <p className="mt-2 text-xs text-slate-400 italic">
            Examiner Intent: {currentQ.examinerIntent}
          </p>

          {/* Hint disclosure */}
          {showHint && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-xs text-amber-200">
              <span className="font-semibold">Examiner Hint:</span> {currentQ.hint}
            </div>
          )}

          {/* Student Answer Input Form */}
          <form onSubmit={handleEvaluate} className="mt-6 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Viva Answer (Type your technical explanation)
            </label>
            <textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="State your answer clearly. Mention technical terms, compiler behavior, memory impact, and code mechanics..."
              rows={4}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 p-4 text-xs leading-relaxed text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!studentAnswer.trim() || isEvaluating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-950 hover:opacity-95 transition-all disabled:opacity-40"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>Examiner Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit for Viva Evaluation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIdx === VIVA_QUESTIONS.length - 1}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
                >
                  Next Question →
                </button>
              </div>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* AI Examiner Evaluation Result */}
          {evaluation && (
            <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-950 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-bold text-white">Examiner Evaluation</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs text-slate-400">Score:</span>
                  <span
                    className={`rounded-lg px-2.5 py-0.5 text-sm font-bold ${
                      (evaluation.score || 0) >= 8
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : (evaluation.score || 0) >= 5
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {evaluation.score || 0} / 10
                  </span>
                  <span className="text-xs text-slate-300 font-sans">
                    ({evaluation.verdict})
                  </span>
                </div>
              </div>

              {/* Strengths */}
              {evaluation.strengths && (
                <div className="text-xs">
                  <span className="font-semibold text-emerald-400">What You Got Right:</span>
                  <p className="mt-1 text-slate-300 leading-relaxed">{evaluation.strengths}</p>
                </div>
              )}

              {/* Missing keywords */}
              {evaluation.missingKeywords && evaluation.missingKeywords.length > 0 && (
                <div className="text-xs">
                  <span className="font-semibold text-rose-400">
                    Important Keywords You Missed:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {evaluation.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] text-rose-300 border border-rose-500/20"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Constructive feedback */}
              {evaluation.feedback && (
                <div className="text-xs">
                  <span className="font-semibold text-amber-300">Examiner Critique:</span>
                  <p className="mt-1 text-slate-300 leading-relaxed">{evaluation.feedback}</p>
                </div>
              )}

              {/* Model 10/10 Answer */}
              {evaluation.idealAnswer && (
                <div className="rounded-xl border border-cyan-500/20 bg-slate-900/90 p-4 text-xs">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="h-4 w-4" />
                    Model 10/10 Viva Answer (Examiner Favorite)
                  </span>
                  <p className="text-slate-200 leading-relaxed italic">
                    "{evaluation.idealAnswer}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

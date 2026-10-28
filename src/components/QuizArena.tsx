import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  Check,
  ChevronRight,
  Code2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QUIZ_QUESTIONS, QuizQuestion } from "../data/quizQuestions";

interface QuizArenaProps {
  onRecordScore?: (score: number, total: number) => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ onRecordScore }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Filter questions
  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    const diffMatch =
      selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    const topicMatch = selectedTopic === "All" || q.topic === selectedTopic;
    return diffMatch && topicMatch;
  });

  const currentQ: QuizQuestion | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ || userAnswers[currentQ.id] !== undefined) return;

    const newAnswers = { ...userAnswers, [currentQ.id]: optionIndex };
    setUserAnswers(newAnswers);

    // If this was the last question in the filtered list
    if (Object.keys(newAnswers).length === filteredQuestions.length) {
      setIsCompleted(true);

      // Calculate score
      let correctCount = 0;
      filteredQuestions.forEach((q) => {
        if (newAnswers[q.id] === q.correctIndex) correctCount++;
      });

      if (onRecordScore) {
        onRecordScore(correctCount, filteredQuestions.length);
      }

      if (correctCount / filteredQuestions.length >= 0.7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // Compute current stats
  const answeredCount = Object.keys(userAnswers).length;
  let correctSoFar = 0;
  filteredQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctIndex) correctSoFar++;
  });
  const accuracy = answeredCount > 0 ? Math.round((correctSoFar / answeredCount) * 100) : 0;

  // Extract unique topics for filter
  const uniqueTopics = ["All", ...Array.from(new Set(QUIZ_QUESTIONS.map((q) => q.topic)))];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl w-full space-y-6">
        {/* Header & Stats Banner */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-900/30 via-slate-900 to-cyan-900/20 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Award className="h-4 w-4" />
                <span>C++ OOP Quiz Arena</span>
                <span>·</span>
                <span className="text-purple-300">32 University Level MCQs</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Test Your C++ Internals
              </h1>
            </div>

            {/* Live Scorecards */}
            <div className="flex items-center gap-3 font-mono">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Score</span>
                <span className="text-sm font-bold text-white">
                  {correctSoFar} / {filteredQuestions.length}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
                <span className="text-sm font-bold text-cyan-400">{accuracy}%</span>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                title="Reset Quiz"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Difficulty:</span>
            </div>
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentIndex(0);
                }}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Topic:</span>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setCurrentIndex(0);
                }}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {uniqueTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Question Area */}
        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
            <p>No questions found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedDifficulty("All");
                setSelectedTopic("All");
              }}
              className="mt-3 text-xs text-cyan-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : currentQ ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-lg">
            {/* Question Meta */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-cyan-400 font-bold">
                  Question {currentIndex + 1} of {filteredQuestions.length}
                </span>
                <span>·</span>
                <span className="text-purple-300">{currentQ.topic}</span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                  currentQ.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : currentQ.difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                }`}
              >
                {currentQ.difficulty}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base font-semibold leading-relaxed text-white md:text-lg">
              {currentQ.question}
            </h2>

            {/* Optional Code Snippet inside Question */}
            {currentQ.codeSnippet && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-100">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* 4 Options */}
            <div className="mt-6 space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const hasAnswered = userAnswers[currentQ.id] !== undefined;
                const isCorrect = optIdx === currentQ.correctIndex;

                let optionStyle =
                  "border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700 hover:bg-slate-900";

                if (hasAnswered) {
                  if (isCorrect) {
                    optionStyle =
                      "border-emerald-500/60 bg-emerald-950/30 text-emerald-200 shadow-sm shadow-emerald-950";
                  } else if (isSelected) {
                    optionStyle =
                      "border-rose-500/60 bg-rose-950/30 text-rose-200 shadow-sm shadow-rose-950";
                  } else {
                    optionStyle = "border-slate-900 bg-slate-950/40 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-xs transition-all ${optionStyle}`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-mono text-[11px] font-bold">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal when answered */}
            {userAnswers[currentQ.id] !== undefined && (
              <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-xs leading-relaxed text-indigo-100">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Engineering Explanation</span>
                </div>
                <p className="text-slate-300">{currentQ.explanation}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                ← Previous
              </button>

              {/* Progress dots */}
              <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-xs px-2">
                {filteredQuestions.map((q, idx) => {
                  const answered = userAnswers[q.id] !== undefined;
                  const correct = userAnswers[q.id] === q.correctIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? "ring-2 ring-cyan-400 scale-125"
                          : ""
                      } ${
                        answered
                          ? correct
                            ? "bg-emerald-400"
                            : "bg-rose-400"
                          : "bg-slate-700"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-950 hover:opacity-95 disabled:opacity-40 transition-all"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

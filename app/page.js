"use client";

import { useState, useEffect } from "react";
import { createQuizQuestion, fetchQuizQuestions } from "./quizManager";
import { ThemeToggle } from "./ThemeToggle";

export default function QuizCreatorPage() {
  // Form input states
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("Option A");

  // UI status states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [notification, setNotification] = useState(null);

  // List of questions fetched from Firebase
  const [questions, setQuestions] = useState([]);

  // Load questions on initial mount using get()
  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    setIsLoadingQuestions(true);
    try {
      const data = await fetchQuizQuestions();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to load questions:", err);
      setNotification({
        type: "error",
        message: "Failed to fetch questions from Firebase: " + (err.message || ""),
      });
    } finally {
      setIsLoadingQuestions(false);
    }
  }

  // Handle Form Submit to add question
  async function handleSaveQuestion(e) {
    e.preventDefault();
    setNotification(null);

    // Validation
    if (!question.trim()) {
      setNotification({ type: "error", message: "Please enter the quiz question." });
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setNotification({
        type: "error",
        message: "Please fill out all four options (Option A, B, C, and D).",
      });
      return;
    }

    setIsSaving(true);
    try {
      const savedData = await createQuizQuestion({
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      });

      // Update question list immediately
      setQuestions((prev) => [savedData, ...prev]);

      // Success notification
      setNotification({
        type: "success",
        message: "Quiz question saved successfully to Firebase!",
      });

      // Reset form fields
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("Option A");
    } catch (err) {
      console.error("Failed to save question:", err);
      setNotification({
        type: "error",
        message: "Failed to save question: " + (err.message || "Unknown error"),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header with Theme Toggle */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full mb-1.5">
              <span>Next.js + Firebase Realtime Database</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Quiz Creator
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Add quiz questions and instantly display all saved questions from Firebase.
            </p>
          </div>
          <div className="self-end sm:self-center shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between shadow-sm transition-all ${
              notification.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>{notification.type === "success" ? "✓" : "⚠"}</span>
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100 ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Add Quiz Question Form */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow">
              +
            </span>
            <span>Add Quiz Question</span>
          </h2>

          <form onSubmit={handleSaveQuestion} className="space-y-5">
            {/* Question Text */}
            <div>
              <label
                htmlFor="quiz-question"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Question
              </label>
              <textarea
                id="quiz-question"
                rows={2}
                placeholder="e.g. What is React?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none text-sm transition placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Options Grid (A, B, C, D) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A */}
              <div>
                <label
                  htmlFor="option-a"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
                >
                  Option A
                </label>
                <input
                  id="option-a"
                  type="text"
                  placeholder="e.g. JavaScript Library"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none text-sm transition placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Option B */}
              <div>
                <label
                  htmlFor="option-b"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
                >
                  Option B
                </label>
                <input
                  id="option-b"
                  type="text"
                  placeholder="e.g. Database"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none text-sm transition placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Option C */}
              <div>
                <label
                  htmlFor="option-c"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
                >
                  Option C
                </label>
                <input
                  id="option-c"
                  type="text"
                  placeholder="e.g. Programming Language"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none text-sm transition placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Option D */}
              <div>
                <label
                  htmlFor="option-d"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
                >
                  Option D
                </label>
                <input
                  id="option-d"
                  type="text"
                  placeholder="e.g. Operating System"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none text-sm transition placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Correct Answer Dropdown */}
            <div>
              <label
                htmlFor="correct-answer"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Correct Answer
              </label>
              <select
                id="correct-answer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 outline-none text-sm font-medium text-slate-800 dark:text-slate-200 transition"
              >
                <option value="Option A">Option A</option>
                <option value="Option B">Option B</option>
                <option value="Option C">Option C</option>
                <option value="Option D">Option D</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Question...</span>
                  </>
                ) : (
                  <span>Save Question</span>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* 2. Display Quiz Questions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Questions</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {questions.length}
              </span>
            </div>
            <button
              type="button"
              onClick={loadQuestions}
              disabled={isLoadingQuestions}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoadingQuestions ? "Refreshing..." : "↻ Refresh"}</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoadingQuestions && questions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading saved questions from Firebase...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingQuestions && questions.length === 0 && (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No questions added yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Fill in the form above and click &quot;Save Question&quot; to add your first quiz question.
              </p>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((q, index) => {
              const correctOptionText =
                q.correctAnswer === "Option A"
                  ? q.optionA
                  : q.correctAnswer === "Option B"
                  ? q.optionB
                  : q.correctAnswer === "Option C"
                  ? q.optionC
                  : q.optionD;

              return (
                <div
                  key={q.id || index}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q{questions.length - index}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {[
                      { key: "Option A", val: q.optionA },
                      { key: "Option B", val: q.optionB },
                      { key: "Option C", val: q.optionC },
                      { key: "Option D", val: q.optionD },
                    ].map((opt) => {
                      const isCorrect = q.correctAnswer === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition ${
                            isCorrect
                              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-medium"
                              : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                              isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {opt.key.replace("Option ", "")}
                          </span>
                          <span className="truncate">{opt.val}</span>
                          {isCorrect && (
                            <span className="ml-auto text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Correct Answer Summary Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                      <span>Correct Answer:</span>
                      <span className="font-bold underline">{q.correctAnswer}</span>
                      {correctOptionText && (
                        <span className="text-emerald-800 dark:text-emerald-200 font-normal">
                          ({correctOptionText})
                        </span>
                      )}
                    </div>
                    {q.id && (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        ID: {q.id}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

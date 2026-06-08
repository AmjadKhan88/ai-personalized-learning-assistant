// components/LessonDisplay.js
"use client";

import { useState } from "react";

export default function LessonDisplay({ lesson, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  function handleAnswer(idx, option) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: option }));
  }

  function handleSubmit() {
    if (!lesson.quiz || lesson.quiz.length === 0) {
      onComplete(100, []);
      return;
    }
    const total = lesson.quiz.length;
    let correct = 0;
    const wrongTopics = [];
    lesson.quiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correct++;
      } else {
        wrongTopics.push(q.question.split(" ").slice(0, 4).join(" "));
      }
    });
    const finalScore = Math.round((correct / total) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore, wrongTopics);
  }

  const allAnswered = lesson.quiz && Object.keys(answers).length >= lesson.quiz.length;

  return (
    <article className="animate-slide-up max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white
                       tracking-tight leading-tight mb-2">
          {lesson.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-5 mb-6">
        {lesson.sections?.map((sec, i) => (
          <section key={i}
            className="card p-5 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wide
                           text-brand-500 dark:text-brand-400 mb-2">
              {sec.heading}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {sec.content}
            </p>
          </section>
        ))}
      </div>

      {/* Key Points */}
      {lesson.keyPoints?.length > 0 && (
        <div className="card p-5 mb-6
                        bg-green-50 dark:bg-green-900/10
                        border-green-200 dark:border-green-800/50">
          <h3 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-3 text-sm">
            <span>✅</span> Key Takeaways
          </h3>
          <ul className="flex flex-col gap-2">
            {lesson.keyPoints.map((kp, i) => (
              <li key={i}
                className="flex items-start gap-2.5
                           text-sm text-green-800 dark:text-green-300">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                {kp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz */}
      {lesson.quiz?.length > 0 && (
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-bold
                         text-gray-900 dark:text-white mb-5 text-sm">
            <span>🧠</span> Quick Quiz
          </h3>

          <div className="flex flex-col gap-6">
            {lesson.quiz.map((q, idx) => (
              <div key={idx}>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <span className="text-brand-500 dark:text-brand-400 mr-1">
                    Q{idx + 1}.
                  </span>
                  {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    let cls = "quiz-option";
                    if (submitted) {
                      if (opt === q.answer) cls += " correct";
                      else if (opt === answers[idx]) cls += " wrong";
                    } else if (answers[idx] === opt) {
                      cls += " selected";
                    }
                    return (
                      <button
                        key={opt}
                        className={cls}
                        onClick={() => handleAnswer(idx, opt)}
                        disabled={submitted}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit / Result */}
          <div className="mt-6">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="btn-primary w-full py-3"
              >
                {allAnswered ? "Submit Quiz" : `Answer all ${lesson.quiz.length} questions`}
              </button>
            ) : (
              <div className={`rounded-xl px-5 py-4 text-center font-semibold
                ${score >= 70
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                  : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50"
                }`}>
                <span className="text-2xl block mb-1">
                  {score === 100 ? "🎉" : score >= 70 ? "👍" : "📚"}
                </span>
                Score: {score}%
                <span className="block text-sm font-normal mt-0.5 opacity-80">
                  {score === 100 && "Perfect — flawless!"}
                  {score >= 70 && score < 100 && "Great work! Keep it up."}
                  {score < 70 && "Review the weak areas below and try again."}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
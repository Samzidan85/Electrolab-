import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { QuizQuestion } from '../../types';
import { soundFx } from '../../utils/audio';
import { usePlayerProgress } from '../../utils/progressStorage';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Lightbulb, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export const CertificationQuiz: React.FC = () => {
  const { recordQuizSuccess, addXP } = usePlayerProgress();
  const [selectedTier, setSelectedTier] = useState<'All' | 'Apprentice' | 'Journeyman' | 'Master'>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const activeQuestions = selectedTier === 'All' 
    ? QUIZ_QUESTIONS 
    : QUIZ_QUESTIONS.filter(q => q.tier === selectedTier);

  const currentQ: QuizQuestion = activeQuestions[currentIndex] || activeQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 100);
      addXP(50, `Correct Answer: ${currentQ.category} (${currentQ.tier})`);
      soundFx.playBeep(1800, 0.1);
    } else {
      soundFx.playBeep(400, 0.15);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      soundFx.playSuccessChime();
      const totalPossible = activeQuestions.length * 100;
      const percent = Math.round((score / (totalPossible || 1)) * 100);
      const tierTarget = selectedTier === 'All' ? 'Master' : selectedTier;
      recordQuizSuccess(tierTarget, percent);
    }
  };

  const handleRestart = (tier = selectedTier) => {
    setSelectedTier(tier);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  const getRankTitle = () => {
    const totalPossible = activeQuestions.length * 100;
    const ratio = score / (totalPossible || 1);
    if (ratio >= 0.9) return 'Senior Master Electrical Diagnostician';
    if (ratio >= 0.7) return 'Certified Journeyman Repair Specialist';
    if (ratio >= 0.5) return 'Qualified Electrical Apprentice';
    return 'Junior Field Trainee';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Tier Filter */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            BENCH CERTIFICATION EXAM
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Electrical, Generator & PCB Competency
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          {(['All', 'Apprentice', 'Journeyman', 'Master'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => handleRestart(tier)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedTier === tier
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-semibold">
              QUESTION {currentIndex + 1} OF {activeQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">SCORE:</span>
              <span className="text-white font-bold tabular-nums">{score} PTS</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                {currentQ.tier} Tier
              </span>
              <span>CATEGORY: {currentQ.category}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-amber-500/15 border-amber-400 text-amber-200';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Rationale */}
          {isAnswerSubmitted && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> CORRECT ANSWER (+100 PTS)
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1 font-mono">
                    <XCircle className="w-4 h-4" /> INCORRECT
                  </span>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-start gap-2 text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block font-semibold">Practical Bench Rule:</strong>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed mt-0.5">
                    {currentQ.practicalBenchRule}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                <span>{currentIndex + 1 < activeQuestions.length ? 'Next Question' : 'View Certificate'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Certificate & Final Score Card */
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/50 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              OFFICIAL VOLTCRAFT CERTIFICATION OF BENCH COMPETENCE
            </span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {getRankTitle()}
            </h3>
            <p className="text-xs text-slate-400">
              Exam Tier: {selectedTier} · Total Score: {score} / {activeQuestions.length * 100} PTS
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">QUESTIONS ATTEMPTED</span>
              <span className="text-xl font-bold text-white">{activeQuestions.length}</span>
            </div>
            <div>
              <span className="text-slate-500 block">SUCCESS RATE</span>
              <span className="text-xl font-bold text-emerald-400">
                {((score / (activeQuestions.length * 100)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleRestart(selectedTier)}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

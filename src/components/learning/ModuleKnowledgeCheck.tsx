import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { QuizQuestion } from '../../types/learningLab';
import { KatexMath } from '../math/KatexMath';

interface ModuleKnowledgeCheckProps {
  questions: QuizQuestion[];
  moduleTitle: string;
}

export const ModuleKnowledgeCheck: React.FC<ModuleKnowledgeCheckProps> = ({
  questions,
  moduleTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentIndex];
  const selectedIndex = selectedAnswers[currentIndex];
  const hasAnswered = selectedIndex !== undefined;
  const isCorrect = hasAnswered && selectedIndex === currentQ.correctIndex;

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctIndex === ansIdx
  ).length;

  const handleSelectOption = (optIdx: number) => {
    if (hasAnswered) return; // Prevent changing answer
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
  };

  return (
    <Card className="p-6 bg-white border-surface-border space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Module Knowledge Verification
          </span>
          <h3 className="text-base font-serif font-normal text-content-primary mt-0.5">
            {moduleTitle} &bull; Practice Assessment
          </h3>
          <p className="text-xs text-content-secondary">
            Test your understanding of the discrete mathematics concepts and their practical EMI overlap interpretations.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <Badge variant="setB" className="text-[10px]">
            Score: {correctCount} / {questions.length}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-xs font-mono h-7 gap-1 text-content-muted hover:text-content-primary"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
        </div>
      </div>

      {/* Progress & Question Index */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-content-muted">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="space-y-4">
        <h4 className="text-sm sm:text-base font-serif font-medium text-content-primary leading-snug">
          {currentQ.question}
        </h4>

        {currentQ.latexEquation && (
          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border font-mono text-sm text-center">
            <KatexMath math={currentQ.latexEquation} block />
          </div>
        )}

        {/* Options */}
        <div className="space-y-2 pt-1">
          {currentQ.options.map((option, optIdx) => {
            const isThisSelected = selectedIndex === optIdx;
            const isThisCorrect = currentQ.correctIndex === optIdx;

            let buttonStyle = 'bg-surface-secondary/30 border-surface-border text-content-primary hover:bg-surface-secondary/60';

            if (hasAnswered) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
              } else if (isThisSelected) {
                buttonStyle = 'bg-rose-50 border-rose-500 text-rose-900';
              } else {
                buttonStyle = 'bg-white/40 border-surface-border text-content-muted opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-3.5 rounded-card border transition-all text-xs flex items-start justify-between gap-3 ${buttonStyle}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[10px] font-semibold text-content-muted uppercase mt-0.5 shrink-0">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span className="leading-relaxed font-sans">{option}</span>
                </div>
                {hasAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box */}
      {hasAnswered && (
        <div
          className={`p-4 rounded-card border space-y-2 text-xs animate-in fade-in duration-200 ${
            isCorrect
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/60 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 font-mono font-semibold text-[11px]">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct Answer</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Incorrect Answer</span>
              </>
            )}
          </div>
          <p className="font-serif leading-relaxed text-content-primary">
            {currentQ.explanation}
          </p>

          {currentQ.whyOthersIncorrect && currentQ.whyOthersIncorrect.length > 0 && (
            <div className="pt-2 border-t border-surface-border/40 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-content-muted block">
                Analysis of Alternative Distractors:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-content-secondary font-sans">
                {currentQ.whyOthersIncorrect.map((distractor, dIdx) => (
                  <li key={dIdx}>{distractor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-border/70">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-xs font-mono h-8"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {questions.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => {
                setCurrentIndex(dotIdx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                dotIdx === currentIndex
                  ? 'bg-brand scale-125'
                  : selectedAnswers[dotIdx] !== undefined
                  ? 'bg-surface-border hover:bg-content-muted'
                  : 'bg-surface-secondary border border-surface-border'
              }`}
              title={`Go to Question ${dotIdx + 1}`}
            />
          ))}
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="text-xs font-mono h-8 gap-1"
        >
          <span>Next</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};

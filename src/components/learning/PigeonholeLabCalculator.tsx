import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RotateCcw, Box, ShieldCheck } from 'lucide-react';

export const PigeonholeLabCalculator: React.FC = () => {
  const [objectsN, setObjectsN] = useState<number>(100);
  const [boxesM, setBoxesM] = useState<number>(4);

  // Validation
  const validN = Math.max(1, Math.floor(objectsN || 1));
  const validM = Math.max(1, Math.floor(boxesM || 1));

  // Extended Pigeonhole formula: floor((n - 1) / m) + 1
  const nMinus1 = validN - 1;
  const quotient = Math.floor(nMinus1 / validM);
  const remainder = nMinus1 % validM;
  const resultK = quotient + 1;

  // Preset loaders
  const loadPreset = (n: number, m: number) => {
    setObjectsN(n);
    setBoxesM(m);
  };

  return (
    <Card className="p-6 bg-white border-surface-border space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-semibold flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" /> Dirichlet Principle Laboratory
          </span>
          <h3 className="text-base font-serif font-normal text-content-primary mt-0.5">
            Extended Pigeonhole Principle Explorer
          </h3>
          <p className="text-xs text-content-secondary">
            Compute guaranteed worst-case concentration bounds for any number of elements distributed across discrete categories.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => loadPreset(100, 4)}
          className="text-xs font-mono h-7 gap-1 text-content-muted hover:text-content-primary self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" /> Reset Benchmark
        </Button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
          Preset Scenarios
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPreset(100, 4)}
            className={`text-xs font-mono h-7 ${validN === 100 && validM === 4 ? 'border-brand text-brand-dark bg-brand-soft/20' : ''}`}
          >
            THE EMI TRAP (n=100, m=4)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPreset(84, 4)}
            className={`text-xs font-mono h-7 ${validN === 84 && validM === 4 ? 'border-brand text-brand-dark bg-brand-soft/20' : ''}`}
          >
            Empirical Survey (n=84, m=4)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPreset(53, 5)}
            className={`text-xs font-mono h-7 ${validN === 53 && validM === 5 ? 'border-brand text-brand-dark bg-brand-soft/20' : ''}`}
          >
            Credit Bureaus (n=53, m=5)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPreset(367, 365)}
            className={`text-xs font-mono h-7 ${validN === 367 && validM === 365 ? 'border-brand text-brand-dark bg-brand-soft/20' : ''}`}
          >
            Calendar Year (n=367, m=365)
          </Button>
        </div>
      </div>

      {/* Interactive Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-card bg-surface-secondary/40 border border-surface-border space-y-2">
          <label className="block text-xs font-mono font-medium text-content-primary">
            Number of Objects / Respondents (<span className="text-brand font-bold">n</span>)
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={objectsN}
            onChange={(e) => setObjectsN(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-surface-border rounded-btn bg-white font-mono text-sm text-content-primary focus:outline-none focus:border-brand"
          />
          <span className="text-[10px] text-content-muted block">
            Total individuals or items to partition
          </span>
        </div>

        <div className="p-4 rounded-card bg-surface-secondary/40 border border-surface-border space-y-2">
          <label className="block text-xs font-mono font-medium text-content-primary">
            Number of Categories / Boxes (<span className="text-brand font-bold">m</span>)
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={boxesM}
            onChange={(e) => setBoxesM(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-surface-border rounded-btn bg-white font-mono text-sm text-content-primary focus:outline-none focus:border-brand"
          />
          <span className="text-[10px] text-content-muted block">
            Discrete buckets (e.g. 0, 1, 2, 3+ loans)
          </span>
        </div>
      </div>

      {/* Step-by-Step Derivation */}
      <div className="p-5 rounded-card bg-surface-secondary/60 border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block font-semibold">
            Mathematical Evaluation
          </span>
          <span className="text-xs font-mono text-brand font-semibold">
            Dirichlet Formula: ⌊(n - 1) / m⌋ + 1
          </span>
        </div>

        <div className="p-4 rounded-card bg-white border border-surface-border font-mono text-xs sm:text-sm space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-content-secondary">1. Subtract 1 from objects:</span>
            <span className="text-content-primary font-bold">n - 1 = {validN} - 1 = {nMinus1}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-content-secondary">2. Integer division by boxes:</span>
            <span className="text-content-primary font-bold">
              ⌊({nMinus1}) / {validM}⌋ = ⌊{(nMinus1 / validM).toFixed(4)}⌋ = {quotient}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-content-secondary">3. Add 1 (guaranteed threshold):</span>
            <span className="text-content-primary font-bold">
              {quotient} + 1 = <span className="text-brand text-base sm:text-lg font-extrabold">{resultK}</span>
            </span>
          </div>
        </div>

        {/* Guaranteed Result Banner */}
        <div className="p-4 rounded-card bg-brand-soft/40 border border-brand/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-brand-dark font-bold">
              Guaranteed Concentration Threshold: k = {resultK}
            </h4>
            <p className="text-xs text-brand-dark font-serif leading-relaxed">
              By the Extended Pigeonhole Principle, no matter how the <strong>{validN} respondents</strong> are distributed across the <strong>{validM} categories</strong>, at least one category is mathematically guaranteed to contain at least <strong>{resultK} respondents</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Adversarial Worst-Case Distribution Visualizer */}
      {validM <= 10 && (
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
            Adversary Distribution Proof (Attempting to minimize the maximum bucket)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 font-mono text-xs">
            {Array.from({ length: validM }).map((_, idx) => {
              // In worst case adversary: each bucket gets quotient, and remainder+1 buckets get quotient + 1
              const bucketCount = idx <= remainder ? quotient + 1 : quotient;
              const isMax = bucketCount === resultK;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-card border text-center transition-all ${
                    isMax
                      ? 'bg-brand-soft/50 border-brand text-brand-dark font-bold'
                      : 'bg-white border-surface-border text-content-secondary'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider block text-content-muted mb-1">
                    Category {idx + 1}
                  </span>
                  <span className="text-base font-bold block">{bucketCount}</span>
                  <span className="text-[9px] block text-content-muted mt-0.5">
                    {isMax ? 'Threshold met' : 'Base items'}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-content-muted font-serif italic">
            Even under perfectly uniform dispersion, filling each of the {validM} categories with at most {quotient} items accounts for only {validM * quotient} items, leaving {validN - validM * quotient} element(s) that must force at least one category to reach {resultK}.
          </p>
        </div>
      )}
    </Card>
  );
};

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle, Sliders } from 'lucide-react';

export const OverlapDemoWidget: React.FC = () => {
  const [mode, setMode] = useState<'two-set' | 'three-set'>('three-set');

  // 2-Set state
  const [sizeA, setSizeA] = useState<number>(40);
  const [sizeB, setSizeB] = useState<number>(35);
  const [intersectAB, setIntersectAB] = useState<number>(15);

  // 3-Set state (defaults to Benchmark N=100)
  const [setA, setSetA] = useState<number>(40);
  const [setB, setSetB] = useState<number>(35);
  const [setC, setSetC] = useState<number>(30);
  const [setAB, setSetAB] = useState<number>(15);
  const [setAC, setSetAC] = useState<number>(12);
  const [setBC, setSetBC] = useState<number>(10);
  const [setABC, setSetABC] = useState<number>(5);

  // Safe 2-Set calculation
  const safeIntersectAB = Math.min(intersectAB, Math.min(sizeA, sizeB));
  const naive2Set = sizeA + sizeB;
  const union2Set = sizeA + sizeB - safeIntersectAB;
  const doubleCounted2Set = safeIntersectAB;

  // Safe 3-Set calculation
  const s1 = setA + setB + setC;
  const s2 = setAB + setAC + setBC;
  const s3 = setABC;
  const union3Set = s1 - s2 + s3;
  const inflation3Set = s1 - union3Set;

  const loadBenchmarkPreset = () => {
    setSetA(40);
    setSetB(35);
    setSetC(30);
    setSetAB(15);
    setSetAC(12);
    setSetBC(10);
    setSetABC(5);
  };

  const loadDisjointPreset = () => {
    setSetA(25);
    setSetB(20);
    setSetC(15);
    setSetAB(0);
    setSetAC(0);
    setSetBC(0);
    setSetABC(0);
  };

  const loadSevereOverlapPreset = () => {
    setSetA(50);
    setSetB(45);
    setSetC(40);
    setSetAB(30);
    setSetAC(25);
    setSetBC(22);
    setSetABC(18);
  };

  return (
    <Card className="p-6 bg-white border-surface-border space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Interactive Overlap Simulator
          </span>
          <h3 className="text-base font-serif font-normal text-content-primary mt-0.5">
            Principle of Inclusion–Exclusion Step-by-Step Laboratory
          </h3>
          <p className="text-xs text-content-secondary">
            Adjust individual set sizes and intersection cardinalities to observe how alternating sums eliminate double-counting.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-surface-secondary/70 p-0.5 rounded-btn border border-surface-border">
            <button
              onClick={() => setMode('two-set')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-btn transition-all ${
                mode === 'two-set'
                  ? 'bg-white text-content-primary font-semibold shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              2-Set PIE
            </button>
            <button
              onClick={() => setMode('three-set')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-btn transition-all ${
                mode === 'three-set'
                  ? 'bg-white text-content-primary font-semibold shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              3-Set PIE
            </button>
          </div>
        </div>
      </div>

      {mode === 'two-set' ? (
        /* TWO-SET PIE SIMULATOR */
        <div className="space-y-6">
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-card bg-surface-secondary/30 border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-category-a">Set A (Personal)</span>
                <span className="text-xs font-mono font-bold text-content-primary">|A| = {sizeA}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sizeA}
                onChange={(e) => setSizeA(Number(e.target.value))}
                className="w-full accent-[#3973B9] cursor-pointer"
              />
              <span className="text-[10px] text-content-muted block">Primary unsecured loans</span>
            </div>

            <div className="p-3.5 rounded-card bg-surface-secondary/30 border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-category-b">Set B (Vehicle)</span>
                <span className="text-xs font-mono font-bold text-content-primary">|B| = {sizeB}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sizeB}
                onChange={(e) => setSizeB(Number(e.target.value))}
                className="w-full accent-[#C18428] cursor-pointer"
              />
              <span className="text-[10px] text-content-muted block">Auto / bike financing</span>
            </div>

            <div className="p-3.5 rounded-card bg-surface-secondary/30 border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-brand">Intersection |A ∩ B|</span>
                <span className="text-xs font-mono font-bold text-content-primary">{safeIntersectAB}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(sizeA, sizeB)}
                value={safeIntersectAB}
                onChange={(e) => setIntersectAB(Number(e.target.value))}
                className="w-full accent-[#176B57] cursor-pointer"
              />
              <span className="text-[10px] text-content-muted block">
                Upper bound: min(|A|, |B|) = {Math.min(sizeA, sizeB)}
              </span>
            </div>
          </div>

          {/* Mathematical Step Breakdown */}
          <div className="p-4 rounded-card bg-surface-secondary/50 border border-surface-border space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
              Step-by-Step Derivation
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-card bg-white border border-surface-border">
                <span className="text-[10px] text-content-muted block mb-0.5">Step 1: Naive Addition</span>
                <div className="text-content-primary font-medium">|A| + |B| = {sizeA} + {sizeB}</div>
                <div className="text-sm font-bold text-content-primary mt-1">{naive2Set} commitments</div>
                <span className="text-[9px] text-amber-700 block mt-1">Counts overlap twice</span>
              </div>

              <div className="p-3 rounded-card bg-white border border-surface-border">
                <span className="text-[10px] text-content-muted block mb-0.5">Step 2: Subtract Overlap</span>
                <div className="text-content-primary font-medium">- |A ∩ B| = -{safeIntersectAB}</div>
                <div className="text-sm font-bold text-rose-700 mt-1">-{doubleCounted2Set} duplicates</div>
                <span className="text-[9px] text-content-muted block mt-1">Removes excess counts</span>
              </div>

              <div className="p-3 rounded-card bg-brand-soft/40 border border-brand/30">
                <span className="text-[10px] text-brand-dark block mb-0.5 font-semibold">Step 3: Exact Union</span>
                <div className="text-brand-dark font-medium">|A ∪ B| = {naive2Set} - {safeIntersectAB}</div>
                <div className="text-base font-bold text-brand-dark mt-1">{union2Set} unique people</div>
                <span className="text-[9px] text-brand-dark/80 block mt-1">Mathematically conserved</span>
              </div>
            </div>
          </div>

          {/* Naive Inflation Alert */}
          {doubleCounted2Set > 0 && (
            <div className="p-3.5 rounded-card bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block font-mono">Naive Double-Counting Trap</span>
                <span>
                  Without PIE subtraction, reporting the naive sum of <strong>{naive2Set}</strong> would inflate the indebted population by{' '}
                  <strong>{doubleCounted2Set} individuals</strong> (
                  {union2Set > 0 ? ((doubleCounted2Set / union2Set) * 100).toFixed(1) : 0}% relative distortion).
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* THREE-SET PIE SIMULATOR */
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted mr-1">
              Load Preset:
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={loadBenchmarkPreset}
              className="text-[11px] font-mono h-6 px-2.5"
            >
              Benchmark (N=100)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={loadSevereOverlapPreset}
              className="text-[11px] font-mono h-6 px-2.5"
            >
              High Overlap Trap
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={loadDisjointPreset}
              className="text-[11px] font-mono h-6 px-2.5"
            >
              Mutually Disjoint
            </Button>
          </div>

          {/* 3-Set Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Single Sets */}
            <div className="p-3.5 rounded-card bg-surface-secondary/30 border border-surface-border space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block font-semibold">
                Single Sets (S₁)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-category-a">|A| Personal</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={setA}
                    onChange={(e) => setSetA(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-category-b">|B| Vehicle</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={setB}
                    onChange={(e) => setSetB(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-category-c">|C| Durable</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={setC}
                    onChange={(e) => setSetC(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Pairwise Intersections */}
            <div className="p-3.5 rounded-card bg-surface-secondary/30 border border-surface-border space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block font-semibold">
                Pairwise Overlaps (S₂)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>|A ∩ B|</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.min(setA, setB)}
                    value={setAB}
                    onChange={(e) => setSetAB(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>|A ∩ C|</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.min(setA, setC)}
                    value={setAC}
                    onChange={(e) => setSetAC(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>|B ∩ C|</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.min(setB, setC)}
                    value={setBC}
                    onChange={(e) => setSetBC(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Triple Intersection */}
            <div className="p-3.5 rounded-card bg-surface-secondary/30 border border-surface-border space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block font-semibold">
                Triple Intersection (S₃)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand">|A ∩ B ∩ C|</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.min(setAB, Math.min(setAC, setBC))}
                    value={setABC}
                    onChange={(e) => setSetABC(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-1.5 py-0.5 border border-surface-border rounded text-right bg-white font-bold"
                  />
                </div>
                <span className="text-[9px] text-content-muted block pt-2">
                  All 3 concurrent loans. Upper bound: min(S₂) = {Math.min(setAB, Math.min(setAC, setBC))}.
                </span>
              </div>
            </div>
          </div>

          {/* Alternating Expansion Box */}
          <div className="p-4 rounded-card bg-surface-secondary/40 border border-surface-border space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
              Alternating Sum Expansion
            </span>
            <div className="p-3 rounded-card bg-white border border-surface-border font-mono text-xs sm:text-sm text-center">
              <span className="text-content-secondary">|A ∪ B ∪ C| = </span>
              <span className="text-blue-700 font-bold">S₁ ({s1})</span>
              <span className="text-rose-700 font-bold"> - S₂ ({s2})</span>
              <span className="text-emerald-700 font-bold"> + S₃ ({s3})</span>
              <span className="text-content-secondary"> = </span>
              <span className="text-brand font-bold text-base sm:text-lg">{union3Set}</span>
            </div>

            {/* Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-card bg-white border border-blue-200">
                <span className="text-[9px] text-blue-700 uppercase tracking-widest block font-bold">
                  Include S₁ (+{s1})
                </span>
                <span className="text-content-muted text-[10px] block mt-0.5">
                  Sum single sets ({setA} + {setB} + {setC})
                </span>
                <span className="text-[9px] text-rose-700 block mt-1">
                  Overlaps are counted 2x or 3x.
                </span>
              </div>

              <div className="p-3 rounded-card bg-white border border-rose-200">
                <span className="text-[9px] text-rose-700 uppercase tracking-widest block font-bold">
                  Exclude S₂ (-{s2})
                </span>
                <span className="text-content-muted text-[10px] block mt-0.5">
                  Subtract pairs ({setAB} + {setAC} + {setBC})
                </span>
                <span className="text-[9px] text-amber-700 block mt-1">
                  Triple overlap subtracted 3 times.
                </span>
              </div>

              <div className="p-3 rounded-card bg-white border border-emerald-200">
                <span className="text-[9px] text-emerald-700 uppercase tracking-widest block font-bold">
                  Re-Include S₃ (+{s3})
                </span>
                <span className="text-content-muted text-[10px] block mt-0.5">
                  Add back triple overlap (+{setABC})
                </span>
                <span className="text-[9px] text-emerald-800 block mt-1">
                  Restores triple intersection exactly once.
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Bar */}
          <div className="p-4 rounded-card bg-white border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-content-secondary">Naive Sum vs Actual Unique Debtors</span>
              <span className="text-content-muted text-[10px]">
                Inflation: +{inflation3Set} phantom counts
              </span>
            </div>
            <div className="h-6 w-full bg-surface-secondary/70 rounded-full overflow-hidden flex font-mono text-[10px] font-bold text-white">
              <div
                style={{ width: `${Math.min(100, (union3Set / Math.max(1, s1)) * 100)}%` }}
                className="bg-brand flex items-center justify-center transition-all duration-300"
                title={`Unique Individuals: ${union3Set}`}
              >
                {union3Set} Unique
              </div>
              {inflation3Set > 0 && (
                <div
                  style={{ width: `${Math.min(100, (inflation3Set / Math.max(1, s1)) * 100)}%` }}
                  className="bg-rose-400 flex items-center justify-center transition-all duration-300"
                  title={`Overlap Inflation: ${inflation3Set}`}
                >
                  +{inflation3Set}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

import React, { useState } from 'react';
import { Check, Sparkles, Database } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { KatexMath } from '../components/math/KatexMath';
import { useSurveyData } from '../context/SurveyContext';
import { calculateThreeSetPIE, calculateTwoSetPIE } from '../lib/math/inclusionExclusion';
import { calculateDisjointRegions } from '../lib/math/vennRegions';
import { calculateExtendedPigeonhole, validatePigeonholeInputs } from '../lib/math/pigeonhole';
import { DatasetBanner } from '../components/survey/DatasetBanner';
import { CsvUploadModal } from '../components/survey/CsvUploadModal';

export const MathematicalAnalysis: React.FC = () => {
  const [selectedCalcId, setSelectedCalcId] = useState<string>('pie-three-set');

  const {
    activeDataset,
    activeSetData,
    isIllustrativeDemo,
    isActualSurvey,
    isEmptyState,
    loadIllustrativeDemo,
    openUploadModal,
  } = useSurveyData();
  const data = activeSetData;

  // Derive dynamic disjoint partition regions and PIE results from active dataset
  const pie = calculateThreeSetPIE(data);
  const regions = calculateDisjointRegions(data);
  const twoSet = calculateTwoSetPIE(data.setA, data.setB, data.intersectionAB);

  // Extended Pigeonhole Principle interactive state (synchronizes with active cohort N)
  const [pigeonholeN, setPigeonholeN] = useState<number>(data.totalRespondents || 100);
  const [pigeonholeM, setPigeonholeM] = useState<number>(4);
  const [pigeonholeError, setPigeonholeError] = useState<string | null>(null);

  React.useEffect(() => {
    if (data.totalRespondents > 0) {
      setPigeonholeN(data.totalRespondents);
    }
  }, [data.totalRespondents]);

  const handlePigeonholeChange = (newN: number, newM: number) => {
    const val = validatePigeonholeInputs(newN, newM);
    if (!val.isValid) {
      setPigeonholeError(val.error || 'Invalid inputs');
    } else {
      setPigeonholeError(null);
      setPigeonholeN(newN);
      setPigeonholeM(newM);
    }
  };

  const pigeonholeResult = calculateExtendedPigeonhole({
    n: pigeonholeN,
    m: pigeonholeM,
  });

  const calculations = [
    {
      id: 'pie-two-set',
      number: '01',
      title: 'Two-Set Principle of Inclusion–Exclusion',
      concept: 'Two-Set Union & Complement',
      latexFormula: '|A \\cup B| = |A| + |B| - |A \\cap B|',
      given: {
        '|A| (Personal Loans)': data.setA,
        '|B| (Vehicle Loans)': data.setB,
        '|A ∩ B| (Inclusive Overlap)': data.intersectionAB,
        'N (|U| Cohort)': data.totalRespondents,
      },
      substitution: `|A \\cup B| = ${data.setA} + ${data.setB} - ${data.intersectionAB} = ${twoSet.union}`,
      stepByStep: [
        `Sum cardinalities of Set A and Set B: ${data.setA} + ${data.setB} = ${data.setA + data.setB}`,
        `Subtract inclusive pairwise intersection |A ∩ B| to eliminate double counting: ${data.setA + data.setB} - ${data.intersectionAB} = ${twoSet.union}`,
        `Calculate two-set complement: N - |A ∪ B| = ${data.totalRespondents} - ${twoSet.union} = ${twoSet.complement(data.totalRespondents)} respondents`,
      ],
      finalResult: twoSet.union,
      unit: 'unique respondents in A ∪ B',
      interpretation: `Exactly ${twoSet.union} unique respondents hold either a Personal Loan or a Vehicle Loan (or both). ${twoSet.complement(data.totalRespondents)} respondents in the cohort service neither of these two loan categories.`,
    },
    {
      id: 'pie-three-set',
      number: '02',
      title: 'Three-Set Principle of Inclusion–Exclusion',
      concept: 'Three-Set Union (Alternating Sum Formula)',
      latexFormula: '|A \\cup B \\cup C| = S_1 - S_2 + S_3',
      given: {
        'S₁ (|A| + |B| + |C|)': `${data.setA} + ${data.setB} + ${data.setC} = ${pie.S1}`,
        'S₂ (|A∩B| + |A∩C| + |B∩C|)': `${data.intersectionAB} + ${data.intersectionAC} + ${data.intersectionBC} = ${pie.S2}`,
        'S₃ (|A∩B∩C|)': pie.S3,
      },
      substitution: `|A \\cup B \\cup C| = ${pie.S1} - ${pie.S2} + ${pie.S3} = ${pie.atLeastOne}`,
      stepByStep: [
        `Include single categories (S₁): ${data.setA} + ${data.setB} + ${data.setC} = ${pie.S1}`,
        `Exclude pairwise intersections (S₂): ${data.intersectionAB} + ${data.intersectionAC} + ${data.intersectionBC} = ${pie.S2}`,
        `Add back triple intersection (S₃) which was subtracted three times: ${pie.S3}`,
        `Alternating summation: ${pie.S1} - ${pie.S2} + ${pie.S3} = ${pie.atLeastOne}`,
      ],
      finalResult: pie.atLeastOne,
      unit: 'unique respondents in |A ∪ B ∪ C|',
      interpretation: `Out of ${data.totalRespondents} surveyed individuals, exactly ${pie.atLeastOne} pay at least one of the three selected EMI categories. Without PIE, naive addition (S₁ = ${pie.S1}) would inflate debtor counts by ${pie.S1 - pie.atLeastOne} phantom agreements due to multi-category duplicate counting.`,
    },
    {
      id: 'complement',
      number: '03',
      title: 'Complement Formula (Outside Selected Sets)',
      concept: 'Universal Set Difference',
      latexFormula: '|U \\setminus (A \\cup B \\cup C)| = N - |A \\cup B \\cup C|',
      given: {
        'Total Cohort (N)': data.totalRespondents,
        'Union |A ∪ B ∪ C|': pie.atLeastOne,
      },
      substitution: `N - |A \\cup B \\cup C| = ${data.totalRespondents} - ${pie.atLeastOne} = ${pie.outside}`,
      stepByStep: [
        `Identify total universal cohort size N = ${data.totalRespondents}`,
        `Subtract unique union of indebted respondents: ${data.totalRespondents} - ${pie.atLeastOne} = ${pie.outside}`,
      ],
      finalResult: pie.outside,
      unit: 'respondents outside A, B, and C',
      interpretation: `Exactly ${pie.outside} respondents belong to none of the three selected categories. Note: They may have other unselected obligations (e.g. Home loans, Education loans) or be debt-free.`,
    },
    {
      id: 'exactly-one',
      number: '04',
      title: 'Exactly One Condition',
      concept: 'Generalized Inclusion–Exclusion for k = 1',
      latexFormula: 'N(\\text{exactly } 1) = S_1 - 2S_2 + 3S_3',
      given: {
        'S₁': pie.S1,
        'S₂': pie.S2,
        'S₃': pie.S3,
      },
      substitution: `${pie.S1} - 2(${pie.S2}) + 3(${pie.S3}) = ${pie.S1} - ${2 * pie.S2} + ${3 * pie.S3} = ${pie.exactlyOne}`,
      stepByStep: [
        `Evaluate S₁: ${pie.S1}`,
        `Multiply pairwise sum S₂ by 2: 2 × ${pie.S2} = ${2 * pie.S2}`,
        `Multiply triple intersection S₃ by 3: 3 × ${pie.S3} = ${3 * pie.S3}`,
        `Calculate final difference: ${pie.S1} - ${2 * pie.S2} + ${3 * pie.S3} = ${pie.exactlyOne}`,
      ],
      finalResult: pie.exactlyOne,
      unit: 'respondents with exactly one EMI',
      interpretation: `Exactly ${pie.exactlyOne} respondents service debt in only one selected category (${regions.onlyA} in Personal only, ${regions.onlyB} in Vehicle only, ${regions.onlyC} in Consumer Durable only). They have no secondary loan overlaps.`,
    },
    {
      id: 'exactly-two',
      number: '05',
      title: 'Exactly Two Conditions',
      concept: 'Generalized Inclusion–Exclusion for k = 2',
      latexFormula: 'N(\\text{exactly } 2) = S_2 - 3S_3',
      given: {
        'S₂': pie.S2,
        'S₃': pie.S3,
      },
      substitution: `${pie.S2} - 3(${pie.S3}) = ${pie.S2} - ${3 * pie.S3} = ${pie.exactlyTwo}`,
      stepByStep: [
        `Identify pairwise intersections sum S₂ = ${pie.S2}`,
        `Multiply triple intersection S₃ by 3: 3 × ${pie.S3} = ${3 * pie.S3}`,
        `Subtract to remove triple overlap count: ${pie.S2} - ${3 * pie.S3} = ${pie.exactlyTwo}`,
      ],
      finalResult: pie.exactlyTwo,
      unit: 'respondents with exactly two EMIs',
      interpretation: `Exactly ${pie.exactlyTwo} respondents hold commitments in exactly two selected categories, excluding those who hold all three (${regions.onlyAB} in A∩B only, ${regions.onlyBC} in B∩C only, ${regions.onlyAC} in A∩C only).`,
    },
    {
      id: 'at-least-two',
      number: '06',
      title: 'At Least Two Conditions (Multi-Loan Trap)',
      concept: 'Cumulative Overlap Condition',
      latexFormula: 'N(\\ge 2) = S_2 - 2S_3 = N(\\text{exactly } 2) + N(\\text{exactly } 3)',
      given: {
        'S₂': pie.S2,
        'S₃': pie.S3,
      },
      substitution: `${pie.S2} - 2(${pie.S3}) = ${pie.S2} - ${2 * pie.S3} = ${pie.atLeastTwo}`,
      stepByStep: [
        `Identify pairwise sum S₂ = ${pie.S2}`,
        `Multiply triple intersection by 2: 2 × ${pie.S3} = ${2 * pie.S3}`,
        `Evaluate expression: ${pie.S2} - ${2 * pie.S3} = ${pie.atLeastTwo}`,
        `Cross-verification check: Exactly 2 (${pie.exactlyTwo}) + Exactly 3 (${pie.allThree}) = ${pie.exactlyTwo + pie.allThree}`,
      ],
      finalResult: pie.atLeastTwo,
      unit: 'respondents with ≥2 loan categories',
      interpretation: `Exactly ${pie.atLeastTwo} respondents (${data.totalRespondents > 0 ? ((pie.atLeastTwo / data.totalRespondents) * 100).toFixed(1) : '0.0'}% of the survey cohort) service multiple debt categories simultaneously, making them vulnerable to asynchronous tenure compounding.`,
    },
    {
      id: 'triple-intersection',
      number: '07',
      title: 'Three-Way Intersection (Core Trap)',
      concept: 'Three-Set Conjunction (A ∩ B ∩ C)',
      latexFormula: '|A \\cap B \\cap C| = S_3',
      given: {
        'Respondents with A, B, and C concurrently': data.intersectionABC,
      },
      substitution: `|A \\cap B \\cap C| = ${data.intersectionABC}`,
      stepByStep: [
        `Direct combinatorial conjunction: ${data.intersectionABC} respondents service Personal, Vehicle, and Consumer durable loans at once.`,
      ],
      finalResult: data.intersectionABC,
      unit: 'respondents in core EMI trap',
      interpretation: `These ${data.intersectionABC} respondents represent the maximum fragmentation cohort, simultaneously managing unsecured, vehicular, and consumer durable financing agreements.`,
    },
    {
      id: 'pigeonhole',
      number: '08',
      title: 'Extended Pigeonhole Principle',
      concept: 'Dirichlet Principle Guarantee',
      latexFormula: '\\left\\lfloor \\frac{n - 1}{m} \\right\\rfloor + 1',
      given: {
        'Objects n (Respondents)': pigeonholeN,
        'Groups m (Borrowing Categories)': pigeonholeM,
      },
      substitution: `\\left\\lfloor \\frac{${pigeonholeN} - 1}{${pigeonholeM}} \\right\\rfloor + 1 = \\left\\lfloor \\frac{${pigeonholeN - 1}}{${pigeonholeM}} \\right\\rfloor + 1 = ${pigeonholeResult.guaranteedMinimum}`,
      stepByStep: pigeonholeResult.stepByStep,
      finalResult: pigeonholeResult.guaranteedMinimum,
      unit: 'guaranteed minimum in at least one tier',
      interpretation: pigeonholeResult.interpretation,
      isInteractive: true,
    },
  ];

  const selectedCalc = calculations.find((c) => c.id === selectedCalcId) || calculations[1];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-surface-border/70 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mb-1">
            Section 04 &bull; Formal Proofs
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-content-primary">
            Mathematical Analysis &amp; Derivations
          </h1>
          <p className="text-xs text-content-secondary mt-1 max-w-xl leading-relaxed">
            Standardized 8-step solutions applying Discrete Mathematics Module 1 (Principle of Inclusion and Exclusion).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {isIllustrativeDemo && (
            <Badge variant="setB" className="font-mono text-[10px]">
              Benchmark Model (N={data.totalRespondents})
            </Badge>
          )}
          {isActualSurvey && (
            <Badge variant="setA" className="font-mono text-[10px]">
              Active Cohort: {activeDataset?.name} (N={data.totalRespondents})
            </Badge>
          )}
          <span className="text-[11px] font-mono text-content-muted">
            Module 1 &bull; Discrete Mathematics
          </span>
        </div>
      </div>

      {/* Dataset State & Ingestion Banner */}
      <DatasetBanner />

      {/* Upload & Column Mapping Modal */}
      <CsvUploadModal />

      {isEmptyState ? (
        <Card className="p-12 text-center bg-white border-surface-border space-y-4">
          <div className="w-12 h-12 rounded-full bg-surface-secondary text-content-muted mx-auto flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-normal text-content-primary">
            No Analytical Dataset Loaded
          </h3>
          <p className="text-xs text-content-secondary max-w-md mx-auto leading-relaxed">
            Please import an anonymous Google Forms survey CSV or load the official 100-respondent demonstration model to populate the mathematical derivations and proofs.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={loadIllustrativeDemo} className="text-xs font-mono gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Load Benchmark Demo (N=100)
            </Button>
            <Button size="sm" onClick={openUploadModal} className="text-xs font-mono">
              Upload Survey CSV
            </Button>
          </div>
        </Card>
      ) : (
        /* 2-Column Layout: Calculation Nav (Left) | 8-Step Solution (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calculation Index */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-content-muted px-1 mb-2">
            Formulation Index (08)
          </p>
          <div className="space-y-1">
            {calculations.map((calc) => {
              const isSelected = calc.id === selectedCalcId;
              return (
                <button
                  key={calc.id}
                  onClick={() => setSelectedCalcId(calc.id)}
                  className={`w-full text-left p-3 rounded-card border transition-all ${
                    isSelected
                      ? 'bg-surface text-content-primary border-surface-border shadow-xs'
                      : 'bg-transparent hover:bg-surface-secondary/60 border-transparent text-content-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate flex items-center gap-2">
                      <span className="font-mono text-[10px] text-content-muted">{calc.number}</span>
                      <span className={isSelected ? 'text-content-primary font-semibold' : ''}>{calc.title}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Standard 8-Step Solution Panel */}
        <div className="lg:col-span-8">
          <Card className="p-8 space-y-6 bg-white border-surface-border shadow-subtle">
            {/* Step 1 & 2: Title & Concept */}
            <div className="border-b border-surface-border/70 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mb-1">
                Step 01 &amp; 02 &bull; Problem Definition &amp; Theorem
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-content-primary">
                {selectedCalc.title}
              </h2>
              <p className="text-xs text-content-secondary mt-1">
                <span className="font-semibold text-content-primary">Concept:</span> {selectedCalc.concept}
              </p>
            </div>

            {/* Interactive Pigeonhole Controls (if calculation 08) */}
            {selectedCalc.isInteractive && (
              <div className="p-4 rounded-card bg-surface-secondary/50 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Interactive Parameter Controls
                  </span>
                  <span className="text-[11px] font-mono text-content-muted">
                    Formula: ⌊(n - 1) / m⌋ + 1
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="pigeonhole-n-input" className="block text-[10px] font-mono uppercase text-content-muted mb-1">
                      Objects n (Respondents)
                    </label>
                    <input
                      id="pigeonhole-n-input"
                      type="number"
                      min="1"
                      value={pigeonholeN}
                      onChange={(e) => handlePigeonholeChange(parseInt(e.target.value, 10) || 1, pigeonholeM)}
                      className="w-full h-8 px-2.5 rounded-input border border-surface-border bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="pigeonhole-m-input" className="block text-[10px] font-mono uppercase text-content-muted mb-1">
                      Categories m (Tiers)
                    </label>
                    <input
                      id="pigeonhole-m-input"
                      type="number"
                      min="1"
                      value={pigeonholeM}
                      onChange={(e) => handlePigeonholeChange(pigeonholeN, parseInt(e.target.value, 10) || 1)}
                      className="w-full h-8 px-2.5 rounded-input border border-surface-border bg-white text-xs font-mono"
                    />
                  </div>
                </div>
                {pigeonholeError && (
                  <p className="text-[11px] text-semantic-danger font-medium">{pigeonholeError}</p>
                )}
              </div>
            )}

            {/* Step 3: Given Values */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Step 03 &bull; Given Cardinalities from Dataset
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(selectedCalc.given).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs"
                  >
                    <span className="text-content-muted block text-[10px] uppercase font-mono">
                      {key}
                    </span>
                    <span className="font-mono text-sm font-semibold text-content-primary mt-1 block">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Mathematical Formula (Rendered with KaTeX) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Step 04 &bull; Formal Theoretical Expression
              </span>
              <div className="p-4 rounded-card bg-surface-secondary/60 border border-surface-border font-mono text-sm sm:text-base font-medium text-content-primary flex items-center justify-center min-h-[50px]">
                <KatexMath math={selectedCalc.latexFormula} block />
              </div>
            </div>

            {/* Step 5: Substitution (Rendered with KaTeX) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Step 05 &bull; Parameter Substitution
              </span>
              <div className="p-3.5 rounded-card bg-brand-soft/30 border border-brand/20 font-mono text-xs sm:text-sm text-brand-dark flex items-center justify-center min-h-[44px]">
                <KatexMath math={selectedCalc.substitution} block />
              </div>
            </div>

            {/* Step 6: Step-by-Step Solution */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Step 06 &bull; Step-by-Step Expansion
              </span>
              <ol className="space-y-2 pl-1">
                {selectedCalc.stepByStep.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-content-secondary">
                    <span className="w-5 h-5 rounded-sm bg-surface-secondary border border-surface-border text-content-muted font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-mono pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Step 7: Final Result */}
            <div className="p-5 rounded-card bg-surface-secondary border border-surface-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block">
                  Step 07 &bull; Evaluated Invariant Result
                </span>
                <p className="text-xs text-content-secondary mt-0.5 font-serif italic">
                  Calculated invariant
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-serif font-normal text-content-primary">
                  {selectedCalc.finalResult}
                </span>
                <span className="text-[11px] font-mono text-content-muted block">
                  {selectedCalc.unit}
                </span>
              </div>
            </div>

            {/* Step 8: Plain-English Interpretation */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Step 08 &bull; Plain-English Interpretation
              </span>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed bg-surface-secondary/30 p-4 rounded-card border border-surface-border font-serif">
                {selectedCalc.interpretation}
              </p>
            </div>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  PieChart,
  ArrowRight,
  TrendingDown,
  Scale,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSurveyData } from '../context/SurveyContext';
import { calculateThreeSetPIE } from '../lib/math/inclusionExclusion';

export const Overview: React.FC = () => {
  const { activeSetData, activeDataset, isEmptyState } = useSurveyData();
  const pie = calculateThreeSetPIE(activeSetData);
  const totalN = activeSetData.totalRespondents;

  const activeDebtPct = totalN > 0 ? Math.round((pie.atLeastOne / totalN) * 100) : 0;
  const multiOverlapPct = totalN > 0 ? Math.round((pie.atLeastTwo / totalN) * 100) : 0;
  const outsidePct = totalN > 0 ? Math.round((pie.outside / totalN) * 100) : 0;
  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* Editorial Hero Section */}
      <section className="relative pt-4 pb-8 border-b border-surface-border/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-surface-secondary border border-surface-border text-content-secondary text-[11px] font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span>Discrete Mathematics &bull; Experiential Learning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-content-primary leading-[1.08]">
              Understanding <br className="hidden sm:inline" />
              the EMI Trap.
            </h1>

            <p className="text-base sm:text-lg font-serif italic text-content-secondary leading-relaxed max-w-xl">
              &ldquo;One EMI feels manageable. But what happens when multiple financial commitments overlap and quietly compound against monthly cash flow?&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-xl">
              Borrowing is marketed in isolation: a ₹2,500 smartphone BNPL, a ₹5,500 two-wheeler, a ₹10,000 personal loan.
              This platform uses <strong>Discrete Mathematics (Module 1: Principle of Inclusion and Exclusion)</strong> to
              isolate unique individuals within overlapping credit obligations and provide a personal cash flow planning engine.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/calculator">
                <Button size="lg" className="h-11 px-7 shadow-xs font-medium">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate My EMIs
                </Button>
              </Link>
              <Link to="/research">
                <Button size="lg" variant="outline" className="h-11 px-6 font-medium">
                  <PieChart className="w-4 h-4 mr-2 text-brand" />
                  Explore Research
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Financial Visual Motif */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-8 rounded-panel bg-gradient-to-b from-surface to-surface-secondary/60 border border-surface-border shadow-subtle overflow-hidden">
              {/* Subtle background architectural grid */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#176B57 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b border-surface-border/70 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">
                    Compound Leverage Vector
                  </span>
                  <span className="text-[10px] font-mono text-brand font-medium">
                    PIE Analysis Model
                  </span>
                </div>

                {/* Minimalist SVG Vector Representation */}
                <svg
                  viewBox="0 0 340 180"
                  className="w-full h-auto text-content-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  {/* Subtle Grid Axes */}
                  <line x1="20" y1="160" x2="320" y2="160" stroke="#E6E8E3" strokeDasharray="3 3" />
                  <line x1="20" y1="20" x2="20" y2="160" stroke="#E6E8E3" strokeDasharray="3 3" />

                  {/* Single Loan Baseline (Linear, steady) */}
                  <path
                    d="M 20 140 Q 150 130 320 120"
                    stroke="#A0A8A3"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />

                  {/* Compound Overlap Curve (Exponential encroachment) */}
                  <path
                    d="M 20 145 C 100 135, 180 80, 320 30"
                    stroke="#176B57"
                    strokeWidth="2.5"
                  />

                  {/* Critical Intersection Point */}
                  <circle cx="220" cy="75" r="4" fill="#176B57" />
                  <circle cx="220" cy="75" r="10" stroke="#176B57" strokeOpacity="0.3" />

                  {/* Overlap Shading */}
                  <path
                    d="M 20 145 C 100 135, 180 80, 320 30 L 320 120 Q 150 130 20 140 Z"
                    fill="#176B57"
                    fillOpacity="0.06"
                  />
                </svg>

                <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-content-secondary">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-0.5 bg-brand" />
                    <span>Combined Outflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-0.5 bg-content-muted" />
                    <span>Perceived Single Outflow</span>
                  </div>
                </div>

                <p className="text-[11px] text-content-muted leading-relaxed italic pt-1">
                  &ldquo;The risk emerges not in any single contract, but at the multi-loan intersection.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Floating Statistics Panel (DESIGN.md Section 4.1) */}
        <div className="mt-12 pt-8 border-t border-surface-border/70">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">
              Active Analytical Invariants
            </span>
            <span className="text-[10px] font-mono text-brand">
              {isEmptyState
                ? 'No active cohort loaded'
                : `${activeDataset?.name || 'Benchmark Model'} (N=${totalN})`}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Metric 01 */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                01 / Total Cohort
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-normal text-content-primary">
                {isEmptyState ? '0' : totalN}
              </div>
              <p className="text-xs text-content-secondary leading-snug">
                Universal respondent sample (|U|).
              </p>
            </div>

            {/* Metric 02 */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                02 / Active Debt Rate
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-normal text-brand">
                {isEmptyState ? '—' : `${activeDebtPct}%`}
              </div>
              <p className="text-xs text-content-secondary leading-snug">
                {isEmptyState
                  ? 'No dataset loaded'
                  : `${pie.atLeastOne} in ≥1 category (|A ∪ B ∪ C|).`}
              </p>
            </div>

            {/* Metric 03 */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                03 / Multi-Loan Overlap
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-normal text-semantic-warning">
                {isEmptyState ? '—' : `${multiOverlapPct}%`}
              </div>
              <p className="text-xs text-content-secondary leading-snug">
                {isEmptyState
                  ? 'No dataset loaded'
                  : `${pie.atLeastTwo} service ≥2 simultaneous categories.`}
              </p>
            </div>

            {/* Metric 04 */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                04 / Outside Sets
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-normal text-content-muted">
                {isEmptyState ? '—' : `${outsidePct}%`}
              </div>
              <p className="text-xs text-content-secondary leading-snug">
                {isEmptyState
                  ? 'No dataset loaded'
                  : `${pie.outside} outside selected categories.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Research Snapshot & Installment Stacking Anatomy */}
      <section className="space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-semibold block mb-1">
            Structural Vulnerability
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-content-primary">
            The Anatomy of Installment Stacking
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary max-w-2xl mt-1 leading-relaxed">
            How micro-financing and fragmented installment agreements progressively dismantle monthly discretionary liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-6 rounded-card bg-surface border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-content-muted">
              <span className="text-[10px] font-mono uppercase tracking-widest">Phase I</span>
              <Compass className="w-4 h-4 text-brand" />
            </div>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Fragmented Inception
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Borrowers evaluate financing in compartmentalized silos—viewing a ₹2,500 gadget BNPL as trivial without factoring in ongoing automobile or personal obligations.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-card bg-surface border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-content-muted">
              <span className="text-[10px] font-mono uppercase tracking-widest">Phase II</span>
              <TrendingDown className="w-4 h-4 text-semantic-warning" />
            </div>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Tenure Asynchrony
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Because loan tenures rarely align (6-month consumer credits running alongside 36-month auto loans), commitments compound into an unrelenting baseline outflow.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-card bg-surface border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-content-muted">
              <span className="text-[10px] font-mono uppercase tracking-widest">Phase III</span>
              <Scale className="w-4 h-4 text-content-primary" />
            </div>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Liquidity Evaporation
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              When unavoidable non-EMI living expenses (rent, healthcare, food) demand payment, the remaining cash flow leaves zero margin for savings or emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* Two Decoupled Systems Editorial Panel */}
      <section className="p-8 sm:p-10 rounded-panel bg-surface-secondary/50 border border-surface-border">
        <div className="max-w-2xl mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block mb-1">
            System Separation Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-content-primary">
            Two Distinct Analytical Domains
          </h2>
          <p className="text-xs text-content-secondary mt-1 leading-relaxed">
            The platform strictly isolates financial arithmetic from discrete mathematics. The calculator measures money; the research engine counts human respondents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-card bg-white border border-surface-border space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-semibold text-content-primary uppercase tracking-wide">
                System A &bull; Personal Calculator
              </h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              Calculates an individual&apos;s total monthly EMI commitment, percentage of take-home income committed, and simulates prospective purchases with a what-if model.
            </p>
            <div className="pt-2">
              <Link
                to="/calculator"
                className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1.5"
              >
                Launch Personal Calculator <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-card bg-white border border-surface-border space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3973B9]" />
              <h3 className="text-sm font-semibold text-content-primary uppercase tracking-wide">
                System B &bull; Set Theory Engine
              </h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              Applies the Principle of Inclusion–Exclusion to survey responses across Personal, Vehicle, and Consumer loans to eliminate duplicate counts and resolve Venn partitions.
            </p>
            <div className="pt-2">
              <Link
                to="/math"
                className="text-xs font-medium text-[#3973B9] hover:underline inline-flex items-center gap-1.5"
              >
                Inspect Mathematical Proofs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

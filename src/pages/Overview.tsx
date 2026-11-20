import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  PieChart,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSurveyData } from '../context/SurveyContext';
import { calculateThreeSetPIE } from '../lib/math/inclusionExclusion';
import { SpotlightCard } from '../components/animated/SpotlightCard';
import { AnimatedCounter } from '../components/animated/AnimatedCounter';
import { MagneticButton } from '../components/animated/MagneticButton';

export const Overview: React.FC = () => {
  const { activeSetData, activeDataset, isEmptyState } = useSurveyData();
  const [simulatedExtra, setSimulatedExtra] = React.useState(false);
  const pie = calculateThreeSetPIE(activeSetData);
  const totalN = activeSetData.totalRespondents;

  const activeDebtPct = totalN > 0 ? Math.round((pie.atLeastOne / totalN) * 100) : 0;
  const multiOverlapPct = totalN > 0 ? Math.round((pie.atLeastTwo / totalN) * 100) : 0;
  const outsidePct = totalN > 0 ? Math.round((pie.outside / totalN) * 100) : 0;

  const surveyQuestions = [
    'Do you currently pay any EMI?',
    'How many active EMIs do you have?',
    'What types of purchases do you use EMI for?',
    'Do you calculate your total monthly EMI before taking another loan?',
    'Have you ever struggled to pay multiple EMIs?',
    'Would you take another EMI if you already had two active loans?',
  ];

  // Base demo commitments for hero visualizer
  const simulatedOutflow = simulatedExtra ? 14000 : 10000;
  const demoSalary = 35000;
  const committedRatio = Math.round((simulatedOutflow / demoSalary) * 100);

  return (
    <div className="space-y-12 animate-in fade-in duration-200 max-w-5xl mx-auto py-2">
      {/* Hero Section */}
      <section className="pt-4 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Lead Editorial */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-surface border border-surface-border text-content-muted text-xs sm:text-sm font-mono">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span>Discrete Mathematics &amp; Financial Analytics</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-content-primary leading-[1.12]">
              Understanding <br className="hidden sm:inline" />
              the EMI Trap.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-content-secondary max-w-xl leading-relaxed">
              When multiple loans run at the same time, individual EMIs quietly combine to consume take-home pay. This platform maps debt overlap and helps you see what is truly left each month.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/calculator">
                <MagneticButton magneticStrength={0.2}>
                  <Button size="lg" className="h-11 px-6 font-medium text-sm sm:text-base shadow-sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate My EMIs
                  </Button>
                </MagneticButton>
              </Link>
              <Link to="/research">
                <Button size="lg" variant="outline" className="h-11 px-6 font-medium text-sm sm:text-base glass-pill hover:bg-white/70">
                  <PieChart className="w-4 h-4 mr-2 text-brand" />
                  View Survey Data
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Live Interactive Stacking Teaser with Optical Specular Spotlight */}
          <div className="lg:col-span-5">
            <SpotlightCard className="p-5 sm:p-6 rounded-panel space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-surface-border/70">
                <span className="text-xs font-mono uppercase tracking-wider text-content-muted font-semibold">
                  Live Overlap Simulation
                </span>
                <span className="text-xs sm:text-sm font-mono text-content-muted">
                  Salary: ₹35,000
                </span>
              </div>

              {/* Stacked Loans List */}
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="flex justify-between p-2.5 rounded bg-white/50 backdrop-blur-xs text-content-secondary border border-white/60">
                  <span>Phone BNPL (12 mos)</span>
                  <span className="font-semibold text-content-primary">₹2,500</span>
                </div>
                <div className="flex justify-between p-2.5 rounded bg-white/50 backdrop-blur-xs text-content-secondary border border-white/60">
                  <span>Two-Wheeler Loan (24 mos)</span>
                  <span className="font-semibold text-content-primary">₹5,500</span>
                </div>
                <div className="flex justify-between p-2.5 rounded bg-white/50 backdrop-blur-xs text-content-secondary border border-white/60">
                  <span>Laptop EMI (6 mos)</span>
                  <span className="font-semibold text-content-primary">₹2,000</span>
                </div>
                {simulatedExtra && (
                  <div className="flex justify-between p-2.5 rounded bg-amber-500/10 backdrop-blur-xs border border-amber-500/25 text-amber-800 animate-in fade-in">
                    <span>+ New Personal Loan (36 mos)</span>
                    <span className="font-semibold">+₹4,000</span>
                  </div>
                )}
              </div>

              {/* Allocation Progress Bar with Animated Ticker */}
              <div className="pt-1 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-content-muted">Committed Outflow:</span>
                  <span className="font-mono font-semibold text-content-primary">
                    <AnimatedCounter value={simulatedOutflow} prefix="₹" /> (<AnimatedCounter value={committedRatio} suffix="%" />)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      committedRatio > 35 ? 'bg-amber-600' : 'bg-brand'
                    }`}
                    style={{ width: `${committedRatio}%` }}
                  />
                </div>
              </div>

              {/* What-If Toggle */}
              <button
                type="button"
                onClick={() => setSimulatedExtra(!simulatedExtra)}
                className="w-full py-2 px-3 rounded text-xs sm:text-sm font-mono border border-dashed border-surface-border hover:border-brand/50 text-content-secondary hover:text-content-primary transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{simulatedExtra ? '✕ Remove Extra Loan' : '+ Simulate Adding Another ₹4,000 EMI'}</span>
              </button>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Clean Metrics Strip in Liquid Glass Plate */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted">
            {isEmptyState ? 'No Dataset Loaded' : `${activeDataset?.name || 'Survey Cohort'} (N=${totalN})`}
          </span>
          <Link to="/research" className="text-xs sm:text-sm text-brand hover:underline inline-flex items-center gap-1 font-medium">
            Explore Breakdown <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-panel glass-plate grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-content-primary">
              {isEmptyState ? '—' : <AnimatedCounter value={totalN} />}
            </div>
            <p className="text-xs sm:text-sm text-content-muted mt-1.5 font-medium">Survey responses</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-brand">
              {isEmptyState ? '—' : <AnimatedCounter value={activeDebtPct} suffix="%" />}
            </div>
            <p className="text-xs sm:text-sm text-content-muted mt-1.5 font-medium">Active borrowers</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-semantic-warning">
              {isEmptyState ? '—' : <AnimatedCounter value={multiOverlapPct} suffix="%" />}
            </div>
            <p className="text-xs sm:text-sm text-content-muted mt-1.5 font-medium">Multiple EMIs</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-content-secondary">
              {isEmptyState ? '—' : <AnimatedCounter value={outsidePct} suffix="%" />}
            </div>
            <p className="text-xs sm:text-sm text-content-muted mt-1.5 font-medium">Debt-free cohort</p>
          </div>
        </div>
      </section>

      {/* Research Scope & Core Questions in Liquid Glass */}
      <section className="p-6 sm:p-8 rounded-panel glass-plate space-y-6">
        <div className="space-y-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-brand font-medium">
            Research Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-content-primary">
            Problem Statement &amp; Methodology
          </h2>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-3xl">
            People often take multiple loans and installment plans without calculating their combined monthly commitments. We analyse overlapping obligations using the Principle of Inclusion and Exclusion to show how multiple EMIs affect available income.
          </p>
        </div>

        <div className="pt-2 border-t border-surface-border/60">
          <div className="flex items-center gap-2 mb-3.5 text-xs sm:text-sm font-mono text-content-muted uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-brand" />
            <span>Survey Questions Asked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {surveyQuestions.map((question, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-card bg-white/50 backdrop-blur-xs border border-white/70 hover:bg-white/75 transition-all text-sm sm:text-base text-content-primary shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>{question}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

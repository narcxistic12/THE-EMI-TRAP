import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { VennDiagramSvg } from '../components/venn/VennDiagramSvg';
import { calculateThreeSetPIE } from '../lib/math/inclusionExclusion';
import { getVennRegionDetails } from '../lib/math/vennRegions';
import { VennRegionDetail, VennRegionId } from '../types/setTheory';
import { useSurveyData } from '../context/SurveyContext';
import { DatasetBanner } from '../components/survey/DatasetBanner';
import { CsvUploadModal } from '../components/survey/CsvUploadModal';
import { ResearchCharts } from '../components/research/ResearchCharts';
import { Layers, Lightbulb, Users, ShieldAlert, Sparkles, Database } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SpotlightCard } from '../components/animated/SpotlightCard';
import { AnimatedCounter } from '../components/animated/AnimatedCounter';

export const ResearchDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sets' | 'overview'>('sets');
  const [selectedRegionId, setSelectedRegionId] = useState<VennRegionId | null>(null);

  const {
    activeDataset,
    activeSetData,
    isEmptyState,
    loadIllustrativeDemo,
    openUploadModal,
  } = useSurveyData();

  // Derive mathematical invariants from the pure mathematical engine
  const pie = calculateThreeSetPIE(activeSetData);
  const regionDetails = getVennRegionDetails(activeSetData);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="pb-4 border-b border-surface-border flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-content-primary">
            Research Analytics &amp; Set Overlap
          </h1>
          <p className="text-sm sm:text-base text-content-secondary mt-1.5">
            Empirical survey analysis of personal, vehicle, and consumer durable loan overlap.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-surface-secondary/70 p-1 rounded-btn border border-surface-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sets')}
            className={`px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'sets'
                ? 'bg-white text-content-primary shadow-xs font-semibold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Venn Partitions
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-content-primary shadow-xs font-semibold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Survey Overview &amp; Charts
          </button>
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
            Please import an anonymous Google Forms survey CSV or load the official 100-respondent demonstration model to populate the Research Dashboard.
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
      ) : activeTab === 'sets' ? (
        <div className="space-y-8">
          {/* Category A, B, C Compact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category A */}
            <Card variant="glass" className="p-4 sm:p-5 border-l-4 border-l-[#3973B9]">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#3973B9] font-semibold">
                  Category A
                </span>
                <span className="text-xs sm:text-sm font-mono text-content-muted">
                  {activeSetData.totalRespondents > 0
                    ? `${((activeSetData.setA / activeSetData.totalRespondents) * 100).toFixed(0)}% cohort`
                    : '0%'}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <h3 className="text-base sm:text-lg font-medium text-content-primary">Personal Loans</h3>
                <span className="font-mono text-xl sm:text-2xl font-normal text-[#3973B9]">|A| = {activeSetData.setA}</span>
              </div>
            </Card>

            {/* Category B */}
            <Card variant="glass" className="p-4 sm:p-5 border-l-4 border-l-[#C18428]">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#C18428] font-semibold">
                  Category B
                </span>
                <span className="text-xs sm:text-sm font-mono text-content-muted">
                  {activeSetData.totalRespondents > 0
                    ? `${((activeSetData.setB / activeSetData.totalRespondents) * 100).toFixed(0)}% cohort`
                    : '0%'}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <h3 className="text-base sm:text-lg font-medium text-content-primary">Vehicle Loans</h3>
                <span className="font-mono text-xl sm:text-2xl font-normal text-[#C18428]">|B| = {activeSetData.setB}</span>
              </div>
            </Card>

            {/* Category C */}
            <Card variant="glass" className="p-4 sm:p-5 border-l-4 border-l-[#8066B2]">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#8066B2] font-semibold">
                  Category C
                </span>
                <span className="text-xs sm:text-sm font-mono text-content-muted">
                  {activeSetData.totalRespondents > 0
                    ? `${((activeSetData.setC / activeSetData.totalRespondents) * 100).toFixed(0)}% cohort`
                    : '0%'}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <h3 className="text-base sm:text-lg font-medium text-content-primary">Consumer Durables</h3>
                <span className="font-mono text-xl sm:text-2xl font-normal text-[#8066B2]">|C| = {activeSetData.setC}</span>
              </div>
            </Card>
          </div>

          {/* Interactive Three-Set Venn Diagram */}
          <div className="space-y-4">
            <VennDiagramSvg
              data={activeSetData}
              selectedRegionId={selectedRegionId}
              onSelectRegion={(reg: VennRegionDetail | null) => setSelectedRegionId(reg ? reg.id : null)}
            />
          </div>

          {/* Exclusive Partitions Ledger Table */}
          <Card variant="default" className="p-6 sm:p-8">
            <CardHeader className="p-0 pb-5 border-b border-surface-border/70">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div>
                  <CardTitle className="font-serif text-xl sm:text-2xl">Eight Mutually Exclusive Partitions</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Complete mathematical decomposition of cohort N={activeSetData.totalRespondents} into disjoint subsets.
                  </CardDescription>
                </div>
                <Badge variant="neutral" className="font-mono text-xs px-2.5 py-1">
                  Sum of Partitions = {activeSetData.totalRespondents}
                </Badge>
              </div>
            </CardHeader>

            <div className="border border-surface-border rounded-card overflow-hidden mt-6">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface-secondary/70 border-b border-surface-border font-mono uppercase tracking-wider text-xs text-content-muted">
                  <tr>
                    <th className="py-3 px-4">Partition Region</th>
                    <th className="py-3 px-4">Set Theoretic Expression</th>
                    <th className="py-3 px-4">Exclusive Formula</th>
                    <th className="py-3 px-4 text-right">Count</th>
                    <th className="py-3 px-4 text-right">% of Cohort</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {regionDetails.map((region) => {
                    const isSelected = selectedRegionId === region.id;
                    return (
                      <tr
                        key={region.id}
                        onClick={() => setSelectedRegionId(isSelected ? null : region.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-brand-soft/40 font-semibold'
                            : 'hover:bg-surface-secondary/30'
                        }`}
                      >
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: region.color }}
                          />
                          <span className={isSelected ? 'text-brand-dark font-semibold' : 'text-content-primary font-medium'}>
                            {region.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-content-muted">
                          {region.setExpression}
                        </td>
                        <td className="py-3 px-4 font-mono text-content-secondary">
                          {region.exclusiveFormula}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-right text-content-primary">
                          {region.count}
                        </td>
                        <td className="py-3 px-4 font-mono text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <div className="w-16 h-2 rounded-full bg-surface-secondary overflow-hidden hidden sm:block">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, Math.max(4, region.percentageOfTotal))}%`,
                                  backgroundColor: region.color,
                                }}
                              />
                            </div>
                            <span className="text-content-muted font-mono">{region.percentageOfTotal.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* TAB A: Survey Overview & Charts */
        <div className="space-y-8">
          {/* Key Aggregate Research Metric Cards with Spotlight Lensing & Animated Figures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard className="p-5 sm:p-6 space-y-1.5">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5 font-semibold">
                <Users className="w-3.5 h-3.5 text-brand" /> Valid Responses (N)
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium text-content-primary pt-1">
                <AnimatedCounter value={activeSetData.totalRespondents} />
              </div>
              <p className="text-xs sm:text-sm text-content-secondary font-serif">
                {activeDataset?.excludedCount ? `${activeDataset.excludedCount} excluded duplicates` : '100% clean responses'}
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-5 sm:p-6 space-y-1.5">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5 font-semibold">
                <Layers className="w-3.5 h-3.5 text-brand" /> Unique Debtors |A∪B∪C|
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium text-content-primary pt-1">
                <AnimatedCounter value={pie.atLeastOne} />
              </div>
              <p className="text-xs sm:text-sm text-content-secondary font-serif">
                {activeSetData.totalRespondents > 0
                  ? `${((pie.atLeastOne / activeSetData.totalRespondents) * 100).toFixed(1)}% in selected sets`
                  : '0%'}
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-5 sm:p-6 space-y-1.5">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-[#C18428]" /> Multi-Loan Overlap (≥2)
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium text-content-primary pt-1">
                <AnimatedCounter value={pie.atLeastTwo} />
              </div>
              <p className="text-xs sm:text-sm text-content-secondary font-serif">
                {activeSetData.totalRespondents > 0
                  ? `${((pie.atLeastTwo / activeSetData.totalRespondents) * 100).toFixed(1)}% multiple commitments`
                  : '0%'}
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-5 sm:p-6 space-y-1.5">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand" /> Core EMI Trap (|A∩B∩C|)
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium text-content-primary pt-1">
                <AnimatedCounter value={pie.allThree} />
              </div>
              <p className="text-xs sm:text-sm text-content-secondary font-serif">
                Triple concurrency cohort
              </p>
            </SpotlightCard>
          </div>

          {/* 6 Research Visualizations */}
          {activeDataset && (
            <ResearchCharts
              stats={activeDataset.distributionStats}
              totalRespondents={activeDataset.totalRespondents}
            />
          )}

          {/* Research Findings & Insights Panel */}
          {activeDataset?.insights && activeDataset.insights.length > 0 && (
            <Card variant="default" className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-surface-border/70 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand block mb-1 font-semibold">
                    Survey Observations
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-content-primary">
                    Key Survey Takeaways
                  </h3>
                </div>
                <Badge variant="neutral" className="font-mono text-xs px-2.5 py-1">
                  Descriptive Statistics
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDataset.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-5 rounded-card bg-surface-secondary/40 border border-surface-border space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5 font-semibold">
                        <Lightbulb className="w-3.5 h-3.5 text-brand" /> {insight.title}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-semibold text-content-primary">
                        {insight.value}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-content-primary leading-relaxed font-medium">
                      {insight.statement}
                    </p>
                    <p className="text-xs sm:text-sm text-content-secondary leading-relaxed pt-2 border-t border-surface-border/50">
                      {insight.significance}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

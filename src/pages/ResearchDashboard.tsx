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
      <div className="pb-6 border-b border-surface-border/70 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mb-1">
            Section 03 &bull; Empirical Research
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-content-primary">
            Research Analytics &amp; Set Overlap
          </h1>
          <p className="text-xs text-content-secondary mt-1 max-w-xl leading-relaxed">
            Investigating multi-loan fragmentation across survey cohorts using Discrete Mathematics and set partitioning.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-surface-secondary/70 p-1 rounded-btn border border-surface-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sets')}
            className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-all ${
              activeTab === 'sets'
                ? 'bg-white text-content-primary shadow-xs font-semibold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            EMI Set Partitions (Venn)
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-all ${
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
          {/* Category A, B, C Cards (DESIGN.md Section 6.2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category A */}
            <Card className="p-6 border-t-2 border-t-[#3973B9] bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#3973B9]">
                  Category A
                </span>
                <Badge variant="setA">
                  {activeSetData.totalRespondents > 0
                    ? `${((activeSetData.setA / activeSetData.totalRespondents) * 100).toFixed(0)}% of cohort`
                    : '0%'}
                </Badge>
              </div>
              <h3 className="text-base font-serif font-normal text-content-primary">Personal Loan EMI</h3>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                Unsecured personal borrowings, instant app loans, and emergency credit lines.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-border/60 flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">Cardinality |A|</span>
                <span className="font-mono text-2xl font-normal text-[#3973B9]">{activeSetData.setA}</span>
              </div>
            </Card>

            {/* Category B */}
            <Card className="p-6 border-t-2 border-t-[#C18428] bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18428]">
                  Category B
                </span>
                <Badge variant="setB">
                  {activeSetData.totalRespondents > 0
                    ? `${((activeSetData.setB / activeSetData.totalRespondents) * 100).toFixed(0)}% of cohort`
                    : '0%'}
                </Badge>
              </div>
              <h3 className="text-base font-serif font-normal text-content-primary">Vehicle Loan EMI</h3>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                Two-wheeler installments, passenger car loans, and auto refinancing obligations.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-border/60 flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">Cardinality |B|</span>
                <span className="font-mono text-2xl font-normal text-[#C18428]">{activeSetData.setB}</span>
              </div>
            </Card>

            {/* Category C */}
            <Card className="p-6 border-t-2 border-t-[#8066B2] bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8066B2]">
                  Category C
                </span>
                <Badge variant="setC">
                  {activeSetData.totalRespondents > 0
                    ? `${((activeSetData.setC / activeSetData.totalRespondents) * 100).toFixed(0)}% of cohort`
                    : '0%'}
                </Badge>
              </div>
              <h3 className="text-base font-serif font-normal text-content-primary">Consumer Durable EMI</h3>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                Smartphone BNPL, laptop financing, home electronics, and retail no-cost EMI schemes.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-border/60 flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">Cardinality |C|</span>
                <span className="font-mono text-2xl font-normal text-[#8066B2]">{activeSetData.setC}</span>
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
          <Card className="p-6 sm:p-8 bg-white border-surface-border">
            <CardHeader className="p-0 pb-5 border-b border-surface-border/70">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="font-serif text-lg">Eight Mutually Exclusive Partitions</CardTitle>
                  <CardDescription>
                    Complete mathematical decomposition of cohort N={activeSetData.totalRespondents} into disjoint subsets.
                  </CardDescription>
                </div>
                <Badge variant="neutral" className="font-mono text-[10px]">
                  Sum of Partitions = {activeSetData.totalRespondents}
                </Badge>
              </div>
            </CardHeader>

            <div className="border border-surface-border rounded-card overflow-hidden mt-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-secondary/70 border-b border-surface-border font-mono uppercase tracking-widest text-[9px] text-content-muted">
                  <tr>
                    <th className="py-2.5 px-4">Partition Region</th>
                    <th className="py-2.5 px-4">Set Theoretic Expression</th>
                    <th className="py-2.5 px-4">Exclusive Formula</th>
                    <th className="py-2.5 px-4 text-right">Count</th>
                    <th className="py-2.5 px-4 text-right">% of Cohort</th>
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
                        <td className="py-2.5 px-4 flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: region.color }}
                          />
                          <span className={isSelected ? 'text-brand-dark' : 'text-content-primary font-medium'}>
                            {region.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-content-muted">
                          {region.setExpression}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-content-secondary">
                          {region.exclusiveFormula}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-right text-content-primary">
                          {region.count}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-content-muted text-right">
                          {region.percentageOfTotal.toFixed(1)}%
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
          {/* Key Aggregate Research Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted flex items-center gap-1.5">
                <Users className="w-3 h-3 text-brand" /> Valid Responses (N)
              </span>
              <div className="text-2xl font-mono font-normal text-content-primary pt-1">
                {activeSetData.totalRespondents}
              </div>
              <p className="text-[11px] text-content-secondary font-serif">
                {activeDataset?.excludedCount ? `${activeDataset.excludedCount} excluded duplicates` : '100% clean responses'}
              </p>
            </Card>

            <Card className="p-5 bg-white border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-brand" /> Unique Debtors |A∪B∪C|
              </span>
              <div className="text-2xl font-mono font-normal text-content-primary pt-1">
                {pie.atLeastOne}
              </div>
              <p className="text-[11px] text-content-secondary font-serif">
                {activeSetData.totalRespondents > 0
                  ? `${((pie.atLeastOne / activeSetData.totalRespondents) * 100).toFixed(1)}% in selected sets`
                  : '0%'}
              </p>
            </Card>

            <Card className="p-5 bg-white border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-[#C18428]" /> Multi-Loan Overlap (≥2)
              </span>
              <div className="text-2xl font-mono font-normal text-content-primary pt-1">
                {pie.atLeastTwo}
              </div>
              <p className="text-[11px] text-content-secondary font-serif">
                {activeSetData.totalRespondents > 0
                  ? `${((pie.atLeastTwo / activeSetData.totalRespondents) * 100).toFixed(1)}% multiple commitments`
                  : '0%'}
              </p>
            </Card>

            <Card className="p-5 bg-white border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand" /> Core EMI Trap (|A∩B∩C|)
              </span>
              <div className="text-2xl font-mono font-normal text-content-primary pt-1">
                {pie.allThree}
              </div>
              <p className="text-[11px] text-content-secondary font-serif">
                Triple concurrency cohort
              </p>
            </Card>
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
            <Card className="p-6 sm:p-8 bg-white border-surface-border space-y-6">
              <div className="border-b border-surface-border/70 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mb-1">
                    Descriptive Empirical Observations
                  </span>
                  <h3 className="text-lg font-serif font-normal text-content-primary">
                    Calculated Research Takeaways
                  </h3>
                </div>
                <Badge variant="neutral" className="font-mono text-[10px]">
                  Factual Non-Causal Analytics
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDataset.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-5 rounded-card bg-surface-secondary/40 border border-surface-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted flex items-center gap-1.5">
                        <Lightbulb className="w-3 h-3 text-brand" /> {insight.title}
                      </span>
                      <span className="font-mono text-xs font-semibold text-content-primary">
                        {insight.value}
                      </span>
                    </div>
                    <p className="text-xs text-content-secondary font-serif leading-relaxed">
                      {insight.statement}
                    </p>
                    <p className="text-[11px] text-content-muted leading-relaxed pt-1 border-t border-surface-border/50">
                      <strong>Methodological Note:</strong> {insight.significance}
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

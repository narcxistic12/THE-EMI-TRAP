import React from 'react';
import { useSurveyData } from '../../context/SurveyContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Upload, Sparkles, Database, Trash2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const DatasetBanner: React.FC = () => {
  const {
    activeDataset,
    isIllustrativeDemo,
    isActualSurvey,
    isEmptyState,
    loadIllustrativeDemo,
    loadResearchSurvey,
    removeActiveDataset,
    openUploadModal,
  } = useSurveyData();

  const isResearchCohort = activeDataset?.id === 'dataset-research-survey-16';

  if (isEmptyState) {
    return (
      <div className="p-6 rounded-panel border border-dashed border-surface-border bg-surface-secondary/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in duration-200">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-content-muted shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-content-primary">No Dataset Currently Active</h3>
              <Badge variant="neutral">Empty State</Badge>
            </div>
            <p className="text-xs text-content-secondary mt-1 max-w-xl leading-relaxed">
              Import a Google Forms survey export CSV or load a demonstration dataset to populate research charts, set intersections, and the interactive Venn explorer.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button size="sm" onClick={loadResearchSurvey} className="text-xs font-mono gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Research Cohort (N=16)
          </Button>
          <Button size="sm" variant="outline" onClick={loadIllustrativeDemo} className="text-xs font-mono gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            Load Demo (N=100)
          </Button>
          <Button size="sm" variant="outline" onClick={openUploadModal} className="text-xs font-mono gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Upload CSV
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-panel border border-surface-border bg-white shadow-subtle space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Dataset Info */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-card bg-surface-secondary flex items-center justify-center shrink-0 text-brand">
            {isActualSurvey ? <FileSpreadsheet className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-serif font-normal text-content-primary">
                {activeDataset?.name}
              </h3>
              {isIllustrativeDemo && (
                <Badge variant="setB" className="font-mono text-xs">
                  Illustrative Demonstration Model
                </Badge>
              )}
              {isActualSurvey && (
                <Badge variant="setA" className="font-mono text-xs">
                  Verified Survey Cohort
                </Badge>
              )}
              <span className="text-xs font-mono text-content-muted">
                N = {activeDataset?.validRespondents} Valid Respondents
              </span>
            </div>
            <p className="text-xs text-content-secondary mt-1 leading-relaxed max-w-2xl">
              {activeDataset?.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isResearchCohort && (
            <Button
              size="sm"
              variant="outline"
              onClick={loadResearchSurvey}
              className="text-xs font-mono gap-1.5 h-8 text-brand border-brand/30 hover:bg-brand/5"
              title="Switch to empirical 16-respondent research survey cohort"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-brand" />
              Research Cohort (N=16)
            </Button>
          )}

          {!isIllustrativeDemo && (
            <Button
              size="sm"
              variant="outline"
              onClick={loadIllustrativeDemo}
              className="text-xs font-mono gap-1.5 h-8"
              title="Switch to official 100-respondent illustrative benchmark"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Benchmark Demo (N=100)
            </Button>
          )}



          <Button
            size="sm"
            variant="outline"
            onClick={openUploadModal}
            className="text-xs font-mono gap-1.5 h-8"
          >
            <Upload className="w-3.5 h-3.5 text-brand" />
            Import CSV
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={removeActiveDataset}
            className="text-xs font-mono text-semantic-danger hover:text-semantic-danger hover:bg-red-50 h-8 gap-1"
            title="Clear loaded dataset"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </Button>
        </div>
      </div>

      {/* Privacy & Source Note */}
      <div className="pt-3 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-content-muted font-mono gap-2">
        <div className="flex items-center gap-1.5 text-brand">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Guaranteed: In-browser memory processing only. Zero external network transfer.</span>
        </div>
        <div>
          <span>Collection Period: {activeDataset?.collectionPeriod}</span>
        </div>
      </div>
    </div>
  );
};

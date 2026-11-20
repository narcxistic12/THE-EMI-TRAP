import React, { useState, useRef } from 'react';
import { useSurveyData } from '../../context/SurveyContext';
import { parseCsvText } from '../../lib/survey/csvParser';
import { CANONICAL_COLUMNS } from '../../lib/survey/columnMapper';
import { validateSurveyRows } from '../../lib/survey/surveyValidator';
import { buildSurveyDataset } from '../../lib/survey/surveyAggregator';
import { generateSampleCsvContent } from '../../data/researchSurveyDataset';
import {
  CanonicalSurveyField,
  ColumnMapping,
  CsvParseResult,
  ValidationSummary,
} from '../../types/survey';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const CsvUploadModal: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal, importUserDataset } = useSurveyData();

  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number }>({ name: '', size: 0 });
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [datasetName, setDatasetName] = useState<string>('Uploaded Survey Cohort');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleResetModal = () => {
    setStep('upload');
    setFileMeta({ name: '', size: 0 });
    setParseResult(null);
    setMapping({});
    setDatasetName('Uploaded Survey Cohort');
    closeUploadModal();
  };

  const handleProcessCsvText = (text: string, filename: string, sizeBytes: number) => {
    const result = parseCsvText(text);
    setParseResult(result);
    setFileMeta({ name: filename, size: sizeBytes });
    setMapping(result.suggestedMapping);
    setDatasetName(filename.replace(/\.csv$/i, ''));
    if (result.isValid && result.rows.length > 0) {
      setStep('mapping');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleProcessCsvText(text, file.name, file.size);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleProcessCsvText(text, file.name, file.size);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    const sampleCsv = generateSampleCsvContent();
    handleProcessCsvText(sampleCsv, 'google_forms_emi_sample.csv', sampleCsv.length);
  };

  const handleMappingChange = (field: CanonicalSurveyField, column: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: column === '__none__' ? undefined : column,
    }));
  };

  // Perform validation
  const validation = parseResult
    ? validateSurveyRows(parseResult.rows, mapping)
    : { validRecords: [], summary: {} as ValidationSummary };

  const handleConfirmImport = () => {
    if (!parseResult || validation.validRecords.length === 0) return;

    const dataset = buildSurveyDataset(
      `uploaded-${Date.now()}`,
      datasetName || 'Uploaded Survey Cohort',
      'uploaded_csv',
      `Imported from ${fileMeta.name} (${validation.validRecords.length} valid respondents).`,
      validation.validRecords,
      validation.summary,
      {
        fileName: fileMeta.name,
        fileSizeBytes: fileMeta.size,
        collectionPeriod: 'Uploaded Custom Survey Cohort',
      }
    );

    importUserDataset(dataset);
    handleResetModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl max-h-[90vh] bg-white border-surface-border shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-surface-border/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-card bg-brand-soft/60 text-brand flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-normal text-content-primary">
                Google Forms Survey Ingestion
              </h2>
              <p className="text-xs text-content-secondary">
                {step === 'upload' && 'Step 1 of 3: Select or drop your survey export CSV.'}
                {step === 'mapping' && 'Step 2 of 3: Map Google Forms question columns to research fields.'}
                {step === 'preview' && 'Step 3 of 3: Validate respondent records and confirm import.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetModal}
            className="p-1 rounded-sm text-content-muted hover:text-content-primary hover:bg-surface-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Privacy Banner */}
          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border flex items-center gap-2.5 text-xs text-content-secondary">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
            <span>
              <strong>Zero Server Upload:</strong> All survey rows are parsed and validated strictly in browser memory. No data is sent over the network.
            </span>
          </div>

          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-10 border-2 border-dashed rounded-panel text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-brand bg-brand-soft/20'
                    : 'border-surface-border hover:border-brand/50 hover:bg-surface-secondary/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded-full bg-brand-soft/50 text-brand mx-auto flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-content-primary">
                  Choose a survey CSV or drag and drop it here
                </h3>
                <p className="text-xs text-content-muted mt-1">
                  Supports Google Forms CSV exports (UTF-8, UTF-8 BOM, quoted cells with commas)
                </p>
                <div className="mt-4">
                  <span className="inline-flex px-3 py-1.5 rounded-btn bg-white border border-surface-border text-xs font-mono font-medium text-content-primary shadow-2xs">
                    Browse Files
                  </span>
                </div>
              </div>

              {parseResult && !parseResult.isValid && (
                <div className="p-4 rounded-card bg-red-50 border border-red-200 text-xs text-semantic-danger space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Error parsing CSV:
                  </div>
                  {parseResult.errors.map((err, i) => (
                    <div key={i}>&bull; {err}</div>
                  ))}
                </div>
              )}

              {/* Sample Dataset Helper */}
              <div className="pt-4 border-t border-surface-border/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-content-primary">No CSV file handy?</h4>
                  <p className="text-xs text-content-muted">
                    Test the ingestion pipeline using the genuine Google Forms survey responses (16 respondents).
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={handleLoadSampleCsv} className="text-xs font-mono">
                  Load Sample CSV
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Column Mapping */}
          {step === 'mapping' && parseResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border/60">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-content-primary">
                    File: {fileMeta.name} ({parseResult.totalRows} rows detected)
                  </span>
                  <p className="text-xs text-content-muted">
                    Review and confirm how each survey question maps to project analysis fields.
                  </p>
                </div>
                <Badge variant="setA" className="font-mono text-xs">
                  {parseResult.headers.length} Columns
                </Badge>
              </div>

              {/* Mapping Table */}
              <div className="border border-surface-border rounded-card overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface-secondary/70 border-b border-surface-border font-mono uppercase tracking-widest text-xs text-content-muted">
                    <tr>
                      <th className="py-2.5 px-4">Research Metric</th>
                      <th className="py-2.5 px-4">Requirement</th>
                      <th className="py-2.5 px-4">CSV Column Header</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/60">
                    {CANONICAL_COLUMNS.map((col) => {
                      const currentMapped = mapping[col.key] || '__none__';
                      return (
                        <tr key={col.key} className="hover:bg-surface-secondary/20">
                          <td className="py-2.5 px-4">
                            <span className="font-medium text-content-primary block">{col.label}</span>
                            <span className="text-xs text-content-muted font-mono">{col.description}</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono">
                            {col.required ? (
                              <span className="text-brand font-semibold">Required</span>
                            ) : (
                              <span className="text-content-muted">Optional</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="relative">
                              <select
                                value={currentMapped}
                                onChange={(e) => handleMappingChange(col.key, e.target.value)}
                                className="w-full h-9 px-2.5 pr-8 rounded-input border border-surface-border bg-white text-xs font-mono text-content-primary appearance-none cursor-pointer focus:outline-none focus:border-brand"
                              >
                                <option value="__none__">-- Not Mapped --</option>
                                {parseResult.headers.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-content-muted absolute right-2.5 top-2.5 pointer-events-none" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!mapping.categories && (
                <div className="p-3 rounded-card bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>Required Field Missing:</strong> Please map the &ldquo;Active EMI Categories&rdquo; question to proceed with set intersection analysis.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Preview & Confirmation */}
          {step === 'preview' && (
            <div className="space-y-6">
              {/* Dataset Name Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-content-muted mb-1">
                  Survey Dataset Name
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full h-9 px-3 rounded-input border border-surface-border text-xs font-serif text-content-primary focus:outline-none focus:border-brand"
                  placeholder="e.g. Bangalore Urban Fintech Survey 2026"
                />
              </div>

              {/* Validation Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border">
                  <span className="text-xs font-mono uppercase text-content-muted block">Total Uploaded</span>
                  <span className="text-xl sm:text-2xl font-mono text-content-primary font-normal mt-1 block">
                    {validation.summary.totalRows}
                  </span>
                </div>
                <div className="p-3.5 rounded-card bg-brand-soft/40 border border-brand/20">
                  <span className="text-xs font-mono uppercase text-brand block font-semibold">Valid Responses</span>
                  <span className="text-xl sm:text-2xl font-mono text-brand-dark font-normal mt-1 block">
                    {validation.summary.validRowCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border">
                  <span className="text-xs font-mono uppercase text-content-muted block">Duplicate Exclusions</span>
                  <span className="text-xl sm:text-2xl font-mono text-content-primary font-normal mt-1 block">
                    {validation.summary.duplicateRowCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border">
                  <span className="text-xs font-mono uppercase text-content-muted block">Invalid Exclusions</span>
                  <span className="text-xl sm:text-2xl font-mono text-content-primary font-normal mt-1 block">
                    {validation.summary.invalidRowCount}
                  </span>
                </div>
              </div>

              {/* Excluded Rows Notice if any */}
              {validation.summary.excludedRows.length > 0 && (
                <div className="p-4 rounded-card bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> {validation.summary.excludedRows.length} Rows Excluded from Mathematical Processing:
                  </div>
                  <ul className="space-y-1 list-disc pl-5 max-h-28 overflow-y-auto font-mono text-xs">
                    {validation.summary.excludedRows.map((ex, i) => (
                      <li key={i}>
                        Row {ex.rowNumber} ({ex.identifier}): {ex.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Valid Records Preview */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-content-muted block">
                  First 5 Valid Records Preview
                </span>
                <div className="border border-surface-border rounded-card overflow-hidden">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-surface-secondary/70 border-b border-surface-border font-mono uppercase tracking-widest text-xs text-content-muted">
                      <tr>
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">Active Categories</th>
                        <th className="py-2.5 px-3">Income</th>
                        <th className="py-2.5 px-3">EMI Commitment</th>
                        <th className="py-2.5 px-3">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/60 font-mono text-xs sm:text-sm">
                      {validation.validRecords.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-surface-secondary/20">
                          <td className="py-2 px-3 text-content-muted">{r.id}</td>
                          <td className="py-2 px-3 text-content-primary">
                            {r.categories.length > 0 ? r.categories.join(', ') : 'None (Debt-free)'}
                          </td>
                          <td className="py-2 px-3 text-content-muted">{r.incomeRange}</td>
                          <td className="py-2 px-3 text-content-muted">{r.emiRange}</td>
                          <td className="py-2 px-3 text-content-muted">{r.repaymentDifficulty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-surface-border/70 flex items-center justify-between bg-surface-secondary/20">
          <div>
            {step === 'mapping' && (
              <Button size="sm" variant="ghost" onClick={() => setStep('upload')} className="text-xs font-mono">
                Back to Upload
              </Button>
            )}
            {step === 'preview' && (
              <Button size="sm" variant="ghost" onClick={() => setStep('mapping')} className="text-xs font-mono">
                Back to Column Mapping
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleResetModal} className="text-xs font-mono">
              Cancel
            </Button>

            {step === 'mapping' && (
              <Button
                size="sm"
                disabled={!mapping.categories}
                onClick={() => setStep('preview')}
                className="text-xs font-mono gap-1.5"
              >
                Validate &amp; Preview
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}

            {step === 'preview' && (
              <Button
                size="sm"
                disabled={validation.validRecords.length === 0}
                onClick={handleConfirmImport}
                className="text-xs font-mono gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm &amp; Import Dataset
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

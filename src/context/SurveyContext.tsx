import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SurveyDataset, DatasetSourceType } from '../types/survey';
import { ILLUSTRATIVE_DATASET } from '../data/illustrativeDataset';
import { SAMPLE_SURVEY_DATASET } from '../data/sampleSurveyDataset';
import { RESEARCH_SURVEY_DATASET } from '../data/researchSurveyDataset';
import { SetCardinalityInput } from '../types/setTheory';
import { ILLUSTRATIVE_SET_DATA } from '../lib/math/setTheory';

interface SurveyContextType {
  activeDataset: SurveyDataset | null;
  datasetSource: DatasetSourceType | 'none';
  isIllustrativeDemo: boolean;
  isActualSurvey: boolean;
  isEmptyState: boolean;
  activeSetData: SetCardinalityInput;
  loadIllustrativeDemo: () => void;
  loadSampleSurvey: () => void;
  loadResearchSurvey: () => void;
  importUserDataset: (dataset: SurveyDataset) => void;
  removeActiveDataset: () => void;
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const EMPTY_SET_DATA: SetCardinalityInput = {
  totalRespondents: 0,
  setA: 0,
  setB: 0,
  setC: 0,
  intersectionAB: 0,
  intersectionAC: 0,
  intersectionBC: 0,
  intersectionABC: 0,
};

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to Empirical Research Survey Cohort (N=16)
  const [activeDataset, setActiveDataset] = useState<SurveyDataset | null>(RESEARCH_SURVEY_DATASET);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const loadIllustrativeDemo = () => {
    setActiveDataset(ILLUSTRATIVE_DATASET);
  };

  const loadSampleSurvey = () => {
    setActiveDataset(SAMPLE_SURVEY_DATASET);
  };

  const loadResearchSurvey = () => {
    setActiveDataset(RESEARCH_SURVEY_DATASET);
  };

  const importUserDataset = (dataset: SurveyDataset) => {
    setActiveDataset(dataset);
    setIsUploadModalOpen(false);
  };

  const removeActiveDataset = () => {
    // Return to clean empty state; do not silently reload demo data
    setActiveDataset(null);
  };

  const datasetSource: DatasetSourceType | 'none' = activeDataset ? activeDataset.sourceType : 'none';
  const isIllustrativeDemo = datasetSource === 'illustrative';
  const isActualSurvey = datasetSource === 'uploaded_csv' || datasetSource === 'sample_survey';
  const isEmptyState = activeDataset === null;

  const activeSetData: SetCardinalityInput = activeDataset
    ? activeDataset.calculatedSetData
    : (isEmptyState ? EMPTY_SET_DATA : ILLUSTRATIVE_SET_DATA);

  return (
    <SurveyContext.Provider
      value={{
        activeDataset,
        datasetSource,
        isIllustrativeDemo,
        isActualSurvey,
        isEmptyState,
        activeSetData,
        loadIllustrativeDemo,
        loadSampleSurvey,
        loadResearchSurvey,
        importUserDataset,
        removeActiveDataset,
        isUploadModalOpen,
        openUploadModal: () => setIsUploadModalOpen(true),
        closeUploadModal: () => setIsUploadModalOpen(false),
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveyData = (): SurveyContextType => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveyData must be used within a SurveyProvider');
  }
  return context;
};


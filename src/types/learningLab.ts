export type LearningModuleId =
  | 'module-1-foundations'
  | 'module-2-pie'
  | 'module-3-generalized'
  | 'module-4-pigeonhole'
  | 'module-5-supplementary';

export interface QuizQuestion {
  id: string;
  question: string;
  latexEquation?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  whyOthersIncorrect?: string[];
}

export interface LearningTopic {
  id: string;
  title: string;
  subtitle: string;
  latexFormula: string;
  definition: string;
  workedExample: string;
  emiApplication: string;
  stepByStep?: string[];
}

export interface LearningModule {
  id: LearningModuleId;
  number: string;
  title: string;
  tagline: string;
  category: 'core' | 'supplementary';
  description: string;
  topics: LearningTopic[];
  quiz: QuizQuestion[];
}


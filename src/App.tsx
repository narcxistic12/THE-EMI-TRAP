import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import { AppLayout } from './components/layout/AppLayout';

// Lazy-loaded routes for optimal bundle code-splitting
const Overview = React.lazy(() =>
  import('./pages/Overview').then((m) => ({ default: m.Overview }))
);
const EMICalculator = React.lazy(() =>
  import('./pages/EMICalculator').then((m) => ({ default: m.EMICalculator }))
);
const ResearchDashboard = React.lazy(() =>
  import('./pages/ResearchDashboard').then((m) => ({ default: m.ResearchDashboard }))
);
const MathematicalAnalysis = React.lazy(() =>
  import('./pages/MathematicalAnalysis').then((m) => ({ default: m.MathematicalAnalysis }))
);
const LearningLab = React.lazy(() =>
  import('./pages/LearningLab').then((m) => ({ default: m.LearningLab }))
);
const NotFound = React.lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound }))
);

const PageFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-content-muted">
        Loading Section...
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <SurveyProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Overview />} />
              <Route path="/calculator" element={<EMICalculator />} />
              <Route path="/research" element={<ResearchDashboard />} />
              <Route path="/math" element={<MathematicalAnalysis />} />
              <Route path="/learning-lab" element={<LearningLab />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SurveyProvider>
  );
};

export default App;

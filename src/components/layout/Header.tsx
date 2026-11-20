import React from 'react';
import { Menu, ChevronRight, Calculator } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useSurveyData } from '../../context/SurveyContext';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

const routeMetadata: Record<string, { title: string; section: string }> = {
  '/': {
    title: 'Understanding the EMI Trap',
    section: 'Overview',
  },
  '/calculator': {
    title: 'Personal Cash Flow & Commitment Calculator',
    section: 'Financial Planning',
  },
  '/research': {
    title: 'Research Dashboard & Debt Segmentation',
    section: 'Research Analytics',
  },
  '/math': {
    title: 'Mathematical Analysis & Formal Proofs',
    section: 'Discrete Mathematics',
  },
  '/learning-lab': {
    title: 'Debt Analytics & Set Theory Lab',
    section: 'Analytical Foundations',
  },
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const location = useLocation();
  const { loadResearchSurvey, loadIllustrativeDemo, isActualSurvey, isIllustrativeDemo } = useSurveyData();

  const currentMeta = routeMetadata[location.pathname] || {
    title: 'The EMI Trap',
    section: 'Platform',
  };

  return (
    <header className="sticky top-0 z-10 glass-header px-6 sm:px-10 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-btn text-content-secondary hover:text-content-primary glass-pill"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-content-muted mb-0.5">
            <span>THE EMI TRAP</span>
            <ChevronRight className="w-3 h-3 text-content-muted/50" />
            <span className="text-content-secondary font-medium">{currentMeta.section}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-normal tracking-tight text-content-primary">
            {currentMeta.title}
          </h2>
        </div>
      </div>

      {/* Header Context Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Dataset Selector */}
        <div className="hidden sm:flex items-center glass-pill rounded-btn p-0.5 text-xs font-mono">
          <button
            onClick={loadResearchSurvey}
            className={`px-2.5 py-1 rounded-sm text-xs transition-colors ${
              isActualSurvey
                ? 'bg-brand text-white font-medium shadow-xs'
                : 'text-content-muted hover:text-content-primary'
            }`}
            title="Load empirical survey cohort (N=16)"
          >
            Cohort N=16
          </button>
          <button
            onClick={loadIllustrativeDemo}
            className={`px-2.5 py-1 rounded-sm text-xs transition-colors ${
              isIllustrativeDemo
                ? 'bg-brand text-white font-medium shadow-xs'
                : 'text-content-muted hover:text-content-primary'
            }`}
            title="Load demonstration model (N=100)"
          >
            Demo N=100
          </button>
        </div>

        {location.pathname !== '/calculator' && (
          <Link to="/calculator">
            <Button size="sm" variant="outline" className="hidden sm:inline-flex text-xs h-7.5 px-3">
              <Calculator className="w-3.5 h-3.5 mr-1.5 text-brand" />
              Calculator
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

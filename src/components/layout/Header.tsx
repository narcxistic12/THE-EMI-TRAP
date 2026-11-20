import React from 'react';
import { Menu, ChevronRight, Calculator, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

const routeMetadata: Record<string, { title: string; subtitle: string; section: string }> = {
  '/': {
    title: 'Understanding the EMI Trap',
    subtitle: 'An analytical investigation into multi-loan compounding and cashflow erosion.',
    section: 'Overview',
  },
  '/calculator': {
    title: 'Personal Cash Flow & Commitment Calculator',
    subtitle: 'Assess combined monthly obligations, income ratio, and simulate prospective purchases.',
    section: 'Financial Planning',
  },
  '/research': {
    title: 'Research Dashboard & Debt Segmentation',
    subtitle: 'Empirical survey analysis of overlapping debt categories with 3-set Venn partitioning.',
    section: 'Research Analytics',
  },
  '/math': {
    title: 'Mathematical Analysis & Formal Proofs',
    subtitle: 'Step-by-step solutions using the Principle of Inclusion and Exclusion (Module 1).',
    section: 'Discrete Mathematics',
  },
  '/learning-lab': {
    title: 'Discrete Mathematics Learning Lab',
    subtitle: 'Interactive educational modules covering Set Theory, Venn regions, and PIE identities.',
    section: 'Educational Foundation',
  },
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const location = useLocation();
  const currentMeta = routeMetadata[location.pathname] || {
    title: 'The EMI Trap',
    subtitle: 'Financial Behaviour & Discrete Mathematics Platform',
    section: 'Platform',
  };

  return (
    <header className="sticky top-0 z-10 bg-canvas/90 backdrop-blur-md border-b border-surface-border px-6 sm:px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-btn text-content-secondary hover:text-content-primary hover:bg-surface border border-surface-border"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-content-muted mb-1">
            <span>THE EMI TRAP</span>
            <ChevronRight className="w-2.5 h-2.5 text-content-muted/50" />
            <span className="text-content-secondary">{currentMeta.section}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-normal tracking-tight text-content-primary">
            {currentMeta.title}
          </h2>
          <p className="hidden sm:block text-xs text-content-secondary mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Header Context Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-surface border border-surface-border text-content-secondary text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span>Client-Side Execution</span>
        </div>

        {location.pathname !== '/calculator' && (
          <Link to="/calculator">
            <Button size="sm" variant="outline" className="hidden sm:inline-flex text-xs h-8">
              <Calculator className="w-3.5 h-3.5 mr-1.5 text-brand" />
              Calculator
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

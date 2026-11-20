import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck } from 'lucide-react';
import { SmoothScrollProvider } from '../../providers/SmoothScrollProvider';
import Aurora from '../animated/Aurora';

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  useEffect(() => {
    // Reset any theme overrides to preserve default design
    localStorage.removeItem('emi-theme');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-canvas text-content-primary flex flex-row relative overflow-x-hidden selection:bg-brand-soft selection:text-brand-dark">
        {/* Layer 1: Ambient Chromatic Refraction Backing for Liquid Glass */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* React Bits Animated Aurora Background */}
          <Aurora
            colorStops={['#176B57', '#3973B9', '#C18428', '#10B981']}
            amplitude={0.9}
            blend={0.6}
            speed={0.45}
            opacity={0.28}
            lightMode={true}
            direction="top"
            dpr={1}
            className="w-full h-full"
          />
        </div>

        {/* Fixed Desktop Sidebar (240px) */}
        <div className="hidden md:block relative z-20">
          <Sidebar
            onOpenAbout={() => setAboutOpen(true)}
            onOpenSources={() => setSourcesOpen(true)}
          />
        </div>

        {/* Mobile Drawer */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenSources={() => setSourcesOpen(true)}
        />

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Header
            onToggleMobileNav={() => setMobileNavOpen(true)}
          />

        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </main>

        {/* Global Footer Disclaimer in Liquid Glass Style */}
        <footer className="border-t border-surface-border/60 glass-plate py-8 px-4 sm:px-6 lg:px-8 text-content-muted mt-auto">
          <div className="max-w-4xl mx-auto space-y-2.5 text-center">
            <div className="flex items-center justify-center gap-2 text-content-secondary font-serif text-sm sm:text-base">
              <span>THE EMI TRAP</span>
              <span className="text-content-muted/60">•</span>
              <span className="italic">Discrete Mathematics &amp; Financial Behaviour Analytics</span>
            </div>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-2xl mx-auto">
              An educational platform applying set theory and the Principle of Inclusion–Exclusion to multi-loan overlap in consumer finance.
            </p>
            <p className="text-xs text-content-muted/80 max-w-xl mx-auto italic pt-1">
              Calculator outputs represent user-entered arithmetic and do not constitute formal credit underwriting or financial advice.
            </p>
          </div>
        </footer>
      </div>

      {/* Modal: About the Project */}
      <Modal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title="About THE EMI TRAP"
        description="Financial Risk &amp; Debt Overlap Analysis"
        footer={<Button size="sm" onClick={() => setAboutOpen(false)}>Close</Button>}
      >
        <div className="space-y-3">
          <div className="p-3.5 rounded-card bg-surface-secondary border border-surface-border flex items-center gap-3">
            <span className="font-serif font-bold text-lg text-brand">∏</span>
            <div className="text-xs">
              <span className="font-semibold text-content-primary block">Principle of Inclusion and Exclusion</span>
              <span className="text-content-secondary">Bridging rigorous set theory with real-world consumer credit overlap.</span>
            </div>
          </div>
          <p>
            <strong>THE EMI TRAP</strong> demonstrates how multiple installment commitments can overlap and quietly consume an individual&apos;s monthly cash flow.
          </p>
          <div className="pt-2 border-t border-surface-border space-y-2 text-xs">
            <p className="font-semibold text-content-primary">Two Decoupled Systems:</p>
            <ul className="list-disc pl-5 space-y-1 text-content-secondary">
              <li><strong>Personal EMI Calculator:</strong> Ordinary financial arithmetic to sum commitments, compute income ratio, and simulate prospective purchases.</li>
              <li><strong>Research &amp; PIE Engine:</strong> Discrete mathematics counting unique respondents across Personal, Vehicle, and Consumer Durable loans without duplicate counting.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal: Data Sources */}
      <Modal
        isOpen={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        title="Data Sources &amp; Privacy Protocol"
        description="Anonymous Google Forms Survey Methodology"
        footer={<Button size="sm" onClick={() => setSourcesOpen(false)}>Done</Button>}
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded-card bg-surface-secondary border border-surface-border flex items-center gap-2.5 text-content-primary">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
            <span>Strict Zero-PII Guarantee: All data processing occurs 100% in local browser memory.</span>
          </div>
          <p>
            The research module investigates population distributions across three mutually non-exclusive sets:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
            <div className="p-2.5 rounded-card bg-setA-soft text-setA border border-setA/20 font-medium text-center">
              Set A: Personal Loans
            </div>
            <div className="p-2.5 rounded-card bg-setB-soft text-setB border border-setB/20 font-medium text-center">
              Set B: Vehicle Loans
            </div>
            <div className="p-2.5 rounded-card bg-setC-soft text-setC border border-setC/20 font-medium text-center">
              Set C: Consumer Durable / BNPL
            </div>
          </div>
          <p className="text-content-muted">
            Initial views use the illustrative dataset defined in Section 8 of the project design document (N = 100) until a primary survey CSV is uploaded.
          </p>
        </div>
      </Modal>
    </div>
    </SmoothScrollProvider>
  );
};

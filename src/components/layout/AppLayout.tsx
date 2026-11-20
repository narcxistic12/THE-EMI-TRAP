import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Sun } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-content-primary flex flex-row">
      {/* Fixed Desktop Sidebar (240px) */}
      <div className="hidden md:block">
        <Sidebar
          onOpenAbout={() => setAboutOpen(true)}
          onOpenSources={() => setSourcesOpen(true)}
          onOpenTheme={() => setThemeOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenSources={() => setSourcesOpen(true)}
        onOpenTheme={() => setThemeOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-8 sm:py-10">
          <Outlet />
        </main>

        {/* Global Footer Disclaimer in Editorial Style */}
        <footer className="border-t border-surface-border bg-surface-secondary/30 py-8 px-6 sm:px-12 text-xs text-content-muted">
          <div className="max-w-4xl mx-auto space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-content-secondary font-serif text-sm">
              <span>THE EMI TRAP</span>
              <span className="text-content-muted/60">•</span>
              <span className="italic">Discrete Mathematics &amp; Financial Behaviour Analytics</span>
            </div>
            <p className="text-[11px] text-content-secondary leading-relaxed max-w-2xl mx-auto">
              An educational platform applying set theory and the Principle of Inclusion–Exclusion to multi-loan overlap in consumer finance.
            </p>
            <p className="text-[10px] text-content-muted/80 max-w-xl mx-auto italic pt-1">
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
        description="Discrete Mathematics Experiential Learning"
        footer={<Button size="sm" onClick={() => setAboutOpen(false)}>Close</Button>}
      >
        <div className="space-y-3">
          <div className="p-3.5 rounded-card bg-surface-secondary border border-surface-border flex items-center gap-3">
            <span className="font-serif font-bold text-lg text-brand">∏</span>
            <div className="text-xs">
              <span className="font-semibold text-content-primary block">Module 1 — Principle of Inclusion and Exclusion</span>
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

      {/* Modal: Theme Settings */}
      <Modal
        isOpen={themeOpen}
        onClose={() => setThemeOpen(false)}
        title="Visual Design Tokens"
        description="Premium Wealth Management Visual Identity"
        footer={<Button size="sm" onClick={() => setThemeOpen(false)}>Close</Button>}
      >
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-card bg-surface border border-surface-border">
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-brand" />
              <div>
                <span className="font-semibold text-content-primary block">Alabaster White (Default Theme)</span>
                <span className="text-content-muted text-[11px]">Subtle Evergreen accent (#176B57) on warm paper (#FBFBFA)</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-sm bg-brand-soft text-brand-dark font-mono text-[10px]">
              Active
            </span>
          </div>
          <p className="text-content-secondary leading-relaxed">
            Inspired by Swiss private banking and editorial financial journals, this palette prioritizes typographic hierarchy, high contrast, and data density.
          </p>
        </div>
      </Modal>
    </div>
  );
};

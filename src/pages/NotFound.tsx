import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-10 h-10 rounded-sm border border-brand/40 bg-brand-soft/40 flex items-center justify-center text-brand">
        <span className="font-serif font-bold text-base">∏</span>
      </div>
      <h1 className="text-3xl font-serif font-normal text-content-primary">404 &mdash; Page Not Found</h1>
      <p className="text-xs sm:text-sm text-content-secondary max-w-md font-serif italic">
        The requested pathway does not exist within the EMI Trap analytical index.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button size="sm" variant="outline" className="gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Overview
          </Button>
        </Link>
      </div>
    </div>
  );
};

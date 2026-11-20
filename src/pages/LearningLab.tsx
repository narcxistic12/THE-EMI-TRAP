import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Award,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { KatexMath } from '../components/math/KatexMath';
import { LEARNING_MODULES } from '../data/learningLabModules';
import { LearningModuleId } from '../types/learningLab';
import { SetMembershipExplorer } from '../components/learning/SetMembershipExplorer';
import { OverlapDemoWidget } from '../components/learning/OverlapDemoWidget';
import { PigeonholeLabCalculator } from '../components/learning/PigeonholeLabCalculator';
import { ModuleKnowledgeCheck } from '../components/learning/ModuleKnowledgeCheck';

export const LearningLab: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<LearningModuleId>('module-1-foundations');
  const [activeView, setActiveView] = useState<'theory' | 'interactive' | 'quiz'>('theory');

  // Active module
  const currentModuleIndex = LEARNING_MODULES.findIndex((m) => m.id === activeModuleId);
  const activeModule = LEARNING_MODULES[currentModuleIndex] || LEARNING_MODULES[0];

  // Active topic within module
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    activeModule.topics[0]?.id || ''
  );

  // When module changes, update selected topic
  const handleSelectModule = (id: LearningModuleId) => {
    setActiveModuleId(id);
    const mod = LEARNING_MODULES.find((m) => m.id === id);
    if (mod && mod.topics.length > 0) {
      setSelectedTopicId(mod.topics[0].id);
    }
  };

  const activeTopic =
    activeModule.topics.find((t) => t.id === selectedTopicId) || activeModule.topics[0];

  const handleNextModule = () => {
    if (currentModuleIndex < LEARNING_MODULES.length - 1) {
      handleSelectModule(LEARNING_MODULES[currentModuleIndex + 1].id);
    }
  };

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      handleSelectModule(LEARNING_MODULES[currentModuleIndex - 1].id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="pb-4 border-b border-surface-border flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted mb-1 font-medium">
            <span>Section 05</span>
            <span>&bull;</span>
            <span>Mathematical Foundations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-content-primary">
            Debt Analytics &amp; Set Theory Lab
          </h1>
          <p className="text-sm sm:text-base text-content-secondary mt-1.5">
            Core mathematical principles: set theory, inclusion-exclusion, and borrower concentration.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="setB" className="font-mono text-xs px-2.5 py-1">
            4 Units &bull; 12 Topics
          </Badge>
        </div>
      </div>

      {/* Module Selector Carousel / Tabs */}
      <div className="space-y-2">
        <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted block font-semibold">
          Analytical Units &amp; Frameworks
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {LEARNING_MODULES.map((module) => {
            const isSelected = module.id === activeModuleId;
            return (
              <button
                key={module.id}
                onClick={() => handleSelectModule(module.id)}
                className={`p-4 rounded-card border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'glass-pill border-brand shadow-xs ring-1 ring-brand/25'
                    : 'bg-white/40 backdrop-blur-xs border-surface-border/80 hover:bg-white/70 text-content-secondary'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-content-muted">
                      UNIT {module.number}
                    </span>
                    {module.category === 'core' ? (
                      <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold">
                        Core Analysis
                      </span>
                    ) : (
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
                        Supp.
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-serif leading-snug ${
                      isSelected ? 'text-content-primary font-semibold' : 'text-content-primary'
                    }`}
                  >
                    {module.title}
                  </h4>
                </div>
                <div className="text-xs font-mono text-content-muted mt-2.5 pt-2 border-t border-surface-border/50">
                  {module.topics.length} Topics &bull; {module.quiz.length} Questions
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Banner Card */}
      <Card variant="default" className="p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-surface-border/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand font-semibold">
                Unit {activeModule.number}
              </span>
              <span className="text-content-muted">&bull;</span>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted font-medium">
                {activeModule.category === 'core' ? 'Core Analytical Framework' : 'Supplementary Framework'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-content-primary">
              {activeModule.title}
            </h2>
            <p className="text-sm sm:text-base text-content-secondary mt-1.5 font-serif italic max-w-3xl leading-relaxed">
              {activeModule.description}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface-secondary/70 p-1 rounded-btn border border-surface-border self-start sm:self-auto">
            <button
              onClick={() => setActiveView('theory')}
              className={`px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-mono transition-all flex items-center gap-2 ${
                activeView === 'theory'
                  ? 'bg-white text-content-primary shadow-xs font-semibold'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <BookOpen className="w-4 h-4 text-brand" />
              <span>Theory ({activeModule.topics.length})</span>
            </button>

            <button
              onClick={() => setActiveView('interactive')}
              className={`px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-mono transition-all flex items-center gap-2 ${
                activeView === 'interactive'
                  ? 'bg-white text-content-primary shadow-xs font-semibold'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Sliders className="w-4 h-4 text-brand" />
              <span>Lab Tool</span>
            </button>

            <button
              onClick={() => setActiveView('quiz')}
              className={`px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-mono transition-all flex items-center gap-2 ${
                activeView === 'quiz'
                  ? 'bg-white text-content-primary shadow-xs font-semibold'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Award className="w-4 h-4 text-brand" />
              <span>Quiz ({activeModule.quiz.length})</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: THEORY SYLLABUS & DEEP DIVE */}
        {activeView === 'theory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            {/* Left Column: Module Topics */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-content-muted px-1 block">
                Topics in Unit {activeModule.number}
              </span>
              <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                {activeModule.topics.map((topic, tIdx) => {
                  const isSelected = topic.id === activeTopic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`w-full text-left p-3.5 rounded-card border transition-all ${
                        isSelected
                          ? 'bg-surface-secondary/70 text-content-primary border-surface-border shadow-xs'
                          : 'bg-transparent hover:bg-surface-secondary/40 border-transparent text-content-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-content-muted">
                              {String(tIdx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold">
                              {topic.subtitle}
                            </span>
                          </div>
                          <h4
                            className={`text-sm sm:text-base mt-1 ${
                              isSelected ? 'text-content-primary font-semibold' : 'text-content-secondary'
                            }`}
                          >
                            {topic.title}
                          </h4>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-brand shrink-0 ml-2" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Topic Detail Card */}
            <div className="lg:col-span-7 space-y-5">
              {/* Header */}
              <div className="border-b border-surface-border/70 pb-3">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand font-semibold">
                  {activeTopic.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-content-primary mt-1">
                  {activeTopic.title}
                </h3>
              </div>

              {/* Definition */}
              <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
                {activeTopic.definition}
              </p>

              {/* KaTeX Notation */}
              <div className="p-4 rounded-card bg-surface-secondary/50 border border-surface-border font-mono text-sm sm:text-base text-content-primary text-center overflow-x-auto">
                <KatexMath math={activeTopic.latexFormula} block />
              </div>

              {/* Step-by-Step Expansion */}
              {activeTopic.stepByStep && activeTopic.stepByStep.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted block font-semibold">
                    Derivation Steps
                  </span>
                  <div className="space-y-2 pl-1 text-xs sm:text-sm">
                    {activeTopic.stepByStep.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5">
                        <span className="font-mono text-brand font-semibold shrink-0">{sIdx + 1}.</span>
                        <span className="font-mono text-content-secondary leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Worked Example */}
              <div className="p-4 rounded-card bg-surface-secondary/30 border border-surface-border/70 space-y-1.5 text-xs sm:text-sm font-mono text-content-secondary">
                <span className="text-xs uppercase tracking-wider text-content-muted block font-semibold">
                  Worked Example
                </span>
                <p className="leading-relaxed">{activeTopic.workedExample}</p>
              </div>

              {/* Connection to THE EMI TRAP */}
              <div className="p-4 rounded-card bg-brand-soft/20 border border-brand/20 space-y-1.5 text-sm sm:text-base text-brand-dark">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand block font-semibold">
                  Application to EMI Trap
                </span>
                <p className="leading-relaxed">{activeTopic.emiApplication}</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE LAB TOOL */}
        {activeView === 'interactive' && (
          <div className="pt-2">
            {activeModule.id === 'module-1-foundations' && <SetMembershipExplorer />}
            {(activeModule.id === 'module-2-pie' || activeModule.id === 'module-3-generalized') && (
              <OverlapDemoWidget />
            )}
            {activeModule.id === 'module-4-pigeonhole' && <PigeonholeLabCalculator />}
          </div>
        )}

        {/* VIEW 3: PRACTICE QUIZ */}
        {activeView === 'quiz' && (
          <div className="pt-2">
            <ModuleKnowledgeCheck
              questions={activeModule.quiz}
              moduleTitle={activeModule.title}
            />
          </div>
        )}
      </Card>

      {/* Module Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border/70">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrevModule}
          disabled={currentModuleIndex === 0}
          className="text-xs font-mono h-8 gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Unit</span>
        </Button>

        <span className="text-xs font-mono text-content-muted">
          Unit {currentModuleIndex + 1} of {LEARNING_MODULES.length}
        </span>

        <Button
          size="sm"
          variant="primary"
          onClick={handleNextModule}
          disabled={currentModuleIndex === LEARNING_MODULES.length - 1}
          className="text-xs font-mono h-8 gap-1.5"
        >
          <span>Next Unit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

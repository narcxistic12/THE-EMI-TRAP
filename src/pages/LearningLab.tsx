import React, { useState } from 'react';
import {
  Layers,
  Lightbulb,
  BookOpen,
  Sparkles,
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
      <div className="pb-6 border-b border-surface-border/70 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mb-1">
            Section 05 &bull; Theoretical Foundation
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-content-primary">
            Discrete Mathematics Learning Lab
          </h1>
          <p className="text-xs text-content-secondary mt-1 max-w-2xl leading-relaxed">
            Academic companion and interactive syllabus covering Discrete Mathematics Module 1 (Principle of Inclusion–Exclusion, Set Partitions, and Dirichlet Bounds).
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="setB" className="font-mono text-[10px]">
            5 Modules &bull; 16 Curriculum Topics
          </Badge>
        </div>
      </div>

      {/* Module Selector Carousel / Tabs */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
          Curriculum Modules
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LEARNING_MODULES.map((module) => {
            const isSelected = module.id === activeModuleId;
            return (
              <button
                key={module.id}
                onClick={() => handleSelectModule(module.id)}
                className={`p-3.5 rounded-card border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-brand shadow-sm ring-1 ring-brand/20'
                    : 'bg-surface-secondary/40 border-surface-border hover:bg-white text-content-secondary'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-content-muted">
                      MOD {module.number}
                    </span>
                    {module.category === 'core' ? (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-brand font-semibold">
                        Core
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-700 font-semibold">
                        Supp.
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-xs font-serif leading-snug ${
                      isSelected ? 'text-content-primary font-semibold' : 'text-content-primary'
                    }`}
                  >
                    {module.title}
                  </h4>
                </div>
                <div className="text-[10px] font-mono text-content-muted mt-2 pt-2 border-t border-surface-border/50">
                  {module.topics.length} Topics &bull; {module.quiz.length} Questions
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Banner Card */}
      <Card className="p-6 bg-white border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-semibold">
                Module {activeModule.number}
              </span>
              <span className="text-content-muted">&bull;</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">
                {activeModule.category === 'core' ? 'Core Discrete Mathematics' : 'Supplementary Combinatorics'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-content-primary">
              {activeModule.title}
            </h2>
            <p className="text-xs text-content-secondary mt-1 font-serif italic max-w-3xl">
              {activeModule.description}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface-secondary/70 p-1 rounded-btn border border-surface-border self-start sm:self-auto">
            <button
              onClick={() => setActiveView('theory')}
              className={`px-3 py-1.5 rounded-btn text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeView === 'theory'
                  ? 'bg-white text-content-primary shadow-xs font-semibold'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-brand" />
              <span>Theory ({activeModule.topics.length})</span>
            </button>

            <button
              onClick={() => setActiveView('interactive')}
              className={`px-3 py-1.5 rounded-btn text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeView === 'interactive'
                  ? 'bg-white text-content-primary shadow-xs font-semibold'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-brand" />
              <span>Lab Tool</span>
            </button>

            <button
              onClick={() => setActiveView('quiz')}
              className={`px-3 py-1.5 rounded-btn text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeView === 'quiz'
                  ? 'bg-white text-content-primary shadow-xs font-semibold'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-brand" />
              <span>Quiz ({activeModule.quiz.length})</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: THEORY SYLLABUS & DEEP DIVE */}
        {activeView === 'theory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            {/* Left Column: Module Topics */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-content-muted px-1 block">
                Topics in Module {activeModule.number}
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
                            <span className="font-mono text-[10px] text-content-muted">
                              {String(tIdx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-brand font-medium">
                              {topic.subtitle}
                            </span>
                          </div>
                          <h4
                            className={`text-xs mt-0.5 ${
                              isSelected ? 'text-content-primary font-semibold' : 'text-content-secondary'
                            }`}
                          >
                            {topic.title}
                          </h4>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand shrink-0 ml-2" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Topic Detail Card */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header */}
              <div className="border-b border-surface-border/70 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block font-semibold">
                  {activeTopic.subtitle}
                </span>
                <h3 className="text-xl font-serif font-normal text-content-primary mt-0.5">
                  {activeTopic.title}
                </h3>
              </div>

              {/* Rigorous Definition */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand" /> Rigorous Definition
                </span>
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-serif bg-surface-secondary/30 p-4 rounded-card border border-surface-border">
                  {activeTopic.definition}
                </p>
              </div>

              {/* KaTeX Notation */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand" /> Formal Mathematical Notation
                </span>
                <div className="p-4 rounded-card bg-surface-secondary/70 border border-surface-border font-mono text-sm sm:text-base text-content-primary flex items-center justify-center min-h-[52px]">
                  <KatexMath math={activeTopic.latexFormula} block />
                </div>
              </div>

              {/* Step-by-Step Expansion */}
              {activeTopic.stepByStep && activeTopic.stepByStep.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                    Analytical Derivation Steps
                  </span>
                  <div className="p-4 rounded-card bg-surface-secondary/40 border border-surface-border space-y-2 text-xs font-mono">
                    {activeTopic.stepByStep.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5">
                        <span className="text-brand font-bold shrink-0">{sIdx + 1}.</span>
                        <span className="text-content-secondary">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benchmark Application Example */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand" /> Worked Benchmark Example
                </span>
                <div className="p-4 rounded-card bg-surface-secondary/30 border border-surface-border text-xs text-content-secondary font-mono leading-relaxed">
                  {activeTopic.workedExample}
                </div>
              </div>

              {/* Connection to THE EMI TRAP */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block flex items-center gap-1.5 font-semibold">
                  <Lightbulb className="w-3.5 h-3.5 text-brand" /> Relevance to THE EMI TRAP Platform
                </span>
                <div className="p-4 rounded-card bg-brand-soft/30 border border-brand/20 text-xs sm:text-sm text-brand-dark font-serif leading-relaxed">
                  {activeTopic.emiApplication}
                </div>
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
            {activeModule.id === 'module-5-supplementary' && (
              <div className="space-y-4">
                <div className="p-4 rounded-card bg-brand-soft/30 border border-brand/20 text-xs text-brand-dark font-serif leading-relaxed">
                  <strong>Supplementary Combinatorics Explorer:</strong> Module 5 provides supplementary material on the Sum &amp; Product Rules, Permutations &amp; Combinations, Derangements, and Rook Polynomials. Use the Overlap Simulator below to experiment with general combinatorial bounds.
                </div>
                <OverlapDemoWidget />
              </div>
            )}
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
          <span>Previous Module</span>
        </Button>

        <span className="text-xs font-mono text-content-muted">
          Module {currentModuleIndex + 1} of {LEARNING_MODULES.length}
        </span>

        <Button
          size="sm"
          variant="primary"
          onClick={handleNextModule}
          disabled={currentModuleIndex === LEARNING_MODULES.length - 1}
          className="text-xs font-mono h-8 gap-1.5"
        >
          <span>Next Module</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

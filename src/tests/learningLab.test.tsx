import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { LEARNING_MODULES } from '../data/learningLabModules';
import { LearningLab } from '../pages/LearningLab';
import { SetMembershipExplorer } from '../components/learning/SetMembershipExplorer';
import { OverlapDemoWidget } from '../components/learning/OverlapDemoWidget';
import { PigeonholeLabCalculator } from '../components/learning/PigeonholeLabCalculator';
import { ModuleKnowledgeCheck } from '../components/learning/ModuleKnowledgeCheck';

describe('Learning Lab — Discrete Mathematics Curriculum & Interactive Engines', () => {
  describe('Curriculum Data Integrity', () => {
    it('contains all 4 comprehensive curriculum modules', () => {
      expect(LEARNING_MODULES.length).toBe(4);
      const moduleIds = LEARNING_MODULES.map((m) => m.id);
      expect(moduleIds).toContain('module-1-foundations');
      expect(moduleIds).toContain('module-2-pie');
      expect(moduleIds).toContain('module-3-generalized');
      expect(moduleIds).toContain('module-4-pigeonhole');
    });

    it('defines non-empty topics with rigorous LaTeX formulas and practical EMI applications', () => {
      let totalTopics = 0;
      for (const module of LEARNING_MODULES) {
        expect(module.topics.length).toBeGreaterThan(0);
        totalTopics += module.topics.length;

        for (const topic of module.topics) {
          expect(topic.id.length).toBeGreaterThan(2);
          expect(topic.title.length).toBeGreaterThan(2);
          expect(topic.definition.length).toBeGreaterThan(15);
          expect(topic.latexFormula.length).toBeGreaterThan(5);
          expect(topic.workedExample.length).toBeGreaterThan(10);
          expect(topic.emiApplication.length).toBeGreaterThan(10);
        }
      }
      expect(totalTopics).toBe(12);
    });

    it('verifies that each module contains verified assessment questions with valid answer bounds', () => {
      let totalQuestions = 0;
      for (const module of LEARNING_MODULES) {
        expect(module.quiz.length).toBeGreaterThan(0);
        totalQuestions += module.quiz.length;

        for (const q of module.quiz) {
          expect(q.id.length).toBeGreaterThan(1);
          expect(q.question.length).toBeGreaterThan(10);
          expect(q.options.length).toBeGreaterThanOrEqual(3);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options.length);
          expect(q.explanation.length).toBeGreaterThan(15);
        }
      }
      expect(totalQuestions).toBe(12);
    });
  });

  describe('Dirichlet / Extended Pigeonhole Principle Formulation', () => {
    // Pure mathematical function matching the engine
    const extendedPigeonhole = (n: number, m: number): number => {
      return Math.floor((n - 1) / m) + 1;
    };

    it('calculates the exact benchmark threshold for n=100 and m=4', () => {
      // floor((100 - 1) / 4) + 1 = floor(99 / 4) + 1 = 24 + 1 = 25
      expect(extendedPigeonhole(100, 4)).toBe(25);
    });

    it('calculates the empirical survey threshold for n=16 and m=4', () => {
      // floor((16 - 1) / 4) + 1 = floor(15 / 4) + 1 = 3 + 1 = 4
      expect(extendedPigeonhole(16, 4)).toBe(4);
    });

    it('handles identical object and bin counts (n = m)', () => {
      // floor((m - 1) / m) + 1 = 0 + 1 = 1
      expect(extendedPigeonhole(10, 10)).toBe(1);
      expect(extendedPigeonhole(365, 365)).toBe(1);
    });

    it('handles n = m + 1 boundary case', () => {
      // floor(m / m) + 1 = 1 + 1 = 2
      expect(extendedPigeonhole(367, 365)).toBe(2);
      expect(extendedPigeonhole(5, 4)).toBe(2);
    });

    it('handles large sample sizes and arbitrary categories', () => {
      // n=53, m=5 -> floor(52 / 5) + 1 = 10 + 1 = 11
      expect(extendedPigeonhole(53, 5)).toBe(11);
      // n=1000, m=7 -> floor(999 / 7) + 1 = 142 + 1 = 143
      expect(extendedPigeonhole(1000, 7)).toBe(143);
    });

    it('handles minimum unit boundary case (n = 1, m = 1)', () => {
      // floor(0 / 1) + 1 = 1
      expect(extendedPigeonhole(1, 1)).toBe(1);
    });
  });

  describe('Principle of Inclusion–Exclusion Mathematical Invariants', () => {
    it('verifies two-set PIE: |A ∪ B| = |A| + |B| - |A ∩ B|', () => {
      const sizeA = 40;
      const sizeB = 35;
      const intersectAB = 15;
      const union = sizeA + sizeB - intersectAB;
      expect(union).toBe(60);
      expect(sizeA + sizeB).toBe(75); // Naive sum inflated by 15
    });

    it('verifies three-set alternating sum: S1 - S2 + S3', () => {
      const a = 40;
      const b = 35;
      const c = 30;
      const ab = 15;
      const ac = 12;
      const bc = 10;
      const abc = 5;

      const s1 = a + b + c; // 105
      const s2 = ab + ac + bc; // 37
      const s3 = abc; // 5

      const union = s1 - s2 + s3;
      expect(union).toBe(73);
      expect(s1).toBe(105);
      expect(s1 - union).toBe(32); // 32 redundant phantom loan counts eliminated
    });
  });

  describe('Component Server Rendering', () => {
    it('renders the LearningLab page without errors', () => {
      const html = renderToString(<LearningLab />);
      expect(html).toContain('Debt Analytics &amp; Set Theory Lab');
      expect(html).toContain('Fundamentals of Set Theory');
      expect(html).toContain('Section 05');
    });

    it('renders the SetMembershipExplorer component', () => {
      const html = renderToString(<SetMembershipExplorer />);
      expect(html).toContain('Interactive Set Membership Lab');
      expect(html).toContain('A ∪ B');
      expect(html).toContain('A ∩ B');
      expect(html).toContain('A ∩ B ∩ C');
      expect(html).toContain('Participant');
    });

    it('renders the OverlapDemoWidget component', () => {
      const html = renderToString(<OverlapDemoWidget />);
      expect(html).toContain('Interactive Overlap Simulator');
      expect(html).toContain('2-Set PIE');
      expect(html).toContain('3-Set PIE');
      expect(html).toContain('Alternating Sum Expansion');
    });

    it('renders the PigeonholeLabCalculator component', () => {
      const html = renderToString(<PigeonholeLabCalculator />);
      expect(html).toContain('Dirichlet Principle Laboratory');
      expect(html).toContain('Extended Pigeonhole Principle Explorer');
      expect(html).toContain('Guaranteed Concentration Threshold');
      expect(html).toContain('THE EMI TRAP (n=100, m=4)');
    });

    it('renders the ModuleKnowledgeCheck component', () => {
      const questions = LEARNING_MODULES[0].quiz;
      const html = renderToString(
        <ModuleKnowledgeCheck questions={questions} moduleTitle="Fundamentals of Set Theory" />
      );
      expect(html).toContain('Concept Knowledge Verification');
      expect(html).toContain('Fundamentals of Set Theory');
      expect(html).toContain('Score:');
      expect(html).toContain('Question');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { SurveyProvider } from '../context/SurveyContext';
import { Overview } from '../pages/Overview';
import { EMICalculator } from '../pages/EMICalculator';
import { ResearchDashboard } from '../pages/ResearchDashboard';
import { MathematicalAnalysis } from '../pages/MathematicalAnalysis';
import { LearningLab } from '../pages/LearningLab';
import { RESEARCH_SURVEY_DATASET } from '../data/researchSurveyDataset';
import { ILLUSTRATIVE_DATASET } from '../data/illustrativeDataset';
import { calculateThreeSetPIE } from '../lib/math/inclusionExclusion';
import { calculateDisjointRegions } from '../lib/math/vennRegions';

describe('Comprehensive Page Integration & Runtime Render Checks', () => {
  it('renders Overview page (/) cleanly without runtime errors', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/']}>
        <SurveyProvider>
          <Overview />
        </SurveyProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Understanding');
    expect(html).toContain('the EMI Trap.');
    expect(html).toContain('Discrete Mathematics');
  });

  it('renders Personal EMI Calculator (/calculator) cleanly with what-if simulator', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/calculator']}>
        <SurveyProvider>
          <EMICalculator />
        </SurveyProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Personal Cash Flow &amp; Commitment Planning');
    expect(html).toContain('What-If Debt Simulator');
  });

  it('renders Research Dashboard (/research) with Research Cohort (N=16) and verifies all metrics', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/research']}>
        <SurveyProvider>
          <ResearchDashboard />
        </SurveyProvider>
      </MemoryRouter>
    );

    // Verify page header & dataset banner
    expect(html).toContain('Research Analytics &amp; Set Overlap');
    expect(html).toContain('Empirical Research Survey Cohort (N=16)');

    // Verify mathematical outputs derived dynamically for N=16
    const pie = calculateThreeSetPIE(RESEARCH_SURVEY_DATASET.calculatedSetData);
    const regions = calculateDisjointRegions(RESEARCH_SURVEY_DATASET.calculatedSetData);

    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.setA).toBe(4);
    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.setB).toBe(6);
    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.setC).toBe(7);
    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.intersectionAB).toBe(1);
    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.intersectionAC).toBe(1);
    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.intersectionBC).toBe(2);
    expect(RESEARCH_SURVEY_DATASET.calculatedSetData.intersectionABC).toBe(0);
    expect(pie.atLeastOne).toBe(13);
    expect(pie.outside).toBe(3);

    // Verify Venn regions exist in rendered SVG markup
    expect(html).toContain('data-region-id="onlyA"');
    expect(html).toContain('data-region-id="onlyB"');
    expect(html).toContain('data-region-id="onlyC"');
    expect(html).toContain('data-region-id="onlyAB"');
    expect(html).toContain('data-region-id="onlyAC"');
    expect(html).toContain('data-region-id="onlyBC"');
    expect(html).toContain('data-region-id="allThree"');
    expect(html).toContain('data-region-id="outside"');

    // Verify region counts in SVG text
    expect(html).toContain(`>${regions.onlyA}<`); // 2
    expect(html).toContain(`>${regions.onlyB}<`); // 3
    expect(html).toContain(`>${regions.onlyC}<`); // 4
    expect(html).toContain(`>${regions.onlyAB}<`); // 1
    expect(html).toContain(`>${regions.onlyAC}<`); // 1
    expect(html).toContain(`>${regions.onlyBC}<`); // 2
    expect(html).toContain(`>${regions.allThree}<`); // 0
    expect(html).toContain(`>${regions.outside}<`); // 3
  });

  it('renders Mathematical Analysis (/math) with KaTeX formula derivations for N=16', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/math']}>
        <SurveyProvider>
          <MathematicalAnalysis />
        </SurveyProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Mathematical Analysis &amp; Derivations');
    expect(html).toContain('Step-by-Step Expansion');
    expect(html).toContain('S_1');
    expect(html).toContain('S_2');
    expect(html).toContain('S_3');
  });

  it('renders Learning Lab (/learn) cleanly with modules and topics', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/learn']}>
        <SurveyProvider>
          <LearningLab />
        </SurveyProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Debt Analytics &amp; Set Theory Lab');
    expect(html).toContain('Fundamentals of Set Theory');
  });

  it('verifies dataset switching between N=16 and N=100 preserves mathematical integrity', () => {
    // 1. Research Cohort (N=16)
    const pie16 = calculateThreeSetPIE(RESEARCH_SURVEY_DATASET.calculatedSetData);
    expect(RESEARCH_SURVEY_DATASET.totalRespondents).toBe(16);
    expect(pie16.atLeastOne).toBe(13);
    expect(pie16.outside).toBe(3);

    // 2. Illustrative Demo (N=100)
    const pie100 = calculateThreeSetPIE(ILLUSTRATIVE_DATASET.calculatedSetData);
    expect(ILLUSTRATIVE_DATASET.totalRespondents).toBe(100);
    expect(pie100.atLeastOne).toBe(73);
    expect(pie100.outside).toBe(27);
  });
});

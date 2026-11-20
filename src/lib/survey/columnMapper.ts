import {
  ColumnDefinition,
  ColumnMapping,
} from '../../types/survey';

/**
 * Canonical Survey Column Definitions matching DESIGN.md Section 10.3
 */
export const CANONICAL_COLUMNS: ColumnDefinition[] = [
  {
    key: 'id',
    label: 'Respondent ID',
    description: 'Unique identifier or anonymous response code.',
    required: false,
    category: 'identity',
    sampleValues: ['RESP-001', 'SUB-102', '1', '2'],
  },
  {
    key: 'timestamp',
    label: 'Submission Timestamp',
    description: 'Date and time of survey submission.',
    required: false,
    category: 'identity',
    sampleValues: ['2026/03/10 10:14:00 AM', '12/03/2026 14:22:15'],
  },
  {
    key: 'hasActiveEmi',
    label: 'Active EMI Status',
    description: 'Q1: Do you currently pay any active EMI? (Yes / No)',
    required: false,
    category: 'membership',
    sampleValues: ['Yes', 'No'],
  },
  {
    key: 'numActiveEmis',
    label: 'Number of Active EMIs',
    description: 'Q2: How many active EMI agreements do you pay?',
    required: false,
    category: 'membership',
    sampleValues: ['1', '2', '3', '4+'],
  },
  {
    key: 'categories',
    label: 'Active EMI Categories (Multi-select)',
    description: 'Q3: Which types of EMIs do you pay? (A: Personal, B: Vehicle, C: Consumer Durable / BNPL)',
    required: true,
    category: 'membership',
    sampleValues: [
      'Personal Loan',
      'Personal Loan, Vehicle Loan',
      'Personal Loan, Vehicle Loan, Consumer Durable / BNPL',
      'None',
    ],
  },
  {
    key: 'incomeRange',
    label: 'Monthly Take-Home Income',
    description: 'Q4: What is your approximate monthly take-home income?',
    required: false,
    category: 'demographics',
    sampleValues: ['< ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', '> ₹1,00,000'],
  },
  {
    key: 'emiRange',
    label: 'Total Monthly EMI Commitment',
    description: 'Q5: What is your approximate total monthly EMI commitment?',
    required: false,
    category: 'demographics',
    sampleValues: ['₹0', '< ₹5,000', '₹5,000 - ₹15,000', '₹15,000 - ₹30,000', '> ₹30,000'],
  },
  {
    key: 'calculatesCombinedEmi',
    label: 'Calculates Combined EMI',
    description: 'Q6: Do you calculate combined monthly EMI before taking another loan?',
    required: false,
    category: 'behavior',
    sampleValues: ['Always', 'Sometimes', 'Never'],
  },
  {
    key: 'repaymentDifficulty',
    label: 'Repayment Difficulty',
    description: 'Q7: Have you experienced difficulty paying multiple EMIs?',
    required: false,
    category: 'behavior',
    sampleValues: ['None', 'Occasional', 'Frequent', 'Severe'],
  },
  {
    key: 'wouldTakeAnotherEmi',
    label: 'Willingness to Add Debt',
    description: 'Q8: Would you take another EMI if you already had two active loans?',
    required: false,
    category: 'behavior',
    sampleValues: ['Yes', 'Maybe', 'No'],
  },
  {
    key: 'hasSavingsAfterEmi',
    label: 'Savings Remaining After EMI',
    description: 'Q9: Do you have savings remaining after paying your EMIs?',
    required: false,
    category: 'behavior',
    sampleValues: ['Yes', 'Barely', 'No'],
  },
];

/**
 * Heuristics to automatically suggest column mappings from Google Forms CSV headers.
 */
export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  headers.forEach((header) => {
    const norm = clean(header);

    // Timestamp
    if (norm.includes('timestamp') || norm === 'date' || norm.includes('submissiondate')) {
      if (!mapping.timestamp) mapping.timestamp = header;
    }

    // Respondent ID
    else if (
      norm.includes('respondentid') ||
      norm.includes('responseid') ||
      norm === 'id' ||
      norm.includes('participant')
    ) {
      if (!mapping.id) mapping.id = header;
    }

    // Number of active EMIs (Q2: How many active EMI agreements do you pay?)
    else if (
      norm.includes('howmany') ||
      norm.includes('numberofemi') ||
      norm.includes('countofemi')
    ) {
      if (!mapping.numActiveEmis) mapping.numActiveEmis = header;
    }

    // Types of EMIs (Q3: Which types of EMIs do you currently pay?)
    else if (
      norm.includes('whichtypes') ||
      norm.includes('typesofemi') ||
      norm.includes('emitypes') ||
      norm.includes('categories') ||
      norm.includes('typeofloan') ||
      norm.includes('whichloan')
    ) {
      if (!mapping.categories) mapping.categories = header;
    }

    // Active EMI status (Q1: Do you currently pay any active EMI?)
    else if (
      norm.includes('currentlypayanyactive') ||
      norm.includes('doyoucurrentlypay') ||
      norm.includes('anyactiveemi') ||
      norm.includes('haveemi') ||
      norm.includes('hasactiveemi') ||
      norm.includes('currentlypaying') ||
      norm.includes('payinganyemi')
    ) {
      if (!mapping.hasActiveEmi) mapping.hasActiveEmi = header;
    }

    // Income range (Q4)
    else if (
      norm.includes('takehomeincome') ||
      norm.includes('monthlyincome') ||
      norm.includes('approximateincome') ||
      norm.includes('incomerange') ||
      norm.includes('income')
    ) {
      if (!mapping.incomeRange) mapping.incomeRange = header;
    }

    // Total monthly EMI commitment (Q5)
    else if (
      norm.includes('totalmonthlyemi') ||
      norm.includes('emicommitment') ||
      norm.includes('totalemi') ||
      norm.includes('emiamount') ||
      norm.includes('emipaid')
    ) {
      if (!mapping.emiRange) mapping.emiRange = header;
    }

    // Calculates combined EMI (Q6)
    else if (
      norm.includes('calculateyourcombined') ||
      norm.includes('combinedmonthlyemi') ||
      norm.includes('calculatebefore')
    ) {
      if (!mapping.calculatesCombinedEmi) mapping.calculatesCombinedEmi = header;
    }

    // Repayment difficulty (Q7)
    else if (
      norm.includes('difficulty') ||
      norm.includes('struggle') ||
      norm.includes('hardshiptopay') ||
      norm.includes('experienceddifficulty')
    ) {
      if (!mapping.repaymentDifficulty) mapping.repaymentDifficulty = header;
    }

    // Willingness to take another (Q8)
    else if (
      norm.includes('wouldyoutakeanother') ||
      norm.includes('takeanotheremi') ||
      norm.includes('anotherloan')
    ) {
      if (!mapping.wouldTakeAnotherEmi) mapping.wouldTakeAnotherEmi = header;
    }

    // Savings remaining (Q9)
    else if (
      norm.includes('savingsremaining') ||
      norm.includes('savingsafter') ||
      norm.includes('havesavings') ||
      norm.includes('savemonthly') ||
      norm.includes('expensesandemis')
    ) {
      if (!mapping.hasSavingsAfterEmi) mapping.hasSavingsAfterEmi = header;
    }
  });

  return mapping;
}

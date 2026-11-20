// Test suggestColumnMapping logic on the user's headers
const headers = [
  'Timestamp',
  'Enter your age in years. ',
  'What is your occupation?',
  '  What is your approximate monthly personal income?  ',
  '  Are you currently paying any EMI?  ',
  '  Which EMI categories are you currently paying?  ',
  '   What is your total monthly EMI payment?  ',
  '  Do you face difficulty managing your EMI payments?  ',
  '  How much do you save monthly after paying your expenses and EMIs?  '
];

function suggestColumnMapping(headers) {
  const mapping = {};
  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

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
      norm.includes('participant') ||
      norm.includes('occupation') ||
      norm.includes('age')
    ) {
      if (!mapping.id) mapping.id = header;
    }
    // Number of active EMIs
    else if (
      norm.includes('howmany') ||
      norm.includes('numberofemi') ||
      norm.includes('countofemi')
    ) {
      if (!mapping.numActiveEmis) mapping.numActiveEmis = header;
    }
    // Categories
    else if (
      norm.includes('whichtypes') ||
      norm.includes('typesofemi') ||
      norm.includes('emitypes') ||
      norm.includes('categories') ||
      norm.includes('typeofloan') ||
      norm.includes('whichloan') ||
      norm.includes('emicategories')
    ) {
      if (!mapping.categories) mapping.categories = header;
    }
    // Active EMI status
    else if (
      norm.includes('currentlypayanyactive') ||
      norm.includes('doyoucurrentlypay') ||
      norm.includes('anyactiveemi') ||
      norm.includes('haveemi') ||
      norm.includes('hasactiveemi') ||
      norm.includes('payinganyemi')
    ) {
      if (!mapping.hasActiveEmi) mapping.hasActiveEmi = header;
    }
    // Income range
    else if (
      norm.includes('takehomeincome') ||
      norm.includes('monthlyincome') ||
      norm.includes('approximateincome') ||
      norm.includes('incomerange') ||
      norm.includes('income')
    ) {
      if (!mapping.incomeRange) mapping.incomeRange = header;
    }
    // Total monthly EMI commitment
    else if (
      norm.includes('totalmonthlyemi') ||
      norm.includes('emicommitment') ||
      norm.includes('totalemi') ||
      norm.includes('emiamount') ||
      norm.includes('emipaid') ||
      norm.includes('emipayment')
    ) {
      if (!mapping.emiRange) mapping.emiRange = header;
    }
    // Difficulty
    else if (
      norm.includes('difficulty') ||
      norm.includes('struggle') ||
      norm.includes('hardshiptopay') ||
      norm.includes('experienceddifficulty')
    ) {
      if (!mapping.repaymentDifficulty) mapping.repaymentDifficulty = header;
    }
    // Savings remaining
    else if (
      norm.includes('savingsremaining') ||
      norm.includes('savingsafter') ||
      norm.includes('havesavings') ||
      norm.includes('savemonthly')
    ) {
      if (!mapping.hasSavingsAfterEmi) mapping.hasSavingsAfterEmi = header;
    }
  });

  return mapping;
}

console.log(suggestColumnMapping(headers));


const fs = require('fs');

// We copy the exact 16 rows from user prompt:
const csvData = `Timestamp,Enter your age in years. ,What is your occupation?,  What is your approximate monthly personal income?  ,  Are you currently paying any EMI?  ,  Which EMI categories are you currently paying?  ,   What is your total monthly EMI payment?  ,  Do you face difficulty managing your EMI payments?  ,  How much do you save monthly after paying your expenses and EMIs?  
11/13/2026 10:23:52,21,Student ,50000,yes,Other EMI,5000,Rarely,20000
11/13/2026 22:12:28,21,College Student / Intern,12000,yes,BNPL (Buy Now Pay Later),2000,Often,500
11/13/2026 22:12:35,27,Software Engineer,110000,yes,"Vehicle Loan EMI, Consumer Durable EMI",24000,Rarely,40000
11/13/2026 22:12:40,38,High School Teacher,55000,yes,Personal Loan EMI,14000,Sometimes,12000
11/13/2026 22:12:46,29,Sales Executive,38000,yes,"Vehicle Loan EMI, BNPL (Buy Now Pay Later)",11000,Often,3000
11/13/2026 22:12:51,25,Graphic Designer,32000,yes,Consumer Durable EMI,5500,Sometimes,5000
11/13/2026 22:12:56,45,Small Business Owner,135000,yes,"Personal Loan EMI, Vehicle Loan EMI, Other EMI",48000,Sometimes,30000
11/13/2026 22:13:00,23,Delivery Partner,22000,yes,Vehicle Loan EMI,6000,Often,2000
11/13/2026 22:13:05,42,Senior Accountant,85000,no,None,0,Never,35000
11/13/2026 22:13:09,31,Marketing Specialist,72000,yes,"Personal Loan EMI, Consumer Durable EMI",21000,Rarely,18000
11/13/2026 22:13:13,24,Call Center Agent,26000,yes,"Consumer Durable EMI, BNPL (Buy Now Pay Later)",9500,Always,0
11/13/2026 22:13:18,36,Civil Engineer,68000,yes,Vehicle Loan EMI,15000,Rarely,16000
11/13/2026 22:13:22,30,Staff Nurse,40000,yes,Personal Loan EMI,9000,Sometimes,7000
11/13/2026 22:13:32,34,Management Consultant,160000,yes,"Vehicle Loan EMI, Other EMI",36000,Never,65000
11/13/2026 22:13:37,26,Retail Store Assistant,24000,yes,BNPL (Buy Now Pay Later),4500,Often,1500
11/13/2026 22:13:41,28,Data Analyst,65000,no,None,0,Never,28000`;

// Let's implement the RFC 4180 parser & category extractor exactly as in the project:
function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  const headers = rows[0];
  const dataRows = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] || '';
    });
    return obj;
  });

  return { headers, rows: dataRows };
}

function extractCategoriesFromText(rawText) {
  if (!rawText || rawText.trim().length === 0) {
    return { categories: [], isExplicitlyNone: true };
  }
  const lower = rawText.toLowerCase().trim();
  if (
    lower === 'none' ||
    lower === 'no' ||
    lower === 'nil' ||
    lower === 'n/a' ||
    lower === 'debt free' ||
    lower === 'zero' ||
    lower.includes('no active')
  ) {
    return { categories: [], isExplicitlyNone: true };
  }

  const categories = [];
  if (
    lower.includes('personal') ||
    lower.includes('unsecured') ||
    lower.includes('instant loan') ||
    lower.includes('salary advance')
  ) {
    categories.push('personal');
  }

  if (
    lower.includes('vehicle') ||
    lower.includes('two-wheeler') ||
    lower.includes('two wheeler') ||
    lower.includes('bike') ||
    lower.includes('car loan') ||
    lower.includes('auto loan') ||
    lower.includes('scooter')
  ) {
    categories.push('vehicle');
  }

  if (
    lower.includes('consumer durable') ||
    lower.includes('consumer') ||
    lower.includes('bnpl') ||
    lower.includes('smartphone') ||
    lower.includes('mobile') ||
    lower.includes('laptop') ||
    lower.includes('electronics') ||
    lower.includes('no-cost') ||
    lower.includes('no cost') ||
    lower.includes('pay later')
  ) {
    categories.push('consumer_durable');
  }

  if (
    lower.includes('home') ||
    lower.includes('education') ||
    lower.includes('gold') ||
    lower.includes('mortgage') ||
    lower.includes('business') ||
    lower.includes('other')
  ) {
    categories.push('other');
  }

  return {
    categories: Array.from(new Set(categories)),
    isExplicitlyNone: categories.length === 0
  };
}

const { headers, rows } = parseCsv(csvData);
console.log('Total parsed rows:', rows.length);
console.log('Headers:', headers);

const mappedRows = rows.map((r, i) => {
  const catHeader = headers.find(h => h.includes('Which EMI categories'));
  const rawCat = r[catHeader];
  const { categories, isExplicitlyNone } = extractCategoriesFromText(rawCat);
  const activeHeader = headers.find(h => h.includes('Are you currently paying'));
  const hasActive = r[activeHeader].toLowerCase().startsWith('y');
  const emiHeader = headers.find(h => h.includes('What is your total monthly EMI payment'));
  const occupationHeader = headers.find(h => h.includes('occupation'));
  const ageHeader = headers.find(h => h.includes('age in years'));
  const incomeHeader = headers.find(h => h.includes('monthly personal income'));

  return {
    index: i + 1,
    age: r[ageHeader],
    occupation: r[occupationHeader],
    income: r[incomeHeader],
    rawCat,
    categories,
    hasActive,
    emi: r[emiHeader]
  };
});

console.log('\n--- MAPPED ROWS ANALYSIS ---');
mappedRows.forEach(r => {
  console.log(`[Row ${r.index}] Age: ${r.age}, Occ: ${r.occupation}, EMI Status: ${r.hasActive}, Raw: "${r.rawCat}" -> Categories: [${r.categories.join(', ')}]`);
});

// Let us calculate the set cardinalities:
let setA = 0, setB = 0, setC = 0, setOther = 0;
let AB = 0, AC = 0, BC = 0, ABC = 0;
let onlyA = 0, onlyB = 0, onlyC = 0, onlyAB = 0, onlyAC = 0, onlyBC = 0, allThree = 0, outside = 0;

mappedRows.forEach(r => {
  const a = r.categories.includes('personal');
  const b = r.categories.includes('vehicle');
  const c = r.categories.includes('consumer_durable');
  const other = r.categories.includes('other');

  if (a) setA++;
  if (b) setB++;
  if (c) setC++;
  if (other) setOther++;

  if (a && b) AB++;
  if (a && c) AC++;
  if (b && c) BC++;
  if (a && b && c) ABC++;

  if (a && !b && !c) onlyA++;
  else if (!a && b && !c) onlyB++;
  else if (!a && !b && c) onlyC++;
  else if (a && b && !c) onlyAB++;
  else if (a && !b && c) onlyAC++;
  else if (!a && b && c) onlyBC++;
  else if (a && b && c) allThree++;
  else outside++;
});

console.log('\n--- SET CARDINALITIES ---');
console.log(`N = ${mappedRows.length}`);
console.log(`Set A (Personal): ${setA}`);
console.log(`Set B (Vehicle): ${setB}`);
console.log(`Set C (Consumer/BNPL): ${setC}`);
console.log(`Other: ${setOther}`);
console.log(`AB: ${AB}, AC: ${AC}, BC: ${BC}, ABC: ${ABC}`);
console.log(`Only A: ${onlyA}`);
console.log(`Only B: ${onlyB}`);
console.log(`Only C: ${onlyC}`);
console.log(`Only AB: ${onlyAB}`);
console.log(`Only AC: ${onlyAC}`);
console.log(`Only BC: ${onlyBC}`);
console.log(`All Three: ${allThree}`);
console.log(`Outside A/B/C: ${outside}`);

const unionABC = setA + setB + setC - (AB + AC + BC) + ABC;
console.log(`\nPIE Formula: |A ∪ B ∪ C| = ${setA} + ${setB} + ${setC} - (${AB} + ${AC} + ${BC}) + ${ABC} = ${unionABC}`);
console.log(`Disjoint Sum of regions inside A ∪ B ∪ C = ${onlyA + onlyB + onlyC + onlyAB + onlyAC + onlyBC + allThree}`);
console.log(`Total respondents = Union (${unionABC}) + Outside (${outside}) = ${unionABC + outside}`);


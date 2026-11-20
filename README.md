# THE EMI TRAP
### EMI Overlap & Financial Behaviour Analysis Platform
**Analytical Platform for Overlapping Financial Obligations & Debt Stacking**

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest Passing](https://img.shields.io/badge/Tests-108%20Passed-10b981.svg)](https://vitest.dev/)
[![Privacy Compliant](https://img.shields.io/badge/Privacy-100%25%20In--Memory-176b57.svg)](#privacy--application-security)

---

## 1. Project Overview & Research Problem

### Research Definition
- **Project Focus:** THE EMI TRAP — Overlapping Financial Commitments
- **Problem Statement:** 
  > *"People may take multiple loans and EMIs without properly calculating their combined monthly financial commitments. This project analyses overlapping financial obligations."*

### Key Research Questions (Survey Instrument)
1. **Do you currently pay any EMI?** — Identifies active borrower status vs debt-free participants.
2. **How many active EMIs do you have?** — Measures commitment count (0, 1, 2, 3, 4+).
3. **What types of purchases do you use EMI for?** — Categorizes loans: Personal Loan ($A$), Vehicle Loan ($B$), Consumer Durable / BNPL ($C$), Other.
4. **Do you calculate your total monthly EMI before taking another loan?** — Evaluates awareness of aggregate cash flow commitments.
5. **Have you ever struggled to pay multiple EMIs?** — Assesses repayment difficulty and liquidity strain.
6. **Would you take another EMI if you already had two active loans?** — Measures behavioral willingness to add compounding debt.

### Expected Result
Calculate overlapping financial commitments and identify how multiple EMIs affect available monthly income using Discrete Mathematics (Principle of Inclusion–Exclusion and Set Partitions).

---

## 2. Overview & Objective

**THE EMI TRAP** is an analytical web application that investigates how multiple installment loans overlap and affect personal finances. By combining consumer credit survey data with discrete mathematics, the platform shows what happens when borrowers carry personal, vehicle, and retail consumer loans simultaneously.

Counting borrowers in each category separately and simply adding them together ($|A| + |B| + |C|$) counts multi-loan borrowers more than once. The **Principle of Inclusion–Exclusion (PIE)** corrects this by accounting for overlaps across loan categories:
1. Decomposing any surveyed cohort into **8 pairwise disjoint, mutually exclusive partitions**.
2. Calculating exact counts for single-loan borrowers, multi-loan cross-debtors, and debt-free respondents.
3. Applying **Dirichlet’s Extended Pigeonhole Principle** ($\lfloor (n - 1) / m \rfloor + 1$) to establish guaranteed population concentration thresholds across repayment categories.
4. Providing an interactive financial planning tool for borrowers to simulate the cash flow impact of taking on an additional loan.

---

## 3. Visual Design System

The application adheres to a bespoke **Luxury Wealth Management + Minimal Editorial Finance** visual language:
- **Typography:**
  - Headlines & Editorial Prose: *Newsreader* (refined serif).
  - UI Labels & Controls: *Inter* (clean, legible sans-serif).
  - Formulas & Numerical Values: *JetBrains Mono* (monospaced tabular figures).
- **Colour Palette:**
  - Primary Accent: Evergreen `#176B57`
  - Background: Warm off-white `#FBFBFA`
  - Elevated Surfaces: Pure White `#FFFFFF`
  - Card & Divider Borders: Soft neutral `#EAEAE7`
  - Category A (Personal Loans): Classic Blue `#3973B9`
  - Category B (Vehicle Loans): Warm Amber `#C18428`
  - Category C (Consumer Durable / BNPL): Muted Violet `#8066B2`

---

## 4. Platform Architecture & Routes

The application features five primary routes with route-level code splitting via `React.lazy()`:

```
├── /                    # Section 01: Overview & Research Abstract
├── /calculator          # Section 02: Personal EMI Calculator & What-If Simulator
├── /research            # Section 03: Research Dashboard & Interactive 3-Set Venn Explorer
├── /math                # Section 04: Mathematical Analysis & Formal KaTeX Derivations
└── /learning-lab        # Section 05: Discrete Mathematics Interactive Learning Lab
```

### Route Overview

1. **Overview (`/`):**
   - High-level research summary and academic motivation.
   - Core mathematical pillars: Principle of Inclusion–Exclusion, Overlap Traps, and Dirichlet Bounds.
   - Live platform metric counters.

2. **Personal EMI Calculator (`/calculator`):**
   - Monthly income input with real-time format validation.
   - Dynamic EMI commitment manager (supports multiple loans with categories, monthly amounts, and tenures).
   - Real-time computation of Total EMI, Remaining Income, and EMI-to-Income percentage ($\text{DTI} = \frac{\sum \text{EMI}}{\text{Income}} \times 100\%$).
   - Non-prescriptive illustrative risk tiers (Healthy $\le 30\%$, Moderate $30\% - 50\%$, Strained $> 50\%$).
   - **What-If Scenario Simulator:** Allows testing prospective new loans without mutating actual commitments.

3. **Research Dashboard (`/research`):**
   - **Interactive 3-Set Venn Diagram:** Custom SVG rendering with 8 native circular arc paths (`VENN_PATHS`) and hit-tested centroids. Features full hover highlighting, click-lock selection persistence, and synchronization with the Partition Inspector.
   - **Survey Ingestion Pipeline:** Allows uploading real Google Forms CSV responses.
   - **Global Dataset Controller:** Seamlessly toggle between:
     - *Empirical Research Survey Cohort* ($N=16$): Genuine field responses from `THE_EMI_TRAP_RESEARCH_DATA_N16.csv` with exact set breakdown ($|A|=4, |B|=6, |C|=7$).
     - *Illustrative Benchmark Cohort* ($N=100$): Theoretical benchmark model ($|A|=40, |B|=35, |C|=30, |AB|=15, |AC|=12, |BC|=10, |ABC|=5$).
     - *Custom Uploaded Dataset:* Processed 100% in-browser.
   - **Six Visual Analytics Panels (Recharts):**
     1. Overlap vs Disjoint Borrowers (Donut).
     2. Cross-Category Loan Combinations (Bar Chart).
     3. EMI-to-Income Risk Band Distribution (Bar Chart).
     4. Monthly Income Tier Breakdown (Bar Chart).
     5. Repayment Tenure Distribution (Bar Chart).
     6. Cumulative EMI Obligation Density (Line Chart).

4. **Mathematical Analysis (`/math`):**
   - Synchronized with the active dataset.
   - KaTeX rendering of all 8 formal mathematical questions:
     1. Single set cardinalities ($|A|, |B|, |C|$).
     2. Pairwise intersections ($|A \cap B|, |A \cap C|, |B \cap C|$).
     3. Triple intersection ($|A \cap B \cap C|$).
     4. Complete union derivation via PIE ($|A \cup B \cup C| = S_1 - S_2 + S_3$).
     5. Outside complement ($U \setminus (A \cup B \cup C)$).
     6. Exactly $m$ conditions ($m=1, 2, 3$).
     7. At least $m$ conditions ($m=1, 2, 3$).
     8. Extended Pigeonhole Principle with dynamic interactive $(n, m)$ controller.

5. **Learning Lab (`/learning-lab`):**
   - Complete 4-module discrete mathematics academic syllabus:
     - **Module 01: Fundamentals of Set Theory** (Universal sets, subsets, operations, disjoint partitions).
     - **Module 02: Principle of Inclusion–Exclusion** (Alternating sums, double-counting elimination).
     - **Module 03: Generalized Inclusion–Exclusion** (Partitions for exactly $m$ and at least $m$ conditions).
     - **Module 04: Extended Pigeonhole Principle** (Dirichlet guarantee, $\lfloor (n-1)/m \rfloor + 1$ proof).
   - **Interactive Learning Components:**
     - `SetMembershipExplorer.tsx`: Live participant toggle table evaluating $A \cup B, A \cap B, A \cap B \cap C$, and complement.
     - `OverlapDemoWidget.tsx`: 2-Set and 3-Set interactive PIE simulator showing alternating steps and inflation metrics.
     - `PigeonholeLabCalculator.tsx`: Arbitrary $(n, m)$ Dirichlet explorer with step-by-step arithmetic and worst-case adversary distribution visualizer.
     - `ModuleKnowledgeCheck.tsx`: Interactive multi-choice assessment with instant visual feedback and analysis of distractors.

---

## 4. Mathematical Foundations

### 1. Principle of Inclusion–Exclusion (3-Set Formulation)

$$\left| A \cup B \cup C \right| = S_1 - S_2 + S_3$$

Where:
- $S_1 = |A| + |B| + |C|$ (Sum of single set sizes)
- $S_2 = |A \cap B| + |A \cap C| + |B \cap C|$ (Sum of pairwise intersections)
- $S_3 = |A \cap B \cap C|$ (Triple intersection)

### 2. Disjoint Partition Decomposition

Every surveyed element belongs to exactly one of the 8 disjoint regions $R_1 \dots R_8$:

$$\begin{aligned}
R_1 (\text{onlyA}) &= |A| - |A \cap B| - |A \cap C| + |A \cap B \cap C| \\
R_2 (\text{onlyB}) &= |B| - |A \cap B| - |B \cap C| + |A \cap B \cap C| \\
R_3 (\text{onlyC}) &= |C| - |A \cap C| - |B \cap C| + |A \cap B \cap C| \\
R_4 (\text{onlyAB}) &= |A \cap B| - |A \cap B \cap C| \\
R_5 (\text{onlyAC}) &= |A \cap C| - |A \cap B \cap C| \\
R_6 (\text{onlyBC}) &= |B \cap C| - |A \cap B \cap C| \\
R_7 (\text{allThree}) &= |A \cap B \cap C| \\
R_8 (\text{outside}) &= |U| - |A \cup B \cup C|
\end{aligned}$$

**Conservation Invariant:**

$$\sum_{i=1}^8 R_i = |U| = N$$

### 3. Extended Pigeonhole Principle (Dirichlet Guarantee)

If $n$ objects are distributed across $m$ bins, at least one bin must contain at least:

$$k = \left\lfloor \frac{n - 1}{m} \right\rfloor + 1$$

*Proof by Contradiction:*
Assume every bin contains at most $k - 1 = \lfloor \frac{n - 1}{m} \rfloor$ objects. The total number of objects across all $m$ bins would be:

$$\text{Total} \le m \left\lfloor \frac{n - 1}{m} \right\rfloor \le m \left( \frac{n - 1}{m} \right) = n - 1 < n$$

This contradicts the existence of $n$ objects. Therefore, at least one bin must contain at least $\lfloor \frac{n - 1}{m} \rfloor + 1$ elements.

---

## 5. Privacy & Application Security

- **100% In-Memory Processing:** Survey CSV files uploaded by users are parsed and validated entirely inside browser RAM.
- **Zero Network Egress:** No uploaded survey data, financial amounts, or participant answers are sent to any remote server, database, or analytics API.
- **Client-Side RFC 4180 Parser:** Robust state machine handles quoted fields with commas, newlines, and escaped quotes (`""`).
- **Input Sanitization:** Strips UTF-8 BOM, validates headers, and enforces mathematical bounds ($0 \le |A \cap B| \le \min(|A|, |B|)$).
- **Deduplication:** Identifies and separates duplicate responses via timestamp/identifier hashes.

---

## 6. Development & Verification

### Prerequisites
- Node.js `v18+` (tested on `v26.13.0`)
- npm `v9+` (tested on `v11.20.0`)

### Installation
```bash
git clone <repo-url>
cd "Emi calculator"
npm install
```

### Development Server
```bash
npm run dev
# Server opens at http://localhost:3000
```

### Automated Test Suite (Vitest)
```bash
npm test
```
**Test Results: 8 Test Suites • 108 Tests Passing (0 Failures)**
- `src/tests/calculatorEdgeCases.test.ts` (10 tests)
- `src/tests/emiCalculations.test.ts` (9 tests)
- `src/tests/researchDataset.test.ts` (6 tests)
- `src/tests/inclusionExclusion.test.ts` (28 tests)
- `src/tests/surveyPipeline.test.ts` (19 tests)
- `src/tests/vennDiagram.test.tsx` (14 tests)
- `src/tests/learningLab.test.tsx` (16 tests)
- `src/tests/pagesIntegration.test.tsx` (6 tests)

### Production Build & Code-Splitting Audit
```bash
npm run build
```
Build output (all chunks $< 500\text{ kB}$, zero bundle warnings):
```
dist/index.html                                 1.54 kB │ gzip:   0.75 kB
dist/assets/index-CWa-XpdW.css                 35.47 kB │ gzip:   6.78 kB
dist/assets/KatexMath-DUYCaRVT.js               0.48 kB │ gzip:   0.35 kB
dist/assets/Badge-Cp5dotWh.js                   0.84 kB │ gzip:   0.42 kB
dist/assets/Card-D5VYWIQS.js                    0.98 kB │ gzip:   0.40 kB
dist/assets/NotFound-BrAFHGYP.js                1.03 kB │ gzip:   0.55 kB
dist/assets/Overview-Cs6cDqIe.js               16.25 kB │ gzip:   4.21 kB
dist/assets/MathematicalAnalysis-DhSwa3xR.js   17.92 kB │ gzip:   5.29 kB
dist/assets/vendor-icons-LyMThxiF.js           19.25 kB │ gzip:   4.31 kB
dist/assets/EMICalculator-CYhGfunC.js          26.59 kB │ gzip:   6.16 kB
dist/assets/CsvUploadModal-CHxnlRBp.js         27.72 kB │ gzip:   7.88 kB
dist/assets/ResearchDashboard-BJKg7Blo.js      32.38 kB │ gzip:   7.08 kB
dist/assets/LearningLab-C-MAnT6Y.js            65.86 kB │ gzip:  15.31 kB
dist/assets/index-2XLKUfiD.js                  72.55 kB │ gzip:  21.21 kB
dist/assets/vendor-react-55UPXt-Y.js          164.75 kB │ gzip:  53.89 kB
dist/assets/vendor-katex-Dc8nsIP1.js          261.07 kB │ gzip:  77.50 kB
dist/assets/vendor-charts-C2DIgTZn.js         415.98 kB │ gzip: 112.53 kB
```

---

## 8. Project Invariant Compliance

- `design.md` length: **33,769 bytes** (Strictly preserved, never modified).
- Mathematical calculations: 100% verified against classical discrete mathematics theorems.
- Visual theme: Luxury Wealth Management / Minimal Editorial Finance.


# DESIGN.md — THE EMI TRAP
## EMI Overlap & Financial Behaviour Analysis Platform

**Project Type:** Discrete Mathematics — Experiential Learning  
**Core Mathematical Concept:** Module 1 — Principle of Inclusion and Exclusion  
**Product Category:** Educational Fintech / Financial Behaviour Analytics  
**Target Audience:** General users, students, survey participants and academic evaluators  
**Primary Currency:** INR (₹)  
**Design Direction:** Premium Modern Fintech Dashboard

---

# 0. PRODUCT VISION

## What is THE EMI TRAP?

THE EMI TRAP is an interactive financial awareness and mathematical research platform that demonstrates how multiple financial commitments can overlap and affect an individual's available monthly income.

The project applies concepts from Discrete Mathematics, particularly the Principle of Inclusion and Exclusion (PIE), to real-world survey data.

The platform has three primary objectives:

1. **Mathematical Analysis:** Identify unique individuals with overlapping EMI commitments using set theory, Inclusion-Exclusion and its generalizations.
2. **Financial Assessment:** Calculate combined monthly EMI commitments and understand their relationship with take-home income.
3. **Research Visualization:** Transform survey responses into interactive dashboards, Venn diagrams, charts and understandable mathematical conclusions.

## Core Product Statement

"One EMI feels manageable. But what happens when multiple financial commitments overlap?"

## Important Product Distinction

The application contains two separate mathematical systems.

### System A — Personal EMI Calculator

Calculates the monetary commitment of an individual.

- Adds monthly EMI amounts.
- Calculates the percentage of income committed.
- Calculates remaining income.
- Simulates the effect of adding another EMI.

These are ordinary financial arithmetic calculations.

### System B — Research & Inclusion-Exclusion Engine

Calculates the number of unique survey respondents belonging to overlapping EMI categories.

- Creates mathematical sets.
- Calculates unions and intersections.
- Eliminates duplicate counting.
- Calculates exactly and at-least conditions.
- Applies generalized Inclusion-Exclusion.

These are Discrete Mathematics calculations.

**Never confuse the two systems.**

The EMI calculator calculates money. The Inclusion-Exclusion engine counts people.

---

# 1. DESIGN PHILOSOPHY

## Design Direction: Premium Editorial Fintech

Create a modern financial analytics experience inspired by high-quality fintech products and contemporary SaaS dashboards.

The interface should feel:

- Premium
- Minimal
- Trustworthy
- Professional
- Data-oriented
- Approachable
- Academically credible

It should not resemble a traditional banking portal or a complicated financial trading terminal.

The audience includes ordinary people who may not understand technical financial terminology.

The interface must therefore prioritize clarity over complexity.

## Visual References

Use these products and design systems as inspiration:

1. **shadcn/ui**
   https://ui.shadcn.com/

2. **shadcn/ui Dashboard Blocks**
   https://ui.shadcn.com/blocks

3. **Linear**
   https://linear.app/

4. **Stripe Dashboard**
   https://stripe.com/

5. **Vercel Dashboard**
   https://vercel.com/

6. **Atlassian Data Visualization**
   https://atlassian.design/foundations/color-new/data-visualization-color/

7. **Tailwind CSS**
   https://tailwindcss.com/

8. **WCAG Accessibility Guidelines**
   https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum

Use these references for visual inspiration, not as templates to copy.

---

# 2. GLOBAL DESIGN SYSTEM

## 2.1 Colour Palette

Use a sophisticated evergreen financial identity.

### Primary Colours

| Token | Hex | Usage |
|---|---|---|
| Brand Primary | #176B57 | Primary buttons and important actions |
| Brand Hover | #105744 | Hover states |
| Brand Soft | #E5F2EC | Selected backgrounds |
| Brand Dark | #123D30 | Strong emphasis |
| Accent | #5C9D83 | Supporting highlights |

### Light Mode

| Token | Hex | Usage |
|---|---|---|
| Background | #F6F8F6 | Main canvas |
| Surface | #FFFFFF | Cards and panels |
| Surface Secondary | #EEF3EF | Secondary containers |
| Border | #DCE5DE | Card borders and dividers |
| Text Primary | #17231D | Main headings |
| Text Secondary | #59675F | Supporting text |
| Text Muted | #859189 | Metadata |

### Dark Mode

| Token | Hex | Usage |
|---|---|---|
| Background | #101713 | Main canvas |
| Surface | #18231D | Cards |
| Surface Secondary | #202D25 | Inputs and secondary areas |
| Border | #2C3A31 | Borders |
| Text Primary | #F1F5F2 | Main headings |
| Text Secondary | #B2C0B6 | Supporting text |

Light mode is the default. Dark mode is optional.

### Semantic Colours

| State | Colour | Usage |
|---|---|---|
| Success | #237A52 | Positive confirmation |
| Warning | #A76B19 | Cautionary information |
| Danger | #B33A3A | Errors and invalid inputs |
| Information | #3973B9 | Explanatory information |

Do not use green or red to label someone's financial situation as inherently good or bad.

## 2.2 Mathematical Visualization Colours

Maintain consistent colours across the entire application.

| Set | Category | Colour |
|---|---|---|
| A | Personal Loan EMI | #3973B9 |
| B | Vehicle Loan EMI | #C18428 |
| C | Consumer Durable EMI | #8066B2 |

Use translucent fills when sets overlap.

The colours must remain consistent across:

- Venn diagrams
- Chart legends
- Category cards
- Mathematical explanations
- Research dashboards

Do not rely on colour alone. Every category must have a visible name or label.

## 2.3 Typography

### Primary Typeface

Inter

Alternative: Plus Jakarta Sans.

### Numeric Typeface

Use tabular numerals for all financial and mathematical figures.

Use JetBrains Mono for mathematical expressions and code-like formula displays where appropriate.

### Typography Scale

| Element | Size | Weight |
|---|---|---|
| Main page heading | 32–40px | 700 |
| Section heading | 22–26px | 600 |
| Card heading | 15–18px | 600 |
| Primary metric | 30–40px | 700 |
| Body text | 14–16px | 400 |
| Supporting labels | 12–13px | 500 |
| Mathematical formula | 17–22px | 500 |

Use sentence case.

Avoid excessive uppercase text.

## 2.4 Spacing System

Use a consistent 4px spacing scale.

4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px.

## 2.5 Radius System

| Element | Radius |
|---|---|
| Small tags | 6px |
| Buttons | 9px |
| Inputs | 10px |
| Standard cards | 14px |
| Large panels | 18px |
| Modals | 18px |

## 2.6 Shadows

Use subtle shadows.

Avoid excessive floating cards and strong drop shadows.

Prefer subtle borders to separate surfaces.

---

# 3. APPLICATION ARCHITECTURE

## 3.1 Main Navigation

Use a fixed left sidebar on desktop.

The sidebar should be compact, clean and professional.

### Sidebar Structure

**Brand**

THE EMI TRAP

**Primary Navigation**

1. Overview
2. EMI Calculator
3. Research Dashboard
4. Mathematical Analysis
5. Learning Lab

**Bottom Navigation**

- About the Project
- Data Sources
- Theme Settings

Avoid unnecessary menu items.

Survey data management should be accessible inside the Research Dashboard rather than occupying a separate primary navigation item.

## 3.2 Main Application Layout

Desktop:

- Left sidebar: approximately 240px.
- Main content: flexible.
- Maximum content width: approximately 1440px.
- Content padding: 28–36px.

Use a responsive CSS Grid layout.

Mobile:

- Replace the sidebar with a compact navigation drawer or bottom navigation.
- Stack cards vertically.
- Use full-width inputs.
- Ensure diagrams and charts remain readable.

## 3.3 Global Header

Include:

- Current page title.
- Short description.
- Optional breadcrumb.
- Contextual actions where needed.

Avoid global search, unnecessary command palettes and irrelevant account controls.

---

# 4. PAGE 01 — OVERVIEW DASHBOARD

## Objective

Give visitors an immediate understanding of the project and the collected research findings.

This is the landing page after entering the application.

## Header

Title:

"Understanding the EMI Trap"

Description:

"Explore how multiple financial commitments overlap and affect monthly income."

Include two primary actions:

- Calculate My EMIs
- Explore Research

## 4.1 Key Statistics

Display four metric cards.

### Card 1 — Total Respondents

Number of people who participated in the survey.

### Card 2 — Multiple EMI Categories

Number of respondents belonging to two or more selected EMI categories.

### Card 3 — At Least One EMI Category

Unique respondents belonging to A, B or C.

### Card 4 — No Selected EMI Category

Respondents outside all three selected categories.

Each card should include:

- Metric name.
- Main numerical value.
- Short explanation.
- Optional comparison or percentage.

All statistics must come from the actual validated dataset.

Never hardcode example numbers into the production dashboard.

## 4.2 Research Snapshot

Display:

- Most common EMI category.
- Distribution across categories.
- Percentage of respondents with multiple categories.
- Financial awareness observations.

Use compact charts and short interpretations.

## 4.3 Financial Awareness Introduction

Show a simple visual explanation:

One EMI → Multiple EMIs → Combined Monthly Commitment.

Include a call to action to open the calculator.

---

# 5. PAGE 02 — EMI CALCULATOR

## Objective

Provide an actual usable calculator for people who want to understand their combined monthly EMI commitments.

This is the most user-facing part of the project.

## 5.1 Layout

Desktop:

Two-column layout.

Left column:
EMI input workspace.

Right column:
Live calculation summary.

Mobile:
Single-column layout.

## 5.2 Input Section

### Monthly Take-Home Income

Allow the user to enter monthly income in INR.

Input:

₹ [Enter monthly income]

### Active EMI Commitments

Allow users to add multiple EMI entries.

Each entry contains:

- Loan or purchase name.
- Monthly EMI amount.
- Optional remaining tenure.
- Remove option.

Example:

| Commitment | Monthly EMI |
|---|---:|
| Smartphone | ₹2,500 |
| Bike | ₹5,500 |
| Laptop | ₹2,000 |

Include:

+ Add Another EMI

## 5.3 Calculation Engine

### Total Monthly EMI

Formula:

Total EMI = EMI1 + EMI2 + ... + EMIn

Example:

2500 + 5500 + 2000 = ₹10,000

### EMI-to-Income Ratio

Formula:

(Total Monthly EMI / Monthly Take-Home Income) × 100

Example:

(10000 / 35000) × 100 = 28.57%

Label this metric:

"Percentage of income committed to EMIs"

### Remaining Income

Formula:

Monthly Take-Home Income − Total Monthly EMI

Example:

35000 − 10000 = ₹25,000

## 5.4 Results Panel

Display:

- Combined monthly EMI.
- Monthly income.
- Income committed percentage.
- Remaining income.

Use a simple horizontal progress visualization.

The chart should explain how much income goes toward EMIs.

Never label a particular percentage as universally safe or unsafe.

## 5.5 What-If Simulator

This is an important feature.

Allow users to simulate adding another EMI.

Example:

Current monthly EMIs: ₹10,000

Proposed additional EMI: ₹3,000

New monthly EMI: ₹13,000

Before and after:

| Metric | Before | After |
|---|---:|---:|
| Total EMI | ₹10,000 | ₹13,000 |
| Income committed | 28.57% | 37.14% |
| Remaining income | ₹25,000 | ₹22,000 |

Display the difference clearly.

The simulation must not overwrite the user's original entries unless explicitly requested.

## 5.6 Validation

- Reject negative income.
- Reject negative EMI amounts.
- Prevent invalid numeric inputs.
- Handle zero income without division errors.
- Handle empty EMI lists.
- Format all figures using Indian currency formatting.

Include a small note:

"Remaining income is calculated before rent, food, utilities, transportation and other household expenses."

---

# 6. PAGE 03 — RESEARCH DASHBOARD

## Objective

Display findings from the actual survey and provide visual insights into EMI behaviour.

This page combines Survey Data, EMI Set Analysis and Research Insights.

Use internal tabs.

### Tab A — Survey Overview

Display:

- Total survey respondents.
- Active EMI distribution.
- EMI category distribution.
- Income ranges.
- Total EMI ranges.
- Repayment difficulty responses.
- Financial awareness responses.

### Charts

1. EMI Category Distribution.
2. Number of Active EMIs.
3. Monthly Income Range Distribution.
4. Monthly EMI Range Distribution.
5. Repayment Difficulty.
6. Borrowing Behaviour.

Every chart should include a short interpretation.

Example:

"Consumer durable EMIs are the most frequently selected category in this sample."

Do not make claims unsupported by the collected data.

### Tab B — EMI Set Analysis

This is the mathematical foundation of the research dashboard.

Define three sets:

A = People paying Personal Loan EMIs.

B = People paying Vehicle Loan EMIs.

C = People paying Consumer Durable EMIs.

The survey respondent population forms the universal set U.

Each respondent may belong to multiple sets.

## 6.1 Three-Set Venn Diagram

Create an interactive three-circle Venn diagram.

The diagram must display seven mutually exclusive regions:

1. A only.
2. B only.
3. C only.
4. A and B only.
5. A and C only.
6. B and C only.
7. A, B and C.

Also display the number of respondents outside all three sets.

The diagram should update automatically when survey data changes.

### Important Intersection Rule

The mathematical intersection A ∩ B includes respondents who also belong to C.

Therefore:

AB only = |A ∩ B| − |A ∩ B ∩ C|

AC only = |A ∩ C| − |A ∩ B ∩ C|

BC only = |B ∩ C| − |A ∩ B ∩ C|

Triple intersection:

ABC only = |A ∩ B ∩ C|

Never confuse inclusive intersections with exclusive Venn regions.

## 6.2 Category Cards

Show:

| Category | Description |
|---|---|
| A | Personal Loan EMI |
| B | Vehicle Loan EMI |
| C | Consumer Durable EMI |

Each card displays:

- Number of respondents.
- Percentage of valid respondents.
- Category colour.
- Brief explanation.

## 6.3 Survey Data Management

Include a small data-management panel inside this page.

Allow:

- CSV upload.
- Dataset preview.
- Column mapping.
- Data validation.
- Import confirmation.
- Dataset summary.

Clearly identify whether the displayed dataset is:

- Illustrative demo data.
- Actual collected survey data.

Never silently replace actual survey results with sample data.

---

# 7. PAGE 04 — MATHEMATICAL ANALYSIS

## Objective

This is the most academically important section of the entire project.

It must demonstrate how Module 1 concepts are applied to the EMI research.

Use a clean mathematical workspace.

The user should be able to select a calculation from a list and see its complete solution.

## 7.1 Calculation Navigation

Create a vertical list or tab navigation.

1. Two-Set Inclusion-Exclusion.
2. Three-Set Inclusion-Exclusion.
3. Complement / No Selected Category.
4. Exactly One Condition.
5. Exactly Two Conditions.
6. At Least Two Conditions.
7. Three-Way Intersection.
8. Extended Pigeonhole Principle.

## 7.2 Calculation Display Format

Every calculation must follow the same structure.

### Step 1 — Calculation Title

Example:

"People paying at least one EMI category"

### Step 2 — Mathematical Concept

Principle of Inclusion and Exclusion — Three-Set Formula.

### Step 3 — Given Values

Show all required values from the actual dataset.

### Step 4 — Formula

Display the mathematical notation.

### Step 5 — Substitution

Insert the actual numbers.

### Step 6 — Step-by-Step Solution

Show the arithmetic in a readable format.

### Step 7 — Final Result

Use a prominent result panel.

### Step 8 — Interpretation

Explain the result in plain English.

Never show only a final answer.

---

## 7.3 CALCULATION 1 — TWO-SET INCLUSION-EXCLUSION

Objective:

Calculate people paying at least one of two selected EMI categories.

Formula:

|A ∪ B| = |A| + |B| − |A ∩ B|

Display:

Given values.

Substitution.

Arithmetic solution.

Final result.

Interpretation:

"This is the number of unique respondents who belong to either category A or category B, including people who belong to both."

## 7.4 CALCULATION 2 — THREE-SET INCLUSION-EXCLUSION

Objective:

Calculate unique respondents paying at least one selected EMI category.

Formula:

|A ∪ B ∪ C| = |A| + |B| + |C|

− |A ∩ B| − |A ∩ C| − |B ∩ C|

+ |A ∩ B ∩ C|

Explain why pairwise intersections are subtracted and the triple intersection is added back.

Interpretation:

"This calculation eliminates duplicate counting and gives the actual number of unique respondents."

## 7.5 CALCULATION 3 — COMPLEMENT

Objective:

Calculate respondents outside all three selected categories.

Formula:

|U − (A ∪ B ∪ C)| = |U| − |A ∪ B ∪ C|

Interpretation:

"The number of respondents who do not belong to any of the three selected EMI categories."

Important:

Do not automatically label these respondents as people without any EMI.

They may have other types of loans outside the three selected categories.

## 7.6 CALCULATION 4 — EXACTLY ONE CONDITION

Objective:

Calculate respondents belonging to exactly one of the three categories.

Define:

S1 = |A| + |B| + |C|

S2 = |A ∩ B| + |A ∩ C| + |B ∩ C|

S3 = |A ∩ B ∩ C|

Formula:

Exactly one = S1 − 2S2 + 3S3

Explain how the formula removes repeated counting.

## 7.7 CALCULATION 5 — EXACTLY TWO CONDITIONS

Objective:

Calculate respondents belonging to exactly two categories.

Formula:

Exactly two = S2 − 3S3

Interpretation:

"These are respondents who belong to exactly two of the selected EMI categories, excluding those who belong to all three."

## 7.8 CALCULATION 6 — AT LEAST TWO CONDITIONS

Objective:

Calculate respondents belonging to two or more categories.

Formula:

At least two = S2 − 2S3

Interpretation:

"These are respondents with overlapping commitments across at least two selected categories."

## 7.9 CALCULATION 7 — THREE-WAY INTERSECTION

Objective:

Calculate respondents belonging to all three categories.

Formula:

|A ∩ B ∩ C|

Interpretation:

"These respondents have commitments in all three selected EMI categories."

## 7.10 CALCULATION 8 — EXTENDED PIGEONHOLE PRINCIPLE

Keep this as a supplementary mathematical demonstration.

Use four mutually exclusive groups based on the number of active EMIs:

- Zero EMIs.
- One EMI.
- Two EMIs.
- Three or more EMIs.

If there are N respondents and k mutually exclusive groups, the minimum guaranteed size of at least one group is:

Ceiling(N / k)

Example:

100 respondents divided into four groups:

Ceiling(100 / 4) = 25

Therefore, at least one group contains 25 or more respondents.

Clearly explain that this is a mathematical guarantee, not a claim about the actual distribution.

Do not apply the Pigeonhole Principle directly to overlapping sets A, B and C.

---

# 8. ILLUSTRATIVE MATHEMATICAL EXAMPLE

Use the following example to demonstrate the calculation interface during development.

These numbers are illustrative only.

N = 100

| Variable | Value |
|---|---:|
| A | 40 |
| B | 35 |
| C | 30 |
| A ∩ B | 15 |
| A ∩ C | 12 |
| B ∩ C | 10 |
| A ∩ B ∩ C | 5 |

### At Least One

40 + 35 + 30 − 15 − 12 − 10 + 5

= 73

### Exactly One

S1 = 105

S2 = 37

S3 = 5

105 − (2 × 37) + (3 × 5)

= 46

### Exactly Two

37 − (3 × 5)

= 22

### At Least Two

37 − (2 × 5)

= 27

### All Three

= 5

### None

100 − 73

= 27

Display these values in the mathematical analysis interface with clear labels.

Never present this example as actual survey findings.

---

# 9. PAGE 05 — MATHEMATICAL LEARNING LAB

## Objective

Provide an educational explanation of the concepts used in the project.

This section should help the student explain the mathematics during project evaluation.

### Topics

1. What is a Set?
2. Universal Set.
3. Union.
4. Intersection.
5. Complement.
6. Two-Set Inclusion-Exclusion.
7. Three-Set Inclusion-Exclusion.
8. Generalized Inclusion-Exclusion.
9. Exactly m Conditions.
10. At Least m Conditions.
11. Extended Pigeonhole Principle.

Each topic should contain:

- Simple definition.
- Mathematical notation.
- Small example.
- Visual explanation.
- Connection to the EMI project where relevant.

### Optional Supplementary Module Concepts

If additional concepts from the PDF need to be demonstrated, add them as separate educational examples.

Possible topics:

- Sum Rule.
- Product Rule.
- Permutations.
- Combinations.
- Combinations with Repetition.
- Derangements.
- Rook Polynomials.

These are supplementary educational demonstrations, not direct EMI research calculations.

Do not force these concepts into the financial analysis.

Keep the primary focus on Inclusion-Exclusion and its generalizations.

---

# 10. DATA COLLECTION AND RESEARCH METHODOLOGY

## 10.1 Data Collection

Use Google Forms to collect anonymous survey responses.

Suggested survey size:

70–100 respondents, depending on availability.

Make participation voluntary.

## 10.2 Set Definitions

A = Personal Loan EMI.

B = Vehicle Loan EMI.

C = Consumer Durable EMI.

Other EMI categories should be recorded separately.

A respondent who has an EMI outside A, B and C must not automatically be classified as having no EMI.

## 10.3 Suggested Survey Questions

1. Do you currently pay any active EMI?
2. How many active EMI agreements do you pay?
3. Which types of EMIs do you currently pay?
4. What is your approximate monthly take-home income?
5. What is your approximate total monthly EMI commitment?
6. Do you calculate your combined monthly EMI before taking another loan?
7. Have you experienced difficulty paying multiple EMIs?
8. Would you take another EMI if you already had two active loans?
9. Do you have savings remaining after paying your EMIs?

For questions involving income and EMI amounts, provide ranges and a Prefer not to say option.

Use optional rounded numeric entries only when necessary and clearly explain the purpose.

## 10.4 Important Survey Rules

- Keep responses anonymous.
- Do not collect account numbers or bank details.
- Allow respondents to skip sensitive financial questions.
- Clearly distinguish single-choice and multiple-choice questions.
- Record the survey collection period.
- Record the actual number of valid respondents.
- Do not fabricate responses.

## 10.5 Data Validation

Before mathematical calculations:

- Remove duplicate respondent records.
- Validate category selections.
- Check missing responses.
- Ensure pairwise intersections are consistent.
- Ensure triple intersection is not larger than any pairwise intersection.
- Ensure all intersections are mathematically possible.
- Verify the total union does not exceed N.
- Keep missing answers separate from negative answers.

A respondent should be counted once in each category, regardless of how many loans they have within that category.

The number of active loan agreements must be stored separately from category membership.

---

# 11. TECHNICAL ARCHITECTURE

## 11.1 Recommended Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide |
| Charts | Recharts |
| Backend | Python Flask, if required |
| Database | SQLite, if persistence is required |
| Mathematical Engine | Python or TypeScript |
| Data Collection | Google Forms |
| Data Import | Google Sheets / CSV |

Avoid unnecessary infrastructure.

The application should work without user authentication.

## 11.2 Architecture

Google Forms

↓

Google Sheets

↓

CSV Export / Import

↓

Data Validation

↓

Mathematical Calculation Engine

↓

Validated Research Dataset

↓

React Dashboard

↓

Charts + Venn Diagram + Mathematical Results

The personal EMI calculator should operate independently of the survey dataset.

## 11.3 Suggested Project Structure

src/

  components/

    layout/

    dashboard/

    calculator/

    research/

    venn/

    mathematics/

    charts/

    shared/

    ui/

  pages/

    Overview.tsx

    EMICalculator.tsx

    ResearchDashboard.tsx

    MathematicalAnalysis.tsx

    LearningLab.tsx

  data/

    demoSurveyData.ts

    surveyData.ts

  lib/

    emiCalculations.ts

    inclusionExclusion.ts

    dataValidation.ts

    formatters.ts

  hooks/

  styles/

  types/

Keep mathematical calculations independent of React components.

## 11.4 Core Calculation Functions

Personal EMI calculator:

```ts
function calculateTotalEMI(
  commitments: { monthlyAmount: number }[]
) {
  return commitments.reduce(
    (sum, item) => sum + item.monthlyAmount,
    0
  );
}

function calculateEMIRatio(
  totalEMI: number,
  income: number
) {
  if (income <= 0) return null;

  return (totalEMI / income) * 100;
}

function calculateRemainingIncome(
  income: number,
  totalEMI: number
) {
  return income - totalEMI;
}
```

Inclusion-Exclusion:

```ts
function calculateThreeSetPIE(data: {
  A: number;
  B: number;
  C: number;
  AB: number;
  AC: number;
  BC: number;
  ABC: number;
}) {
  const S1 = data.A + data.B + data.C;

  const S2 = data.AB + data.AC + data.BC;

  const S3 = data.ABC;

  const atLeastOne = S1 - S2 + S3;

  const exactlyOne = S1 - 2 * S2 + 3 * S3;

  const exactlyTwo = S2 - 3 * S3;

  const atLeastTwo = S2 - 2 * S3;

  const allThree = S3;

  return {
    atLeastOne,
    exactlyOne,
    exactlyTwo,
    atLeastTwo,
    allThree
  };
}
```

Complement:

```ts
const none = totalRespondents - atLeastOne;
```

Validate all input counts before using the formulas.

---

# 12. INTERACTION DESIGN

## 12.1 General Interface States

Every interactive element should support:

- Default.
- Hover.
- Focus.
- Active.
- Disabled.
- Loading, where applicable.
- Error.

## 12.2 Animations

Use subtle transitions.

Recommended duration:

150–200ms.

Examples:

- Card hover.
- Button feedback.
- Tab transitions.
- Chart tooltip appearance.
- Number changes.

Avoid excessive animation.

Respect reduced-motion settings.

## 12.3 Charts

All charts must include:

- Clear title.
- Descriptive subtitle where necessary.
- Visible axes and units.
- Legend.
- Tooltip.
- Responsive sizing.
- Textual interpretation.

Every important chart should have a table or accessible textual alternative.

## 12.4 Venn Diagram

The Venn diagram is a central visual element.

Prioritize mathematical correctness over decorative appearance.

Every region must display its correct exclusive count.

Include a legend and the total number of respondents.

Provide a table of the seven regions below the diagram for clarity.

---

# 13. RESPONSIVE DESIGN

## Desktop

- Fixed sidebar.
- Multi-column metric cards.
- Two-column EMI calculator.
- Wide mathematical workspace.
- Interactive Venn diagram.

## Tablet

- Compact sidebar.
- Two-column layout where possible.
- Reduced padding.
- Charts resize proportionally.

## Mobile

- Single-column layout.
- Compact navigation.
- Full-width buttons.
- Stacked input fields.
- Readable mathematical formulas.
- Scrollable tables only where necessary.
- Responsive Venn diagram.
- No horizontal page overflow.

Test at:

- 360px.
- 390px.
- 768px.
- 1024px.
- 1440px.

---

# 14. ACCESSIBILITY

Follow WCAG 2.2 AA principles.

Requirements:

- Visible labels for every form input.
- Keyboard-accessible controls.
- Clear focus indicators.
- Sufficient contrast.
- Semantic HTML.
- Accessible chart descriptions.
- No colour-only information.
- Descriptive button labels.
- Clear error messages.
- Touch-friendly controls.
- Support reduced motion.

---

# 15. PRIVACY AND FINANCIAL DISCLAIMER

This is an educational project, not a financial institution.

Do not:

- Connect to bank accounts.
- Collect financial credentials.
- Store personal loan documents.
- Request card or account numbers.
- Make credit eligibility predictions.
- Claim to provide professional financial advice.

Calculator inputs should remain in the browser unless the user explicitly chooses otherwise.

Survey data should be anonymized.

Display the following disclaimer:

"THE EMI TRAP is an educational project designed to demonstrate mathematical concepts and financial awareness. Calculator results are based on user-entered values and do not represent a professional assessment of financial affordability or borrowing eligibility."

---

# 16. DEVELOPMENT PRIORITIES

## P0 — Core Features

These must be implemented.

- Overview dashboard.
- EMI calculator.
- Add/remove EMI entries.
- Combined monthly EMI calculation.
- EMI-to-income ratio.
- Remaining income.
- What-if simulation.
- Survey dataset import.
- Dataset validation.
- Three-set Venn diagram.
- Inclusion-Exclusion calculations.
- Generalized PIE calculations.
- Step-by-step mathematical explanations.
- Research charts.
- Responsive design.

## P1 — Additional Features

Implement if time permits.

- CSV export.
- Downloadable research summary.
- Month-by-month EMI timeline.
- Dark mode.
- Printable mathematical calculations.
- Additional independent mathematical examples.

Do not sacrifice the accuracy of core mathematical calculations to implement optional features.

---

# 17. TESTING AND MATHEMATICAL VERIFICATION

Test the following scenarios.

### EMI Calculator

1. No EMI commitments.
2. One EMI.
3. Multiple EMIs.
4. Zero monthly income.
5. EMI total greater than monthly income.
6. Adding a proposed EMI.
7. Removing an EMI.
8. Invalid or negative input.

### Inclusion-Exclusion

1. No respondents in any set.
2. Respondents in only A.
3. Respondents in A and B.
4. Respondents in all three sets.
5. Respondents outside all three sets.
6. All three pairwise intersections.
7. Exactly one category.
8. Exactly two categories.
9. At least two categories.
10. Invalid intersections.
11. Duplicate survey records.

Compare website results against manually solved calculations.

The following identity must always hold:

Exactly one + Exactly two + Exactly three = At least one.

Also:

None + At least one = Total respondents.

These identities should be included in automated tests.

---

# 18. DEVELOPMENT PHASES

| Phase | Task |
|---|---|
| 1 | Finalize survey questions and category definitions |
| 2 | Collect survey responses |
| 3 | Clean and validate the dataset |
| 4 | Implement mathematical calculation functions |
| 5 | Verify all formulas manually |
| 6 | Build the EMI calculator |
| 7 | Build the Research Dashboard |
| 8 | Implement the interactive Venn diagram |
| 9 | Build Mathematical Analysis |
| 10 | Build the Learning Lab |
| 11 | Apply final UI and responsive styling |
| 12 | Test, document and prepare the demonstration |

---

# 19. FINAL DESIGN AND DEVELOPMENT INSTRUCTIONS

The coding agent must follow these priorities:

1. Mathematical correctness comes first.
2. Real survey data must be distinguished from illustrative data.
3. The EMI calculator and research calculation engine must remain separate.
4. Every formula must have an understandable explanation.
5. The Venn diagram must represent exclusive regions correctly.
6. The interface must be understandable to ordinary users.
7. Maintain consistent typography, colours, spacing and components.
8. Avoid unnecessary features and excessive dashboard density.
9. Do not introduce fake financial statistics.
10. Preserve the existing working application architecture where practical.

Do not blindly rewrite the entire project if a working implementation already exists.

Inspect the existing codebase before making architectural changes.

Implement features incrementally and test each mathematical function independently.

The result should feel like a polished modern fintech product while remaining an academically accurate Discrete Mathematics project.

**FINAL PRODUCT GOAL:**

A functional, visually polished and mathematically accurate platform that demonstrates how the Principle of Inclusion and Exclusion can be used to analyse overlapping financial commitments, while helping users understand the impact of multiple EMIs on their monthly income.

# END OF DESIGN SPECIFICATION
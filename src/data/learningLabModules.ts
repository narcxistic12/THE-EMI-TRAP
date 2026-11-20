import { LearningModule } from '../types/learningLab';

export const LEARNING_MODULES: LearningModule[] = [
  // ─────────────────────────────────────────────────────────────
  // MODULE 1: FUNDAMENTALS OF SET THEORY
  // ─────────────────────────────────────────────────────────────
  {
    id: 'module-1-foundations',
    number: '01',
    title: 'Fundamentals of Set Theory',
    tagline: 'Elementary collections, universes, operations, and disjoint partitions',
    category: 'core',
    description:
      'Set theory provides the mathematical language for rigorous classification. In credit risk analysis, survey respondents and their active loan agreements are modeled as well-defined mathematical sets.',
    topics: [
      {
        id: 'universal-empty-set',
        title: 'Universal Set & Empty Set',
        subtitle: 'The domain of discourse and null collection',
        latexFormula: 'U = \\{ x \\mid x \\text{ is a surveyed respondent} \\}, \\quad \\emptyset = \\{ \\}, \\quad |\\emptyset| = 0',
        definition:
          'The Universal Set (U) contains every element under consideration in a specific study. The Empty Set (∅) contains no elements and has cardinality zero.',
        workedExample:
          'If an empirical study evaluates 100 participants, |U| = 100. If 0 respondents hold agricultural crop debt, the set of crop debtors is the empty set ∅.',
        emiApplication:
          'In THE EMI TRAP, U constitutes the full surveyed cohort (N = |U|). Every participant belongs to U, establishing a finite bound for all subset cardinalities.',
        stepByStep: [
          'Identify domain: All individuals completing the questionnaire belong to U.',
          'Quantify boundary: The total sample size N = |U| (e.g. N = 100).',
          'Evaluate edge conditions: An unselected loan category with zero borrowers is modeled as ∅ with |∅| = 0.',
        ],
      },
      {
        id: 'subsets-cardinality',
        title: 'Subsets & Cardinality',
        subtitle: 'Sub-populations and quantitative counting',
        latexFormula: 'A \\subseteq U \\iff (\\forall x \\in A \\implies x \\in U), \\quad |A| = n(A)',
        definition:
          'Set A is a subset of U if every element of A also belongs to U. Cardinality |A| denotes the number of distinct elements within set A.',
        workedExample:
          'Let A = {borrowers with Personal Loans}. Since all borrowers are surveyed respondents, A ⊆ U. If 40 respondents hold personal loans, |A| = 40.',
        emiApplication:
          'Individual loan categories (A: Personal, B: Vehicle, C: Consumer Durable) are subsets of U. Duplicate agreements held by one borrower do not increment cardinality.',
        stepByStep: [
          'Identify individual loan holders: Count distinct respondents servicing personal loans.',
          'Apply uniqueness constraint: A borrower with two personal loans is counted once in set A.',
          'Evaluate cardinality: |A| = 40 respondents.',
        ],
      },
      {
        id: 'union-intersection-complement',
        title: 'Union, Intersection & Complement',
        subtitle: 'Fundamental set-theoretic boolean operations',
        latexFormula: 'A \\cup B = \\{ x \\mid x \\in A \\lor x \\in B \\}, \\quad A \\cap B = \\{ x \\mid x \\in A \\land x \\in B \\}, \\quad A^c = U \\setminus A',
        definition:
          'Union (∪) represents elements in A, B, or both (logical OR). Intersection (∩) represents elements in both A and B concurrently (logical AND). Complement (A^c) represents elements in U that are not in A.',
        workedExample:
          'If |A| = 40 (Personal), |B| = 35 (Vehicle), and |A ∩ B| = 15, the two-set union is |A ∪ B| = 40 + 35 - 15 = 60. The complement is |U \\ (A ∪ B)| = 100 - 60 = 40.',
        emiApplication:
          'A ∩ B isolates borrowers simultaneously servicing personal and vehicle loans. The complement U \\ (A ∪ B ∪ C) represents respondents outside the 3 primary categories.',
        stepByStep: [
          'Calculate intersection: Identify borrowers holding agreements in both categories.',
          'Apply logical disjunction: Combine sets without counting shared elements twice.',
          'Formulate complement: Subtract union from total cohort N to find outside respondents.',
        ],
      },
      {
        id: 'disjoint-partitions',
        title: 'Disjoint Sets & Mutual Exclusivity',
        subtitle: 'Non-overlapping subsets and universal partitioning',
        latexFormula: 'A \\cap B = \\emptyset, \\quad \\sum_{i=1}^k |R_i| = |U| \\quad (\\text{if } R_i \\cap R_j = \\emptyset)',
        definition:
          'Two sets are mutually disjoint if their intersection is empty. A partition divides U into pairwise disjoint subsets whose union exactly reconstructs U.',
        workedExample:
          'The 8 exclusive Venn regions (R1 through R8) are pairwise disjoint. Their individual counts (18+15+13+10+7+5+5+27) sum exactly to N = 100.',
        emiApplication:
          'Every respondent belongs to exactly one of the 8 mutually exclusive Venn regions. This guarantees conservation of total respondents across the analytical engine.',
        stepByStep: [
          'Decompose cohort: Divide into exclusive groups (e.g. only Personal, only Vehicle, overlaps).',
          'Verify pairwise disjointness: Confirm that no respondent belongs to more than one exclusive region.',
          'Sum check: Σ R_i must equal total surveyed sample size N.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'If set A has cardinality |A| = 40 and set B has cardinality |B| = 35 within a cohort of N = 100, which condition guarantees that |A ∪ B| = 75?',
        options: [
          'A and B are mutually disjoint (A ∩ B = ∅)',
          'A is a proper subset of B (A ⊂ B)',
          'The intersection |A ∩ B| equals 15',
          'The complement (A ∪ B)^c equals zero',
        ],
        correctIndex: 0,
        explanation:
          'By the Sum Rule of set theory, |A ∪ B| = |A| + |B| if and only if A and B share no elements in common, meaning their intersection is the empty set (A ∩ B = ∅).',
        whyOthersIncorrect: [
          'If A ⊂ B, then |A ∪ B| = |B| = 35, not 75.',
          'If |A ∩ B| = 15, then |A ∪ B| = 40 + 35 - 15 = 60, not 75.',
          'If (A ∪ B)^c = 0, then |A ∪ B| = N = 100, not 75.',
        ],
      },
      {
        id: 'q1-2',
        question: 'A survey participant reports holding a Home Loan, but zero Personal, Vehicle, or Consumer BNPL loans. Where does this respondent reside in set notation?',
        latexEquation: 'A = \\text{Personal}, \\; B = \\text{Vehicle}, \\; C = \\text{Consumer}',
        options: [
          'Inside the complement U \\ (A ∪ B ∪ C)',
          'Inside the triple intersection A ∩ B ∩ C',
          'Outside the universal set U',
          'Inside the exclusive region A \\ (B ∪ C)',
        ],
        correctIndex: 0,
        explanation:
          'Because the respondent holds neither A, B, nor C, they do not belong to the union A ∪ B ∪ C. They belong to the complement U \\ (A ∪ B ∪ C), while remaining inside U.',
        whyOthersIncorrect: [
          'The triple intersection requires holding loans in all 3 categories (A, B, and C).',
          'All surveyed participants belong to the universal set U.',
          'Region A \\ (B ∪ C) requires holding a Personal Loan.',
        ],
      },
      {
        id: 'q1-3',
        question: 'In a three-set Venn diagram, into how many mutually exclusive and pairwise disjoint regions is the universal set U partitioned?',
        options: [
          '8 regions (7 regions in the union plus 1 outside complement region)',
          '7 regions (only the interior partitions)',
          '3 regions (one for each set)',
          '6 regions (pairwise combinations only)',
        ],
        correctIndex: 0,
        explanation:
          'Three sets partition the universal set U into exactly 2^3 = 8 mutually exclusive regions: 3 single-only regions, 3 two-only regions, 1 all-three region, and 1 outside complement region.',
        whyOthersIncorrect: [
          '7 regions only accounts for the indebted union A ∪ B ∪ C, ignoring the outside complement.',
          '3 regions ignores all overlapping intersections.',
          '6 regions is mathematically incomplete.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 2: PRINCIPLE OF INCLUSION–EXCLUSION (PIE)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'module-2-pie',
    number: '02',
    title: 'Principle of Inclusion–Exclusion',
    tagline: 'Alternating sum series, eliminating duplicate counting, and union formulas',
    category: 'core',
    description:
      'The Principle of Inclusion–Exclusion (PIE) is a fundamental combinatorial theorem that computes the size of a union of multiple overlapping sets by systematically compensating for multi-counted intersections.',
    topics: [
      {
        id: 'why-duplicate-counting-occurs',
        title: 'The Origin of Duplicate Counting',
        subtitle: 'Why naive addition fails in overlapping populations',
        latexFormula: '|A| + |B| = |A \\setminus B| + |B \\setminus A| + 2|A \\cap B| > |A \\cup B|',
        definition:
          'When two sets overlap, summing their individual cardinalities (|A| + |B|) counts the shared intersection |A ∩ B| twice. Naive addition overestimates total unique individuals.',
        workedExample:
          'If 40 people pay Personal loans and 35 pay Vehicle loans with 15 paying both, 40 + 35 = 75 counts the 15 dual-borrowers twice. The true union is 75 - 15 = 60.',
        emiApplication:
          'Credit aggregators frequently report loan volumes independently. Naive addition gives an inflated perception of how many distinct citizens are indebted.',
        stepByStep: [
          'Sum individual categories: 40 (Personal) + 35 (Vehicle) = 75 reported contracts.',
          'Identify shared population: 15 dual-debtors were counted in both tallies.',
          'Subtract duplicate instance: 75 - 15 = 60 distinct indebted individuals.',
        ],
      },
      {
        id: 'two-set-pie-theorem',
        title: 'Two-Set Inclusion–Exclusion',
        subtitle: 'The foundational two-set union identity',
        latexFormula: '|A \\cup B| = |A| + |B| - |A \\cap B|',
        definition:
          'The cardinality of the union of two finite sets equals the sum of their individual cardinalities minus the cardinality of their intersection.',
        workedExample:
          'Given |A| = 40, |B| = 35, |A ∩ B| = 15, we evaluate |A ∪ B| = 40 + 35 - 15 = 60. Complement = 100 - 60 = 40 respondents.',
        emiApplication:
          'Quantifies the combined reach of two credit products. Allows financial analysts to separate single-loan borrowers from multi-loan borrowers.',
        stepByStep: [
          'Step 1: Include |A| = 40.',
          'Step 2: Include |B| = 35 (running total = 75).',
          'Step 3: Exclude |A ∩ B| = 15 (final union = 60).',
        ],
      },
      {
        id: 'three-set-pie-alternating-sum',
        title: 'Three-Set Inclusion–Exclusion',
        subtitle: 'The alternating sum expansion for three overlapping categories',
        latexFormula: '|A \\cup B \\cup C| = S_1 - S_2 + S_3',
        definition:
          'For three sets, include single cardinalities (S₁), exclude pairwise intersections (S₂), and re-include the triple intersection (S₃) which was subtracted three times.',
        workedExample:
          'With S₁ = 40+35+30 = 105, S₂ = 15+12+10 = 37, and S₃ = 5, the unique union is |A ∪ B ∪ C| = 105 - 37 + 5 = 73.',
        emiApplication:
          'The core mathematical proof in THE EMI TRAP: Naive addition (S₁ = 105) exceeds the sample of 100 respondents. PIE corrects this to exactly 73 unique debtors.',
        stepByStep: [
          'Evaluate S₁: Sum single sets = 40 + 35 + 30 = 105.',
          'Evaluate S₂: Sum pairwise intersections = 15 + 12 + 10 = 37.',
          'Evaluate S₃: Triple overlap = 5.',
          'Alternating calculation: 105 - 37 + 5 = 73 unique respondents.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'Why must the triple intersection S₃ = |A ∩ B ∩ C| be added back in the three-set PIE formula |A ∪ B ∪ C| = S₁ - S₂ + S₃?',
        options: [
          'Because S₃ is included 3 times in S₁ and subtracted 3 times in S₂, leaving its net coefficient at 0 before adding S₃',
          'Because S₃ contains respondents who do not belong to any pairwise intersection',
          'Because S₃ is a negative quantity in set theory',
          'Because the universal set N would be exceeded without adding S₃',
        ],
        correctIndex: 0,
        explanation:
          'An element in all three sets is counted +3 times in S₁ (+1 for A, +1 for B, +1 for C) and subtracted -3 times in S₂ (-1 for AB, -1 for AC, -1 for BC). Its net count becomes 0! Adding S₃ (+1) ensures it is counted exactly once.',
        whyOthersIncorrect: [
          'Elements in S₃ belong to all three pairwise intersections by definition.',
          'Cardinalities in finite set theory are strictly non-negative integers.',
          'Adding a term increases the union; it does not prevent exceeding N.',
        ],
      },
      {
        id: 'q2-2',
        question: 'In a survey of N = 100, if |A| = 50, |B| = 40, |C| = 30, and all pairwise intersections are empty (|A ∩ B| = |A ∩ C| = |B ∩ C| = 0), what is the size of the union |A ∪ B ∪ C|?',
        options: [
          '120 (Invalid set configuration exceeding N)',
          '100 (Capped at universal set size)',
          '70',
          '0',
        ],
        correctIndex: 0,
        explanation:
          'If pairwise intersections are 0, PIE gives |A ∪ B ∪ C| = 50 + 40 + 30 - 0 + 0 = 120. But a subset cannot exceed universal set N = 100! This configuration is mathematically impossible and rejected by our validation engine.',
        whyOthersIncorrect: [
          'Set theory does not cap numbers; an input sum exceeding N indicates inconsistent or fraudulent survey responses.',
          '70 is an arbitrary number.',
          'The union cannot be 0 when non-empty sets are provided.',
        ],
      },
      {
        id: 'q2-3',
        question: 'If |A| = 40, |B| = 35, and their intersection |A ∩ B| = 15, what is the relative distortion if an analyst mistakenly reports the naive sum |A| + |B| instead of the true union |A ∪ B|?',
        options: [
          '25% overstatement (75 reported vs 60 actual unique individuals)',
          '15% overstatement',
          '37.5% overstatement',
          '0% distortion because all agreements exist',
        ],
        correctIndex: 0,
        explanation:
          'True union is |A ∪ B| = 40 + 35 - 15 = 60. Naive sum is 40 + 35 = 75. The distortion is (75 - 60) / 60 = 15 / 60 = 25% inflation.',
        whyOthersIncorrect: [
          '15 is the absolute count of double-counted individuals, not the percentage.',
          '37.5% is 15 / 40.',
          'While agreements exist, individuals are double-counted, distorting true borrower penetration.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 3: GENERALIZED INCLUSION–EXCLUSION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'module-3-generalized',
    number: '03',
    title: 'Generalized Inclusion–Exclusion',
    tagline: 'Exact partitions, cumulative conditions, and exclusive Venn regions',
    category: 'core',
    description:
      'Generalized PIE derives exact population formulas for elements satisfying exactly m conditions or at least m conditions, cleanly distinguishing inclusive intersections from mutually exclusive Venn regions.',
    topics: [
      {
        id: 'inclusive-vs-exclusive',
        title: 'Inclusive Overlaps vs. Exclusive Regions',
        subtitle: 'The critical distinction between intersections and partitions',
        latexFormula: '(A \\cap B) = R_{\\text{onlyAB}} \\cup (A \\cap B \\cap C), \\quad R_{\\text{onlyAB}} = (A \\cap B) \\setminus C',
        definition:
          'An inclusive intersection |A ∩ B| contains everyone with loans in both A and B, including those who also have loan C. An exclusive region onlyAB contains only those with loans in A and B, strictly excluding C.',
        workedExample:
          'If |A ∩ B| = 15 and |A ∩ B ∩ C| = 5, the exclusive region onlyAB = 15 - 5 = 10 respondents.',
        emiApplication:
          'Conflating inclusive intersections with exclusive regions leads to massive visual and analytical errors in financial dashboards.',
        stepByStep: [
          'Start with inclusive overlap: |A ∩ B| = 15 dual borrowers.',
          'Subtract triple overlap: Subtract 5 borrowers who also carry category C.',
          'Isolate exclusive partition: Exactly 10 borrowers hold only A and B.',
        ],
      },
      {
        id: 'exactly-m-conditions',
        title: 'Exactly m Conditions',
        subtitle: 'General combinatorial formula for exact multi-set membership',
        latexFormula: 'N(\\text{exactly } m) = \\sum_{k=m}^n (-1)^{k-m} \\binom{k}{m} S_k',
        definition:
          'Computes the number of elements belonging to exactly m of the n sets. For m = 1: S₁ - 2S₂ + 3S₃. For m = 2: S₂ - 3S₃.',
        workedExample:
          'With S₁ = 105, S₂ = 37, S₃ = 5: N(exactly 1) = 105 - 2(37) + 3(5) = 46. N(exactly 2) = 37 - 3(5) = 22.',
        emiApplication:
          'Separates individuals with solitary loans (46) from those managing two distinct categories (22), tracking vulnerability progression.',
        stepByStep: [
          'Choose target condition m: e.g. m = 1 (exactly one loan).',
          'Calculate binomial coefficients: S₁ - 2S₂ + 3S₃.',
          'Substitute values: 105 - 74 + 15 = 46 respondents.',
        ],
      },
      {
        id: 'at-least-m-conditions',
        title: 'At Least m Conditions (The Multi-Loan Trap)',
        subtitle: 'Cumulative overlap conditions for compounding commitments',
        latexFormula: 'N(\\ge m) = \\sum_{k=m}^n (-1)^{k-m} \\binom{k-1}{m-1} S_k = N(\\text{exactly } m) + \\dots + N(\\text{exactly } n)',
        definition:
          'Computes the number of elements belonging to m or more sets simultaneously. For m = 2: N(≥2) = S₂ - 2S₃.',
        workedExample:
          'N(≥2) = 37 - 2(5) = 27. Cross-check: N(exactly 2) + N(exactly 3) = 22 + 5 = 27.',
        emiApplication:
          'Directly defines the multi-loan compounding cohort in THE EMI TRAP. Exactly 27% of respondents manage 2 or more active credit categories concurrently.',
        stepByStep: [
          'Identify threshold: m = 2 (two or more categories).',
          'Apply alternating formula: S₂ - 2S₃ = 37 - 10 = 27.',
          'Cross-verify invariant: Exactly 2 (22) + All 3 (5) = 27.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'What is the mathematical relationship between the inclusive pairwise intersection |A ∩ B| and the exclusive region onlyAB in a 3-set system?',
        options: [
          'onlyAB = |A ∩ B| - |A ∩ B ∩ C|',
          'onlyAB = |A ∩ B| + |A ∩ B ∩ C|',
          'onlyAB = |A ∩ B| / 2',
          'onlyAB = |A| + |B| - |A ∩ B|',
        ],
        correctIndex: 0,
        explanation:
          'The inclusive intersection |A ∩ B| contains both the exclusive two-loan holders (onlyAB) and the triple-loan holders (A ∩ B ∩ C). Subtracting the triple intersection isolates onlyAB.',
        whyOthersIncorrect: [
          'Adding the triple intersection would double-count it.',
          'Division by 2 has no set-theoretic foundation.',
          '|A| + |B| - |A ∩ B| is the formula for the two-set union |A ∪ B|.',
        ],
      },
      {
        id: 'q3-2',
        question: 'Under Generalized Inclusion–Exclusion, which formula correctly computes respondents holding at least two loan categories (N(≥ 2)) in a 3-set system?',
        latexEquation: 'N(\\ge 2) = \\sum_{k=2}^3 (-1)^{k-2} \\binom{k-1}{2-1} S_k',
        options: [
          'S₂ - 2S₃',
          'S₂ + S₃',
          'S₁ - S₂',
          'S₂ - 3S₃',
        ],
        correctIndex: 0,
        explanation:
          'Expanding the alternating formula yields: binom(1,1) S₂ - binom(2,1) S₃ = S₂ - 2S₃. In the benchmark cohort: 37 - 2(5) = 27 respondents.',
        whyOthersIncorrect: [
          'S₂ + S₃ fails to exclude triple-counted elements properly.',
          'S₁ - S₂ is not the at-least-2 expansion.',
          'The binomial coefficient for k=3, m=2 is binom(2, 1) = 2, not 3.',
        ],
      },
      {
        id: 'q3-3',
        question: 'Given S₁ = 105, S₂ = 37, and S₃ = 5, how many respondents hold debt in exactly one loan category (N(exactly 1))?',
        options: [
          '46 respondents',
          '68 respondents',
          '73 respondents',
          '27 respondents',
        ],
        correctIndex: 0,
        explanation:
          'Formula: N(exactly 1) = S₁ - 2S₂ + 3S₃ = 105 - 2(37) + 3(5) = 105 - 74 + 15 = 46 respondents. This matches onlyA (18) + onlyB (15) + onlyC (13) = 46.',
        whyOthersIncorrect: [
          '68 is S₁ - S₂ = 105 - 37.',
          '73 is the total union cardinality |A ∪ B ∪ C|.',
          '27 is the count of respondents holding at least two loans (N(≥ 2)).',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 4: EXTENDED PIGEONHOLE PRINCIPLE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'module-4-pigeonhole',
    number: '04',
    title: 'Extended Pigeonhole Principle',
    tagline: 'Dirichlet principle guarantee, exact floor formula, and tier density bounds',
    category: 'core',
    description:
      'The Extended Pigeonhole Principle provides guaranteed lower bounds when distributing n discrete objects into m categories, establishing population density guarantees regardless of sample variance.',
    topics: [
      {
        id: 'pigeonhole-exact-formula',
        title: 'The Exact Pigeonhole Formula',
        subtitle: 'Why the floor formula ⌊(n - 1) / m⌋ + 1 is mathematically canonical',
        latexFormula: '\\left\\lfloor \\frac{n - 1}{m} \\right\\rfloor + 1',
        definition:
          'If n objects are distributed into m distinct boxes, at least one box must contain at least ⌊(n - 1) / m⌋ + 1 objects. This formula is exact and avoids ceiling edge-case pitfalls.',
        workedExample:
          'Distributing n = 100 respondents across m = 4 borrowing tiers (0, 1, 2, 3+ EMIs): ⌊(100 - 1) / 4⌋ + 1 = ⌊99 / 4⌋ + 1 = 24 + 1 = 25.',
        emiApplication:
          'Guarantees that no matter how credit behavior shifts, at least one EMI frequency tier is mathematically guaranteed to hold at least 25 respondents.',
        stepByStep: [
          'Subtract 1 from total objects: n - 1 = 100 - 1 = 99.',
          'Divide by number of boxes m: 99 / 4 = 24.75.',
          'Apply floor function: ⌊24.75⌋ = 24.',
          'Add 1 to determine guaranteed minimum: 24 + 1 = 25 respondents.',
        ],
      },
      {
        id: 'pigeonhole-edge-cases',
        title: 'Boundary Conditions & Proof by Contradiction',
        subtitle: 'Rigorous proof demonstrating why the bound must hold',
        latexFormula: '\\text{Assume all } m \\text{ boxes hold } \\le k-1 \\implies \\text{Total} \\le m \\left( \\left\\lfloor \\frac{n - 1}{m} \\right\\rfloor \\right) \\le n - 1 < n',
        definition:
          'If every box held at most ⌊(n - 1) / m⌋ objects, their sum could not exceed n - 1, contradicting the existence of n objects.',
        workedExample:
          'For n = 5 objects and m = 4 boxes: ⌊(5 - 1) / 4⌋ + 1 = ⌊4 / 4⌋ + 1 = 1 + 1 = 2. At least one box must hold at least 2 objects.',
        emiApplication:
          'Provides academic evaluators with a proof that clustering into debt brackets is a mathematical necessity of sample size, not an artifact of survey noise.',
        stepByStep: [
          'Assume the contrary: No box contains 25 or more respondents.',
          'Sum maximum possible counts: 4 boxes × 24 respondents = 96 maximum total.',
          'Observe contradiction: 96 < 100 surveyed respondents. Hence, at least one box must contain ≥ 25.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'Using the canonical formula ⌊(n - 1) / m⌋ + 1, if 120 survey participants are distributed across 3 income brackets, what is the guaranteed minimum count in at least one bracket?',
        options: [
          '40 respondents',
          '39 respondents',
          '41 respondents',
          '120 respondents',
        ],
        correctIndex: 0,
        explanation:
          'Substitute n = 120 and m = 3: ⌊(120 - 1) / 3⌋ + 1 = ⌊119 / 3⌋ + 1 = ⌊39.667⌋ + 1 = 39 + 1 = 40 respondents.',
        whyOthersIncorrect: [
          '39 forgot to add the +1 at the end.',
          '41 is an arithmetic calculation error.',
          '120 is the total sample size, not the minimum category guarantee.',
        ],
      },
      {
        id: 'q4-2',
        question: 'In an empirical survey of n = 84 participants distributed into m = 4 borrowing frequency tiers (0, 1, 2, 3+ EMIs), what is the Dirichlet guaranteed threshold?',
        options: [
          '21 respondents',
          '20 respondents',
          '22 respondents',
          '84 respondents',
        ],
        correctIndex: 0,
        explanation:
          'Evaluate ⌊(84 - 1) / 4⌋ + 1 = ⌊83 / 4⌋ + 1 = ⌊20.75⌋ + 1 = 20 + 1 = 21 respondents.',
        whyOthersIncorrect: [
          '20 is the unincremented integer division result ⌊83 / 4⌋.',
          '22 overshoots the integer floor evaluation.',
          '84 is the entire sample size.',
        ],
      },
      {
        id: 'q4-3',
        question: 'Under the Extended Pigeonhole Principle, what is the guaranteed concentration bound when the number of objects equals the number of bins (n = m)?',
        options: [
          'Exactly 1',
          '0',
          '2',
          'Undefined (division by zero)',
        ],
        correctIndex: 0,
        explanation:
          'When n = m, ⌊(m - 1) / m⌋ + 1 = 0 + 1 = 1. If every bin contains at most 1 object, exactly m objects are accommodated without requiring any box to hold 2.',
        whyOthersIncorrect: [
          'A non-empty set of objects cannot guarantee a bound of zero.',
          'Bound 2 requires n > m (at least m + 1 objects).',
          'Since m ≥ 1, division by zero never occurs.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 5: ADDITIONAL MODULE 1 CONCEPTS (SUPPLEMENTARY)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'module-5-supplementary',
    number: '05',
    title: 'Additional Module 1 Concepts',
    tagline: 'Supplementary educational demonstrations in combinatorial theory',
    category: 'supplementary',
    description:
      'These supplementary concepts expand on the Discrete Mathematics Module 1 syllabus (counting rules, arrangements with repetition, derangements, and rook polynomials). They are provided purely for academic enrichment and are not direct calculations in the personal EMI calculator.',
    topics: [
      {
        id: 'sum-and-product-rules',
        title: 'Sum & Product Rules',
        subtitle: 'Fundamental disjunctive and sequential counting rules',
        latexFormula: '|A \\cup B| = |A| + |B| \\quad (\\text{if } A \\cap B = \\emptyset), \\qquad |A \\times B| = |A| \\cdot |B|',
        definition:
          'The Sum Rule states that if task A can be done in m ways and task B in n ways with no overlap, doing A or B has m + n ways. The Product Rule states that doing task A followed by task B has m × n ways.',
        workedExample:
          'If a borrower chooses 1 of 3 banks (Sum Rule: 3 choices) and selects 1 of 4 repayment terms (Product Rule: 3 × 4 = 12 loan configurations).',
        emiApplication:
          'Educational precursor to understanding when dependencies exist between financial choices versus independent permutations.',
        stepByStep: [
          'Sum Rule: Disjoint choices add together.',
          'Product Rule: Sequential independent choices multiply together.',
        ],
      },
      {
        id: 'permutations-and-combinations',
        title: 'Permutations & Combinations',
        subtitle: 'Ordered sequences versus unordered groupings',
        latexFormula: 'P(n, r) = \\frac{n!}{(n - r)!}, \\qquad \\binom{n}{r} = \\frac{n!}{r!(n - r)!}',
        definition:
          'Permutations count ordered arrangements where sequence matters. Combinations count unordered selections where order is disregarded.',
        workedExample:
          'Selecting 2 loan categories from 4 available: C(4, 2) = 4! / (2! 2!) = (24) / (4) = 6 possible pairwise loan combinations.',
        emiApplication:
          'Combinations provide the binomial coefficients (k choose m) used in Generalized Inclusion–Exclusion expansions.',
        stepByStep: [
          'Identify total categories n = 4 and choice size r = 2.',
          'Calculate factorials: 4! = 24, 2! = 2.',
          'Divide: 24 / (2 × 2) = 6 pairwise combinations.',
        ],
      },
      {
        id: 'combinations-with-repetition',
        title: 'Combinations with Repetition',
        subtitle: 'Stars and bars distribution of identical units',
        latexFormula: '\\binom{n + r - 1}{r} = \\binom{n + r - 1}{n - 1}',
        definition:
          'The number of ways to choose r elements from n categories with replacement, equivalent to distributing r identical items into n distinct bins.',
        workedExample:
          'Distributing r = 5 loan payments across n = 3 bank accounts: C(3 + 5 - 1, 5) = C(7, 5) = 21 ways.',
        emiApplication:
          'Illustrates cash allocation models across competing financial commitments.',
        stepByStep: [
          'Formulate stars and bars: r stars and n - 1 dividers.',
          'Evaluate binomial coefficient C(n + r - 1, r).',
        ],
      },
      {
        id: 'derangements-subfactorials',
        title: 'Derangements (Subfactorials)',
        subtitle: 'Permutations where no element remains in its original position',
        latexFormula: '!n = n! \\sum_{k=0}^n \\frac{(-1)^k}{k!} = n! \\left( 1 - 1 + \\frac{1}{2!} - \\frac{1}{3!} + \\dots + \\frac{(-1)^n}{n!} \\right)',
        definition:
          'A derangement is a permutation of n elements where no element appears in its original position, rigorously derived via Inclusion–Exclusion.',
        workedExample:
          '!3 = 3!(1 - 1 + 1/2 - 1/6) = 6(2/6) = 2. For n=4, !4 = 9.',
        emiApplication:
          'Classic pedagogical demonstration of alternating signs in PIE series expansions during course viva evaluations.',
        stepByStep: [
          'Define total permutations n!.',
          'Exclude permutations with at least one fixed point using PIE.',
          'Derive subfactorial series !n.',
        ],
      },
      {
        id: 'rook-polynomials-forbidden',
        title: 'Rook Polynomials & Forbidden Positions',
        subtitle: 'Placing non-attacking rooks on restricted boards',
        latexFormula: 'R(x, B) = \\sum_{k=0}^n r_k x^k, \\qquad N(\\text{valid}) = \\sum_{k=0}^n (-1)^k r_k (n - k)!',
        definition:
          'Rook polynomials generate the number of ways to place k non-attacking rooks on a restricted board. Combined with PIE, they solve matching problems with forbidden assignments.',
        workedExample:
          'On a 2×2 board with 1 forbidden square, R(x, B) = 1 + x. Valid assignments = 2! - 1(1!) = 2 - 1 = 1.',
        emiApplication:
          'Academic demonstration of generating functions combined with PIE for constrained matching problems.',
        stepByStep: [
          'Find rook coefficients r_k from board geometry.',
          'Apply alternating PIE sum with (n - k)! permutations.',
          'Compute final valid arrangements.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'Which discrete mathematics principle is used to derive the derangement formula !n = n! Σ (-1)^k / k! ?',
        options: [
          'Principle of Inclusion–Exclusion',
          'Pigeonhole Principle',
          'Binomial Theorem',
          'Euclidean Algorithm',
        ],
        correctIndex: 0,
        explanation:
          'The derangement formula is a celebrated direct application of the Principle of Inclusion–Exclusion, where the conditions C_i represent element i appearing in its original fixed position.',
        whyOthersIncorrect: [
          'The Pigeonhole Principle proves existence; it does not derive alternating permutation sums.',
          'The Binomial Theorem expands (x + y)^n.',
          'The Euclidean Algorithm computes greatest common divisors.',
        ],
      },
      {
        id: 'q5-2',
        question: 'How many distinct combinations of choosing 2 loan categories from 4 available options exist?',
        latexEquation: '\\binom{4}{2} = \\frac{4!}{2!(4 - 2)!}',
        options: [
          '6 combinations',
          '12 combinations',
          '8 combinations',
          '24 combinations',
        ],
        correctIndex: 0,
        explanation:
          'Evaluate the combination formula: 4! / (2! × 2!) = 24 / 4 = 6 combinations. The 6 pairs are {A,B}, {A,C}, {A,D}, {B,C}, {B,D}, {C,D}.',
        whyOthersIncorrect: [
          '12 is the number of permutations P(4, 2) where order matters.',
          '8 is 4 × 2.',
          '24 is 4! permutations of all 4 items.',
        ],
      },
      {
        id: 'q5-3',
        question: 'For a set of 3 distinct items {1, 2, 3}, how many complete derangements (!3) exist where no element appears in its original position?',
        options: [
          '2 derangements: (2, 3, 1) and (3, 1, 2)',
          '6 derangements (all permutations)',
          '1 derangement: (3, 2, 1)',
          '0 derangements',
        ],
        correctIndex: 0,
        explanation:
          '!3 = 3!(1 - 1 + 1/2 - 1/6) = 6(2/6) = 2. Out of 6 total permutations, exactly two leave no element fixed: (2, 3, 1) and (3, 1, 2).',
        whyOthersIncorrect: [
          '6 includes the identity (1, 2, 3) and single-element swaps like (1, 3, 2) where element 1 is fixed.',
          '(3, 2, 1) leaves element 2 in its original 2nd position, so it is not a derangement.',
          'Derangements exist for all n ≥ 2.',
        ],
      },
    ],
  },
];

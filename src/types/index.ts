export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastVisit: string;
}

export interface PsychologyAssessment {
  currentStep: number;
  stepsCompleted: number[];
  mindsetResponses: Record<string, number>;
  limitingBeliefs: Belief[];
  empoweringBeliefs: Belief[];
  actionCommitments: ActionCommitment[];
}

export interface Belief {
  belief: string;
  date: string;
}

export interface ActionCommitment {
  commitment: string;
  deadline: string;
}

export interface BlueprintAssessment {
  responses: Record<string, number>;
  completedAt: string;
}

export interface BlueprintScores {
  psychologyScore: number;
  economicsScore: number;
  sophisticationScore: number;
  executionScore: number;
  overallScore: number;
}

export interface MindsetAssessment {
  moneyBeliefsScore: number;
  emotionalBlocksScore: number;
  readinessScore: number;
  responses: Record<string, number>;
  completedAt: string;
}

export interface FinancialData {
  currency: string;
  annualIncome: number;
  nextYearIncome: number;
  effectiveTaxRate: number;
  savingsRate: number;
  capitalGainsRate: number;
  inflationRate: number;
  // 27-question structure additions
  taxRate: number;
  traditionalRetirement: number;
  taxAdvantagedInvestments: number;
  investedAssetsOptOut: boolean;
  investedAssetsList?: Array<{ id: string; name: string; value: string }>;
  nonInvestedAssets: number;
  homeMarketValue: number;
  personalPropertyValue: number;
  // Liabilities (6 questions - stored for easy access)
  mortgageBalance: number;
  autoLoanBalance: number;
  creditCardBalance: number;
  studentLoanBalance: number;
  personalLoanBalance: number;
  otherLiabilities: number;
  // Future projections (Section 5)
  incomeGrowth3to5Years: number;
  incomeGrowth6to10Years: number;
  // Financial Independence monthly
  monthlyIncomeForLifestyle: number;
  // Expense subcategories (Security/Vitality/Independence)
  monthlyExpenses: {
    security: number;
    vitality: number;
    independence: number;
  };
  assets: Asset[];
  liabilities: Liability[];
  expenses: Expense[];
}

export interface Asset {
  id: string;
  category: 'retirement' | 'tax-advantaged' | 'invested' | 'non-invested' | 'property' | 'dream';
  subcategory: string;
  name: string;
  value: number;
  currency: string;
}

export interface Liability {
  id: string;
  category: 'mortgage' | 'auto' | 'credit_card' | 'student' | 'personal';
  name: string;
  balance: number;
  monthlyPayment: number;
  interestRate: number;
  currency: string;
}

export interface Expense {
  id: string;
  category: 'security' | 'vitality' | 'independence';
  subcategory: string;
  amount: number;
  currency: string;
  // New: Half-monthly flag for Vitality category
  isHalfMonthly?: boolean;
  // New: Monthly flag for Security category
  isMonthly?: boolean;
}

export interface FinancialPlan {
  id: string;
  name: string;
  scenarioType: 'conservative' | 'current' | 'aggressive';
  returnRate: number;
  projections: Projection[];
  createdAt: string;
}

export interface Projection {
  year: number;
  annualIncome: number;
  annualSavings: number;
  afterTaxAndSavings: number;
  criticalMass: number;
  preTaxAnnualIncome: number;
  preTaxMonthlyIncome: number;
  preTaxAnnualIncomeTodayValue: number;
  netWorth: number;
  netWorthTodayValue: number;
}

export interface Goal {
  id: string;
  type: 'security' | 'vitality' | 'independence' | 'freedom';
  targetAmount: number;
  targetYear: number;
  progress: ProgressEntry[];
}

export interface ProgressEntry {
  date: string;
  value: number;
}

export interface ExportData {
  version: string;
  exportDate: string;
  userProfile: UserProfile;
  psychologyAssessment: PsychologyAssessment;
  assessments: {
    blueprint?: BlueprintAssessment;
    mindset?: MindsetAssessment;
  };
  financialData?: FinancialData;
  customReturnRates: {
    conservative: number;
    current: number;
    aggressive: number;
  };
  financialPlans: FinancialPlan[];
  goals: Goal[];
}

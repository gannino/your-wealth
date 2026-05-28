import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialPlanStore } from '../../stores';

interface Question {
  id: keyof FormData | 'investedAssetsOptOut';
  question: string;
  description: string;
  type: 'number' | 'checkbox';
  prefix?: string;
  suffix?: string;
  required?: boolean;
}

interface QuestionSection {
  id: string;
  sectionNumber: number;
  title: string;
  subtitle: string;
  questionRange: string;
  parentSection?: string;
  description?: string;
  questions: Question[];
}

interface FormData {
  // Section 1: Income (2 questions)
  annualIncome: string;
  taxRate: string;

  // Section 2: Inventory of Investment (5 questions)
  traditionalRetirement: string;
  taxAdvantagedInvestments: string;
  investedAssetsOptOut: boolean;
  investedAssetsList: Array<{ id: string; name: string; value: string }>;
  nonInvestedAssets: string;
  homeMarketValue: string;
  personalPropertyValue: string;

  // Section 3: Liabilities (6 questions)
  mortgageBalance: string;
  autoLoanBalance: string;
  creditCardBalance: string;
  studentLoanBalance: string;
  personalLoanBalance: string;
  otherLiabilities: string;

  // Section 4: Key Expenses - Security (5 questions)
  monthlyHousing: string;
  monthlyUtilities: string;
  monthlyFood: string;
  monthlyTransportation: string;
  monthlyHealthInsurance: string;

  // Section 4: Key Expenses - Vitality (3 questions)
  halfMonthlyLuxuries: string;
  halfMonthlyDining: string;
  halfMonthlyClothing: string;

  // Section 4: Key Expenses - Independence (1 question)
  monthlyIncomeForLifestyle: string;

  // Section 5: Where You Are Going (4 questions)
  nextYearIncome: string;
  savingsPercentage: string;
  incomeGrowth3to5Years: string;
  incomeGrowth6to10Years: string;
}

const initialFormData: FormData = {
  // Section 1: Income
  annualIncome: '',
  taxRate: '',

  // Section 2: Investments
  traditionalRetirement: '0',
  taxAdvantagedInvestments: '0',
  investedAssetsOptOut: true,
  investedAssetsList: [],
  nonInvestedAssets: '0',
  homeMarketValue: '0',
  personalPropertyValue: '0',

  // Section 3: Liabilities
  mortgageBalance: '0',
  autoLoanBalance: '0',
  creditCardBalance: '0',
  studentLoanBalance: '0',
  personalLoanBalance: '0',
  otherLiabilities: '0',

  // Section 4: Security
  monthlyHousing: '0',
  monthlyUtilities: '0',
  monthlyFood: '0',
  monthlyTransportation: '0',
  monthlyHealthInsurance: '0',

  // Section 4: Vitality
  halfMonthlyLuxuries: '0',
  halfMonthlyDining: '0',
  halfMonthlyClothing: '0',

  // Section 4: Independence
  monthlyIncomeForLifestyle: '',

  // Section 5: Future
  nextYearIncome: '',
  savingsPercentage: '',
  incomeGrowth3to5Years: '',
  incomeGrowth6to10Years: '',
};

// 27-question structure matching screenshots exactly
const questionSections: QuestionSection[] = [
  {
    id: 'income',
    sectionNumber: 1,
    title: 'Income Information',
    subtitle: 'SECTION 1',
    questionRange: '1-2',
    questions: [
      {
        id: 'annualIncome',
        question: 'What is your annual income?',
        description: 'Enter your total annual income before taxes',
        type: 'number' as const,
        prefix: '$',
        required: true,
      },
      {
        id: 'taxRate',
        question: 'What is your tax rate?',
        description: 'Enter your effective tax rate as a percentage',
        type: 'number' as const,
        suffix: '%',
        required: true,
      },
    ],
  },
  {
    id: 'retirement',
    sectionNumber: 2,
    title: 'Retirement Accounts',
    subtitle: 'SECTION 2',
    questionRange: '3-4',
    parentSection: 'Inventory of Investment',
    questions: [
      {
        id: 'traditionalRetirement',
        question: "Total invested in account(s) specifically set aside for retirement.",
        description: 'Traditional IRA\'s, Roth IRAs, 401k, 403b, Superannuation, Pension',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'taxAdvantagedInvestments',
        question: 'Cash value of annuities, life insurance, etc.',
        description: '(Note: This is not the death benefit, it is the value of the policy you could get today if you cancelled it)',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'invested',
    sectionNumber: 2,
    title: 'Invested Assets',
    subtitle: '1/1',
    questionRange: '5',
    parentSection: 'Inventory of Investment',
    questions: [
      {
        id: 'investedAssetsOptOut',
        question: 'I DON\'T WANT TO ADD ANY ASSETS',
        description: 'An asset is a resource with economic value that you control with the expectation that it will provide future benefit. Here we\'ll identify assets you currently have invested for your financial plan.',
        type: 'checkbox' as const,
      },
    ],
  },
  {
    id: 'non-invested',
    sectionNumber: 2,
    title: 'Non Invested Assets',
    subtitle: '1/1',
    questionRange: '6',
    parentSection: 'Inventory of Investment',
    questions: [
      {
        id: 'nonInvestedAssets',
        question: 'What is the total sum of all cash and all other assets not currently invested?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'property',
    sectionNumber: 2,
    title: 'Personal Property',
    subtitle: '2/2',
    questionRange: '7-8',
    parentSection: 'Inventory of Investment',
    questions: [
      {
        id: 'homeMarketValue',
        question: 'What is the market value of your home?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'personalPropertyValue',
        question: 'What is the value of your furniture, cars, jewelry, etc.?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'liabilities',
    sectionNumber: 3,
    title: 'Liabilities / Loans',
    subtitle: 'SECTION 3',
    questionRange: '9-14',
    description: 'Here is where you\'ll measure what you owe against what you have.',
    questions: [
      {
        id: 'mortgageBalance',
        question: 'What is the total you owe on your mortgage?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'autoLoanBalance',
        question: 'What is the balance on your auto loans if paid over time?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'creditCardBalance',
        question: 'What is the balance on credit cards if paid off over time?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'studentLoanBalance',
        question: 'What is the total amount owed on student loans?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'personalLoanBalance',
        question: 'What is the balance owed on any personal loans or notes?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'otherLiabilities',
        question: 'What is the balance of other liabilities not captured above?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'security',
    sectionNumber: 4,
    title: 'Financial Security',
    subtitle: '5/5',
    questionRange: '15-19',
    parentSection: 'Key Expenses',
    questions: [
      {
        id: 'monthlyHousing',
        question: 'What is your monthly mortgage or rent payment?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'monthlyUtilities',
        question: 'On average, how much do you pay for monthly utilities?',
        description: '(water, heat, gas, electricity, etc.)',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'monthlyFood',
        question: 'On average, how much do you pay for food each month?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'monthlyTransportation',
        question: 'On average, how much do you pay for transportation per month?',
        description: '(car payments, fuel, insurance, parking, etc.)',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'monthlyHealthInsurance',
        question: 'What is your monthly basic health insurance cost?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'vitality',
    sectionNumber: 4,
    title: 'Financial Vitality',
    subtitle: '3/3',
    questionRange: '20-22',
    parentSection: 'Key Expenses',
    questions: [
      {
        id: 'halfMonthlyLuxuries',
        question: 'What is half of your current monthly cost for any small indulgences or luxury items?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'halfMonthlyDining',
        question: 'What is half of your current monthly cost for dining and entertainment?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
      {
        id: 'halfMonthlyClothing',
        question: 'What is half of your current monthly cost for clothing?',
        description: '',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'independence',
    sectionNumber: 4,
    title: 'Financial Independence',
    subtitle: '1/1',
    questionRange: '23',
    parentSection: 'Key Expenses',
    description: 'This means that on this year, you will have accumulated a Critical Mass that generates enough cash to live the exact same quality of life you have today (accounting for inflation), without ever having to work again for the rest of your life.',
    questions: [
      {
        id: 'monthlyIncomeForLifestyle',
        question: 'What is the average monthly income needed to maintain your current lifestyle?',
        description: 'Example: If you earn $100,000, save $20,000 and live on the rest, your figure would be $80,000 / 12 = 6,667 per month.',
        type: 'number' as const,
        prefix: '$',
      },
    ],
  },
  {
    id: 'future',
    sectionNumber: 5,
    title: 'Where You Are Going',
    subtitle: 'SECTION 5',
    questionRange: '24-27',
    questions: [
      {
        id: 'nextYearIncome',
        question: 'What is your anticipated income next year?',
        description: 'If you are married, what will it be for both of you?',
        type: 'number' as const,
        prefix: '$',
        required: true,
      },
      {
        id: 'savingsPercentage',
        question: 'What percentage of your income are you committed to saving or investing?',
        description: '',
        type: 'number' as const,
        suffix: '%',
        required: true,
      },
      {
        id: 'incomeGrowth3to5Years',
        question: 'By what percentage do you expect your current income to increase each year, on average, over the next 3 to 5 years?',
        description: '',
        type: 'number' as const,
        suffix: '%',
      },
      {
        id: 'incomeGrowth6to10Years',
        question: 'And over the next 6 to 10 years?',
        description: '',
        type: 'number' as const,
        suffix: '%',
      },
    ],
  },
];

export default function FinancialDataWizard() {
  const navigate = useNavigate();
  const { setFinancialData, currency } = useFinancialPlanStore();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentSection = questionSections[currentSectionIndex];
  const totalQuestions = 27;
  const currentQuestionStart = currentSectionIndex === 0 ? 1 :
    questionSections.slice(0, currentSectionIndex).reduce((sum, s) => sum + s.questions.length, 1);
  const currentQuestionEnd = currentQuestionStart + currentSection.questions.length - 1;
  const progress = ((currentQuestionEnd) / totalQuestions) * 100;

  const handleInputChange = (fieldId: string, value: string | boolean | Array<{ id: string; name: string; value: string }>) => {
    setFormData({ ...formData, [fieldId]: value });
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: '' });
    }
  };

  const validateSection = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = currentSection.questions.filter((q) => q.required);

    for (const question of requiredFields) {
      const value = formData[question.id as keyof FormData];
      if (typeof value === 'string' && !value) {
        newErrors[question.id] = `${question.question} is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateSection()) {
      return;
    }

    if (currentSectionIndex < questionSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleReset = () => {
    // Reset current section's fields to defaults
    const newFormData = { ...formData };

    // Special handling for invested section
    if (currentSection.id === 'invested') {
      newFormData.investedAssetsOptOut = true;
      newFormData.investedAssetsList = [];
    } else {
      currentSection.questions.forEach((q) => {
        const fieldId = q.id as keyof FormData;
        if (q.type === 'checkbox' || fieldId === 'investedAssetsOptOut') {
          (newFormData as Record<string, unknown>)[fieldId] = true;
        } else {
          (newFormData as Record<string, unknown>)[fieldId] = '0';
        }
      });
    }

    setFormData(newFormData);
  };

  const handleSubmit = () => {
    const annualIncome = parseFloat(formData.annualIncome);
    const taxRate = parseFloat(formData.taxRate) / 100;
    const savingsPercentage = parseFloat(formData.savingsPercentage) / 100;
    const nextYearIncome = parseFloat(formData.nextYearIncome);
    const incomeGrowth3to5Years = parseFloat(formData.incomeGrowth3to5Years) / 100;
    const incomeGrowth6to10Years = parseFloat(formData.incomeGrowth6to10Years) / 100;
    const monthlyIncomeForLifestyle = parseFloat(formData.monthlyIncomeForLifestyle);

    // Calculate Security expenses (5 questions)
    const securityExpenses = [
      parseFloat(formData.monthlyHousing) || 0,
      parseFloat(formData.monthlyUtilities) || 0,
      parseFloat(formData.monthlyFood) || 0,
      parseFloat(formData.monthlyTransportation) || 0,
      parseFloat(formData.monthlyHealthInsurance) || 0,
    ].reduce((sum, val) => sum + val, 0) * 12; // Convert to annual

    // Calculate Vitality expenses (3 questions - these are already half-monthly)
    const vitalityExpenses = [
      parseFloat(formData.halfMonthlyLuxuries) || 0,
      parseFloat(formData.halfMonthlyDining) || 0,
      parseFloat(formData.halfMonthlyClothing) || 0,
    ].reduce((sum, val) => sum + val, 0) * 12; // Convert to annual

    // Independence expenses (1 question - monthly lifestyle)
    const independenceExpenses = monthlyIncomeForLifestyle * 12;

    const financialData = {
      currency,
      annualIncome,
      nextYearIncome,
      effectiveTaxRate: taxRate,
      savingsRate: savingsPercentage,
      capitalGainsRate: 0.15, // Default
      inflationRate: 0.03, // Default
      // 27-question specific fields
      taxRate,
      traditionalRetirement: parseFloat(formData.traditionalRetirement),
      taxAdvantagedInvestments: parseFloat(formData.taxAdvantagedInvestments),
      investedAssetsOptOut: formData.investedAssetsOptOut,
      nonInvestedAssets: parseFloat(formData.nonInvestedAssets),
      homeMarketValue: parseFloat(formData.homeMarketValue),
      personalPropertyValue: parseFloat(formData.personalPropertyValue),
      mortgageBalance: parseFloat(formData.mortgageBalance),
      autoLoanBalance: parseFloat(formData.autoLoanBalance),
      creditCardBalance: parseFloat(formData.creditCardBalance),
      studentLoanBalance: parseFloat(formData.studentLoanBalance),
      personalLoanBalance: parseFloat(formData.personalLoanBalance),
      otherLiabilities: parseFloat(formData.otherLiabilities),
      incomeGrowth3to5Years,
      incomeGrowth6to10Years,
      monthlyIncomeForLifestyle,
      monthlyExpenses: {
        security: securityExpenses,
        vitality: vitalityExpenses,
        independence: independenceExpenses,
      },
      assets: [
        {
          id: 'retirement',
          category: 'retirement' as const,
          subcategory: 'Traditional Retirement',
          name: 'Traditional IRA\'s, Roth IRAs, 401k, 403b, Superannuation, Pension',
          value: parseFloat(formData.traditionalRetirement),
          currency,
        },
        {
          id: 'tax-advantaged',
          category: 'tax-advantaged' as const,
          subcategory: 'Annuities & Life Insurance',
          name: 'Other Tax Advantaged Investments',
          value: parseFloat(formData.taxAdvantagedInvestments),
          currency,
        },
        // Add individual invested assets if not opted out
        ...(!formData.investedAssetsOptOut ? formData.investedAssetsList.map((asset, idx) => ({
          id: asset.id,
          category: 'invested' as const,
          subcategory: 'Invested Asset',
          name: asset.name || `Invested Asset ${idx + 1}`,
          value: parseFloat(asset.value) || 0,
          currency,
        })) : []),
        {
          id: 'non-invested',
          category: 'non-invested' as const,
          subcategory: 'Cash',
          name: 'Cash and non-invested assets',
          value: parseFloat(formData.nonInvestedAssets),
          currency,
        },
        {
          id: 'property',
          category: 'property' as const,
          subcategory: 'Real Estate',
          name: 'Home Market Value',
          value: parseFloat(formData.homeMarketValue),
          currency,
        },
        {
          id: 'personal-property',
          category: 'property' as const,
          subcategory: 'Personal Property',
          name: 'Personal Property',
          value: parseFloat(formData.personalPropertyValue),
          currency,
        },
      ],
      liabilities: [
        {
          id: 'mortgage',
          category: 'mortgage' as const,
          name: 'Mortgage',
          balance: parseFloat(formData.mortgageBalance),
          monthlyPayment: parseFloat(formData.monthlyHousing),
          interestRate: 0,
          currency,
        },
        {
          id: 'auto',
          category: 'auto' as const,
          name: 'Auto Loans',
          balance: parseFloat(formData.autoLoanBalance),
          monthlyPayment: 0,
          interestRate: 0,
          currency,
        },
        {
          id: 'credit-card',
          category: 'credit_card' as const,
          name: 'Credit Card',
          balance: parseFloat(formData.creditCardBalance),
          monthlyPayment: 0,
          interestRate: 0,
          currency,
        },
        {
          id: 'student',
          category: 'student' as const,
          name: 'Student Loans',
          balance: parseFloat(formData.studentLoanBalance),
          monthlyPayment: 0,
          interestRate: 0,
          currency,
        },
        {
          id: 'personal',
          category: 'personal' as const,
          name: 'Personal Loans',
          balance: parseFloat(formData.personalLoanBalance),
          monthlyPayment: 0,
          interestRate: 0,
          currency,
        },
        {
          id: 'other',
          category: 'personal' as const,
          name: 'Other Liabilities',
          balance: parseFloat(formData.otherLiabilities),
          monthlyPayment: 0,
          interestRate: 0,
          currency,
        },
      ],
      expenses: [
        // Security expenses (5 questions - monthly)
        {
          id: 'housing',
          category: 'security' as const,
          subcategory: 'Housing',
          amount: parseFloat(formData.monthlyHousing),
          currency,
          isMonthly: true,
        },
        {
          id: 'utilities',
          category: 'security' as const,
          subcategory: 'Utilities',
          amount: parseFloat(formData.monthlyUtilities),
          currency,
          isMonthly: true,
        },
        {
          id: 'food',
          category: 'security' as const,
          subcategory: 'Food',
          amount: parseFloat(formData.monthlyFood),
          currency,
          isMonthly: true,
        },
        {
          id: 'transportation',
          category: 'security' as const,
          subcategory: 'Transportation',
          amount: parseFloat(formData.monthlyTransportation),
          currency,
          isMonthly: true,
        },
        {
          id: 'health-insurance',
          category: 'security' as const,
          subcategory: 'Health Insurance',
          amount: parseFloat(formData.monthlyHealthInsurance),
          currency,
          isMonthly: true,
        },
        // Vitality expenses (3 questions - half-monthly)
        {
          id: 'luxuries',
          category: 'vitality' as const,
          subcategory: 'Luxuries',
          amount: parseFloat(formData.halfMonthlyLuxuries),
          currency,
          isHalfMonthly: true,
        },
        {
          id: 'dining',
          category: 'vitality' as const,
          subcategory: 'Dining & Entertainment',
          amount: parseFloat(formData.halfMonthlyDining),
          currency,
          isHalfMonthly: true,
        },
        {
          id: 'clothing',
          category: 'vitality' as const,
          subcategory: 'Clothing',
          amount: parseFloat(formData.halfMonthlyClothing),
          currency,
          isHalfMonthly: true,
        },
        // Independence (1 question - monthly lifestyle income)
        {
          id: 'lifestyle',
          category: 'independence' as const,
          subcategory: 'Current Lifestyle',
          amount: monthlyIncomeForLifestyle,
          currency,
          isMonthly: true,
        },
      ],
    };

    setFinancialData(financialData);
    navigate('/planning/generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                {currentQuestionStart}-{currentQuestionEnd} of {totalQuestions} QUESTIONS
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-primary-teal h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {currentSection.parentSection && (
                <span className="text-sm text-gray-400">{currentSection.parentSection}</span>
              )}
              <span className="text-sm text-gray-400">{currentSection.subtitle}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentSection.title}</h1>
            {currentSection.description && (
              <p className="text-gray-400 mb-4">{currentSection.description}</p>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors text-sm"
            >
              RESET VALUES
            </button>
          </div>

          {/* Form Questions */}
          <div className="space-y-8">
            {/* Special handling for Invested Assets section */}
            {currentSection.id === 'invested' ? (
              <div>
                <p className="text-gray-300 mb-4">
                  An asset is a resource with economic value that you control with the expectation that it will provide future benefit. Here we'll identify assets you currently have invested for your financial plan.
                </p>

                {/* Checkbox opt-out option */}
                <label className="flex items-center gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={formData.investedAssetsOptOut}
                    onChange={(e) => handleInputChange('investedAssetsOptOut', e.target.checked)}
                    className="w-5 h-5 rounded border-dark-border bg-dark-bg text-primary-teal focus:ring-primary-teal focus:ring-offset-0"
                  />
                  <span className="text-gray-300 font-medium">I DON'T WANT TO ADD ANY ASSETS</span>
                </label>

                {/* OR Start Adding Assets button */}
                {!formData.investedAssetsOptOut && (
                  <div className="space-y-4">
                    {formData.investedAssetsList.length === 0 ? (
                      <button
                        onClick={() => {
                          const newAsset = {
                            id: `invested-${Date.now()}`,
                            name: '',
                            value: ''
                          };
                          handleInputChange('investedAssetsList', [...formData.investedAssetsList, newAsset]);
                        }}
                        className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
                      >
                        START ADDING ASSETS
                      </button>
                    ) : (
                      <div className="space-y-3">
                        {formData.investedAssetsList.map((asset, idx) => (
                          <div key={asset.id} className="flex gap-3 items-center">
                            <input
                              type="text"
                              value={asset.name}
                              onChange={(e) => {
                                const updatedList = [...formData.investedAssetsList];
                                updatedList[idx] = { ...asset, name: e.target.value };
                                handleInputChange('investedAssetsList', updatedList);
                              }}
                              placeholder="Asset name (e.g., Apple stock, Mutual fund)"
                              className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal"
                            />
                            <input
                              type="number"
                              value={asset.value}
                              onChange={(e) => {
                                const updatedList = [...formData.investedAssetsList];
                                updatedList[idx] = { ...asset, value: e.target.value };
                                handleInputChange('investedAssetsList', updatedList);
                              }}
                              placeholder="Value"
                              className="w-40 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal"
                            />
                            <button
                              onClick={() => {
                                const updatedList = formData.investedAssetsList.filter((_, i) => i !== idx);
                                handleInputChange('investedAssetsList', updatedList);
                              }}
                              className="px-3 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newAsset = {
                              id: `invested-${Date.now()}`,
                              name: '',
                              value: ''
                            };
                            handleInputChange('investedAssetsList', [...formData.investedAssetsList, newAsset]);
                          }}
                          className="px-4 py-2 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal/10 transition-colors text-sm"
                        >
                          + Add Another Asset
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {currentSection.questions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {question.question}
                      {question.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {question.description && (
                      <p className="text-gray-400 text-sm mb-3">{question.description}</p>
                    )}
                    <div className="relative">
                      {question.type === 'checkbox' ? (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[question.id as keyof FormData] as boolean}
                            onChange={(e) => handleInputChange(question.id, e.target.checked)}
                            className="w-5 h-5 rounded border-dark-border bg-dark-bg text-primary-teal focus:ring-primary-teal focus:ring-offset-0"
                          />
                          <span className="text-gray-300">{question.question}</span>
                        </label>
                      ) : (
                        <>
                          {question.prefix && question.prefix !== '$' && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                              {question.prefix}
                            </span>
                          )}
                          <input
                            type={question.type}
                            value={formData[question.id as keyof FormData] as string}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className={`w-full bg-dark-bg border ${
                              errors[question.id] ? 'border-red-500' : 'border-dark-border'
                            } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal ${
                              (question.prefix && question.prefix !== '$') ? 'pl-12' : ''
                            } ${question.suffix ? 'pr-12' : ''}`}
                            placeholder="0"
                          />
                          {question.suffix && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                              {question.suffix}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {errors[question.id] && (
                      <p className="text-red-400 text-sm mt-2">{errors[question.id]}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentSectionIndex === 0}
              className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-primary-teal hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              PREVIOUS
            </button>

            {currentSectionIndex < questionSections.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                NEXT
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                GENERATE FINANCIAL PLAN
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

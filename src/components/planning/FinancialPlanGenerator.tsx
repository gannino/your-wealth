import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialPlanStore } from '../../stores';
import { useCurrency } from '../../hooks/useCurrency';
import { generateFinancialProjection } from '../../lib/calculations';
import type { ScenarioType, Projection } from '../../lib/calculations';

export default function FinancialPlanGenerator() {
  const navigate = useNavigate();
  const { financialData, currency, customReturnRates, withdrawalRate, useMonthlyCompounding, setCustomReturnRates, setWithdrawalRate, setUseMonthlyCompounding, setFinancialData } = useFinancialPlanStore();
  const { getSymbol } = useCurrency();
  const currencySymbol = getSymbol();
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('current');
  const [selectedTab, setSelectedTab] = useState<'goals' | 'yearly' | 'buckets'>('goals');
  const [projections, setProjections] = useState<Record<ScenarioType, Projection[]>>({
    conservative: [],
    current: [],
    aggressive: [],
  });
  const [loading, setLoading] = useState(true);
  const [showRateEditor, setShowRateEditor] = useState(false);
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [infoModal, setInfoModal] = useState<'security' | 'vitality' | 'independence' | null>(null);
  const [editingData, setEditingData] = useState({
    // Section 1: Income (2 questions)
    annualIncome: 0,
    taxRate: 0,
    // Section 2a: Retirement (2 questions)
    traditionalRetirement: 0,
    taxAdvantagedInvestments: 0,
    // Section 2b: Invested Assets (dynamic list)
    investedAssetsList: [] as Array<{ id: string; name: string; value: string }>,
    investedAssetsOptOut: false,
    // Section 2c: Non-Invested (1 question)
    nonInvestedAssets: 0,
    // Section 2d: Personal Property (2 questions)
    homeMarketValue: 0,
    personalPropertyValue: 0,
    // Section 3: Liabilities (6 questions)
    mortgageBalance: 0,
    autoLoanBalance: 0,
    creditCardBalance: 0,
    studentLoanBalance: 0,
    personalLoanBalance: 0,
    otherLiabilities: 0,
    // Section 4a: Security Expenses (5 questions - monthly)
    monthlyHousing: 0,
    monthlyUtilities: 0,
    monthlyFood: 0,
    monthlyTransportation: 0,
    monthlyHealthInsurance: 0,
    // Section 4b: Vitality Expenses (3 questions - half-monthly)
    halfMonthlyLuxuries: 0,
    halfMonthlyDining: 0,
    halfMonthlyClothing: 0,
    // Section 4c: Independence (1 question - monthly)
    monthlyIncomeForLifestyle: 0,
    // Section 5: Future (4 questions)
    nextYearIncome: 0,
    savingsPercentage: 0,
    incomeGrowth3to5Years: 0,
    incomeGrowth6to10Years: 0,
    // Additional settings (not from 27 questions)
    effectiveTaxRate: 0,
    capitalGainsRate: 0,
    inflationRate: 0,
  });

  useEffect(() => {
    if (!financialData) {
      navigate('/assessments/currency');
      return;
    }

    // Generate projections for all three scenarios using custom return rates
    const generateProjections = () => {
      const totalAssets = financialData.assets.reduce((sum, asset) => sum + asset.value, 0);
      const totalLiabilities = financialData.liabilities.reduce((sum, liability) => sum + liability.balance, 0);
      const currentBalance = totalAssets - totalLiabilities;
      const monthlySavings = financialData.annualIncome * financialData.savingsRate / 12;

      const scenarios: ScenarioType[] = ['conservative', 'current', 'aggressive'];
      const scenarioProjections: Record<ScenarioType, Projection[]> = {
        conservative: [],
        current: [],
        aggressive: [],
      };

      scenarios.forEach((scenario) => {
        const customRate = customReturnRates[scenario] / 100;

        scenarioProjections[scenario] = generateFinancialProjection(
          {
            currentBalance,
            annualIncome: financialData.annualIncome,
            monthlySavings,
            effectiveTaxRate: financialData.effectiveTaxRate,
            inflationRate: financialData.inflationRate,
            useMonthlyCompounding,
          },
          scenario,
          new Date().getFullYear(),
          50,
          customRate,
          withdrawalRate / 100
        );
      });

      console.log('🔄 Projections regenerated. Net worth projections:', scenarioProjections.current.slice(0, 5).map(p => ({ year: p.year, netWorth: p.netWorth })));

      setProjections(scenarioProjections);
      setLoading(false);
    };

    generateProjections();
  }, [financialData, navigate, customReturnRates, withdrawalRate, useMonthlyCompounding]);

  // Handler to open data editor and populate with current financial data
  const handleOpenDataEditor = () => {
    if (!financialData) return;

    // Extract individual asset values based on 27-question structure
    const retirementAsset = financialData.assets.find(a => a.category === 'retirement');
    const taxAdvantagedAsset = financialData.assets.find(a => a.category === 'tax-advantaged');
    const nonInvestedAsset = financialData.assets.find(a => a.category === 'non-invested');
    const investedAssets = financialData.assets.filter(a => a.category === 'invested');

    // Extract home vs personal property from property category
    const propertyAssets = financialData.assets.filter(a => a.category === 'property');
    const homeAsset = propertyAssets.find(a => a.subcategory === 'Real Estate');
    const personalPropertyAsset = propertyAssets.find(a => a.subcategory === 'Personal Property');

    // Extract individual liability values
    const mortgageLiability = financialData.liabilities.find(l => l.category === 'mortgage');
    const autoLiability = financialData.liabilities.find(l => l.category === 'auto');
    const creditLiability = financialData.liabilities.find(l => l.category === 'credit_card');
    const studentLiability = financialData.liabilities.find(l => l.category === 'student');
    const personalLiability = financialData.liabilities.find(l => l.name === 'Personal Loans');
    const otherLiability = financialData.liabilities.find(l => l.name === 'Other Liabilities');

    // Extract Security expenses (5 questions)
    const housingExpense = financialData.expenses.find(e => e.subcategory === 'Housing')?.amount || 0;
    const utilitiesExpense = financialData.expenses.find(e => e.subcategory === 'Utilities')?.amount || 0;
    const foodExpense = financialData.expenses.find(e => e.subcategory === 'Food')?.amount || 0;
    const transportationExpense = financialData.expenses.find(e => e.subcategory === 'Transportation')?.amount || 0;
    const healthInsuranceExpense = financialData.expenses.find(e => e.subcategory === 'Health Insurance')?.amount || 0;

    // Extract Vitality expenses (3 questions - half-monthly)
    const luxuriesExpense = financialData.expenses.find(e => e.subcategory === 'Luxuries')?.amount || 0;
    const diningExpense = financialData.expenses.find(e => e.subcategory === 'Dining & Entertainment')?.amount || 0;
    const clothingExpense = financialData.expenses.find(e => e.subcategory === 'Clothing')?.amount || 0;

    // Extract Independence expense (1 question - monthly)
    const lifestyleExpense = financialData.expenses.find(e => e.subcategory === 'Current Lifestyle')?.amount || 0;

    setEditingData({
      // Section 1: Income
      annualIncome: financialData.annualIncome,
      taxRate: financialData.taxRate || financialData.effectiveTaxRate * 100,
      // Section 2a: Retirement
      traditionalRetirement: financialData.traditionalRetirement || retirementAsset?.value || 0,
      taxAdvantagedInvestments: financialData.taxAdvantagedInvestments || taxAdvantagedAsset?.value || 0,
      // Section 2b: Invested Assets
      investedAssetsList: investedAssets.map(a => ({ id: a.id, name: a.name, value: a.value.toString() })),
      investedAssetsOptOut: financialData.investedAssetsOptOut || false,
      // Section 2c: Non-Invested
      nonInvestedAssets: financialData.nonInvestedAssets || nonInvestedAsset?.value || 0,
      // Section 2d: Personal Property
      homeMarketValue: financialData.homeMarketValue || homeAsset?.value || 0,
      personalPropertyValue: financialData.personalPropertyValue || personalPropertyAsset?.value || 0,
      // Section 3: Liabilities
      mortgageBalance: financialData.mortgageBalance || mortgageLiability?.balance || 0,
      autoLoanBalance: financialData.autoLoanBalance || autoLiability?.balance || 0,
      creditCardBalance: financialData.creditCardBalance || creditLiability?.balance || 0,
      studentLoanBalance: financialData.studentLoanBalance || studentLiability?.balance || 0,
      personalLoanBalance: financialData.personalLoanBalance || personalLiability?.balance || 0,
      otherLiabilities: financialData.otherLiabilities || otherLiability?.balance || 0,
      // Section 4a: Security Expenses
      monthlyHousing: housingExpense,
      monthlyUtilities: utilitiesExpense,
      monthlyFood: foodExpense,
      monthlyTransportation: transportationExpense,
      monthlyHealthInsurance: healthInsuranceExpense,
      // Section 4b: Vitality Expenses
      halfMonthlyLuxuries: luxuriesExpense,
      halfMonthlyDining: diningExpense,
      halfMonthlyClothing: clothingExpense,
      // Section 4c: Independence
      monthlyIncomeForLifestyle: financialData.monthlyIncomeForLifestyle || lifestyleExpense,
      // Section 5: Future
      nextYearIncome: financialData.nextYearIncome,
      savingsPercentage: (financialData.savingsRate || 0) * 100,
      incomeGrowth3to5Years: (financialData.incomeGrowth3to5Years || 0) * 100,
      incomeGrowth6to10Years: (financialData.incomeGrowth6to10Years || 0) * 100,
      // Additional settings
      effectiveTaxRate: financialData.effectiveTaxRate,
      capitalGainsRate: financialData.capitalGainsRate,
      inflationRate: financialData.inflationRate,
    });

    setShowDataEditor(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating your financial projections...</p>
        </div>
      </div>
    );
  }

  const currentProjection = projections[selectedScenario];
  const returnRate = customReturnRates[selectedScenario];

  const scenarioColors = {
    conservative: 'text-blue-400 border-blue-400',
    current: 'text-green-400 border-green-400',
    aggressive: 'text-purple-400 border-purple-400',
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Financial Plan</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400">
            <span>{returnRate}% annual return</span>
            <span>•</span>
            <span>{withdrawalRate}% safe withdrawal rate</span>
            <span>•</span>
            <span>Goals calculated at 6% withdrawal (from "Money Master the Game")</span>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex flex-wrap gap-4 mb-8">
          {(['conservative', 'current', 'aggressive'] as ScenarioType[]).map((scenario) => (
            <button
              key={scenario}
              onClick={() => setSelectedScenario(scenario)}
              className={`px-6 py-3 rounded-lg border-2 transition-all ${
                selectedScenario === scenario
                  ? `${scenarioColors[scenario]} bg-opacity-20`
                  : 'border-dark-border text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="text-lg font-bold capitalize">{scenario}</div>
              <div className="text-sm">{customReturnRates[scenario]}% return</div>
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => showDataEditor ? setShowDataEditor(false) : handleOpenDataEditor()}
            className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
          >
            {showDataEditor ? 'Hide Data Editor' : 'Edit Financial Data'}
          </button>
          <button
            onClick={() => setShowRateEditor(!showRateEditor)}
            className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
          >
            {showRateEditor ? 'Hide Rate Editor' : 'Edit Rates'}
          </button>
        </div>

        {/* Calculation Method Banner */}
        <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-teal rounded-full flex items-center justify-center">
                <span className="text-xl">🧮</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Calculation Method: {useMonthlyCompounding ? 'Monthly Compounding' : 'Annual Compounding'}</h3>
                <p className="text-gray-400 text-sm">
                  {useMonthlyCompounding
                    ? 'Monthly contributions earn interest throughout the year. Matches most financial apps. Faster growth to goals.'
                    : 'Simpler calculation with contributions at year-end. More conservative estimates.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setUseMonthlyCompounding(!useMonthlyCompounding)}
              className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
            >
              Switch to {useMonthlyCompounding ? 'Annual' : 'Monthly'}
            </button>
          </div>
        </div>


        {/* Financial Data Editor */}
        {showDataEditor && (
          <div className="space-y-6 mb-8">
            {/* Section 1: Income Information (2 questions) */}
            <div className="bg-dark-surface border border-primary-teal rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-teal rounded-full flex items-center justify-center text-white text-sm">1</span>
                Income Information
              </h3>
              <p className="text-gray-400 text-sm mb-4">2 Questions</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">1. What is your annual income?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.annualIncome}
                      onChange={(e) => setEditingData({ ...editingData, annualIncome: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary-teal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">2. What is your tax rate?</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editingData.taxRate * 100}
                      onChange={(e) => setEditingData({ ...editingData, taxRate: (parseFloat(e.target.value) || 0) / 100 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pr-12 py-2 text-white focus:outline-none focus:border-primary-teal"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Inventory of Investment (5 questions) */}
            <div className="bg-dark-surface border border-green-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-sm">2</span>
                Inventory of Investment
              </h3>
              <p className="text-gray-400 text-sm mb-4">5 Questions</p>

              {/* 2a. Retirement Accounts (2 questions) */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-400 mb-3">2a. Retirement Accounts</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">1. Total invested in Traditional IRA's, Roth IRAs, 401k, 403b, Superannuation, Pension</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                      <input
                        type="number"
                        value={editingData.traditionalRetirement}
                        onChange={(e) => setEditingData({ ...editingData, traditionalRetirement: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">2. Cash value of annuities, life insurance (not death benefit)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                      <input
                        type="number"
                        value={editingData.taxAdvantagedInvestments}
                        onChange={(e) => setEditingData({ ...editingData, taxAdvantagedInvestments: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2b. Invested Assets (opt-out or dynamic) */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-400 mb-3">2b. Invested Assets</h4>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={editingData.investedAssetsOptOut}
                    onChange={(e) => setEditingData({ ...editingData, investedAssetsOptOut: e.target.checked })}
                    className="w-5 h-5 rounded border-dark-border bg-dark-bg text-green-400 focus:ring-green-400"
                  />
                  <span className="text-gray-300 font-medium">I DON'T WANT TO ADD ANY ASSETS</span>
                </label>
                {!editingData.investedAssetsOptOut && (
                  <div className="space-y-3">
                    {editingData.investedAssetsList.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">No invested assets added yet</p>
                    ) : (
                      editingData.investedAssetsList.map((asset, idx) => (
                        <div key={asset.id} className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={asset.name}
                            onChange={(e) => {
                              const updatedList = [...editingData.investedAssetsList];
                              updatedList[idx] = { ...asset, name: e.target.value };
                              setEditingData({ ...editingData, investedAssetsList: updatedList });
                            }}
                            placeholder="Asset name"
                            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                          />
                          <input
                            type="number"
                            value={asset.value}
                            onChange={(e) => {
                              const updatedList = [...editingData.investedAssetsList];
                              updatedList[idx] = { ...asset, value: e.target.value };
                              setEditingData({ ...editingData, investedAssetsList: updatedList });
                            }}
                            placeholder="Value"
                            className="w-40 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                          />
                          <button
                            onClick={() => {
                              const updatedList = editingData.investedAssetsList.filter((_, i) => i !== idx);
                              setEditingData({ ...editingData, investedAssetsList: updatedList });
                            }}
                            className="px-3 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() => {
                        setEditingData({
                          ...editingData,
                          investedAssetsList: [
                            ...editingData.investedAssetsList,
                            { id: `invested-${Date.now()}`, name: '', value: '' }
                          ]
                        });
                      }}
                      className="px-4 py-2 rounded-lg border border-green-400 text-green-400 hover:bg-green-400/10 text-sm"
                    >
                      + Add Invested Asset
                    </button>
                  </div>
                )}
              </div>

              {/* 2c. Non-Invested Assets (1 question) */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-400 mb-3">2c. Non Invested Assets</h4>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">1. What is the total sum of all cash and all other assets not currently invested?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.nonInvestedAssets}
                      onChange={(e) => setEditingData({ ...editingData, nonInvestedAssets: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>
              </div>

              {/* 2d. Personal Property (2 questions) */}
              <div>
                <h4 className="text-md font-semibold text-green-400 mb-3">2d. Personal Property</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">1. What is the market value of your home?</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                      <input
                        type="number"
                        value={editingData.homeMarketValue}
                        onChange={(e) => setEditingData({ ...editingData, homeMarketValue: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">2. What is the value of your furniture, cars, jewelry, etc.?</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                      <input
                        type="number"
                        value={editingData.personalPropertyValue}
                        onChange={(e) => setEditingData({ ...editingData, personalPropertyValue: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Liabilities (6 questions) */}
            <div className="bg-dark-surface border border-red-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-white text-sm">3</span>
                Liabilities
              </h3>
              <p className="text-gray-400 text-sm mb-4">6 Questions</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">1. What is the total you owe on your mortgage?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.mortgageBalance}
                      onChange={(e) => setEditingData({ ...editingData, mortgageBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">2. What is the balance on your auto loans if paid over time?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.autoLoanBalance}
                      onChange={(e) => setEditingData({ ...editingData, autoLoanBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">3. What is the balance on credit cards if paid off over time?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.creditCardBalance}
                      onChange={(e) => setEditingData({ ...editingData, creditCardBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">4. What is the total amount owed on student loans?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.studentLoanBalance}
                      onChange={(e) => setEditingData({ ...editingData, studentLoanBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">5. What is the balance owed on any personal loans or notes?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.personalLoanBalance}
                      onChange={(e) => setEditingData({ ...editingData, personalLoanBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">6. What is the balance of other liabilities not captured above?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.otherLiabilities}
                      onChange={(e) => setEditingData({ ...editingData, otherLiabilities: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Key Expenses (9 questions) */}
            <div className="bg-dark-surface border border-orange-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm">4</span>
                Key Expenses
              </h3>
              <p className="text-gray-400 text-sm mb-4">9 Questions</p>

              {/* 4a. Financial Security (5 questions) */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-orange-400 mb-3">4a. Financial Security (5 questions)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">1. Monthly mortgage or rent payment</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.monthlyHousing}
                        onChange={(e) => setEditingData({ ...editingData, monthlyHousing: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">2. Monthly utilities (water, heat, gas, electricity, etc.)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.monthlyUtilities}
                        onChange={(e) => setEditingData({ ...editingData, monthlyUtilities: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">3. Monthly food cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.monthlyFood}
                        onChange={(e) => setEditingData({ ...editingData, monthlyFood: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">4. Monthly transportation cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.monthlyTransportation}
                        onChange={(e) => setEditingData({ ...editingData, monthlyTransportation: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">5. Monthly basic health insurance cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.monthlyHealthInsurance}
                        onChange={(e) => setEditingData({ ...editingData, monthlyHealthInsurance: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4b. Financial Vitality (3 questions) */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-orange-400 mb-3">4b. Financial Vitality (3 questions - half of your current monthly cost)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">1. Half of monthly cost for small indulgences or luxury items</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.halfMonthlyLuxuries}
                        onChange={(e) => setEditingData({ ...editingData, halfMonthlyLuxuries: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">2. Half of monthly cost for dining and entertainment</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.halfMonthlyDining}
                        onChange={(e) => setEditingData({ ...editingData, halfMonthlyDining: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">3. Half of monthly cost for clothing</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                      <input
                        type="number"
                        value={editingData.halfMonthlyClothing}
                        onChange={(e) => setEditingData({ ...editingData, halfMonthlyClothing: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4c. Financial Independence (1 question) */}
              <div>
                <h4 className="text-md font-semibold text-orange-400 mb-3">4c. Financial Independence (1 question)</h4>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">1. Average monthly income needed to maintain your current lifestyle</label>
                  <p className="text-xs text-gray-400 mb-2">Example: If you earn $100,000, save $20,000 and live on the rest, your figure would be $80,000 / 12 = $6,667 per month</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}/mo</span>
                    <input
                      type="number"
                      value={editingData.monthlyIncomeForLifestyle}
                      onChange={(e) => setEditingData({ ...editingData, monthlyIncomeForLifestyle: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-2 text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Where You Are Going (4 questions) */}
            <div className="bg-dark-surface border border-purple-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-white text-sm">5</span>
                Where You Are Going
              </h3>
              <p className="text-gray-400 text-sm mb-4">4 Questions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">1. What is your anticipated income next year?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editingData.nextYearIncome}
                      onChange={(e) => setEditingData({ ...editingData, nextYearIncome: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">2. What percentage of your income are you committed to saving or investing?</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editingData.savingsPercentage}
                      onChange={(e) => setEditingData({ ...editingData, savingsPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pr-12 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">3. By what percentage do you expect your current income to increase each year, on average, over the next 3 to 5 years?</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editingData.incomeGrowth3to5Years}
                      onChange={(e) => setEditingData({ ...editingData, incomeGrowth3to5Years: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pr-12 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">4. And over the next 6 to 10 years?</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={editingData.incomeGrowth6to10Years}
                      onChange={(e) => setEditingData({ ...editingData, incomeGrowth6to10Years: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pr-12 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDataEditor(false)}
                className="px-4 py-2 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (financialData) {
                    // Calculate Security expenses (5 questions - monthly)
                    const securityExpenses = [
                      editingData.monthlyHousing,
                      editingData.monthlyUtilities,
                      editingData.monthlyFood,
                      editingData.monthlyTransportation,
                      editingData.monthlyHealthInsurance,
                    ].reduce((sum, val) => sum + (val || 0), 0) * 12; // Convert to annual

                    // Calculate Vitality expenses (3 questions - half-monthly)
                    const vitalityExpenses = [
                      editingData.halfMonthlyLuxuries,
                      editingData.halfMonthlyDining,
                      editingData.halfMonthlyClothing,
                    ].reduce((sum, val) => sum + (val || 0), 0) * 12; // Convert to annual

                    // Independence expenses (1 question - monthly)
                    const independenceExpenses = (editingData.monthlyIncomeForLifestyle || 0) * 12;

                    // Reconstruct assets array from 27-question structure
                    const updatedAssets = [
                      {
                        id: 'retirement',
                        category: 'retirement' as const,
                        subcategory: 'Traditional Retirement',
                        name: "Traditional IRA's, Roth IRAs, 401k, 403b, Superannuation, Pension",
                        value: editingData.traditionalRetirement || 0,
                        currency,
                      },
                      {
                        id: 'tax-advantaged',
                        category: 'tax-advantaged' as const,
                        subcategory: 'Annuities & Life Insurance',
                        name: 'Other Tax Advantaged Investments',
                        value: editingData.taxAdvantagedInvestments || 0,
                        currency,
                      },
                      // Add individual invested assets if not opted out
                      ...(!editingData.investedAssetsOptOut ? editingData.investedAssetsList.map((asset) => ({
                        id: asset.id,
                        category: 'invested' as const,
                        subcategory: 'Invested Asset',
                        name: asset.name || 'Invested Asset',
                        value: parseFloat(asset.value) || 0,
                        currency,
                      })) : []),
                      {
                        id: 'non-invested',
                        category: 'non-invested' as const,
                        subcategory: 'Cash',
                        name: 'Cash and non-invested assets',
                        value: editingData.nonInvestedAssets || 0,
                        currency,
                      },
                      {
                        id: 'home',
                        category: 'property' as const,
                        subcategory: 'Real Estate',
                        name: 'Home Market Value',
                        value: editingData.homeMarketValue || 0,
                        currency,
                      },
                      {
                        id: 'personal-property',
                        category: 'property' as const,
                        subcategory: 'Personal Property',
                        name: 'Personal Property',
                        value: editingData.personalPropertyValue || 0,
                        currency,
                      },
                    ];

                    // Reconstruct liabilities array from 27-question structure
                    const updatedLiabilities = [
                      {
                        id: 'mortgage',
                        category: 'mortgage' as const,
                        name: 'Mortgage',
                        balance: editingData.mortgageBalance || 0,
                        monthlyPayment: editingData.monthlyHousing || 0,
                        interestRate: 0,
                        currency,
                      },
                      {
                        id: 'auto',
                        category: 'auto' as const,
                        name: 'Auto Loans',
                        balance: editingData.autoLoanBalance || 0,
                        monthlyPayment: 0,
                        interestRate: 0,
                        currency,
                      },
                      {
                        id: 'credit-card',
                        category: 'credit_card' as const,
                        name: 'Credit Card',
                        balance: editingData.creditCardBalance || 0,
                        monthlyPayment: 0,
                        interestRate: 0,
                        currency,
                      },
                      {
                        id: 'student',
                        category: 'student' as const,
                        name: 'Student Loans',
                        balance: editingData.studentLoanBalance || 0,
                        monthlyPayment: 0,
                        interestRate: 0,
                        currency,
                      },
                      {
                        id: 'personal',
                        category: 'personal' as const,
                        name: 'Personal Loans',
                        balance: editingData.personalLoanBalance || 0,
                        monthlyPayment: 0,
                        interestRate: 0,
                        currency,
                      },
                      {
                        id: 'other',
                        category: 'personal' as const,
                        name: 'Other Liabilities',
                        balance: editingData.otherLiabilities || 0,
                        monthlyPayment: 0,
                        interestRate: 0,
                        currency,
                      },
                    ];

                    // Reconstruct expenses array from 27-question structure
                    const updatedExpenses = [
                      // Security expenses (5 questions - monthly)
                      {
                        id: 'housing',
                        category: 'security' as const,
                        subcategory: 'Housing',
                        amount: editingData.monthlyHousing || 0,
                        currency,
                        isMonthly: true,
                      },
                      {
                        id: 'utilities',
                        category: 'security' as const,
                        subcategory: 'Utilities',
                        amount: editingData.monthlyUtilities || 0,
                        currency,
                        isMonthly: true,
                      },
                      {
                        id: 'food',
                        category: 'security' as const,
                        subcategory: 'Food',
                        amount: editingData.monthlyFood || 0,
                        currency,
                        isMonthly: true,
                      },
                      {
                        id: 'transportation',
                        category: 'security' as const,
                        subcategory: 'Transportation',
                        amount: editingData.monthlyTransportation || 0,
                        currency,
                        isMonthly: true,
                      },
                      {
                        id: 'health-insurance',
                        category: 'security' as const,
                        subcategory: 'Health Insurance',
                        amount: editingData.monthlyHealthInsurance || 0,
                        currency,
                        isMonthly: true,
                      },
                      // Vitality expenses (3 questions - half-monthly)
                      {
                        id: 'luxuries',
                        category: 'vitality' as const,
                        subcategory: 'Luxuries',
                        amount: editingData.halfMonthlyLuxuries || 0,
                        currency,
                        isHalfMonthly: true,
                      },
                      {
                        id: 'dining',
                        category: 'vitality' as const,
                        subcategory: 'Dining & Entertainment',
                        amount: editingData.halfMonthlyDining || 0,
                        currency,
                        isHalfMonthly: true,
                      },
                      {
                        id: 'clothing',
                        category: 'vitality' as const,
                        subcategory: 'Clothing',
                        amount: editingData.halfMonthlyClothing || 0,
                        currency,
                        isHalfMonthly: true,
                      },
                      // Independence (1 question - monthly lifestyle)
                      {
                        id: 'lifestyle',
                        category: 'independence' as const,
                        subcategory: 'Current Lifestyle',
                        amount: editingData.monthlyIncomeForLifestyle || 0,
                        currency,
                        isMonthly: true,
                      },
                    ];

                    const updatedData = {
                      ...financialData,
                      // Section 1: Income
                      annualIncome: editingData.annualIncome,
                      taxRate: editingData.taxRate / 100,
                      // Section 2: Investments
                      traditionalRetirement: editingData.traditionalRetirement,
                      taxAdvantagedInvestments: editingData.taxAdvantagedInvestments,
                      investedAssetsOptOut: editingData.investedAssetsOptOut,
                      nonInvestedAssets: editingData.nonInvestedAssets,
                      homeMarketValue: editingData.homeMarketValue,
                      personalPropertyValue: editingData.personalPropertyValue,
                      // Section 3: Liabilities
                      mortgageBalance: editingData.mortgageBalance,
                      autoLoanBalance: editingData.autoLoanBalance,
                      creditCardBalance: editingData.creditCardBalance,
                      studentLoanBalance: editingData.studentLoanBalance,
                      personalLoanBalance: editingData.personalLoanBalance,
                      otherLiabilities: editingData.otherLiabilities,
                      // Section 4: Expenses totals
                      monthlyExpenses: {
                        security: securityExpenses,
                        vitality: vitalityExpenses,
                        independence: independenceExpenses,
                      },
                      // Section 5: Future
                      nextYearIncome: editingData.nextYearIncome,
                      savingsRate: editingData.savingsPercentage / 100,
                      incomeGrowth3to5Years: editingData.incomeGrowth3to5Years / 100,
                      incomeGrowth6to10Years: editingData.incomeGrowth6to10Years / 100,
                      monthlyIncomeForLifestyle: editingData.monthlyIncomeForLifestyle,
                      // Additional settings
                      effectiveTaxRate: editingData.effectiveTaxRate,
                      capitalGainsRate: editingData.capitalGainsRate,
                      inflationRate: editingData.inflationRate,
                      // Full arrays
                      assets: updatedAssets,
                      liabilities: updatedLiabilities,
                      expenses: updatedExpenses,
                      currency,
                    };
                    console.log('💾 Saving updated financial data:', {
                      annualIncome: updatedData.annualIncome,
                      savingsRate: updatedData.savingsRate,
                      securityExpenses: updatedData.monthlyExpenses.security,
                      withdrawalRate: withdrawalRate,
                    });
                    setFinancialData(updatedData);
                    setShowDataEditor(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Return Rate Editor - Moved before tabs */}
        {showRateEditor && (
          <div className="bg-dark-surface border border-primary-teal rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Customize Return Rates</h2>
            <p className="text-gray-400 mb-6">
              Adjust the expected annual return rate for each scenario. Conservative typically uses bonds/fixed income,
              current uses balanced portfolio, and aggressive uses stocks/higher risk investments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['conservative', 'current', 'aggressive'] as ScenarioType[]).map((scenario) => (
                <div key={scenario} className="bg-dark-bg rounded-lg p-4">
                  <label className="block text-sm font-semibold text-white capitalize mb-2">
                    {scenario}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={customReturnRates[scenario]}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setCustomReturnRates({ ...customReturnRates, [scenario]: value });
                      }}
                      className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white text-center focus:outline-none focus:border-primary-teal"
                    />
                    <span className="text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {scenario === 'conservative' && 'Bonds, fixed income, savings'}
                    {scenario === 'current' && 'Balanced portfolio, index funds'}
                    {scenario === 'aggressive' && 'Stocks, real estate, high growth'}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCustomReturnRates({ conservative: 5, current: 7, aggressive: 9 });
                  setShowRateEditor(false);
                }}
                className="px-4 py-2 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => setShowRateEditor(false)}
                className="px-4 py-2 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Withdrawal Rate Editor - Moved before tabs */}
        {showRateEditor && (
          <div className="bg-dark-surface border border-primary-purple rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Safe Withdrawal Rate</h2>
            <div className="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm">
                <strong className="text-primary-purple">What is this?</strong> The safe withdrawal rate is the percentage of your portfolio
                you can withdraw annually in retirement without depleting it over 30+ years. The "4% rule" is a common guideline,
                but you can adjust based on your circumstances.
              </p>
              <ul className="text-gray-400 text-xs mt-3 space-y-1">
                <li>• <strong className="text-green-400">3-4%:</strong> Very conservative, higher likelihood your money lasts 40+ years</li>
                <li>• <strong className="text-primary-purple">4-5%:</strong> Traditional safe range (the "4% rule")</li>
                <li>• <strong className="text-orange-400">5-6%:</strong> More aggressive, may require flexibility in spending</li>
                <li>• <strong className="text-red-400">7%+:</strong> High risk of depletion, not recommended for retirement planning</li>
              </ul>
            </div>
            <div className="bg-dark-bg rounded-lg p-6 max-w-md">
              <label className="block text-sm font-semibold text-white mb-2">
                Annual Withdrawal Rate
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={withdrawalRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setWithdrawalRate(value);
                  }}
                  className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white text-center text-2xl focus:outline-none focus:border-primary-purple"
                />
                <span className="text-gray-400 text-xl">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                At this rate, your annual withdrawal would be{' '}
                <span className="text-primary-purple font-semibold">
                  {currencySymbol}{Math.round((currentProjection[0]?.netWorth || 0) * withdrawalRate / 100).toLocaleString()}
                </span>
                {' '}based on your current net worth
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setWithdrawalRate(5);
                }}
                className="px-4 py-2 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
              >
                Reset to 5%
              </button>
              <button
                onClick={() => setShowRateEditor(false)}
                className="px-4 py-2 rounded-lg bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Main Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-dark-border">
          <button
            onClick={() => setSelectedTab('goals')}
            className={`px-6 py-3 font-semibold transition-colors ${
              selectedTab === 'goals'
                ? 'text-primary-teal border-b-2 border-primary-teal'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            FINANCIAL GOALS
          </button>
          <button
            onClick={() => setSelectedTab('yearly')}
            className={`px-6 py-3 font-semibold transition-colors ${
              selectedTab === 'yearly'
                ? 'text-primary-teal border-b-2 border-primary-teal'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            YEARLY OVERVIEW
          </button>
          <button
            onClick={() => setSelectedTab('buckets')}
            className={`px-6 py-3 font-semibold transition-colors ${
              selectedTab === 'buckets'
                ? 'text-primary-teal border-b-2 border-primary-teal'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            FINANCIAL BUCKETS
          </button>
        </div>

        {/* Financial Goals Tab - Now Scenario-Specific */}
        {selectedTab === 'goals' && financialData && currentProjection && currentProjection.length > 0 && (
          <div className="space-y-6 mb-8">
            {(() => {
              const withdrawalRatePercent = withdrawalRate;
              const withdrawalRateDecimal = withdrawalRatePercent / 100;
              const securityAnnual = financialData.monthlyExpenses.security;
              const vitalityAnnual = financialData.monthlyExpenses.vitality;
              const independenceAnnual = financialData.monthlyExpenses.independence;

              const securityCriticalMass = securityAnnual / withdrawalRateDecimal;
              const vitalityCriticalMass = (securityAnnual + vitalityAnnual) / withdrawalRateDecimal;
              const independenceCriticalMass = independenceAnnual / withdrawalRateDecimal;

              console.log('🎯 Calculating goals for scenario:', selectedScenario, {
                securityAnnual,
                vitalityAnnual,
                independenceAnnual,
                securityCriticalMass,
                vitalityCriticalMass,
                independenceCriticalMass,
                withdrawalRate: withdrawalRatePercent,
                projectionSample: currentProjection.slice(0, 3).map(p => ({ year: p.year, netWorth: p.netWorth })),
              });

              // Find when each goal is reached in the current scenario's projection
              const findGoalYear = (targetAmount: number) => {
                const yearIndex = currentProjection.findIndex((p: Projection) => p.netWorth >= targetAmount);
                if (yearIndex !== undefined && yearIndex >= 0) {
                  return {
                    year: new Date().getFullYear() + yearIndex,
                    yearsAway: yearIndex,
                    reached: true,
                  };
                }
                return {
                  year: null,
                  yearsAway: null,
                  reached: false,
                };
              };

              const securityGoal = findGoalYear(securityCriticalMass);
              const vitalityGoal = findGoalYear(vitalityCriticalMass);
              const independenceGoal = findGoalYear(independenceCriticalMass);

              console.log('🎯 Goal results:', { securityGoal, vitalityGoal, independenceGoal });

              return (
                <>
                  <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-4 mb-6">
                    <p className="text-primary-teal text-sm">
                      Showing projections for <strong className="capitalize">{selectedScenario}</strong> scenario ({customReturnRates[selectedScenario]}% annual return)
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Goal targets calculated as: <strong>Annual Expenses ÷ 6% Withdrawal Rate</strong> = Target Amount Needed
                      {withdrawalRate !== 6 && ` (Your custom withdrawal rate: ${withdrawalRate}%)`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Financial Security Card */}
                    <div className="bg-dark-surface border-2 border-purple-500 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-purple-400 mb-2">Financial Security</h3>
                      <p className="text-gray-400 text-sm mb-4">Cover your basic needs forever without having to work again.</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target Year</span>
                          <span className="text-white font-semibold">
                            {securityGoal.reached ? securityGoal.year : 'Not reached in 50 years'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Years Away</span>
                          <span className="text-white font-semibold">
                            {securityGoal.reached ? `${securityGoal.yearsAway} YEARS` : '> 50 YEARS'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target Amount</span>
                          <span className="text-white font-semibold">{currencySymbol}{Math.round(securityCriticalMass).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Income</span>
                          <span className="text-white font-semibold">{currencySymbol}{Math.round(securityAnnual).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dark-border pt-2 mt-2">
                          <p className="text-xs text-gray-500">
                            {currencySymbol}{Math.round(securityAnnual).toLocaleString()} ÷ 6% = {currencySymbol}{Math.round(securityCriticalMass).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInfoModal('security')}
                        className="mt-4 text-purple-400 text-sm font-semibold hover:text-purple-300"
                      >
                        MORE INFO →
                      </button>
                    </div>

                    {/* Financial Vitality Card */}
                    <div className="bg-dark-surface border-2 border-teal-400 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-teal-400 mb-2">Financial Vitality</h3>
                      <p className="text-gray-400 text-sm mb-4">Financial Security plus 1/2 of your monthly extras like dining and little luxuries.</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target Year</span>
                          <span className="text-white font-semibold">
                            {vitalityGoal.reached ? vitalityGoal.year : 'Not reached in 50 years'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Years Away</span>
                          <span className="text-white font-semibold">
                            {vitalityGoal.reached ? `${vitalityGoal.yearsAway} YEARS` : '> 50 YEARS'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target Amount</span>
                          <span className="text-white font-semibold">{currencySymbol}{Math.round(vitalityCriticalMass).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Income</span>
                          <span className="text-white font-semibold">{currencySymbol}{Math.round(securityAnnual + vitalityAnnual).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dark-border pt-2 mt-2">
                          <p className="text-xs text-gray-500">
                            {currencySymbol}{Math.round(securityAnnual + vitalityAnnual).toLocaleString()} ÷ 6% = {currencySymbol}{Math.round(vitalityCriticalMass).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInfoModal('vitality')}
                        className="mt-4 text-teal-400 text-sm font-semibold hover:text-teal-300"
                      >
                        MORE INFO →
                      </button>
                    </div>

                    {/* Financial Independence Card */}
                    <div className="bg-dark-surface border-2 border-pink-400 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-pink-400 mb-2">Financial Independence</h3>
                      <p className="text-gray-400 text-sm mb-4">Maintain your current lifestyle without having to work again.</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target Year</span>
                          <span className="text-white font-semibold">
                            {independenceGoal.reached ? independenceGoal.year : 'Not reached in 50 years'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Years Away</span>
                          <span className="text-white font-semibold">
                            {independenceGoal.reached ? `${independenceGoal.yearsAway} YEARS` : '> 50 YEARS'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target Amount</span>
                          <span className="text-white font-semibold">{currencySymbol}{Math.round(independenceCriticalMass).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Income</span>
                          <span className="text-white font-semibold">{currencySymbol}{Math.round(independenceAnnual).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dark-border pt-2 mt-2">
                          <p className="text-xs text-gray-500">
                            {currencySymbol}{Math.round(independenceAnnual).toLocaleString()} ÷ 6% = {currencySymbol}{Math.round(independenceCriticalMass).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInfoModal('independence')}
                        className="mt-4 text-pink-400 text-sm font-semibold hover:text-pink-300"
                      >
                        MORE INFO →
                      </button>
                    </div>
                  </div>

                  {/* Financial Freedom Card */}
                  <div className="bg-dark-surface border-2 border-orange-400 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-orange-400 mb-2">Financial Freedom</h3>
                    <p className="text-gray-400 text-sm mb-4">Maintain your current lifestyle plus two or three significant luxuries you want.</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-white font-semibold">
                          {independenceGoal.reached && independenceGoal.yearsAway !== null && independenceGoal.yearsAway < 30
                            ? `You could reach this in ${independenceGoal.yearsAway + 5}+ years`
                            : 'You will reach this goal in 30+ years'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-4">Calculate the cost of two or three significant luxuries you want.</p>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg text-sm">
                      ADD LUXURIES
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Financial Buckets Tab */}
        {selectedTab === 'buckets' && financialData && (
          <div className="space-y-6 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Financial Buckets</h2>
              <p className="text-gray-400">This is your asset allocation and will be the most important investment decision of your life.</p>
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 mt-4">
                <p className="text-gray-400 text-xs">
                  <strong>Note:</strong> Asset allocation reflects how your investments are distributed NOW and does not change based on return rate scenarios.
                  The scenario selector above affects when you'll reach your goals, not how your assets are currently allocated.
                </p>
              </div>
            </div>

            {(() => {
              // Calculate bucket allocations
              const nonInvested = financialData.assets.find(a => a.category === 'non-invested')?.value || 0;
              const taxAdvantaged = financialData.assets.find(a => a.category === 'tax-advantaged')?.value || 0;
              const homeValue = financialData.assets.find(a => a.subcategory === 'Real Estate')?.value || 0;
              const mortgageBalance = financialData.liabilities.find(l => l.category === 'mortgage')?.balance || 0;
              const homeEquity = Math.max(0, homeValue - mortgageBalance);

              const securityBucket = nonInvested + taxAdvantaged + homeEquity;
              const growthBucket = financialData.assets.filter(a => a.category === 'retirement' || a.category === 'invested').reduce((sum, a) => sum + a.value, 0);
              const dreamBucket = financialData.assets.filter(a => a.category === 'dream').reduce((sum, a) => sum + a.value, 0);

              const totalAssets = securityBucket + growthBucket + dreamBucket;
              const securityPercent = totalAssets > 0 ? Math.round((securityBucket / totalAssets) * 100) : 0;
              const growthPercent = totalAssets > 0 ? Math.round((growthBucket / totalAssets) * 100) : 0;
              const dreamPercent = totalAssets > 0 ? Math.round((dreamBucket / totalAssets) * 100) : 0;

              return (
                <>
                  {/* Bucket Visualization */}
                  <div className="flex gap-4 mb-8">
                    <div className="flex-1">
                      <div className="h-8 bg-orange-500 rounded-lg" style={{ width: `${securityPercent}%` }}></div>
                      <p className="text-orange-400 text-sm mt-2">Security Bucket ({securityPercent}%)</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-teal-400 rounded-lg" style={{ width: `${growthPercent}%` }}></div>
                      <p className="text-teal-400 text-sm mt-2">Growth Bucket ({growthPercent}%)</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-pink-400 rounded-lg" style={{ width: `${dreamPercent}%` }}></div>
                      <p className="text-pink-400 text-sm mt-2">Dream Bucket ({dreamPercent}%)</p>
                    </div>
                  </div>

                  {/* Bucket Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Security Bucket */}
                    <div className="bg-dark-surface border-2 border-orange-500 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-orange-400 mb-2">Security Bucket ({securityPercent}%)</h3>
                      <p className="text-gray-400 text-sm mb-4">{Math.ceil(securityBucket / 1000)} ASSETS</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Cash/uninvested</span>
                          <span className="text-white">{currencySymbol}{nonInvested.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Other tax advantaged</span>
                          <span className="text-white">{currencySymbol}{taxAdvantaged.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Residence value - Owed mortgage</span>
                          <span className="text-white">{currencySymbol}{homeEquity.toLocaleString()}</span>
                        </div>
                      </div>
                      <button className="mt-4 text-orange-400 text-sm font-semibold hover:text-orange-300">ADD →</button>
                    </div>

                    {/* Growth Bucket */}
                    <div className="bg-dark-surface border-2 border-teal-400 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-teal-400 mb-2">Growth Bucket ({growthPercent}%)</h3>
                      <p className="text-gray-400 text-sm mb-4">{financialData.assets.filter(a => a.category === 'retirement' || a.category === 'invested').length} ASSETS</p>
                      <div className="space-y-2">
                        {financialData.assets.filter(a => a.category === 'retirement' || a.category === 'invested').map(asset => (
                          <div key={asset.id} className="flex justify-between text-sm">
                            <span className="text-gray-400">{asset.name}</span>
                            <span className="text-white">{currencySymbol}{asset.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 text-teal-400 text-sm font-semibold hover:text-teal-300">ADD →</button>
                    </div>

                    {/* Dream Bucket */}
                    <div className="bg-dark-surface border-2 border-pink-400 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-pink-400 mb-2">Dream Bucket ({dreamPercent}%)</h3>
                      {dreamBucket === 0 ? (
                        <>
                          <p className="text-gray-400 text-sm mb-4">You currently have no dream assets!</p>
                          <p className="text-gray-500 text-xs mb-4">To be filled with assets once certain milestones / outcomes are reached. Use your newly obtained knowledge about asset allocation!</p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400 text-sm mb-4">{financialData.assets.filter(a => a.category === 'dream').length} ASSETS</p>
                          <div className="space-y-2">
                            {financialData.assets.filter(a => a.category === 'dream').map(asset => (
                              <div key={asset.id} className="flex justify-between text-sm">
                                <span className="text-gray-400">{asset.name}</span>
                                <span className="text-white">{currencySymbol}{asset.value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <button className="mt-4 text-pink-400 text-sm font-semibold hover:text-pink-300">ADD →</button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Yearly Overview Tab */}
        {selectedTab === 'yearly' && (
          <>
          <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-4 mb-6">
            <p className="text-primary-teal text-sm">
              <strong className="capitalize">{selectedScenario}</strong> scenario projections •
              <strong> {customReturnRates[selectedScenario]}% investment return</strong> •
              <strong> {withdrawalRate}% safe withdrawal rate</strong>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Your portfolio grows at {customReturnRates[selectedScenario]}% annually. In retirement, you can withdraw {withdrawalRate}% of your portfolio value each year.
            </p>
          </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Current Net Worth"
            value={currentProjection[0]?.netWorth || 0}
            format="currency"
            currencySymbol={currencySymbol}
          />
          <MetricCard
            title="10-Year Projection"
            value={currentProjection[9]?.netWorth || 0}
            format="currency"
            currencySymbol={currencySymbol}
            highlight
          />
          <MetricCard
            title="20-Year Projection"
            value={currentProjection[19]?.netWorth || 0}
            format="currency"
            currencySymbol={currencySymbol}
          />
          <MetricCard
            title="30-Year Projection"
            value={currentProjection[29]?.netWorth || 0}
            format="currency"
            currencySymbol={currencySymbol}
          />
        </div>

        {/* Projections Table */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Year-by-Year Projections</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Year</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Net Worth</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Inflation-Adjusted</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Annual Income</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                    Annual Withdrawal ({withdrawalRate}% of Net Worth)
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProjection.slice(0, 20).map((year: Projection) => (
                  <tr key={year.year} className="border-b border-dark-border hover:bg-dark-bg">
                    <td className="py-3 px-4 text-white">{year.year}</td>
                    <td className="py-3 px-4 text-right text-primary-teal font-semibold">
                      {formatCurrency(year.netWorth, currencySymbol)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {formatCurrency(year.netWorthTodayValue, currencySymbol)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {formatCurrency(year.annualIncome, currencySymbol)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {formatCurrency(year.preTaxAnnualIncome, currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Showing first 20 years. Projections assume {returnRate}% annual return, {(financialData?.inflationRate ?? 0.03) * 100}% inflation, and {withdrawalRate}% annual withdrawal rate.
          </p>
        </div>
          </>
        )}

        {/* Info Modals */}
        {infoModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setInfoModal(null)}>
            <div className="bg-dark-surface border border-dark-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {infoModal === 'security' && (
                <>
                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Financial Security</h2>
                    <p className="text-purple-200">Your foundation for a worry-free life</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What It Means</h3>
                      <p className="text-gray-300">
                        Financial Security covers your essential living expenses forever. You can cover basic needs like housing, food,
                        utilities, healthcare, and transportation without ever needing to work again.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What It Covers</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Mortgage or rent payments</li>
                        <li>• Basic utilities (water, heat, electricity)</li>
                        <li>• Groceries and essential food</li>
                        <li>• Transportation to work/appointments</li>
                        <li>• Basic health insurance</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The Formula</h3>
                      <p className="text-gray-400 text-sm">
                        Target = Annual Security Expenses ÷ 6% withdrawal rate
                      </p>
                      <p className="text-purple-400 text-sm mt-1">
                        Example: ${Math.round((financialData?.monthlyExpenses?.security || 0) * 12).toLocaleString()} ÷ 0.06 = ${Math.round((financialData?.monthlyExpenses?.security || 0) * 12 / 0.06).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">How to Reach It Faster</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Increase your savings rate</li>
                        <li>• Reduce essential expenses where possible</li>
                        <li>• Maximize tax-advantaged accounts</li>
                        <li>• Consider higher return investments (within risk tolerance)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 border-t border-dark-border flex justify-end">
                    <button
                      onClick={() => setInfoModal(null)}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

              {infoModal === 'vitality' && (
                <>
                  <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Financial Vitality</h2>
                    <p className="text-teal-200">Security plus the joys of life</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What It Means</h3>
                      <p className="text-gray-300">
                        Financial Vitality goes beyond basics to include half of your current discretionary spending on luxuries,
                        dining out, and entertainment. It's Financial Security plus life's pleasures.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What It Covers</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• All Security expenses (housing, food, utilities, etc.)</li>
                        <li>• Half of current dining out & entertainment budget</li>
                        <li>• Half of current luxury/spending money</li>
                        <li>• Half of current clothing budget</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The Formula</h3>
                      <p className="text-gray-400 text-sm">
                        Target = (Security Expenses + Vitality Expenses) ÷ 6% withdrawal rate
                      </p>
                      <p className="text-teal-400 text-sm mt-1">
                        Example: (${Math.round((financialData?.monthlyExpenses?.security || 0) * 12).toLocaleString()} + ${Math.round((financialData?.monthlyExpenses?.vitality || 0)).toLocaleString()}) ÷ 0.06
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">How to Reach It Faster</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Balance saving with enjoying life now</li>
                        <li>• Optimize your discretionary spending</li>
                        <li>• Look for ways to reduce expenses without sacrificing joy</li>
                        <li>• Increase income through side hustles or career growth</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 border-t border-dark-border flex justify-end">
                    <button
                      onClick={() => setInfoModal(null)}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

              {infoModal === 'independence' && (
                <>
                  <div className="bg-gradient-to-r from-pink-600 to-pink-800 p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Financial Independence</h2>
                    <p className="text-pink-200">Complete freedom to live your current lifestyle</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What It Means</h3>
                      <p className="text-gray-300">
                        Financial Independence means you can maintain your current lifestyle indefinitely without working.
                        You've saved enough to cover your current monthly expenses for the rest of your life.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">What It Covers</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• All current expenses at today's lifestyle level</li>
                        <li>• Housing, food, transportation, healthcare</li>
                        <li>• Dining out, entertainment, luxuries</li>
                        <li>• Travel, hobbies, and experiences</li>
                        <li>• Everything you spend money on now</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The Formula</h3>
                      <p className="text-gray-400 text-sm">
                        Target = Annual Independence Expenses ÷ 6% withdrawal rate
                      </p>
                      <p className="text-pink-400 text-sm mt-1">
                        Example: ${Math.round((financialData?.monthlyExpenses?.independence || 0) * 12).toLocaleString()} ÷ 0.06 = ${Math.round((financialData?.monthlyExpenses?.independence || 0) * 12 / 0.06).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The 25x Rule</h3>
                      <p className="text-gray-300 text-sm">
                        At a 4% withdrawal rate (more conservative), you need 25x your annual expenses.
                        At the 6% rate from "Money Master the Game", you need approximately 17x your annual expenses.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">How to Reach It Faster</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Aggressively increase savings rate (aim for 30-50%)</li>
                        <li>• Optimize asset allocation for growth</li>
                        <li>• Minimize lifestyle inflation as income grows</li>
                        <li>• Consider geographic arbitrage (lower cost of living areas)</li>
                        <li>• Develop multiple income streams</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 border-t border-dark-border flex justify-end">
                    <button
                      onClick={() => setInfoModal(null)}
                      className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/planning/scenarios')}
            className="flex-1 bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Compare All Scenarios →
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-primary-teal hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, format, currencySymbol, highlight }: { title: string; value: number; format: 'currency' | 'number'; currencySymbol: string; highlight?: boolean }) {
  return (
    <div className={`bg-dark-surface border rounded-lg p-6 ${highlight ? 'border-primary-teal border-2' : 'border-dark-border'}`}>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${highlight ? 'text-primary-teal' : 'text-white'}`}>
        {format === 'currency' ? formatCurrency(value, currencySymbol) : value.toLocaleString()}
      </p>
    </div>
  );
}

function formatCurrency(value: number, currencySymbol: string): string {
  return currencySymbol + value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

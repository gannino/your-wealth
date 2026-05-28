import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialPlanStore } from '../../stores';
import { useCurrency } from '../../hooks/useCurrency';
import { generateFinancialProjection } from '../../lib/calculations';
import type { ScenarioType, Projection } from '../../lib/calculations';

export default function ScenarioComparison() {
  const navigate = useNavigate();
  const { financialData, customReturnRates } = useFinancialPlanStore();
  const { getSymbol } = useCurrency();
  const currencySymbol = getSymbol();
  const [projections, setProjections] = useState<Record<ScenarioType, Projection[]>>({
    conservative: [],
    current: [],
    aggressive: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!financialData) {
      navigate('/assessments/currency');
      return;
    }

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
          },
          scenario,
          new Date().getFullYear(),
          50,
          customRate
        );
      });

      setProjections(scenarioProjections);
      setLoading(false);
    };

    generateProjections();
  }, [financialData, navigate, customReturnRates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Comparing scenarios...</p>
        </div>
      </div>
    );
  }

  const scenarioColors = {
    conservative: {
      text: 'text-blue-400',
      bg: 'bg-blue-400',
      border: 'border-blue-400',
      bgLight: 'bg-blue-400/10',
    },
    current: {
      text: 'text-green-400',
      bg: 'bg-green-400',
      border: 'border-green-400',
      bgLight: 'bg-green-400/10',
    },
    aggressive: {
      text: 'text-purple-400',
      bg: 'bg-purple-400',
      border: 'border-purple-400',
      bgLight: 'bg-purple-400/10',
    },
  };

  const years = [10, 20, 30];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Scenario Comparison</h1>
          <p className="text-gray-400">
            See how different return rates affect your wealth over time
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(['conservative', 'current', 'aggressive'] as ScenarioType[]).map((scenario) => {
            const colors = scenarioColors[scenario];
            const projection = projections[scenario];
            const returnRate = customReturnRates[scenario];

            return (
              <div key={scenario} className={`border-2 rounded-lg p-6 ${colors.border}`}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold capitalize text-white mb-2">{scenario}</h2>
                  <div className={`inline-block px-4 py-2 rounded-full ${colors.bgLight} ${colors.text} font-semibold`}>
                    {returnRate}% Annual Return
                  </div>
                </div>

                <div className="space-y-4">
                  {years.map((year) => {
                    const data = projection[year - 1];
                    return (
                      <div key={year} className="bg-dark-bg rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">{year} Years</div>
                        <div className={`text-xl font-bold ${colors.text}`}>
                          {formatCurrency(data?.netWorth || 0, currencySymbol)}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Inflation-adjusted to today's purchasing power
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Net Worth Comparison (Inflation-Adjusted)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Year</th>
                  <th className={`text-right py-3 px-4 font-semibold ${scenarioColors.conservative.text}`}>
                    Conservative ({customReturnRates.conservative}%)
                  </th>
                  <th className={`text-right py-3 px-4 font-semibold ${scenarioColors.current.text}`}>
                    Current ({customReturnRates.current}%)
                  </th>
                  <th className={`text-right py-3 px-4 font-semibold ${scenarioColors.aggressive.text}`}>
                    Aggressive ({customReturnRates.aggressive}%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[0, 4, 9, 14, 19, 24, 29, 34, 39, 49].map((index) => {
                  const year = new Date().getFullYear() + index;
                  return (
                    <tr key={year} className="border-b border-dark-border hover:bg-dark-bg">
                      <td className="py-3 px-4 text-white">{year}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${scenarioColors.conservative.text}`}>
                        {formatCurrency(projections.conservative[index]?.netWorthTodayValue || 0, currencySymbol)}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${scenarioColors.current.text}`}>
                        {formatCurrency(projections.current[index]?.netWorthTodayValue || 0, currencySymbol)}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${scenarioColors.aggressive.text}`}>
                        {formatCurrency(projections.aggressive[index]?.netWorthTodayValue || 0, currencySymbol)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights - Specific to User's 27-Question Data */}
        <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-primary-teal mb-4">Key Insights Based on Your Financial Data</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary-teal">→</span>
              <span className="text-gray-300">
                Your monthly Security expenses: {formatCurrency(financialData?.monthlyExpenses?.security || 0, currencySymbol)} ({formatCurrency((financialData?.monthlyExpenses?.security || 0) * 12, currencySymbol)}/year)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-teal">→</span>
              <span className="text-gray-300">
                Your Independence target: {formatCurrency((financialData?.monthlyExpenses?.independence || 0) * 12, currencySymbol)}/year
                {financialData?.monthlyExpenses?.independence && (
                  <span className="text-gray-400 block text-sm mt-1">
                    Target needed at 6% withdrawal: {formatCurrency((financialData.monthlyExpenses.independence * 12) / 0.06, currencySymbol)}
                  </span>
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-teal">→</span>
              <span className="text-gray-300">
                With your current savings rate of {financialData?.savingsRate ? (financialData.savingsRate * 100).toFixed(1) : 0}%, you're saving {formatCurrency((financialData?.annualIncome || 0) * (financialData?.savingsRate || 0), currencySymbol)}/year
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-teal">→</span>
              <span className="text-gray-300">
                A {customReturnRates.aggressive - customReturnRates.conservative}% difference in annual returns could mean{' '}
                {formatCurrency(
                  (projections.aggressive[29]?.netWorth || 0) - (projections.conservative[29]?.netWorth || 0),
                  currencySymbol
                )} difference over 30 years
              </span>
            </li>
          </ul>
        </div>

        {/* Retirement Milestones - Calculated from User's 27 Questions */}
        {financialData?.monthlyExpenses && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">When Will You Reach Financial Freedom?</h2>
            <p className="text-gray-400 mb-6">
              Based on your actual expense data from the 27-question assessment
            </p>

            <div className="space-y-6">
              {(() => {
                const withdrawalRate = 0.06;
                const securityAnnual = financialData.monthlyExpenses.security * 12;
                const independenceAnnual = financialData.monthlyExpenses.independence * 12;

                // Calculate Vitality (Security + half of typical luxuries)
                // For now, use average of Security and Independence
                const vitalityAnnual = (securityAnnual + independenceAnnual) / 2;

                return [
                  {
                    name: 'Security',
                    target: securityAnnual / withdrawalRate,
                    description: `Based on your Security expenses of ${formatCurrency(financialData.monthlyExpenses.security, currencySymbol)}/month`,
                    color: 'text-blue-400',
                  },
                  {
                    name: 'Vitality',
                    target: vitalityAnnual / withdrawalRate,
                    description: `Comfortable lifestyle - ${formatCurrency(securityAnnual, currencySymbol)}/year to ${formatCurrency(vitalityAnnual, currencySymbol)}/year`,
                    color: 'text-green-400',
                  },
                  {
                    name: 'Independence',
                    target: independenceAnnual / withdrawalRate,
                    description: `Your full lifestyle at ${formatCurrency(financialData.monthlyExpenses.independence, currencySymbol)}/month`,
                    color: 'text-purple-400',
                  },
                ];
              })().map((milestone) => (
              <div key={milestone.name} className="bg-dark-bg rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`text-lg font-bold ${milestone.color}`}>{milestone.name} - {formatCurrency(milestone.target, currencySymbol)}</h3>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(['conservative', 'current', 'aggressive'] as ScenarioType[]).map((scenario) => {
                    const scenarioProjection = projections[scenario];
                    const milestoneYear = scenarioProjection?.findIndex((p) => p.netWorth >= milestone.target);

                    let yearDisplay = 'Not reached in 50 years';
                    let amountDisplay = '';

                    if (milestoneYear !== -1 && milestoneYear !== undefined) {
                      const targetYear = new Date().getFullYear() + milestoneYear;
                      yearDisplay = `${targetYear} (${milestoneYear} years)`;
                      amountDisplay = formatCurrency(scenarioProjection[milestoneYear]?.netWorth || 0, currencySymbol);
                    }

                    return (
                      <div key={scenario} className="text-center">
                        <div className="text-sm text-gray-400 capitalize mb-1">{scenario}</div>
                        <div className={`font-bold ${scenarioColors[scenario].text}`}>{yearDisplay}</div>
                        {amountDisplay && (
                          <div className="text-xs text-gray-500 mt-1">{amountDisplay}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/planning/generate')}
            className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-primary-teal hover:text-white transition-colors"
          >
            ← Back to Generator
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number, currencySymbol: string): string {
  return currencySymbol + value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

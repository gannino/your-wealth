import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialPlanStore } from '../../stores';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
];

export default function CurrencySelector() {
  const navigate = useNavigate();
  const { currency, setCurrency, financialData, setUKMode } = useFinancialPlanStore();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  // Redirect if currency and data are already set
  useEffect(() => {
    if (currency && financialData) {
      navigate('/planning/generate', { replace: true });
    } else if (currency && !financialData) {
      // Currency is set but no financial data - could add a skip button, but for now just continue to financial data
      // User can still change currency if they want
    }
  }, [currency, financialData, navigate]);

  const handleSelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    setCurrency(currencyCode);

    // Activate UK mode for GBP currency
    setUKMode(currencyCode === 'GBP');
  };

  const handleContinue = () => {
    // If financial data already exists, go directly to plan generator
    if (financialData) {
      navigate('/planning/generate');
    } else {
      navigate('/assessments/financial-data');
    }
  };

  const handleBack = () => {
    navigate('/assessments/blueprint');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">Select Your Currency</h1>
          <p className="text-gray-400 mb-8">
            Choose your preferred currency for all monetary values in this assessment.
            This ensures all numbers match your expectations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleSelect(curr.code)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCurrency === curr.code
                    ? 'border-primary-teal bg-primary-teal/10'
                    : 'border-dark-border bg-dark-bg hover:border-dark-border'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{curr.flag}</span>
                  <span className="text-2xl font-bold text-white">{curr.symbol}</span>
                </div>
                <div className="text-sm font-semibold text-white">{curr.code}</div>
                <div className="text-xs text-gray-400">{curr.name}</div>
              </button>
            ))}
          </div>

          <div className="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-purple mb-3">💡 Why This Matters</h3>
            <p className="text-gray-300 leading-relaxed">
              All calculations use your selected currency. This makes it easier to understand
              your financial picture without doing mental conversions. You can change this
              setting later from your profile.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Continue with {CURRENCIES.find(c => c.code === selectedCurrency)?.symbol} →
          </button>
        </div>
      </div>
    </div>
  );
}

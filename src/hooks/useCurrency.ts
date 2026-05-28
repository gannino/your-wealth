import { useFinancialPlanStore } from '../stores';
import { formatCurrency as formatCurrencyUtil } from '../lib/currency';

export function useCurrency() {
  const { currency } = useFinancialPlanStore();

  const formatCurrency = (
    amount: number,
    options: {
      decimals?: number;
      showSymbol?: boolean;
      compact?: boolean;
    } = {}
  ): string => {
    return formatCurrencyUtil(amount, currency, options);
  };

  const getSymbol = (): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      CHF: 'Fr',
      CNY: '¥',
      INR: '₹',
      BRL: 'R$',
      MXN: '$',
      SGD: 'S$',
    };
    return symbols[currency] || '$';
  };

  return {
    currency,
    formatCurrency,
    getSymbol,
  };
}

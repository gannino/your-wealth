const CURRENCY_SYMBOLS: Record<string, string> = {
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

const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CAD: 'en-CA',
  AUD: 'en-AU',
  CHF: 'de-CH',
  CNY: 'zh-CN',
  INR: 'en-IN',
  BRL: 'pt-BR',
  MXN: 'es-MX',
  SGD: 'en-SG',
};

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  options: {
    decimals?: number;
    showSymbol?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    decimals = 0,
    showSymbol = true,
    compact = false
  } = options;

  try {
    const locale = CURRENCY_LOCALES[currency] || 'en-US';

    if (compact) {
      // Compact format: $1.2M, $450K, etc.
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(amount);
    }

    if (showSymbol) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(amount);
    }

    // No symbol, just format the number
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    // Fallback to simple formatting
    const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] || '$' : '';
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  }
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || '$';
}

export function getAllCurrencies() {
  return Object.keys(CURRENCY_SYMBOLS).map(code => ({
    code,
    symbol: CURRENCY_SYMBOLS[code],
    locale: CURRENCY_LOCALES[code],
  }));
}

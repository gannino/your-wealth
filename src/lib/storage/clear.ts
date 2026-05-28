/**
 * Clear all Your Wealth data from localStorage
 * Use this to reset the app state if there are persistence issues
 */
export function clearAllStorage(): void {
  const keys = Object.keys(localStorage);
  const wealthMasteryKeys = keys.filter((key) => key.startsWith('your-wealth-'));

  wealthMasteryKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Get storage keys for debugging
 */
export function getStorageKeys(): string[] {
  const keys = Object.keys(localStorage);
  return keys.filter((key) => key.startsWith('your-wealth-'));
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  const keys = getStorageKeys();

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      total += key.length + value.length;
    }
  });

  return total;
}

/**
 * Check if storage has data
 */
export function hasStoredData(): boolean {
  return getStorageKeys().length > 0;
}

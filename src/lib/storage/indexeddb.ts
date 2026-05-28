import Dexie from 'dexie';

const DB_NAME = 'wealthMasteryDB';

export interface StorageItem {
  key: string;
  value: unknown;
  timestamp: number;
}

class WealthMasteryDB extends Dexie {
  storage!: Dexie.Table<StorageItem, string>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      storage: 'key, timestamp',
    });
  }
}

export const db = new WealthMasteryDB();

// IndexedDB storage adapter for Zustand persist
export const indexedDBStorage = () => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      const item = await db.storage.get(name);
      return item ? JSON.stringify(item.value) : null;
    } catch (error) {
      console.error(`IndexedDB get error for ${name}:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await db.storage.put({
        key: name,
        value: JSON.parse(value),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`IndexedDB set error for ${name}:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await db.storage.delete(name);
    } catch (error) {
      console.error(`IndexedDB remove error for ${name}:`, error);
    }
  },
});

// Migration utility to move data from localStorage to IndexedDB
export async function migrateFromLocalStorage() {
  const storeKeys = [
    'your-wealth-user',
    'your-wealth-psychology',
    'your-wealth-assessments',
  ];

  for (const key of storeKeys) {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue) {
      try {
        const value = JSON.parse(localStorageValue);
        await db.storage.put({
          key,
          value,
          timestamp: Date.now(),
        });
        console.log(`✅ Migrated ${key} to IndexedDB`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${key}:`, error);
      }
    }
  }
}

// Utility to clear all Your Wealth data
export async function clearAllData() {
  await db.storage.clear();
  localStorage.clear();
  console.log('🗑️ All Your Wealth data cleared');
}

// Initialize database and migrate if needed
export async function initializeDB() {
  try {
    await db.open();

    // Check if we need to migrate from localStorage
    const hasLocalStorageData = localStorage.getItem('your-wealth-assessments') ||
                                   localStorage.getItem('your-wealth-psychology') ||
                                   localStorage.getItem('your-wealth-user');

    if (hasLocalStorageData) {
      console.log('🔄 Migrating data from localStorage to IndexedDB...');
      await migrateFromLocalStorage();
      console.log('✅ Migration complete');
    }
  } catch (error) {
    console.error('❌ Failed to initialize IndexedDB:', error);
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    try {
      const serialized =
        typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

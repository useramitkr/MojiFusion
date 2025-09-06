// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving data:", e);
  }
}

export async function loadData<T>(key: string, fallback: T): Promise<T> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error("Error loading data:", e);
    return fallback;
  }
}

export async function removeData(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing data:", e);
  }
}

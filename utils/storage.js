import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@welder_bid_tracker_jobs_v1';

export async function loadJobs() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load jobs', e);
    return [];
  }
}

export async function saveJobs(jobs) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.warn('Failed to save jobs', e);
    throw e;
  }
}

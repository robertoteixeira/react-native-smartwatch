import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import type {WatchIdentity} from '../models/WatchIdentity';

const storage = createAsyncStorage('smartwatch');
const PAIRED_WATCH_KEY = 'paired-watch';

export type RememberedWatch = WatchIdentity;

function isRememberedWatch(value: unknown): value is RememberedWatch {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

export async function saveRememberedWatch(
  watch: RememberedWatch,
): Promise<void> {
  await storage.setItem(PAIRED_WATCH_KEY, JSON.stringify(watch));
}

export async function loadRememberedWatch(): Promise<RememberedWatch | null> {
  const storedWatch = await storage.getItem(PAIRED_WATCH_KEY);

  if (storedWatch === null) {
    return null;
  }

  try {
    const parsedWatch: unknown = JSON.parse(storedWatch);
    return isRememberedWatch(parsedWatch) ? parsedWatch : null;
  } catch {
    return null;
  }
}

export async function removeRememberedWatch(): Promise<void> {
  await storage.removeItem(PAIRED_WATCH_KEY);
}

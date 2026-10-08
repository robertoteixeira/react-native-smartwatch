import {useEffect, useState} from 'react';
import {
  loadRememberedWatch,
  removeRememberedWatch,
  saveRememberedWatch,
  type RememberedWatch,
} from './pairedWatchStorage';

type RememberedWatchState = {
  rememberedWatch: RememberedWatch | null;
  isLoadingRememberedWatch: boolean;
  rememberWatch: (watch: RememberedWatch) => Promise<void>;
  forgetRememberedWatch: () => Promise<void>;
};

export function useRememberedWatch(): RememberedWatchState {
  const [rememberedWatch, setRememberedWatch] =
    useState<RememberedWatch | null>(null);
  const [isLoadingRememberedWatch, setIsLoadingRememberedWatch] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadWatch() {
      try {
        const storedWatch = await loadRememberedWatch();

        if (!isCancelled) {
          setRememberedWatch(storedWatch);
        }
      } catch (error) {
        console.warn('Unable to load remembered watch:', error);
      } finally {
        if (!isCancelled) {
          setIsLoadingRememberedWatch(false);
        }
      }
    }

    loadWatch();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function rememberWatch(watch: RememberedWatch): Promise<void> {
    await saveRememberedWatch(watch);
    setRememberedWatch(watch);
  }

  async function forgetRememberedWatch(): Promise<void> {
    await removeRememberedWatch();
    setRememberedWatch(null);
  }

  return {
    rememberedWatch,
    isLoadingRememberedWatch,
    rememberWatch,
    forgetRememberedWatch,
  };
}

import {useEffect, useState} from 'react';
import {loadRememberedWatch, type RememberedWatch} from './pairedWatchStorage';

type RememberedWatchState = {
  rememberedWatch: RememberedWatch | null;
  isLoadingRememberedWatch: boolean;
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

  return {
    rememberedWatch,
    isLoadingRememberedWatch,
  };
}

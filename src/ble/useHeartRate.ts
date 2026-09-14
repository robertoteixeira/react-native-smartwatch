import {useEffect, useState} from 'react';
import {monitorHeartRate} from './monitorHeartRate';

export function useHeartRate(deviceId: string | null): number | null {
  const [heartRate, setHeartRate] = useState<number | null>(null);

  useEffect(() => {
    setHeartRate(null);

    if (!deviceId) {
      return;
    }

    const subscription = monitorHeartRate(
      deviceId,
      newHeartRate => {
        setHeartRate(newHeartRate);
      },
      error => {
        console.warn('Heart-rate monitoring failed:', error);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [deviceId]);

  return heartRate;
}

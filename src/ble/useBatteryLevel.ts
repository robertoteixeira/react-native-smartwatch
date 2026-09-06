import {useEffect, useState} from 'react';
import {monitorBatteryLevel} from './monitorBatteryLevel';

export function useBatteryLevel(
  deviceId: string | null,
  initialBatteryLevel: number | null,
): number | null {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(
    initialBatteryLevel,
  );

  useEffect(() => {
    setBatteryLevel(initialBatteryLevel);

    if (!deviceId) {
      return;
    }

    const subscription = monitorBatteryLevel(
      deviceId,
      newBatteryLevel => {
        setBatteryLevel(newBatteryLevel);
      },
      error => {
        console.warn('Battery monitoring failed:', error);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [deviceId, initialBatteryLevel]);

  return batteryLevel;
}

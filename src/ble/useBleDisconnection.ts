import {useEffect, useRef} from 'react';
import type {BleError} from '@sfourdrinier/react-native-ble-plx';
import {monitorBleDisconnection} from './monitorBleDisconnection';

export function useBleDisconnection(
  deviceId: string | null,
  onDisconnected: (error: BleError | null) => void,
): void {
  const onDisconnectedRef = useRef(onDisconnected);

  useEffect(() => {
    onDisconnectedRef.current = onDisconnected;
  }, [onDisconnected]);

  useEffect(() => {
    if (!deviceId) {
      return;
    }

    const subscription = monitorBleDisconnection(deviceId, error => {
      onDisconnectedRef.current(error);
    });

    return () => {
      subscription.remove();
    };
  }, [deviceId]);
}

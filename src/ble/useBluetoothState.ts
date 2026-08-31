import {useEffect, useState} from 'react';
import {BleManager} from '@sfourdrinier/react-native-ble-plx';

export type BluetoothState =
  | 'Unknown'
  | 'Resetting'
  | 'Unsupported'
  | 'Unauthorized'
  | 'PoweredOff'
  | 'PoweredOn';

let bleManager: BleManager | null = null;

function getBleManager(): BleManager {
  if (!bleManager) {
    bleManager = new BleManager();
  }

  return bleManager;
}

export function useBluetoothState(isActive: boolean): BluetoothState {
  const [bluetoothState, setBluetoothState] =
    useState<BluetoothState>('Unknown');

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const manager = getBleManager();

    const subscription = manager.onStateChange(newState => {
      setBluetoothState(newState);
    }, true);

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  return bluetoothState;
}

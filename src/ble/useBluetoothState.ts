import {useEffect, useState} from 'react';
import {bleManager} from './bleManager';

export type BluetoothState =
  | 'Unknown'
  | 'Resetting'
  | 'Unsupported'
  | 'Unauthorized'
  | 'PoweredOff'
  | 'PoweredOn';

export function useBluetoothState(isActive: boolean): BluetoothState {
  const [bluetoothState, setBluetoothState] =
    useState<BluetoothState>('Unknown');

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const subscription = bleManager.onStateChange(newState => {
      setBluetoothState(newState);
    }, true);

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  return bluetoothState;
}
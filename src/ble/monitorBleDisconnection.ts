import type {
  BleError,
  Subscription,
} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';

export function monitorBleDisconnection(
  deviceId: string,
  onDisconnected: (error: BleError | null) => void,
): Subscription {
  return bleManager.onDeviceDisconnected(deviceId, error => {
    onDisconnected(error);
  });
}
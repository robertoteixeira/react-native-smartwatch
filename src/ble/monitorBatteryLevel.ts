import type {BleError, Subscription} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';
import {
  BATTERY_LEVEL_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
  decodeBatteryLevel,
} from './batteryLevel';

export function monitorBatteryLevel(
  deviceId: string,
  onBatteryLevel: (batteryLevel: number) => void,
  onError: (error: BleError | Error) => void,
): Subscription {
  return bleManager.monitorCharacteristicForDevice(
    deviceId,
    BATTERY_SERVICE_UUID,
    BATTERY_LEVEL_CHARACTERISTIC_UUID,
    (error, characteristic) => {
      if (error) {
        onError(error);
        return;
      }

      try {
        onBatteryLevel(decodeBatteryLevel(characteristic?.value ?? null));
      } catch (decodeError) {
        onError(
          decodeError instanceof Error
            ? decodeError
            : new Error('Unable to decode battery level.'),
        );
      }
    },
  );
}

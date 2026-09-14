import type {BleError, Subscription} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';
import {
  HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID,
  HEART_RATE_SERVICE_UUID,
  decodeHeartRateMeasurement,
} from './heartRate';

export function monitorHeartRate(
  deviceId: string,
  onHeartRate: (heartRate: number) => void,
  onError: (error: BleError | Error) => void,
): Subscription {
  return bleManager.monitorCharacteristicForDevice(
    deviceId,
    HEART_RATE_SERVICE_UUID,
    HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID,
    (error, characteristic) => {
      if (error) {
        onError(error);
        return;
      }

      try {
        const heartRate = decodeHeartRateMeasurement(
          characteristic?.value ?? null,
        );

        onHeartRate(heartRate);
      } catch (decodeError) {
        onError(
          decodeError instanceof Error
            ? decodeError
            : new Error('Unable to decode heart rate.'),
        );
      }
    },
  );
}

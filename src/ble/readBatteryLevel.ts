import {bleManager} from './bleManager';
import {
  BATTERY_LEVEL_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
  decodeBatteryLevel,
} from './batteryLevel';

export async function readBatteryLevel(deviceId: string): Promise<number> {
  const characteristic = await bleManager.readCharacteristicForDevice(
    deviceId,
    BATTERY_SERVICE_UUID,
    BATTERY_LEVEL_CHARACTERISTIC_UUID,
  );

  return decodeBatteryLevel(characteristic.value);
}

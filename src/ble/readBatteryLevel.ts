import {bleManager} from './bleManager';

export const BATTERY_SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb';

export const BATTERY_LEVEL_CHARACTERISTIC_UUID =
  '00002a19-0000-1000-8000-00805f9b34fb';

export function decodeBatteryLevel(value: string | null): number {
  if (!value) {
    throw new Error('The watch returned no battery value.');
  }

  const batteryLevel = atob(value).charCodeAt(0);

  if (batteryLevel < 0 || batteryLevel > 100) {
    throw new Error(`Invalid battery level: ${batteryLevel}`);
  }

  return batteryLevel;
}

export async function readBatteryLevel(deviceId: string): Promise<number> {
  const characteristic = await bleManager.readCharacteristicForDevice(
    deviceId,
    BATTERY_SERVICE_UUID,
    BATTERY_LEVEL_CHARACTERISTIC_UUID,
  );

  return decodeBatteryLevel(characteristic.value);
}

import {bleManager} from './bleManager';

const BATTERY_SERVICE_UUID =
  '0000180f-0000-1000-8000-00805f9b34fb';

const BATTERY_LEVEL_CHARACTERISTIC_UUID =
  '00002a19-0000-1000-8000-00805f9b34fb';

export async function readBatteryLevel(
  deviceId: string,
): Promise<number> {
  const characteristic =
    await bleManager.readCharacteristicForDevice(
      deviceId,
      BATTERY_SERVICE_UUID,
      BATTERY_LEVEL_CHARACTERISTIC_UUID,
    );

  if (!characteristic.value) {
    throw new Error('The watch returned no battery value.');
  }

  const decodedValue = atob(characteristic.value);
  const batteryLevel = decodedValue.charCodeAt(0);

  if (batteryLevel < 0 || batteryLevel > 100) {
    throw new Error(`Invalid battery level: ${batteryLevel}`);
  }

  return batteryLevel;
}
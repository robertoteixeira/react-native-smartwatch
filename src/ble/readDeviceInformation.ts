import {bleManager} from './bleManager';

const DEVICE_INFORMATION_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb';

const SERIAL_NUMBER_CHARACTERISTIC_UUID =
  '00002a25-0000-1000-8000-00805f9b34fb';

const HARDWARE_REVISION_CHARACTERISTIC_UUID =
  '00002a27-0000-1000-8000-00805f9b34fb';

const SOFTWARE_REVISION_CHARACTERISTIC_UUID =
  '00002a28-0000-1000-8000-00805f9b34fb';

const MANUFACTURER_NAME_CHARACTERISTIC_UUID =
  '00002a29-0000-1000-8000-00805f9b34fb';

export type DeviceInformation = {
  serialNumber: string;
  hardwareRevision: string;
  softwareRevision: string;
  manufacturerName: string;
};

async function readTextCharacteristic(
  deviceId: string,
  characteristicUuid: string,
): Promise<string> {
  const characteristic = await bleManager.readCharacteristicForDevice(
    deviceId,
    DEVICE_INFORMATION_SERVICE_UUID,
    characteristicUuid,
  );

  if (!characteristic.value) {
    throw new Error(`Characteristic ${characteristicUuid} returned no value.`);
  }

  return atob(characteristic.value).replace(/\0+$/u, '');
}

export async function readDeviceInformation(
  deviceId: string,
): Promise<DeviceInformation> {
  const [serialNumber, hardwareRevision, softwareRevision, manufacturerName] =
    await Promise.all([
      readTextCharacteristic(deviceId, SERIAL_NUMBER_CHARACTERISTIC_UUID),
      readTextCharacteristic(deviceId, HARDWARE_REVISION_CHARACTERISTIC_UUID),
      readTextCharacteristic(deviceId, SOFTWARE_REVISION_CHARACTERISTIC_UUID),
      readTextCharacteristic(deviceId, MANUFACTURER_NAME_CHARACTERISTIC_UUID),
    ]);

  return {
    serialNumber,
    hardwareRevision,
    softwareRevision,
    manufacturerName,
  };
}

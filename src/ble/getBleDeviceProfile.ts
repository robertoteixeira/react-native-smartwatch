import type {Device} from '@sfourdrinier/react-native-ble-plx';

export type BleCharacteristicProfile = {
  uuid: string;
  isReadable: boolean;
  isWritable: boolean;
  isNotifiable: boolean;
};

export type BleServiceProfile = {
  uuid: string;
  characteristics: readonly BleCharacteristicProfile[];
};

export async function getBleDeviceProfile(
  device: Device,
): Promise<readonly BleServiceProfile[]> {
  const services = await device.services();

  return Promise.all(
    services.map(async service => {
      const characteristics = await service.characteristics();

      return {
        uuid: service.uuid,
        characteristics: characteristics.map(characteristic => ({
          uuid: characteristic.uuid,
          isReadable: characteristic.isReadable,
          isWritable:
            characteristic.isWritableWithResponse ||
            characteristic.isWritableWithoutResponse,
          isNotifiable:
            characteristic.isNotifiable || characteristic.isIndicatable,
        })),
      };
    }),
  );
}
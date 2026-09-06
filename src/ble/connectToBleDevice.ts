import type {Device} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';

export async function connectToBleDevice(deviceId: string): Promise<Device> {
  bleManager.stopDeviceScan();

  const connectedDevice = await bleManager.connectToDevice(deviceId);

  return connectedDevice.discoverAllServicesAndCharacteristics();
}

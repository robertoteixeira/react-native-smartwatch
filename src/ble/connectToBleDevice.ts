import type {Device} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';

const CONNECTION_TIMEOUT_MS = 15_000;

export async function connectToBleDevice(deviceId: string): Promise<Device> {
  bleManager.stopDeviceScan();

  try {
    const connectedDevice = await bleManager.connectToDevice(deviceId, {
      timeout: CONNECTION_TIMEOUT_MS,
    });

    return await connectedDevice.discoverAllServicesAndCharacteristics();
  } catch (connectionError) {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
    } catch (cleanupError) {
      console.warn('Unable to clean up failed BLE connection:', cleanupError);
    }

    throw connectionError;
  }
}

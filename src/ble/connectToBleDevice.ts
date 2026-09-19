import type {Device} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';

const CONNECTION_TIMEOUT_MS = 15_000;
const SERVICE_DISCOVERY_TIMEOUT_MS = 10_000;

function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    operation.then(
      result => {
        clearTimeout(timer);
        resolve(result);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function connectToBleDevice(deviceId: string): Promise<Device> {
  bleManager.stopDeviceScan();

  try {
    const connectedDevice = await bleManager.connectToDevice(deviceId, {
      timeout: CONNECTION_TIMEOUT_MS,
    });

    return await withTimeout(
      connectedDevice.discoverAllServicesAndCharacteristics(),
      SERVICE_DISCOVERY_TIMEOUT_MS,
      'Bluetooth service discovery timed out.',
    );
  } catch (connectionError) {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
    } catch (cleanupError) {
      console.warn('Unable to clean up failed BLE connection:', cleanupError);
    }

    throw connectionError;
  }
}

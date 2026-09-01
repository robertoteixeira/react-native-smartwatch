import {bleManager} from './bleManager';

export async function disconnectFromBleDevice(deviceId: string): Promise<void> {
  const isConnected = await bleManager.isDeviceConnected(deviceId);

  if (!isConnected) {
    return;
  }

  await bleManager.cancelDeviceConnection(deviceId);
}

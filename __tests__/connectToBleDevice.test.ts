import type {Device} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from '../src/ble/bleManager';
import {connectToBleDevice} from '../src/ble/connectToBleDevice';

jest.mock('../src/ble/bleManager', () => ({
  bleManager: {
    stopDeviceScan: jest.fn(),
    connectToDevice: jest.fn(),
    cancelDeviceConnection: jest.fn(),
  },
}));

const mockConnect = jest.mocked(bleManager.connectToDevice);
const mockCancel = jest.mocked(bleManager.cancelDeviceConnection);

describe('connectToBleDevice', () => {
  const discover = jest.fn();

  const connectedDevice = {
    discoverAllServicesAndCharacteristics: discover,
  } as Device;

  const discoveredDevice = {id: 'watch-1'} as Device;

  beforeEach(() => {
    jest.resetAllMocks();

    mockConnect.mockResolvedValue(connectedDevice);
    mockCancel.mockResolvedValue(connectedDevice);
    discover.mockResolvedValue(discoveredDevice);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stops scanning, connects with a timeout, and discovers services', async () => {
    const result = await connectToBleDevice('watch-1');

    expect(bleManager.stopDeviceScan).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith('watch-1', {
      timeout: 15_000,
    });
    expect(discover).toHaveBeenCalledTimes(1);
    expect(result).toBe(discoveredDevice);
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it('cleans up when connection fails', async () => {
    const error = new Error('Connection failed');

    mockConnect.mockRejectedValue(error);

    await expect(connectToBleDevice('watch-1')).rejects.toBe(error);

    expect(mockCancel).toHaveBeenCalledWith('watch-1');
    expect(discover).not.toHaveBeenCalled();
  });

  it('cleans up when service discovery fails', async () => {
    const error = new Error('Discovery failed');

    discover.mockRejectedValue(error);

    await expect(connectToBleDevice('watch-1')).rejects.toBe(error);

    expect(mockCancel).toHaveBeenCalledWith('watch-1');
  });

  it('preserves the original error when cleanup also fails', async () => {
    const connectionError = new Error('Connection failed');
    const cleanupError = new Error('Cleanup failed');
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    mockConnect.mockRejectedValue(connectionError);
    mockCancel.mockRejectedValue(cleanupError);

    await expect(connectToBleDevice('watch-1')).rejects.toBe(connectionError);

    expect(warn).toHaveBeenCalledWith(
      'Unable to clean up failed BLE connection:',
      cleanupError,
    );
  });
});

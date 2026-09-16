import type {
  BleError,
  Characteristic,
} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from '../src/ble/bleManager';
import {
  BATTERY_LEVEL_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
} from '../src/ble/batteryLevel';
import {monitorBatteryLevel} from '../src/ble/monitorBatteryLevel';

jest.mock('../src/ble/bleManager', () => ({
  bleManager: {
    monitorCharacteristicForDevice: jest.fn(),
  },
}));

const nativeMonitor = jest.mocked(bleManager.monitorCharacteristicForDevice);

describe('monitorBatteryLevel', () => {
  const subscription = {remove: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
    nativeMonitor.mockReturnValue(subscription);
  });

  it('subscribes to the battery characteristic', () => {
    const result = monitorBatteryLevel('watch-1', jest.fn(), jest.fn());

    expect(nativeMonitor).toHaveBeenCalledWith(
      'watch-1',
      BATTERY_SERVICE_UUID,
      BATTERY_LEVEL_CHARACTERISTIC_UUID,
      expect.any(Function),
    );

    expect(result).toBe(subscription);
  });

  it('forwards a decoded battery notification', () => {
    const onBatteryLevel = jest.fn();
    const onError = jest.fn();

    monitorBatteryLevel('watch-1', onBatteryLevel, onError);

    const listener = nativeMonitor.mock.calls[0][3];

    listener(null, {value: 'Sw=='} as Characteristic);

    expect(onBatteryLevel).toHaveBeenCalledWith(75);
    expect(onError).not.toHaveBeenCalled();
  });

  it('forwards native BLE errors', () => {
    const onBatteryLevel = jest.fn();
    const onError = jest.fn();
    const error = {message: 'Connection lost'} as BleError;

    monitorBatteryLevel('watch-1', onBatteryLevel, onError);

    const listener = nativeMonitor.mock.calls[0][3];

    listener(error, null);

    expect(onError).toHaveBeenCalledWith(error);
    expect(onBatteryLevel).not.toHaveBeenCalled();
  });

  it('forwards decoding errors', () => {
    const onBatteryLevel = jest.fn();
    const onError = jest.fn();

    monitorBatteryLevel('watch-1', onBatteryLevel, onError);

    const listener = nativeMonitor.mock.calls[0][3];

    listener(null, {value: 'ZQ=='} as Characteristic);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onBatteryLevel).not.toHaveBeenCalled();
  });
});

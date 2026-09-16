import type {
  BleError,
  Characteristic,
} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from '../src/ble/bleManager';
import {
  HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID,
  HEART_RATE_SERVICE_UUID,
} from '../src/ble/heartRate';
import {monitorHeartRate} from '../src/ble/monitorHeartRate';

jest.mock('../src/ble/bleManager', () => ({
  bleManager: {
    monitorCharacteristicForDevice: jest.fn(),
  },
}));

const nativeMonitor = jest.mocked(bleManager.monitorCharacteristicForDevice);

describe('monitorHeartRate', () => {
  const subscription = {remove: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
    nativeMonitor.mockReturnValue(subscription);
  });

  it('subscribes to the heart-rate characteristic', () => {
    const result = monitorHeartRate('watch-1', jest.fn(), jest.fn());

    expect(nativeMonitor).toHaveBeenCalledWith(
      'watch-1',
      HEART_RATE_SERVICE_UUID,
      HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID,
      expect.any(Function),
    );

    expect(result).toBe(subscription);
  });

  it('forwards a decoded heart-rate notification', () => {
    const onHeartRate = jest.fn();
    const onError = jest.fn();

    monitorHeartRate('watch-1', onHeartRate, onError);

    const listener = nativeMonitor.mock.calls[0][3];

    listener(null, {value: 'AEg='} as Characteristic);

    expect(onHeartRate).toHaveBeenCalledWith(72);
    expect(onError).not.toHaveBeenCalled();
  });

  it('forwards native BLE errors', () => {
    const onHeartRate = jest.fn();
    const onError = jest.fn();
    const error = {message: 'Connection lost'} as BleError;

    monitorHeartRate('watch-1', onHeartRate, onError);

    const listener = nativeMonitor.mock.calls[0][3];

    listener(error, null);

    expect(onError).toHaveBeenCalledWith(error);
    expect(onHeartRate).not.toHaveBeenCalled();
  });

  it('forwards decoding errors', () => {
    const onHeartRate = jest.fn();
    const onError = jest.fn();

    monitorHeartRate('watch-1', onHeartRate, onError);

    const listener = nativeMonitor.mock.calls[0][3];

    listener(null, {value: 'AQ=='} as Characteristic);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onHeartRate).not.toHaveBeenCalled();
  });
});

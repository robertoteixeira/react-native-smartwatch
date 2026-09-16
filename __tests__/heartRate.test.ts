import {decodeHeartRateMeasurement} from '../src/ble/heartRate';

describe('decodeHeartRateMeasurement', () => {
  it('decodes an 8-bit heart rate', () => {
    expect(decodeHeartRateMeasurement('AEg=')).toBe(72);
  });

  it('decodes a little-endian 16-bit heart rate', () => {
    expect(decodeHeartRateMeasurement('ASwB')).toBe(300);
  });

  it('rejects a missing value', () => {
    expect(() => decodeHeartRateMeasurement(null)).toThrow();
  });

  it('rejects a truncated measurement', () => {
    expect(() => decodeHeartRateMeasurement('AQ==')).toThrow();
  });

  it('rejects a zero measurement', () => {
    expect(() => decodeHeartRateMeasurement('AAA=')).toThrow();
  });
});

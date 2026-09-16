import {decodeBatteryLevel} from '../src/ble/batteryLevel';

describe('decodeBatteryLevel', () => {
  it.each([
    {encoded: 'AA==', expected: 0},
    {encoded: 'Sw==', expected: 75},
    {encoded: 'ZA==', expected: 100},
  ])('decodes $expected percent', ({encoded, expected}) => {
    expect(decodeBatteryLevel(encoded)).toBe(expected);
  });

  it('rejects a missing value', () => {
    expect(() => decodeBatteryLevel(null)).toThrow();
  });

  it('rejects an empty value', () => {
    expect(() => decodeBatteryLevel('')).toThrow();
  });

  it('rejects percentages above 100', () => {
    expect(() => decodeBatteryLevel('ZQ==')).toThrow();
  });

  it('rejects packets containing multiple bytes', () => {
    expect(() => decodeBatteryLevel('SwA=')).toThrow();
  });
});

export const HEART_RATE_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';

export const HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID =
  '00002a37-0000-1000-8000-00805f9b34fb';

export function decodeHeartRateMeasurement(value: string | null): number {
  if (!value) {
    throw new Error('The watch returned no heart-rate value.');
  }

  const decodedValue = atob(value);
  const flags = decodedValue.charCodeAt(0);
  const usesSixteenBitValue = flags % 2 === 1;

  const lowByte = decodedValue.charCodeAt(1);
  const highByte = decodedValue.charCodeAt(2);

  const heartRate = usesSixteenBitValue ? lowByte + highByte * 256 : lowByte;

  if (!Number.isFinite(heartRate) || heartRate <= 0) {
    throw new Error(`Invalid heart rate: ${heartRate}`);
  }

  return heartRate;
}

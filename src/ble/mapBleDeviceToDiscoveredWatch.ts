import type {Device} from '@sfourdrinier/react-native-ble-plx';
import type {DiscoveredWatch} from '../models/DiscoveredWatch';

function getSignalStrength(
  rssi: number | null,
): DiscoveredWatch['signalStrength'] {
  if (rssi === null || rssi < -80) {
    return 'weak';
  }

  if (rssi >= -60) {
    return 'strong';
  }

  return 'medium';
}

export function mapBleDeviceToDiscoveredWatch(device: Device): DiscoveredWatch {
  return {
    id: device.id,
    name: device.name ?? device.localName ?? 'Unknown device',
    signalStrength: getSignalStrength(device.rssi),
  };
}

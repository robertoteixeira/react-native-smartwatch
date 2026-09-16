import type {DeviceInformation} from '../ble/readDeviceInformation';
import type {DiscoveredWatch} from './DiscoveredWatch';

export type ConnectedWatch = DiscoveredWatch & {
  batteryLevel: number | null;
  deviceInformation: DeviceInformation | null;
};

import type {DeviceInformation} from '../ble/readDeviceInformation';
import type {WatchIdentity} from './WatchIdentity';

export type ConnectedWatch = WatchIdentity & {
  batteryLevel: number | null;
  deviceInformation: DeviceInformation | null;
};

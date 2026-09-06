import type {DiscoveredWatch} from './DiscoveredWatch';

export type ConnectedWatch = DiscoveredWatch & {
  batteryLevel: number | null;
};

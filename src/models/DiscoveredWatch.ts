import type {WatchIdentity} from './WatchIdentity';

export type DiscoveredWatch = WatchIdentity & {
  signalStrength: 'strong' | 'medium' | 'weak';
};

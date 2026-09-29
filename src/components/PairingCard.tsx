import {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import type {DiscoveredWatch} from '../models/DiscoveredWatch';

type PairingCardProps = {
  watches: readonly DiscoveredWatch[];
  isScanning: boolean;
  scanError: string | null;
  hasCompletedScan: boolean;
  isConnecting: boolean;
  isPreparingToPair: boolean;
  selectedWatchId: string | null;
  onSelectWatch: (watchId: string) => void;
  onConfirmSelection: () => void;
  onTogglePairing: () => void;
  onRetryScan: () => void;
};

export function PairingCard({
  watches,
  isScanning,
  scanError,
  hasCompletedScan,
  isConnecting,
  isPreparingToPair,
  selectedWatchId,
  onSelectWatch,
  onConfirmSelection,
  onTogglePairing,
  onRetryScan,
}: PairingCardProps) {
  const [hideUnknownDevices, setHideUnknownDevices] = useState(false);
  const visibleWatches = hideUnknownDevices
    ? watches.filter(
        watch =>
          watch.name.trim() !== '' &&
          watch.name.trim().toLowerCase() !== 'unknown device',
      )
    : watches;
  const canConnect =
    selectedWatchId !== null &&
    visibleWatches.some(watch => watch.id === selectedWatchId) &&
    !isConnecting;

  return (
    <View style={styles.emptyCard}>
      <View style={styles.watchPlaceholder}>
        <View style={styles.watchScreen} />
      </View>
      <Text style={styles.cardTitle}>
        {isPreparingToPair ? 'Ready to scan' : 'No watch connected'}
      </Text>
      <Text style={styles.cardDescription}>
        {isPreparingToPair
          ? 'Choose the watch you want to connect.'
          : 'Pair a compatible smartwatch to get started.'}
      </Text>

      {isPreparingToPair && (
        <View style={styles.deviceList}>
          <Text style={styles.deviceListTitle}>
            Nearby watches ({visibleWatches.length})
          </Text>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Hide unknown devices</Text>
            <Switch
              accessibilityLabel="Hide unknown Bluetooth devices"
              value={hideUnknownDevices}
              onValueChange={setHideUnknownDevices}
              trackColor={{false: '#CBD3DD', true: '#9FC4F8'}}
              thumbColor={hideUnknownDevices ? '#1769E0' : '#FFFFFF'}
            />
          </View>
          {isScanning && (
            <View style={styles.scanningRow}>
              <ActivityIndicator color="#1769E0" />

              <Text style={styles.scanningText}>
                Scanning for compatible watches…
              </Text>
            </View>
          )}
          {scanError && (
            <Text
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              style={styles.scanError}
            >
              {scanError}
            </Text>
          )}
          {hasCompletedScan && !scanError && visibleWatches.length === 0 && (
            <Text style={styles.emptyScanText}>
              {hideUnknownDevices && watches.length > 0
                ? 'No named devices found. Show unknown devices or scan again.'
                : 'No watches found. Move your watch closer and try again.'}
            </Text>
          )}
          {!isScanning && (hasCompletedScan || scanError !== null) && (
            <Pressable
              accessibilityRole="button"
              onPress={onRetryScan}
              style={({pressed}) => [
                styles.retryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.retryButtonText}>Scan again</Text>
            </Pressable>
          )}
          <ScrollView
            style={styles.deviceScroll}
            contentContainerStyle={styles.deviceScrollContent}
            showsVerticalScrollIndicator
            nestedScrollEnabled
          >
            {visibleWatches.map(watch => {
              const isSelected = watch.id === selectedWatchId;
              return (
                <Pressable
                  key={watch.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${watch.name}`}
                  accessibilityState={{selected: isSelected}}
                  onPress={() => onSelectWatch(watch.id)}
                  style={({pressed}) => [
                    styles.deviceRow,
                    isSelected && styles.deviceRowSelected,
                    pressed && styles.deviceRowPressed,
                  ]}
                >
                  <View>
                    <Text style={styles.deviceName}>{watch.name}</Text>
                    <Text style={styles.deviceSignal}>
                      {watch.signalStrength} signal
                    </Text>
                  </View>
                  <Text style={styles.deviceAction}>
                    {isSelected ? 'Selected' : 'Select'}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {isPreparingToPair && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{disabled: !canConnect}}
          disabled={!canConnect}
          onPress={onConfirmSelection}
          style={({pressed}) => [
            styles.connectButton,
            !canConnect && styles.connectButtonDisabled,
            pressed && canConnect && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.connectButtonText,
              !canConnect && styles.connectButtonTextDisabled,
            ]}
          >
            {isConnecting ? 'Connecting…' : 'Connect'}
          </Text>
        </Pressable>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{disabled: isConnecting}}
        accessibilityLabel={
          isPreparingToPair ? 'Cancel smartwatch pairing' : 'Pair a smartwatch'
        }
        disabled={isConnecting}
        onPress={onTogglePairing}
        style={({pressed}) => [
          styles.pairButton,
          isPreparingToPair && styles.cancelButton,
          isConnecting && styles.connectButtonDisabled,
          pressed && !isConnecting && styles.buttonPressed,
        ]}
      >
        <Text
          style={[
            styles.pairButtonText,
            isPreparingToPair && styles.cancelButtonText,
          ]}
        >
          {isPreparingToPair ? 'Cancel' : 'Pair a watch'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  watchPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#E8EDF3',
    borderRadius: 22,
    height: 112,
    justifyContent: 'center',
    width: 76,
  },
  watchScreen: {
    backgroundColor: '#B8C2CE',
    borderRadius: 16,
    height: 72,
    width: 58,
  },
  cardTitle: {color: '#17202A', fontSize: 20, fontWeight: '700', marginTop: 24},
  cardDescription: {
    color: '#687382',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  pairButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#1769E0',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 15,
  },
  buttonPressed: {opacity: 0.75},
  pairButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  connectButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#1769E0',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 15,
  },
  connectButtonDisabled: {backgroundColor: '#DCE2E9'},
  connectButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  connectButtonTextDisabled: {color: '#8A95A3'},
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#D5DBE3',
    borderWidth: 1,
    marginTop: 12,
  },
  cancelButtonText: {color: '#46515F'},
  deviceList: {alignSelf: 'stretch', marginTop: 24},
  deviceListTitle: {
    color: '#687382',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  filterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterLabel: {
    color: '#46515F',
    fontSize: 14,
  },
  deviceRow: {
    alignItems: 'center',
    borderColor: '#E2E7ED',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 16,
  },
  deviceName: {color: '#17202A', fontSize: 16, fontWeight: '600'},
  deviceSignal: {
    color: '#687382',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  deviceAction: {color: '#1769E0', fontSize: 14, fontWeight: '700'},
  deviceRowSelected: {backgroundColor: '#EDF4FF', borderColor: '#1769E0'},
  deviceRowPressed: {opacity: 0.7},
  scanningRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
  },
  scanningText: {
    color: '#687382',
    fontSize: 14,
    marginLeft: 12,
  },
  deviceScroll: {
    maxHeight: 300,
  },
  deviceScrollContent: {
    paddingBottom: 8,
  },
  scanError: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 12,
  },
  emptyScanText: {
    color: '#687382',
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 12,
  },
  retryButton: {
    alignItems: 'center',
    borderColor: '#1769E0',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#1769E0',
    fontSize: 14,
    fontWeight: '700',
  },
});

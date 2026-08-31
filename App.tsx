import {useEffect, useState} from 'react';
import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ConnectedWatchCard} from './src/components/ConnectedWatchCard';
import {PairingCard} from './src/components/PairingCard';
import type {DiscoveredWatch} from './src/models/DiscoveredWatch';
import {requestBluetoothPermissions} from './src/ble/requestBluetoothPermissions';

const previewScanResults: readonly DiscoveredWatch[] = [
  {
    id: 'preview-watch-1',
    name: 'Smart Watch',
    signalStrength: 'strong',
  },
  {
    id: 'preview-watch-2',
    name: 'Watch 7',
    signalStrength: 'medium',
  },
];

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <DashboardScreen />
    </SafeAreaProvider>
  );
}

function DashboardScreen() {
  const [isPreparingToPair, setIsPreparingToPair] = useState(false);
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const [connectedWatch, setConnectedWatch] = useState<DiscoveredWatch | null>(
    null,
  );
  const [discoveredWatches, setDiscoveredWatches] = useState<
    readonly DiscoveredWatch[]
  >([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isPreparingToPair) {
      setDiscoveredWatches([]);
      setIsScanning(false);
      return;
    }

    setDiscoveredWatches([]);
    setIsScanning(true);

    const scanTimer = setTimeout(() => {
      setDiscoveredWatches(previewScanResults);
      setIsScanning(false);
    }, 1500);

    return () => {
      clearTimeout(scanTimer);
    };
  }, [isPreparingToPair]);

  async function handleTogglePairing() {
    if (isPreparingToPair) {
      setIsPreparingToPair(false);
      setSelectedWatchId(null);
      return;
    }

    const permissionGranted = await requestBluetoothPermissions();

    if (!permissionGranted) {
      Alert.alert(
        'Bluetooth permission required',
        'Allow access to nearby devices to discover your smartwatch.',
      );
      return;
    }

    setIsPreparingToPair(true);
    setSelectedWatchId(null);
  }

  function handleSelectWatch(watchId: string) {
    setSelectedWatchId(watchId);
  }

  function handleConfirmSelection() {
    const selectedWatch = discoveredWatches.find(
      watch => watch.id === selectedWatchId,
    );

    if (!selectedWatch) {
      return;
    }

    setConnectedWatch(selectedWatch);
    setIsPreparingToPair(false);
    setSelectedWatchId(null);
  }

  function handleDisconnect() {
    setConnectedWatch(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View>
          <Text style={styles.eyebrow}>SMARTWATCH</Text>
          <Text style={styles.title}>My Watch</Text>
          <Text style={styles.subtitle}>
            Connect a watch to see its status and activity.
          </Text>
        </View>

        {connectedWatch ? (
          <ConnectedWatchCard
            watch={connectedWatch}
            onDisconnect={handleDisconnect}
          />
        ) : (
          <PairingCard
            watches={discoveredWatches}
            isScanning={isScanning}
            isPreparingToPair={isPreparingToPair}
            selectedWatchId={selectedWatchId}
            onSelectWatch={handleSelectWatch}
            onConfirmSelection={handleConfirmSelection}
            onTogglePairing={handleTogglePairing}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F7FA'},
  screen: {flex: 1, paddingHorizontal: 24, paddingTop: 24},
  eyebrow: {
    color: '#5B6472',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#17202A',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 6,
  },
  subtitle: {color: '#5B6472', fontSize: 16, lineHeight: 23, marginTop: 8},
});

export default App;

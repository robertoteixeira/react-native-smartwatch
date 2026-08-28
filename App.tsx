import {useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {ConnectedWatchCard} from './src/components/ConnectedWatchCard';
import {PairingCard} from './src/components/PairingCard';
import type {DiscoveredWatch} from './src/models/DiscoveredWatch';

const previewWatches: DiscoveredWatch[] = [
  {id: 'preview-watch-1', name: 'Smart Watch', signalStrength: 'strong'},
  {id: 'preview-watch-2', name: 'Watch 7', signalStrength: 'medium'},
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
  const [connectedWatch, setConnectedWatch] =
    useState<DiscoveredWatch | null>(null);

  function handleTogglePairing() {
    setIsPreparingToPair(currentValue => !currentValue);
    setSelectedWatchId(null);
  }

  function handleSelectWatch(watchId: string) {
    setSelectedWatchId(watchId);
  }

  function handleConfirmSelection() {
    const selectedWatch = previewWatches.find(
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
            watches={previewWatches}
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

import {useState} from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <DashboardScreen />
    </SafeAreaProvider>
  );
}

type PairingCardProps = {
  isPreparingToPair: boolean;
  selectedWatchId: string | null;
  onSelectWatch: (watchId: string) => void;
  onConfirmSelection: () => void;
  onTogglePairing: () => void; 
}

type DiscoveredWatch = {
  id: string;
  name: string;
  signalStrength: 'strong' | 'medium' | 'weak';
}

type ConnectedWatchCardProps = {
  watch: DiscoveredWatch;
  onDisconnect: () => void;
}

const previewWatches: DiscoveredWatch[] = [
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

function DashboardScreen() {
  const [isPreparingToPair, setIsPreparingToPair] = useState(false);
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const [connectedWatch, setConnectedWatch] = useState<DiscoveredWatch | null>(null);

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

function PairingCard({
  isPreparingToPair,
  selectedWatchId,
  onSelectWatch,
  onConfirmSelection,
  onTogglePairing,
}: PairingCardProps) {
  const canConnect = selectedWatchId !== null;

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
          <Text style={styles.deviceListTitle}>Nearby watches</Text>

          {previewWatches.map(watch => {
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
                ]}>
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
            pressed && canConnect && styles.pairButtonPressed,
          ]}>
          <Text
            style={[
              styles.connectButtonText,
              !canConnect && styles.connectButtonTextDisabled,
            ]}>
            Connect
          </Text>
        </Pressable>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isPreparingToPair
            ? 'Cancel smartwatch pairing'
            : 'Pair a smartwatch'
        }
        onPress={onTogglePairing}
        style={({pressed}) => [
          styles.pairButton,
          isPreparingToPair && styles.cancelButton,
          pressed && styles.pairButtonPressed,
        ]}>
        <Text
          style={[
            styles.pairButtonText,
            isPreparingToPair && styles.cancelButtonText,
          ]}>
          {isPreparingToPair ? 'Cancel' : 'Pair a watch'}
        </Text>
      </Pressable>
    </View>
  );
}

function ConnectedWatchCard({
  watch,
  onDisconnect
}: ConnectedWatchCardProps) {
  return (
    <View style={styles.connectedCard}>
      <View style={styles.connectionHeader}>
        <View style= {styles.connectedIndicator} />
        <Text style={styles.connectedLabel}>Connected preview</Text>
      </View>

      <View style={styles.watchPlaceholder}>
        <View style= {styles.watchScreen} />
      </View>

      <Text style={styles.cardTitle}>{watch.name}</Text>
      <Text style={styles.cardDescription}>
        Device information will appear here after a real BLE connection.
      </Text>

      <Pressable
        accessibilityRole='button'
        accessibilityLabel={`Disconnect ${watch.name}`}
        onPress={onDisconnect}
        style={({pressed}) => [
          styles.disconnectButton,
          pressed && styles.pairButtonPressed,
        ]}>
        <Text style={styles.disconnectButtonText}>Disconnect preview</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
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
  subtitle: {
    color: '#5B6472',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
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
  cardTitle: {
    color: '#17202A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
  },
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
  pairButtonPressed: {
    opacity: 0.75,
  },
  pairButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  connectButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#1769E0',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 15,
  },
  connectButtonDisabled: {
    backgroundColor: '#DCE2E9',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  connectButtonTextDisabled: {
    color: '#8A95A3',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#D5DBE3',
    borderWidth: 1,
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#46515F',
  },
  deviceList: {
  alignSelf: 'stretch',
  marginTop: 24,
  },
  deviceListTitle: {
    color: '#687382',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
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
  deviceName: {
    color: '#17202A',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceSignal: {
    color: '#687382',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  deviceAction: {
    color: '#1769E0',
    fontSize: 14,
    fontWeight: '700',
  },
  deviceRowSelected: {
    backgroundColor: '#EDF4FF',
    borderColor: '#1769E0',
  },
  deviceRowPressed: {
    opacity: 0.7,
  },
  connectedCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  connectionHeader: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  connectedIndicator: {
    backgroundColor: '#28A66A',
    borderRadius: 5,
    height: 10,
    marginRight: 8,
    width: 10,
  },
  connectedLabel: {
    color: '#24855A',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  disconnectButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: '#D5DBE3',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 24,
    paddingVertical: 15,
  },
  disconnectButtonText: {
    color: '#46515F',
    fontSize: 16,
    fontWeight: '700',
  },    
});

export default App;
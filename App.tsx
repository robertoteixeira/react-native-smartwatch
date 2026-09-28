import {useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ConnectedWatchCard} from './src/components/ConnectedWatchCard';
import {PairingCard} from './src/components/PairingCard';
import {requestBluetoothPermissions} from './src/ble/requestBluetoothPermissions';
import {useBluetoothState} from './src/ble/useBluetoothState';
import {mapBleDeviceToDiscoveredWatch} from './src/ble/mapBleDeviceToDiscoveredWatch';
import {useBleScan} from './src/ble/useBleScan';
import {connectToBleDevice} from './src/ble/connectToBleDevice';
import {getBleDeviceProfile} from './src/ble/getBleDeviceProfile';
import {disconnectFromBleDevice} from './src/ble/disconnectFromBleDevice';
import {useBleDisconnection} from './src/ble/useBleDisconnection';
import {useBatteryLevel} from './src/ble/useBatteryLevel';
import type {ConnectedWatch} from './src/models/ConnectedWatch';
import {readBatteryLevel} from './src/ble/readBatteryLevel';
import {
  readDeviceInformation,
  type DeviceInformation,
} from './src/ble/readDeviceInformation';
import {useHeartRate} from './src/ble/useHeartRate';
import {saveRememberedWatch} from './src/storage/pairedWatchStorage';

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
  const [connectedWatch, setConnectedWatch] = useState<ConnectedWatch | null>(
    null,
  );
  const [isConnecting, setIsConnecting] = useState(false);

  const bluetoothState = useBluetoothState(isPreparingToPair);
  const canScan = isPreparingToPair && bluetoothState === 'PoweredOn';
  const {devices, isScanning, scanError, hasCompletedScan, restartScan} =
    useBleScan(canScan);

  const discoveredWatches = useMemo(
    () => devices.map(mapBleDeviceToDiscoveredWatch),
    [devices],
  );

  useBleDisconnection(connectedWatch?.id ?? null, error => {
    setConnectedWatch(null);

    if (error) {
      Alert.alert(
        'Watch disconnected',
        error.message || 'The Bluetooth connection was lost.',
      );
    }
  });

  const liveBatteryLevel = useBatteryLevel(
    connectedWatch?.id ?? null,
    connectedWatch?.batteryLevel ?? null,
  );

  const heartRate = useHeartRate(connectedWatch?.id ?? null);

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

  async function handleConfirmSelection() {
    const selectedWatch = discoveredWatches.find(
      watch => watch.id === selectedWatchId,
    );

    if (!selectedWatch) {
      return;
    }

    setIsConnecting(true);

    try {
      const connectedDevice = await connectToBleDevice(selectedWatch.id);

      try {
        const profile = await getBleDeviceProfile(connectedDevice);

        console.info('BLE GATT profile:', JSON.stringify(profile, null, 2));
      } catch (profileError) {
        console.warn('Unable to inspect BLE GATT profile:', profileError);
      }

      let batteryLevel: number | null = null;

      try {
        batteryLevel = await readBatteryLevel(selectedWatch.id);
      } catch (batteryError) {
        console.warn('Unable to read battery level:', batteryError);
      }

      let deviceInformation: DeviceInformation | null = null;

      try {
        deviceInformation = await readDeviceInformation(selectedWatch.id);
      } catch (deviceInformationError) {
        console.warn(
          'Unable to read device information:',
          deviceInformationError,
        );
      }

      setConnectedWatch({
        id: selectedWatch.id,
        name: selectedWatch.name,
        batteryLevel,
        deviceInformation,
      });

      try {
        await saveRememberedWatch({
          id: selectedWatch.id,
          name: selectedWatch.name,
        });
      } catch (storageError) {
        console.warn('Unable to remember paired watch:', storageError);
      }

      setIsPreparingToPair(false);
      setSelectedWatchId(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unknown Bluetooth error occurred.';

      Alert.alert('Unable to connect', message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!connectedWatch) {
      return;
    }

    try {
      await disconnectFromBleDevice(connectedWatch.id);
      setConnectedWatch(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unknown Bluetooth error occurred.';

      Alert.alert('Unable to disconnect', message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.eyebrow}>SMARTWATCH</Text>
          <Text style={styles.title}>My Watch</Text>
          <Text style={styles.subtitle}>
            Connect a watch to see its status and activity.
          </Text>

          {isPreparingToPair && (
            <Text style={styles.bluetoothState}>
              Bluetooth: {bluetoothState}
            </Text>
          )}
        </View>

        {connectedWatch ? (
          <ConnectedWatchCard
            watch={{
              ...connectedWatch,
              batteryLevel: liveBatteryLevel,
            }}
            heartRate={heartRate}
            onDisconnect={handleDisconnect}
          />
        ) : (
          <PairingCard
            watches={discoveredWatches}
            isScanning={isScanning}
            scanError={scanError}
            hasCompletedScan={hasCompletedScan}
            isConnecting={isConnecting}
            isPreparingToPair={isPreparingToPair}
            selectedWatchId={selectedWatchId}
            onSelectWatch={handleSelectWatch}
            onConfirmSelection={handleConfirmSelection}
            onTogglePairing={handleTogglePairing}
            onRetryScan={restartScan}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F7FA'},
  screen: {
    flexGrow: 1,
    paddingBottom: 24,
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
  subtitle: {color: '#5B6472', fontSize: 16, lineHeight: 23, marginTop: 8},
  bluetoothState: {
    color: '#687382',
    fontSize: 13,
    marginTop: 12,
  },
});

export default App;

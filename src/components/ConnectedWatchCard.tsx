import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {ConnectedWatch} from '../models/ConnectedWatch';

type ConnectedWatchCardProps = {
  watch: ConnectedWatch;
  heartRate: number | null;
  onDisconnect: () => void;
};

export function ConnectedWatchCard({
  watch,
  heartRate,
  onDisconnect,
}: ConnectedWatchCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.connectionHeader}>
        <View style={styles.connectedIndicator} />
        <Text style={styles.connectedLabel}>Connected</Text>
      </View>

      <View style={styles.watchPlaceholder}>
        <View style={styles.watchScreen} />
      </View>

      <Text style={styles.title}>{watch.name}</Text>

      <Text style={styles.battery}>
        {watch.batteryLevel === null
          ? 'Battery unavailable'
          : `Battery ${watch.batteryLevel}%`}
      </Text>

      <Text style={styles.heartRate}>
        {heartRate === null
          ? 'Waiting for heart rate…'
          : `Heart rate ${heartRate} BPM`}
      </Text>

      {watch.deviceInformation && (
        <View style={styles.deviceInformation}>
          <View style={styles.informationRow}>
            <Text style={styles.informationLabel}>Manufacturer</Text>
            <Text style={styles.informationValue}>
              {watch.deviceInformation.manufacturerName}
            </Text>
          </View>

          <View style={styles.informationRow}>
            <Text style={styles.informationLabel}>Software</Text>
            <Text style={styles.informationValue}>
              {watch.deviceInformation.softwareRevision}
            </Text>
          </View>

          <View style={styles.informationRow}>
            <Text style={styles.informationLabel}>Hardware</Text>
            <Text style={styles.informationValue}>
              {watch.deviceInformation.hardwareRevision}
            </Text>
          </View>

          <View style={styles.informationRow}>
            <Text style={styles.informationLabel}>Serial number</Text>
            <Text style={styles.informationValue}>
              {watch.deviceInformation.serialNumber}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.description}>
        Bluetooth connection established successfully.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Disconnect ${watch.name}`}
        onPress={onDisconnect}
        style={({pressed}) => [
          styles.disconnectButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.disconnectButtonText}>Disconnect</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  title: {
    color: '#17202A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
  },
  description: {
    color: '#687382',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
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
  buttonPressed: {
    opacity: 0.75,
  },
  battery: {
    color: '#24855A',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  heartRate: {
    color: '#C4475A',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  deviceInformation: {
    alignSelf: 'stretch',
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    marginTop: 20,
    padding: 16,
  },
  informationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  informationLabel: {
    color: '#687382',
    fontSize: 14,
  },
  informationValue: {
    color: '#17202A',
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    textAlign: 'right',
  },
});

import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {WatchIdentity} from '../models/WatchIdentity';

type RememberedWatchCardProps = {
  watch: WatchIdentity;
  isConnecting: boolean;
  onReconnect: () => void;
  onPairDifferentWatch: () => void;
  onForgetWatch: () => void;
};

export function RememberedWatchCard({
  watch,
  isConnecting,
  onReconnect,
  onPairDifferentWatch,
  onForgetWatch,
}: RememberedWatchCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.watchPlaceholder}>
        <View style={styles.watchScreen} />
      </View>

      <Text style={styles.title}>{watch.name}</Text>

      <Text style={styles.description}>
        This watch was paired previously. Reconnect without scanning again.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{disabled: isConnecting}}
        disabled={isConnecting}
        onPress={onReconnect}
        style={({pressed}) => [
          styles.reconnectButton,
          isConnecting && styles.disabledButton,
          pressed && !isConnecting && styles.buttonPressed,
        ]}
      >
        <Text
          style={[
            styles.reconnectButtonText,
            isConnecting && styles.disabledButtonText,
          ]}
        >
          {isConnecting ? 'Connecting…' : 'Reconnect'}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{disabled: isConnecting}}
        disabled={isConnecting}
        onPress={onPairDifferentWatch}
        style={({pressed}) => [
          styles.secondaryButton,
          pressed && !isConnecting && styles.buttonPressed,
        ]}
      >
        <Text style={styles.secondaryButtonText}>Pair a different watch</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{disabled: isConnecting}}
        disabled={isConnecting}
        onPress={onForgetWatch}
        style={({pressed}) => [
          styles.forgetButton,
          pressed && !isConnecting && styles.buttonPressed,
        ]}
      >
        <Text style={styles.forgetButtonText}>Forget this watch</Text>
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
  reconnectButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#1769E0',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 15,
  },
  reconnectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: '#D5DBE3',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: '#46515F',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#DCE2E9',
  },
  disabledButtonText: {
    color: '#8A95A3',
  },
  forgetButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  forgetButtonText: {
    color: '#C4475A',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.75,
  },
});

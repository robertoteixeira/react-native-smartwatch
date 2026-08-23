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

function DashboardScreen() {
  const [isPreparingToPair, setIsPreparingToPair] = useState(false);

  function handlePairWatch() {
    setIsPreparingToPair(currentValue => !currentValue);
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

        <View style={styles.emptyCard}>
          <View style={styles.watchPlaceholder}>
            <View style={styles.watchScreen} />
          </View>

          <Text style={styles.cardTitle}>
            {isPreparingToPair ? 'Ready to scan' : 'No watch connected'}
          </Text>

          <Text style={styles.cardDescription}>
            {isPreparingToPair
              ? 'Bluetooth device discovery will be added in the next pairing step.'
              : 'Pair a compatible smartwatch to get started.'}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isPreparingToPair ? 'Cancel smartwatch pairing' : 'Pair a smartwatch'
            }
            onPress={handlePairWatch}
            style={({pressed}) => [
              styles.pairButton,
              pressed && styles.pairButtonPressed,
            ]}>
            <Text style={styles.pairButtonText}>
              {isPreparingToPair ? 'Cancel' : 'Pair a watch'}
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
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
});

export default App;
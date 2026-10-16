# React Native Smartwatch

A React Native and TypeScript prototype for exploring Bluetooth Low Energy devices from iOS and Android. It covers scanning, connection management, GATT inspection, and live readings from compatible peripherals.

## Features

- Scan nearby BLE peripherals in 10-second windows, select a device, and retry a scan.
- Request platform-specific Bluetooth permissions and display Bluetooth state.
- Connect with a 15-second timeout and bound service discovery to 10 seconds.
- Inspect services and characteristic capabilities.
- Read battery level and subscribe to battery and heart-rate updates.
- Read manufacturer, serial number, hardware revision, and software revision.
- Handle disconnections, remember a device locally, reconnect, and forget it.
- Test connection behavior, value decoding, subscriptions, hooks, and persistence with Jest.

## Stack

React Native 0.87, React 19, TypeScript, `@sfourdrinier/react-native-ble-plx`, AsyncStorage, and Jest. Native projects are included for Android and iOS.

## Run locally

Use a Node version supported by `package.json` (`^22.13.0`, `^24.3.0`, or `>=26.0.0`), npm, and the native toolchain for your target platform. Android requires an SDK and compatible JDK; iOS requires macOS, Xcode, Ruby/Bundler, and CocoaPods.

```sh
git clone https://github.com/robertoteixeira/react-native-smartwatch.git
cd react-native-smartwatch
npm ci
```

For iOS, install native dependencies:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
```

Start Metro, then run the target in a second terminal:

```sh
npm start
```

```sh
npm run android
# or
npm run ios
```

Use a physical phone and an accessible BLE peripheral to exercise the complete Bluetooth flow. Enable Bluetooth and grant the requested permission. Android 12+ requests scan/connect permissions; earlier Android versions use location permission for scanning.

### Android signing setup

The current Gradle configuration references `SMARTWATCH_UPLOAD_STORE_FILE`, `SMARTWATCH_UPLOAD_STORE_PASSWORD`, `SMARTWATCH_UPLOAD_KEY_ALIAS`, and `SMARTWATCH_UPLOAD_KEY_PASSWORD` during project configuration. Until signing configuration is made conditional, these private Gradle properties must be supplied even for a debug checkout. Keep real signing material outside source control. The checked-in debug keystore is for development only.

For iOS, select your own development team in Xcode before deploying to a physical device.

## Try the BLE flow

1. Start a scan and select an advertising peripheral.
2. Connect and inspect its discovered GATT profile.
3. On a compatible device, inspect battery, device information, and heart-rate readings.
4. Disconnect, reconnect using the remembered-device card, or forget the device.

The app uses standard GATT services:

| Data | Service | Characteristic |
| --- | --- | --- |
| Battery level | `180F` | `2A19` |
| Heart-rate measurement | `180D` | `2A37` |
| Device information | `180A` | `2A25`, `2A27`, `2A28`, `2A29` |

These short UUIDs use the Bluetooth base UUID. A device must expose the relevant service and characteristic for a reading to work. Many consumer watches use proprietary protocols and will not support these flows. Remembering a device in the app does not establish OS-level Bluetooth bonding.

## Validation

```sh
npm run check
```

This runs TypeScript, ESLint, and Jest. You can also run `npm run typecheck`, `npm run lint`, or `npm test -- --runInBand --watchman=false` individually. Mock-based tests do not verify radio behavior, native builds, or compatibility with a particular watch.

## Code layout

- `src/ble/`: Bluetooth manager, permissions, connection workflow, GATT reads, decoding, subscriptions, and hooks.
- `src/components/`: discovery, connected-device, and remembered-device UI.
- `src/storage/`: local device identity persistence.
- `src/models/`: shared device models.
- `__tests__/`: Jest tests.
- `android/` and `ios/`: native projects.

## Project status

Personal learning prototype. It is not a medical device, a universal smartwatch companion, or a production-ready health application. Remembered device identifiers and names are stored using AsyncStorage. No cloud service is required by the implemented BLE flow.

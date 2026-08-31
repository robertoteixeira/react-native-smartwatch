import {PermissionsAndroid, Platform} from 'react-native';

export async function requestBluetoothPermissions(): Promise<boolean> {
  const androidApiLevel = Number(Platform.Version);

  if (androidApiLevel >= 31) {
    const scanPermission = PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN;

    const connectPermission = PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT;

    const results = await PermissionsAndroid.requestMultiple([
      scanPermission,
      connectPermission,
    ]);

    return (
      results[scanPermission] === PermissionsAndroid.RESULTS.GRANTED &&
      results[connectPermission] === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

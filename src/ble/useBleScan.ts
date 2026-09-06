import {useEffect, useState} from 'react';
import type {Device} from '@sfourdrinier/react-native-ble-plx';
import {bleManager} from './bleManager';

type BleScanResult = {
  devices: readonly Device[];
  isScanning: boolean;
};

export function useBleScan(isActive: boolean): BleScanResult {
  const [devices, setDevices] = useState<readonly Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDevices([]);
      setIsScanning(false);
      return;
    }

    setDevices([]);
    setIsScanning(true);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('BLE scan failed:', error.message);
        setIsScanning(false);
        return;
      }

      if (!device) {
        return;
      }

      setDevices(currentDevices => {
        const alreadyDiscovered = currentDevices.some(
          currentDevice => currentDevice.id === device.id,
        );

        if (alreadyDiscovered) {
          return currentDevices;
        }

        return [...currentDevices, device];
      });
    });

    const scanTimer = setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10_000);

    return () => {
      clearTimeout(scanTimer);
      bleManager.stopDeviceScan();
    };
  }, [isActive]);

  return {devices, isScanning};
}

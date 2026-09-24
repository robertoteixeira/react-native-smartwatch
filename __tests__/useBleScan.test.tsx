import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {bleManager} from '../src/ble/bleManager';
import {useBleScan} from '../src/ble/useBleScan';

jest.mock('../src/ble/bleManager', () => ({
  bleManager: {
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
  },
}));

const mockStartDeviceScan = jest.mocked(bleManager.startDeviceScan);
const mockStopDeviceScan = jest.mocked(bleManager.stopDeviceScan);

type ScanResult = ReturnType<typeof useBleScan>;

let latestScanResult: ScanResult | null = null;

function TestComponent({isActive}: {isActive: boolean}) {
  latestScanResult = useBleScan(isActive);
  return null;
}

describe('useBleScan', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null;

  beforeEach(() => {
    renderer = null;
    latestScanResult = null;
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await act(() => {
      renderer?.unmount();
    });

    jest.useRealTimers();
  });

  async function renderScanner(isActive: boolean) {
    await act(() => {
      renderer = ReactTestRenderer.create(
        <TestComponent isActive={isActive} />,
      );
    });
  }

  it('does not scan while inactive', async () => {
    await renderScanner(false);

    expect(mockStartDeviceScan).not.toHaveBeenCalled();
    expect(latestScanResult?.isScanning).toBe(false);
    expect(latestScanResult?.hasCompletedScan).toBe(false);
  });

  it('stops and marks the scan complete after ten seconds', async () => {
    await renderScanner(true);

    expect(mockStartDeviceScan).toHaveBeenCalledTimes(1);
    expect(latestScanResult?.isScanning).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(10_000);
    });

    expect(mockStopDeviceScan).toHaveBeenCalled();
    expect(latestScanResult?.isScanning).toBe(false);
    expect(latestScanResult?.hasCompletedScan).toBe(true);
  });

  it('starts a new scan when retry is requested', async () => {
    await renderScanner(true);

    await act(() => {
      jest.advanceTimersByTime(10_000);
    });

    expect(latestScanResult?.hasCompletedScan).toBe(true);

    await act(() => {
      latestScanResult?.restartScan();
    });

    expect(mockStartDeviceScan).toHaveBeenCalledTimes(2);
    expect(latestScanResult?.isScanning).toBe(true);
    expect(latestScanResult?.hasCompletedScan).toBe(false);
  });
});

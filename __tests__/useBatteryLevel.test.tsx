import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {monitorBatteryLevel} from '../src/ble/monitorBatteryLevel';
import {useBatteryLevel} from '../src/ble/useBatteryLevel';

jest.mock('../src/ble/monitorBatteryLevel', () => ({
  monitorBatteryLevel: jest.fn(),
}));

const mockMonitor = jest.mocked(monitorBatteryLevel);

let latestBatteryLevel: number | null = null;

function TestComponent({
  deviceId,
  initialBatteryLevel,
}: {
  deviceId: string | null;
  initialBatteryLevel: number | null;
}) {
  latestBatteryLevel = useBatteryLevel(deviceId, initialBatteryLevel);

  return null;
}

describe('useBatteryLevel', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null;
  const remove = jest.fn();

  beforeEach(() => {
    renderer = null;
    latestBatteryLevel = null;
    jest.clearAllMocks();
    mockMonitor.mockReturnValue({remove});
  });

  afterEach(async () => {
    await act(() => {
      renderer?.unmount();
    });
  });

  async function renderDevice(
    deviceId: string | null,
    initialBatteryLevel: number | null,
  ) {
    await act(() => {
      renderer = ReactTestRenderer.create(
        <TestComponent
          deviceId={deviceId}
          initialBatteryLevel={initialBatteryLevel}
        />,
      );
    });
  }

  it('uses the initial battery reading', async () => {
    await renderDevice('watch-1', 75);

    expect(latestBatteryLevel).toBe(75);
  });

  it('updates the value when a notification arrives', async () => {
    await renderDevice('watch-1', 75);

    const onBatteryLevel = mockMonitor.mock.calls[0][1];

    await act(() => {
      onBatteryLevel(74);
    });

    expect(latestBatteryLevel).toBe(74);
  });

  it('does not subscribe without a connected device', async () => {
    await renderDevice(null, null);

    expect(mockMonitor).not.toHaveBeenCalled();
    expect(latestBatteryLevel).toBeNull();
  });

  it('removes the subscription when unmounted', async () => {
    await renderDevice('watch-1', 75);

    await act(() => {
      renderer?.unmount();
      renderer = null;
    });

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('switches subscriptions and uses the new initial value', async () => {
    await renderDevice('watch-1', 75);

    await act(() => {
      renderer?.update(
        <TestComponent deviceId="watch-2" initialBatteryLevel={40} />,
      );
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(mockMonitor).toHaveBeenCalledTimes(2);
    expect(latestBatteryLevel).toBe(40);
  });

  it('clears the value and removes the listener on disconnect', async () => {
    await renderDevice('watch-1', 75);

    await act(() => {
      renderer?.update(
        <TestComponent deviceId={null} initialBatteryLevel={null} />,
      );
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(mockMonitor).toHaveBeenCalledTimes(1);
    expect(latestBatteryLevel).toBeNull();
  });
});

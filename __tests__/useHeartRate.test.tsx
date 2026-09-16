import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {monitorHeartRate} from '../src/ble/monitorHeartRate';
import {useHeartRate} from '../src/ble/useHeartRate';

jest.mock('../src/ble/monitorHeartRate', () => ({
  monitorHeartRate: jest.fn(),
}));

const mockMonitor = jest.mocked(monitorHeartRate);

function TestComponent({deviceId}: {deviceId: string | null}) {
  useHeartRate(deviceId);
  return null;
}

describe('useHeartRate', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null;
  const remove = jest.fn();

  beforeEach(() => {
    renderer = null;
    jest.clearAllMocks();
    mockMonitor.mockReturnValue({remove});
  });

  afterEach(async () => {
    await act(() => {
      renderer?.unmount();
    });
  });

  it('does not subscribe without a connected device', async () => {
    await act(() => {
      renderer = ReactTestRenderer.create(<TestComponent deviceId={null} />);
    });

    expect(mockMonitor).not.toHaveBeenCalled();
  });

  it('removes the subscription when unmounted', async () => {
    await act(() => {
      renderer = ReactTestRenderer.create(<TestComponent deviceId="watch-1" />);
    });

    await act(() => {
      renderer?.unmount();
      renderer = null;
    });

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('removes the old subscription when switching devices', async () => {
    await act(() => {
      renderer = ReactTestRenderer.create(<TestComponent deviceId="watch-1" />);
    });

    await act(() => {
      renderer?.update(<TestComponent deviceId="watch-2" />);
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(mockMonitor).toHaveBeenCalledTimes(2);
    expect(mockMonitor).toHaveBeenLastCalledWith(
      'watch-2',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('removes the subscription when disconnected', async () => {
    await act(() => {
      renderer = ReactTestRenderer.create(<TestComponent deviceId="watch-1" />);
    });

    await act(() => {
      renderer?.update(<TestComponent deviceId={null} />);
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(mockMonitor).toHaveBeenCalledTimes(1);
  });
});

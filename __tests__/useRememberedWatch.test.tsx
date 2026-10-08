import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {
  loadRememberedWatch,
  removeRememberedWatch,
  saveRememberedWatch,
} from '../src/storage/pairedWatchStorage';
import {useRememberedWatch} from '../src/storage/useRememberedWatch';

jest.mock('../src/storage/pairedWatchStorage', () => ({
  loadRememberedWatch: jest.fn(),
  removeRememberedWatch: jest.fn(),
  saveRememberedWatch: jest.fn(),
}));

const mockLoadRememberedWatch = jest.mocked(loadRememberedWatch);
const mockRemoveRememberedWatch = jest.mocked(removeRememberedWatch);
const mockSaveRememberedWatch = jest.mocked(saveRememberedWatch);

type RememberedWatchState = ReturnType<typeof useRememberedWatch>;

let latestState: RememberedWatchState | null = null;

function TestComponent() {
  latestState = useRememberedWatch();
  return null;
}

describe('useRememberedWatch', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null;

  beforeEach(() => {
    renderer = null;
    latestState = null;
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await act(() => {
      renderer?.unmount();
    });
  });

  async function renderHook() {
    await act(async () => {
      renderer = ReactTestRenderer.create(<TestComponent />);
      await Promise.resolve();
    });
  }

  it('loads a remembered watch', async () => {
    mockLoadRememberedWatch.mockResolvedValue({
      id: 'watch-1',
      name: 'My Watch',
    });

    await renderHook();

    expect(mockLoadRememberedWatch).toHaveBeenCalledTimes(1);
    expect(latestState?.rememberedWatch).toEqual({
      id: 'watch-1',
      name: 'My Watch',
    });
    expect(latestState?.isLoadingRememberedWatch).toBe(false);
  });

  it('finishes loading when no remembered watch exists', async () => {
    mockLoadRememberedWatch.mockResolvedValue(null);

    await renderHook();

    expect(latestState?.rememberedWatch).toBeNull();
    expect(latestState?.isLoadingRememberedWatch).toBe(false);
  });

  it('finishes loading when storage fails', async () => {
    const storageError = new Error('Storage unavailable');
    const warn = jest.spyOn(console, 'warn').mockImplementation();

    mockLoadRememberedWatch.mockRejectedValue(storageError);

    await renderHook();

    expect(latestState?.rememberedWatch).toBeNull();
    expect(latestState?.isLoadingRememberedWatch).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      'Unable to load remembered watch:',
      storageError,
    );

    warn.mockRestore();
  });

  it('saves and publishes a newly remembered watch', async () => {
    mockLoadRememberedWatch.mockResolvedValue(null);

    await renderHook();

    const watch = {
      id: 'watch-1',
      name: 'My Watch',
    };

    await act(async () => {
      await latestState?.rememberWatch(watch);
    });

    expect(mockSaveRememberedWatch).toHaveBeenCalledWith(watch);
    expect(latestState?.rememberedWatch).toEqual(watch);
  });

  it('removes and clears the remembered watch', async () => {
    const watch = {
      id: 'watch-1',
      name: 'My Watch',
    };

    mockLoadRememberedWatch.mockResolvedValue(watch);

    await renderHook();

    expect(latestState?.rememberedWatch).toEqual(watch);

    await act(async () => {
      await latestState?.forgetRememberedWatch();
    });

    expect(mockRemoveRememberedWatch).toHaveBeenCalledTimes(1);
    expect(latestState?.rememberedWatch).toBeNull();
  });
});

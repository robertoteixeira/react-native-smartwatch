import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import {
  loadRememberedWatch,
  removeRememberedWatch,
  saveRememberedWatch,
} from '../src/storage/pairedWatchStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  createAsyncStorage: jest.fn(() => ({
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  })),
}));

const mockCreateAsyncStorage = jest.mocked(createAsyncStorage);
const mockStorage = mockCreateAsyncStorage.mock.results[0].value;
const mockGetItem = jest.mocked(mockStorage.getItem);
const mockRemoveItem = jest.mocked(mockStorage.removeItem);
const mockSetItem = jest.mocked(mockStorage.setItem);

describe('pairedWatchStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves the remembered watch as JSON', async () => {
    const watch = {
      id: 'watch-1',
      name: 'My Watch',
    };

    await saveRememberedWatch(watch);

    expect(mockSetItem).toHaveBeenCalledWith(
      'paired-watch',
      JSON.stringify(watch),
    );
  });

  it('loads a valid remembered watch', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({
        id: 'watch-1',
        name: 'My Watch',
      }),
    );

    await expect(loadRememberedWatch()).resolves.toEqual({
      id: 'watch-1',
      name: 'My Watch',
    });
  });

  it('returns null when no watch has been saved', async () => {
    mockGetItem.mockResolvedValue(null);

    await expect(loadRememberedWatch()).resolves.toBeNull();
  });

  it('returns null when the stored JSON has the wrong shape', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({
        id: 123,
        name: 'My Watch',
      }),
    );

    await expect(loadRememberedWatch()).resolves.toBeNull();
  });

  it('returns null when the stored value is invalid JSON', async () => {
    mockGetItem.mockResolvedValue('not a valid JSON');

    await expect(loadRememberedWatch()).resolves.toBeNull();
  });

  it('removes the remembered watch', async () => {
    await removeRememberedWatch();

    expect(mockRemoveItem).toHaveBeenCalledWith('paired-watch');
  });
});

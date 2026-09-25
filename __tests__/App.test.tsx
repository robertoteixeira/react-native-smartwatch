import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@sfourdrinier/react-native-ble-plx', () => ({
  BleManager: jest.fn().mockImplementation(() => ({
    onStateChange: jest.fn(() => ({
      remove: jest.fn(),
    })),
  })),
}));

jest.mock('../src/storage/pairedWatchStorage', () => ({
  saveRememberedWatch: jest.fn(),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

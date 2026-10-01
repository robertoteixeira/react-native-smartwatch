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

jest.mock('../src/storage/useRememberedWatch', () => ({
  useRememberedWatch: jest.fn(() => ({
    rememberedWatch: null,
    isLoadingRememberedWatch: false,
    rememberWatch: jest.fn(),
  })),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

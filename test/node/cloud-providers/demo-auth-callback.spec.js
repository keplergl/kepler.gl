// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  CLOUD_PROVIDERS,
  DEFAULT_CLOUD_PROVIDER,
  getCloudProvider,
  handleAuthCallback
} from '../../../examples/demo-app/src/cloud-providers';

jest.mock('../../../examples/demo-app/src/constants/default-settings', () => ({
  CLOUD_PROVIDERS_CONFIGURATION: {}
}));
jest.mock('../../../examples/demo-app/src/cloud-providers/foursquare/foursquare-provider', () =>
  jest.fn().mockImplementation(() => ({name: 'foursquare'}))
);
jest.mock('../../../examples/demo-app/src/cloud-providers/google-drive/google-drive-provider', () =>
  jest.fn().mockImplementation(() => ({name: 'google-drive'}))
);

describe('DuckDB demo OAuth callback', () => {
  const location = {pathname: '/auth', hash: '#access_token=example-token'};
  const origin = 'https://duckdb.example.com';

  test('ignores the legacy callback when Dropbox is not configured', () => {
    const opener = {postMessage: jest.fn()};

    expect(() => getCloudProvider(DEFAULT_CLOUD_PROVIDER)).toThrow('Unknown cloud provider');
    expect(() => handleAuthCallback(location, opener, origin)).not.toThrow();
    expect(opener.postMessage).not.toHaveBeenCalled();
  });

  test('preserves the callback when Dropbox is configured', () => {
    const opener = {postMessage: jest.fn()};
    const provider = {
      name: DEFAULT_CLOUD_PROVIDER,
      getAccessTokenFromLocation: jest.fn().mockReturnValue('example-token')
    };
    CLOUD_PROVIDERS.push(provider);
    try {
      handleAuthCallback(location, opener, origin);
      expect(provider.getAccessTokenFromLocation).toHaveBeenCalledWith(location);
      expect(opener.postMessage).toHaveBeenCalledWith({token: 'example-token'}, origin);

      provider.getAccessTokenFromLocation.mockClear();
      opener.postMessage.mockClear();
      handleAuthCallback({...location, pathname: '/demo'}, opener, origin);
      handleAuthCallback(location, null, origin);
      expect(provider.getAccessTokenFromLocation).not.toHaveBeenCalled();
      expect(opener.postMessage).not.toHaveBeenCalled();
    } finally {
      CLOUD_PROVIDERS.pop();
    }
  });
});

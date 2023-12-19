// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react';
import LoadStorageMapFactory from './load-storage-map';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {dataTestIds} from '@kepler.gl/constants';

const LoadStorageMap = LoadStorageMapFactory();

const DEFAULT_MAPS = [
  {
    id: '1234',
    title: 'first map',
    description: 'description 1',
    loadParams: {
      id: '1234'
    }
  },
  {
    id: '5678',
    title: 'second map',
    description: 'description 2',
    loadParams: {
      id: '5678'
    }
  }
];

const DEFAULT_PROVIDER = {
  name: 'test provider',
  icon: jest.fn(),
  getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
  listMaps: jest.fn().mockResolvedValue([])
};

const DEFAULT_PROPS = {
  onLoadCloudMap: jest.fn()
};

jest.mock('../hooks/use-cloud-list-provider', () => ({
  useCloudListProvider: jest.fn().mockImplementation(() => ({
    provider: null,
    setProvider: jest.fn(),
    cloudProviders: []
  }))
}));

describe('LoadStorageMap', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders provider select and no cloud components when provider is set to null', () => {
    const {getByTestId} = renderWithTheme(<LoadStorageMap {...DEFAULT_PROPS} />);
    expect(getByTestId(dataTestIds.providerSelect)).toBeInTheDocument();
  });

  test('renders empty map list because fetchmaps return empty array', async () => {
    useCloudListProvider.mockImplementation(() => ({
      provider: DEFAULT_PROVIDER,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    const {getByText} = renderWithTheme(<LoadStorageMap {...DEFAULT_PROPS} />);
    expect(DEFAULT_PROVIDER.listMaps).toHaveBeenCalled();

    // first show loading icon
    expect(getByText('modal.loadingDialog.loading')).toBeInTheDocument();

    // show empty maps
    await waitFor(() => {
      expect(getByText('modal.loadStorageMap.noSavedMaps')).toBeInTheDocument();
    });
  });

  test('renders map list because', async () => {
    const mapProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockResolvedValue(DEFAULT_MAPS)
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: mapProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    const {getByText} = renderWithTheme(<LoadStorageMap {...DEFAULT_PROPS} />);
    expect(mapProvider.listMaps).toHaveBeenCalled();

    // first show loading icon
    expect(getByText('modal.loadingDialog.loading')).toBeInTheDocument();

    // show empty maps
    await waitFor(() => {
      DEFAULT_MAPS.forEach(map => {
        expect(getByText(map.title)).toBeInTheDocument();
        expect(getByText(map.description)).toBeInTheDocument();
      });
    });
  });

  test('trigger onLoadCLoudMap when clicking on a map', async () => {
    const mapProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockResolvedValue(DEFAULT_MAPS)
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: mapProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    const {getByText} = renderWithTheme(<LoadStorageMap {...DEFAULT_PROPS} />);
    expect(mapProvider.listMaps).toHaveBeenCalled();

    // first show loading icon
    expect(getByText('modal.loadingDialog.loading')).toBeInTheDocument();

    // click on a map
    await waitFor(() => {
      const map = DEFAULT_MAPS[0];
      // if the component doesn't exist this will throw an exception
      const mapTitleComponent = getByText(map.title);
      fireEvent.click(mapTitleComponent);
      expect(DEFAULT_PROPS.onLoadCloudMap).toHaveBeenCalled();
    });
  });

  test('renders errors because fetchmaps rejects', async () => {
    const rejectableProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockRejectedValue(new Error('timeout'))
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: rejectableProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    const {getByText} = renderWithTheme(<LoadStorageMap {...DEFAULT_PROPS} />);
    expect(rejectableProvider.listMaps).toHaveBeenCalled();

    // first show loading icon
    expect(getByText('modal.loadingDialog.loading')).toBeInTheDocument();

    // show empty maps
    await waitFor(() => {
      expect(getByText('Error while fetching maps: timeout')).toBeInTheDocument();
    });
  });
});

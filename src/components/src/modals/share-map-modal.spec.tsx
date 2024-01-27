// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import ShareMapUrlModalFactory from './share-map-modal';
import {dataTestIds} from '@kepler.gl/constants';
import {act} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';

jest.mock('../hooks/use-cloud-list-provider', () => ({
  useCloudListProvider: jest.fn().mockImplementation(() => ({
    provider: null,
    setProvider: jest.fn(),
    cloudProviders: []
  }))
}));

const ShareMapUrlModal = ShareMapUrlModalFactory();

const DEFAULT_PROPS = {
  isProviderLoading: false,
  onExport: jest.fn(),
  providerError: null,
  successInfo: undefined,
  onUpdateImageSetting: jest.fn(),
  cleanupExportImage: jest.fn()
};

describe('ShareMapModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders only list of providers', () => {
    const {getByText, queryByTestId} = renderWithTheme(<ShareMapUrlModal {...DEFAULT_PROPS} />);
    expect(getByText('modal.shareMap.title')).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.providerShareMap)).toBeNull();
  });

  test('renders list of provider and sharing section', () => {
    const mapProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockResolvedValue([]),
      hasSharingUrl: jest.fn().mockImplementation(() => true)
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: mapProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    const {getByText, getByTestId} = renderWithTheme(<ShareMapUrlModal {...DEFAULT_PROPS} />);
    expect(getByText('modal.shareMap.title')).toBeInTheDocument();
    expect(getByTestId(dataTestIds.providerShareMap)).toBeInTheDocument();
  });

  test('renders loading when isLoading is set to true', () => {
    const mapProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockResolvedValue([]),
      hasSharingUrl: jest.fn().mockImplementation(() => true)
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: mapProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    const providerLoadingProps = {
      ...DEFAULT_PROPS,
      isProviderLoading: true
    };

    const {getByText} = renderWithTheme(<ShareMapUrlModal {...providerLoadingProps} />);
    expect(getByText('modal.statusPanel.mapUploading')).toBeInTheDocument();
  });

  test('calls onExport when provider is set correctly', () => {
    const mapProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockResolvedValue([]),
      hasSharingUrl: jest.fn().mockImplementation(() => true)
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: mapProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    renderWithTheme(<ShareMapUrlModal {...DEFAULT_PROPS} />);

    expect(DEFAULT_PROPS.onExport).toHaveBeenCalled();
  });

  test('calls onExport after provider was updated', () => {
    const {rerender} = renderWithTheme(<ShareMapUrlModal {...DEFAULT_PROPS} />);

    const mapProvider = {
      name: 'test provider',
      icon: jest.fn(),
      getManagementUrl: jest.fn().mockImplementation(() => 'provider.url'),
      listMaps: jest.fn().mockResolvedValue([]),
      hasSharingUrl: jest.fn().mockImplementation(() => true)
    };
    useCloudListProvider.mockImplementation(() => ({
      provider: mapProvider,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    act(() => {
      rerender(
        <ThemeProvider theme={theme}>
          <IntlProvider locale="en" messages={messages}>
            <ShareMapUrlModal {...DEFAULT_PROPS} />
          </IntlProvider>
        </ThemeProvider>
      );
    });

    expect(DEFAULT_PROPS.onExport).toHaveBeenCalled();
  });

  it('displays share URL when provided', () => {
    const shareUrl = 'http://example.com';
    const {getByText} = renderWithTheme(
      <ShareMapUrlModal {...DEFAULT_PROPS} successInfo={{shareUrl}} />
    );
    expect(getByText('Share Url')).toBeInTheDocument();
  });

  it('renders errors', () => {
    const {getByText} = renderWithTheme(
      <ShareMapUrlModal {...DEFAULT_PROPS} providerError={new Error('timeout')} />
    );
    expect(getByText('modal.statusPanel.error')).toBeInTheDocument();
  });
});

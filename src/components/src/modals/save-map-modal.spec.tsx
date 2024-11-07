// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

/**
 * I decided to move the next to the actual file because it makes it
 * extremely easier to mock adn test features.
 * It's easier to mock items with jest using the relative path
 * rather than trying to mock imports like @kepler.gl/components
 * which creates several side effects.
 * Colocating tests is much easier
 */

import React from 'react';
import {fireEvent} from '@testing-library/react';
import SaveMapModalFactory from './save-map-modal';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {dataTestIds} from '@kepler.gl/constants';

const SaveMapModal = SaveMapModalFactory();

const DEFAULT_PROS = {
  mapInfo: {
    title: 'Test Map',
    description: 'test'
  },
  exportImage: jest.fn(),
  isProviderLoading: false,
  providerError: null,
  onUpdateImageSetting: jest.fn(),
  cleanupExportImage: jest.fn(),
  onSetMapInfo: jest.fn(),
  onCancel: jest.fn(),
  onConfirm: jest.fn()
};

const UNDEFINED_MAP_TITLE_PROPS = {
  ...DEFAULT_PROS,
  mapInfo: {
    description: undefined,
    title: undefined
  }
};

const DEFAULT_PROVIDER = {
  name: 'test provider',
  icon: jest.fn(),
  getManagementUrl: jest.fn().mockImplementation(() => 'provider.url')
};

jest.mock('../hooks/use-cloud-list-provider', () => ({
  useCloudListProvider: jest.fn().mockImplementation(() => ({
    provider: null,
    setProvider: jest.fn(),
    cloudProviders: []
  }))
}));

describe('SaveMapModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SaveMapModal component with provider set to null and map title set', () => {
    const {getByText} = renderWithTheme(<SaveMapModal {...DEFAULT_PROS} />);
    const confirmButton = getByText('modal.button.save');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  test('renders SaveMapModal component with provider set to null and map title not set', () => {
    const {getByText} = renderWithTheme(<SaveMapModal {...UNDEFINED_MAP_TITLE_PROPS} />);
    const confirmButton = getByText('modal.button.save');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  test('renders SaveMapModal component with provider correctly set and map title not set', () => {
    useCloudListProvider.mockImplementation(() => ({
      provider: DEFAULT_PROVIDER,
      setProvider: jest.fn(),
      cloudProviders: []
    }));
    const {getByText} = renderWithTheme(<SaveMapModal {...UNDEFINED_MAP_TITLE_PROPS} />);
    const confirmButton = getByText('modal.button.save');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  test('renders SaveMapModal component with provider correctly set and map title set', () => {
    useCloudListProvider.mockImplementation(() => ({
      provider: DEFAULT_PROVIDER,
      setProvider: jest.fn(),
      cloudProviders: []
    }));
    const {getByText} = renderWithTheme(<SaveMapModal {...DEFAULT_PROS} />);
    const confirmButton = getByText('modal.button.save');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
  });

  test('calls onCancel when cancel button is clicked', () => {
    const {getByText} = renderWithTheme(<SaveMapModal {...DEFAULT_PROS} />);
    fireEvent.click(getByText('modal.button.defaultCancel'));
    expect(DEFAULT_PROS.onCancel).toHaveBeenCalled();
  });

  test('calls onConfirm with provider when confirm button is clicked', () => {
    useCloudListProvider.mockImplementation(() => ({
      provider: DEFAULT_PROVIDER,
      setProvider: jest.fn(),
      cloudProviders: []
    }));
    const {getByText} = renderWithTheme(<SaveMapModal {...DEFAULT_PROS} />);
    const confirmButton = getByText('modal.button.save');
    fireEvent.click(confirmButton);
    expect(DEFAULT_PROS.onConfirm).toHaveBeenCalled();
  });

  test('does not render loading animation when isProviderLoading is true', () => {
    const {queryAllByTestId} = renderWithTheme(<SaveMapModal {...DEFAULT_PROS} />);
    expect(queryAllByTestId(dataTestIds.providerLoading)).toHaveLength(0);
  });

  test('renders loading animation when isProviderLoading is true', () => {
    const {getByTestId} = renderWithTheme(
      <SaveMapModal {...DEFAULT_PROS} isProviderLoading={true} />
    );
    expect(getByTestId(dataTestIds.providerLoading)).toBeInTheDocument();
  });

  test('renders no error if provider error is undefined', () => {
    const {queryAllByText} = renderWithTheme(<SaveMapModal {...DEFAULT_PROS} />);
    expect(queryAllByText('modal.statusPanel.error')).toHaveLength(0);
  });

  test('displays provider error message when providerError is present', () => {
    const {getByText} = renderWithTheme(
      <SaveMapModal {...DEFAULT_PROS} providerError={{message: 'Error message'}} />
    );
    expect(getByText('modal.statusPanel.error')).toBeInTheDocument();
  });

  test('call onSetMapInfo upon typing map (provider is set)', () => {
    useCloudListProvider.mockImplementation(() => ({
      provider: DEFAULT_PROVIDER,
      setProvider: jest.fn(),
      cloudProviders: []
    }));
    const {getByTestId, getByPlaceholderText} = renderWithTheme(
      <SaveMapModal {...UNDEFINED_MAP_TITLE_PROPS} />
    );

    const mapInfoPanel = getByTestId(dataTestIds.providerMapInfoPanel);
    expect(mapInfoPanel).toBeInTheDocument();

    const titleInput = getByPlaceholderText('Type map title');
    expect(titleInput).toBeInTheDocument();

    fireEvent.change(titleInput, {target: {value: 'first kepler map'}});
    expect(DEFAULT_PROS.onSetMapInfo).toHaveBeenCalledWith({title: 'first kepler map'});
  });

  test('call onUpdateImageSetting', () => {
    useCloudListProvider.mockImplementation(() => ({
      provider: DEFAULT_PROVIDER,
      setProvider: jest.fn(),
      cloudProviders: []
    }));

    renderWithTheme(<SaveMapModal {...UNDEFINED_MAP_TITLE_PROPS} />);

    // first time the component mount
    expect(DEFAULT_PROS.onUpdateImageSetting).toHaveBeenCalledWith({
      exporting: true
    });
  });
});

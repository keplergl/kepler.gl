// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {fireEvent} from '@testing-library/react';
import {renderWithTheme} from '../../../../../test/helpers/component-jest-utils';
import {CloudMaps} from './cloud-maps';

describe('CloudMaps Component', () => {
  it('renderWithThemes without crashing', () => {
    const {getByText} = renderWithTheme(<CloudMaps isLoading={false} maps={[]} error={null} />);
    expect(getByText(/noSavedMaps/i)).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const errorMessage = 'Test Error';
    const {getByText} = renderWithTheme(
      <CloudMaps isLoading={false} maps={[]} error={{message: errorMessage}} />
    );
    expect(getByText(`Error while fetching maps: ${errorMessage}`)).toBeInTheDocument();
  });

  it('displays loading spinner when isLoading is true', () => {
    const {getByText} = renderWithTheme(<CloudMaps isLoading={true} maps={[]} error={null} />);
    expect(getByText('modal.loadingDialog.loading')).toBeInTheDocument(); // Ensure your spinner has 'data-testid="loading-spinner"'
  });

  it('renderWithThemes correct number of CloudItems based on maps prop', () => {
    const mockMaps = [
      {id: 1, title: 'map'},
      {id: 2, title: 'map'},
      {id: 3, title: 'map'}
    ];
    const {getAllByText} = renderWithTheme(
      <CloudMaps isLoading={false} maps={mockMaps} error={null} />
    );
    expect(getAllByText('map')).toHaveLength(mockMaps.length); // Ensure your CloudItem has 'data-testid="cloud-item"'
  });

  it('displays message when there are no maps', () => {
    const {getByText} = renderWithTheme(<CloudMaps isLoading={false} maps={[]} error={null} />);
    expect(getByText(/noSavedMaps/i)).toBeInTheDocument();
  });

  it('calls onSelectMap when a CloudItem is clicked', () => {
    const mockMaps = [
      {id: 1, title: 'map'},
      {id: 2, title: 'map'},
      {id: 3, title: 'map'}
    ];
    const onSelectMap = jest.fn();
    const provider = 'testProvider';
    const {getAllByText} = renderWithTheme(
      <CloudMaps
        provider={provider}
        onSelectMap={onSelectMap}
        isLoading={false}
        maps={mockMaps}
        error={null}
      />
    );

    const firstItem = getAllByText('map')[0];
    fireEvent.click(firstItem);
    expect(onSelectMap).toHaveBeenCalledWith(provider, mockMaps[0]);
  });
});

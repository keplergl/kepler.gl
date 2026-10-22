// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import TilesetZarrForm from './tileset-zarr-form';

jest.mock('@kepler.gl/table', () => ({
  getZarrMetadata: jest.fn(),
  selectZarrVariable: jest.fn(metadata => metadata)
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {getZarrMetadata} = require('@kepler.gl/table');

const VALID_URL = 'https://example.com/store.zarr';
const INVALID_URL = 'not a url';

const lastResponse = setResponse => setResponse.mock.calls[setResponse.mock.calls.length - 1][0];

function noop() {
  return;
}

describe('TilesetZarrForm', () => {
  beforeEach(() => {
    getZarrMetadata.mockReset();
  });

  it.each([
    ['CMIP6 Water Resources', 'https://data.source.coop/earthblox/cciwr/data/cciwr.zarr'],
    [
      'ECMWF IFS Ensemble',
      'https://data.source.coop/dynamical/ecmwf-ifs-ens-forecast-15-day-0-25-degree/v0.1.0.zarr'
    ],
    [
      'NOAA HRRR Forecast',
      'https://data.source.coop/dynamical/noaa-hrrr-forecast-48-hour/v0.1.0.zarr'
    ]
  ])('shows details for %s on focus and loads it only when selected', async (name, url) => {
    getZarrMetadata.mockReturnValue(new Promise(noop));
    const {getByRole, getByLabelText} = renderWithTheme(
      <TilesetZarrForm setResponse={jest.fn()} />
    );

    fireEvent.focus(getByRole('button', {name: `About ${name}`}));
    await waitFor(() => {
      expect(getByRole('tooltip')).toHaveTextContent(name);
      expect(getByRole('tooltip')).toHaveTextContent(url);
    });
    expect(getZarrMetadata).not.toHaveBeenCalled();
    expect(getByLabelText('Zarr store URL')).toHaveValue('');

    const example = getByRole('button', {name: `Use ${name}`});
    fireEvent.click(example);
    expect(getByLabelText('Name')).toHaveValue(name);
    expect(getByLabelText('Zarr store URL')).toHaveValue(url);
    expect(example).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(getZarrMetadata).toHaveBeenCalledWith(url));

    fireEvent.change(getByLabelText('Zarr store URL'), {target: {value: INVALID_URL}});
    expect(example).toHaveAttribute('aria-pressed', 'false');
  });

  it('stops loading when the url is edited to an invalid one mid-request', async () => {
    // A request that never settles, standing in for one still in flight.
    getZarrMetadata.mockReturnValue(new Promise(noop));

    const setResponse = jest.fn();
    const {getByPlaceholderText} = renderWithTheme(<TilesetZarrForm setResponse={setResponse} />);
    const input = getByPlaceholderText('Enter Zarr store URL');

    fireEvent.change(input, {target: {value: VALID_URL}});
    await waitFor(() => expect(lastResponse(setResponse).loading).toBe(true), {timeout: 3000});

    fireEvent.change(input, {target: {value: INVALID_URL}});
    await waitFor(() => expect(lastResponse(setResponse).loading).toBe(false), {timeout: 3000});
  });

  it('reports the error from a store it cannot read', async () => {
    getZarrMetadata.mockRejectedValue(new Error('bad store'));

    const setResponse = jest.fn();
    const {getByPlaceholderText} = renderWithTheme(<TilesetZarrForm setResponse={setResponse} />);

    fireEvent.change(getByPlaceholderText('Enter Zarr store URL'), {target: {value: VALID_URL}});

    await waitFor(
      () => {
        const response = lastResponse(setResponse);
        expect(response.loading).toBe(false);
        expect(response.error?.message).toBe('bad store');
      },
      {timeout: 3000}
    );
  });
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {act, fireEvent, waitFor} from '@testing-library/react';
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
    [
      'CMIP6 Water Resources',
      'https://data.source.coop/earthblox/cciwr/data/cciwr.zarr',
      /runoff.*groundwater recharge.*evapotranspiration/i,
      ['season', 'gcm', 'ghm', 'ssp', 'horizon']
    ],
    [
      'ECMWF IFS Ensemble',
      'https://data.source.coop/dynamical/ecmwf-ifs-ens-forecast-15-day-0-25-degree/v0.1.0.zarr',
      /temperature.*precipitation.*wind.*pressure/i,
      ['Valid time', 'init_time', 'lead_time', 'ensemble_member']
    ],
    [
      'NOAA HRRR Forecast',
      'https://data.source.coop/dynamical/noaa-hrrr-forecast-48-hour/v0.1.0.zarr',
      /temperature.*rain.*snow.*wind.*radar reflectivity/i,
      ['Valid time', 'init_time', 'lead_time']
    ]
  ])(
    'shows details for %s on focus and loads it only when selected',
    async (name, url, data, axes) => {
      getZarrMetadata.mockReturnValue(new Promise(noop));
      const {getByRole, getByLabelText} = renderWithTheme(
        <TilesetZarrForm setResponse={jest.fn()} />
      );

      fireEvent.focus(getByRole('button', {name: `About ${name}`}));
      await waitFor(() => {
        expect(getByRole('tooltip')).toHaveTextContent(name);
        expect(getByRole('tooltip')).toHaveTextContent(data);
        for (const axis of axes) {
          expect(getByRole('tooltip')).toHaveTextContent(axis);
        }
      });
      expect(getZarrMetadata).not.toHaveBeenCalled();
      expect(getByLabelText('Zarr store URL')).toHaveValue('');

      const example = getByRole('button', {name: `Use ${name}`});
      fireEvent.click(example);
      expect(getByLabelText('Name')).toHaveValue(name);
      expect(getByLabelText('Zarr store URL')).toHaveValue(url);
      expect(example).toHaveAttribute('aria-pressed', 'true');
      await waitFor(() =>
        expect(getZarrMetadata).toHaveBeenCalledWith(url, {signal: expect.any(AbortSignal)})
      );

      fireEvent.change(getByLabelText('Zarr store URL'), {target: {value: INVALID_URL}});
      expect(example).toHaveAttribute('aria-pressed', 'false');
    }
  );

  it('stops loading when the url is edited to an invalid one mid-request', async () => {
    // A request that never settles, standing in for one still in flight.
    getZarrMetadata.mockReturnValue(new Promise(noop));

    const setResponse = jest.fn();
    const {getByPlaceholderText} = renderWithTheme(<TilesetZarrForm setResponse={setResponse} />);
    const input = getByPlaceholderText('Enter Zarr store URL');

    fireEvent.change(input, {target: {value: VALID_URL}});
    await waitFor(() => expect(lastResponse(setResponse).loading).toBe(true), {timeout: 3000});

    fireEvent.change(input, {target: {value: INVALID_URL}});
    expect(getZarrMetadata.mock.calls[0][1].signal.aborted).toBe(true);
    expect(lastResponse(setResponse)).toMatchObject({loading: false, error: null, dataset: null});
  });

  describe('request lifecycle', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    function startRequest() {
      const setResponse = jest.fn();
      const view = renderWithTheme(<TilesetZarrForm setResponse={setResponse} />);
      const input = view.getByLabelText('Zarr store URL');
      fireEvent.change(input, {target: {value: VALID_URL}});
      act(() => jest.advanceTimersByTime(500));
      return {...view, input, setResponse, signal: getZarrMetadata.mock.calls[0][1].signal};
    }

    it('cancels the debounce when the form closes before a request starts', () => {
      const {getByLabelText, unmount} = renderWithTheme(
        <TilesetZarrForm setResponse={jest.fn()} />
      );
      fireEvent.change(getByLabelText('Zarr store URL'), {target: {value: VALID_URL}});
      unmount();
      act(() => jest.advanceTimersByTime(500));
      expect(getZarrMetadata).not.toHaveBeenCalled();
    });

    it('aborts immediately on a new URL and ignores a stale response', async () => {
      let resolveOld;
      getZarrMetadata.mockReturnValueOnce(new Promise(resolve => (resolveOld = resolve)));
      const latest = {variable: 'latest', variables: [], levels: []};
      getZarrMetadata.mockResolvedValueOnce(latest);
      const {input, signal, setResponse} = startRequest();

      fireEvent.change(input, {target: {value: `${VALID_URL}/new`}});
      expect(signal.aborted).toBe(true);
      expect(getZarrMetadata).toHaveBeenCalledTimes(1);
      expect(lastResponse(setResponse).metadata).toBeNull();
      await act(async () => jest.advanceTimersByTime(500));
      expect(lastResponse(setResponse).metadata).toBe(latest);

      await act(async () => resolveOld({variable: 'stale', variables: [], levels: []}));
      expect(lastResponse(setResponse).metadata).toBe(latest);
      expect(lastResponse(setResponse).error).toBeNull();
    });

    it('aborts on unmount and clears the timeout without reporting an error', () => {
      getZarrMetadata.mockReturnValue(new Promise(noop));
      const {signal, setResponse, unmount} = startRequest();
      unmount();
      expect(signal.aborted).toBe(true);
      setResponse.mockClear();
      act(() => jest.advanceTimersByTime(30_000));
      expect(setResponse).not.toHaveBeenCalled();
    });

    it('aborts a timed-out load, ignores late results, and allows another URL', async () => {
      let resolveLate;
      getZarrMetadata.mockReturnValueOnce(new Promise(resolve => (resolveLate = resolve)));
      const {signal, input, setResponse} = startRequest();
      act(() => jest.advanceTimersByTime(29_999));
      expect(signal.aborted).toBe(false);
      expect(lastResponse(setResponse).loading).toBe(true);
      act(() => jest.advanceTimersByTime(1));
      expect(signal.aborted).toBe(true);
      expect(lastResponse(setResponse)).toMatchObject({loading: false, dataset: null});
      expect(lastResponse(setResponse).error.message).toMatch(/timed out/i);

      await act(async () => resolveLate({variable: 'late', variables: [], levels: []}));
      expect(lastResponse(setResponse).metadata).toBeNull();
      expect(lastResponse(setResponse).error.message).toMatch(/timed out/i);

      const metadata = {variable: 'retry', variables: [], levels: []};
      getZarrMetadata.mockResolvedValueOnce(metadata);
      fireEvent.change(input, {target: {value: `${VALID_URL}/retry`}});
      await act(async () => jest.advanceTimersByTime(500));
      expect(lastResponse(setResponse)).toMatchObject({metadata, loading: false, error: null});
    });

    it('clears the deadline after a successful load', async () => {
      const metadata = {variable: 'success', variables: [], levels: []};
      getZarrMetadata.mockResolvedValue(metadata);
      const {signal, setResponse} = startRequest();
      await act(async () => {
        // Flush the already-resolved metadata promise and its state updates.
      });
      act(() => jest.advanceTimersByTime(30_000));
      expect(signal.aborted).toBe(false);
      expect(lastResponse(setResponse)).toMatchObject({metadata, loading: false, error: null});
    });
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

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {act, fireEvent, waitFor} from '@testing-library/react';
import {DatasetType} from '@kepler.gl/constants';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import LoadTilesetTabFactory from './load-tileset';
import {getZarrMetadataPreview} from './zarr-metadata-preview';

jest.mock('./tileset-vector-form', () => () => null);
jest.mock('react-virtualized', () => ({
  AutoSizer: ({children}) => children({height: 400, width: 500})
}));
jest.mock('@kepler.gl/table', () => ({
  getZarrMetadata: jest.fn(),
  selectZarrVariable: jest.fn(metadata => metadata)
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {getZarrMetadata} = require('@kepler.gl/table');
const LoadTilesetTab = LoadTilesetTabFactory();

describe('Zarr metadata preview', () => {
  let previousZarrFlag;
  beforeEach(() => {
    previousZarrFlag = getApplicationConfig().enableZarrLayer;
    initApplicationConfig({enableZarrLayer: true});
    getZarrMetadata.mockReset();
  });
  afterEach(() => initApplicationConfig({enableZarrLayer: previousZarrFlag}));

  it.each([true, false])('respects enableZarrLayer=%s in Add Data', enabled => {
    initApplicationConfig({enableZarrLayer: enabled});
    const {queryByText, getByText} = renderWithTheme(
      <IntlWrapper>
        <LoadTilesetTab onTilesetAdded={jest.fn()} isAddingDatasets={false} />
      </IntlWrapper>
    );
    expect(Boolean(queryByText('Zarr'))).toBe(enabled);
    expect(getByText('Vector Tile')).toBeTruthy();
    expect(getZarrMetadata).not.toHaveBeenCalled();
  });

  it('aborts metadata requests when switching away from the Zarr tab', async () => {
    getZarrMetadata.mockReturnValue(
      new Promise(() => {
        // Keep metadata pending until the user leaves the tab.
      })
    );
    const {getByText, getByRole} = renderWithTheme(
      <IntlWrapper>
        <LoadTilesetTab onTilesetAdded={jest.fn()} isAddingDatasets={false} />
      </IntlWrapper>
    );
    fireEvent.click(getByText('Zarr'));
    fireEvent.click(getByRole('button', {name: 'Use NOAA HRRR Forecast'}));
    await waitFor(() => expect(getZarrMetadata).toHaveBeenCalled());
    const {signal} = getZarrMetadata.mock.calls[0][1];
    expect(signal.aborted).toBe(false);
    fireEvent.click(getByText('Vector Tile'));
    expect(signal.aborted).toBe(true);
  });

  it('shows download progress and processing until the metadata is ready to add', async () => {
    let resolveMetadata;
    getZarrMetadata.mockReturnValue(new Promise(resolve => (resolveMetadata = resolve)));
    const {container, getByText, getByRole, findByRole, queryByRole} = renderWithTheme(
      <IntlWrapper>
        <LoadTilesetTab onTilesetAdded={jest.fn()} isAddingDatasets={false} />
      </IntlWrapper>
    );
    fireEvent.click(getByText('Zarr'));
    fireEvent.click(getByRole('button', {name: 'Use NOAA HRRR Forecast'}));
    await waitFor(() => expect(getZarrMetadata).toHaveBeenCalled());

    const bar = await findByRole('progressbar', {name: 'Zarr metadata loading'});
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('aria-valuetext', expect.stringContaining('Connecting'));
    const {onProgress} = getZarrMetadata.mock.calls[0][1];
    act(() => onProgress({phase: 'downloading', loadedBytes: 5_000_000, totalBytes: 10_000_000}));
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuetext', expect.stringContaining('5.0 MB / 10.0 MB'));
    expect(container.querySelector('.load-data-footer button')).toBeDisabled();

    act(() => onProgress({phase: 'downloading', loadedBytes: 6_000_000}));
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('total size unavailable')
    );
    act(() => onProgress({phase: 'processing', loadedBytes: 10_000_000}));
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('aria-valuetext', expect.stringContaining('Reading variables'));

    act(() => onProgress({phase: 'connecting', loadedBytes: 10_000_000}));
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('Waiting for metadata response')
    );
    expect(bar).toHaveAttribute('aria-valuetext', expect.stringContaining('10.0 MB received'));

    await act(async () =>
      resolveMetadata({variable: 'climate', variables: [], levels: [], nonSpatialDims: []})
    );
    expect(queryByRole('progressbar')).not.toBeInTheDocument();
    expect(getByRole('button', {name: 'Add Tileset'})).toBeEnabled();
  });

  it.each([
    ['ECMWF IFS Ensemble', 935, 19],
    ['NOAA HRRR Forecast', 12094, 29]
  ])('bounds the %s preview while adding complete metadata', async (name, count, variableCount) => {
    const values = Array.from({length: count}, (_, i) => Date.UTC(2024, 0, 1) + i * 3600000);
    // Fail before creating a huge DOM if full-array serialization is reintroduced.
    values.toJSON = jest.fn(() => {
      throw new Error('The preview must not serialize full coordinate arrays');
    });
    const timeDimension = {
      name: 'init_time',
      size: count,
      kind: 'time',
      values,
      rawValues: values
    };
    const metadata = {
      url: 'https://example.com/forecast.zarr',
      variable: 'variable_0',
      axes: ['init_time', 'y', 'x'],
      xAxisIndex: 2,
      yAxisIndex: 1,
      levels: [{path: '.', shape: [2, 2], chunks: [2, 2]}],
      nonSpatialDims: [timeDimension],
      timeDimension,
      variables: Array.from({length: variableCount}, (_, i) => ({
        path: `variable_${i}`,
        name: `variable_${i}`,
        displayName: `Variable ${i}`,
        dtype: 'float32',
        shape: [count, 2, 2],
        chunks: [1, 2, 2],
        nonSpatialDims: [timeDimension],
        timeDimension
      }))
    };
    getZarrMetadata.mockResolvedValue(metadata);
    const onTilesetAdded = jest.fn();
    const {container, getByText, getByRole} = renderWithTheme(
      <IntlWrapper>
        <LoadTilesetTab onTilesetAdded={onTilesetAdded} isAddingDatasets={false} />
      </IntlWrapper>
    );
    fireEvent.click(getByText('Zarr'));
    fireEvent.click(getByRole('button', {name: `Use ${name}`}));
    await waitFor(() => expect(container.querySelector('#json-pretty')).not.toBeNull());

    const preview = JSON.parse(container.querySelector('#json-pretty').textContent);
    expect(preview.variableCount).toBe(variableCount);
    expect(preview.omittedVariables).toBe(Math.max(0, variableCount - 20));
    expect(preview.dimensions[0].coordinates).toEqual({
      count,
      first: values.slice(0, 3),
      last: values.slice(-3)
    });
    expect(container.querySelectorAll('#json-pretty span').length).toBeLessThan(500);
    expect(values.toJSON).not.toHaveBeenCalled();

    fireEvent.click(getByRole('button', {name: 'Add Tileset'}));
    const [dataset, addedMetadata] = onTilesetAdded.mock.calls[0];
    expect(dataset.type).toBe(DatasetType.ZARR);
    expect(addedMetadata).toBe(metadata);
    expect(addedMetadata.variables).toHaveLength(variableCount);
    expect(addedMetadata.variables[0].nonSpatialDims[0].values).toBe(values);
    expect(values).toHaveLength(count);
  });

  it('handles missing and empty coordinates and previews the selected variable', () => {
    const metadata = {
      url: 'https://example.com/empty.zarr',
      variable: 'second',
      levels: [],
      nonSpatialDims: [],
      variables: [
        {path: 'first', displayName: 'First', nonSpatialDims: []},
        {
          path: 'second',
          displayName: 'Second',
          nonSpatialDims: [
            {name: 'band', size: 2},
            {name: 'time', size: 0, values: []}
          ]
        }
      ]
    };
    const preview = getZarrMetadataPreview(metadata);
    expect(preview.selectedVariable.path).toBe('second');
    expect(preview.dimensions[0].coordinates).toBeUndefined();
    expect(preview.dimensions[1].coordinates).toEqual({count: 0, first: []});
    expect(getZarrMetadataPreview({...metadata, variables: []}).selectedVariable).toBeUndefined();
  });
});

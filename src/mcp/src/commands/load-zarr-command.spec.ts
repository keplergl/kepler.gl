// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getLoadZarrCommand} from './load-zarr-command';
import {getZarrMetadata} from '@kepler.gl/table';
import {DatasetType} from '@kepler.gl/constants';
import type {KeplerContext, RoomCommandResult} from './types';

jest.mock('@kepler.gl/table', () => ({getZarrMetadata: jest.fn()}));

const metadata = {
  url: 'https://example.com/data.zarr',
  variables: [
    {
      path: 'temperature',
      displayName: 'temperature',
      nonSpatialDims: [{name: 'time', size: 10, kind: 'time'}],
      dataRange: [250, 310]
    }
  ]
};
function setup() {
  const dispatch = jest.fn();
  const command = getLoadZarrCommand({dispatch} as unknown as KeplerContext);
  return {
    dispatch,
    execute: async (input: unknown, signal?: AbortSignal) =>
      (await command.execute({signal} as any, input)) as RoomCommandResult<any>
  };
}
const input = {url: metadata.url, datasetName: 'Forecast'};

describe('map.load-zarr', () => {
  beforeEach(() => {
    (getZarrMetadata as jest.Mock).mockReset().mockResolvedValue(metadata);
  });

  it('imports tileset metadata without tabular parsing or auto-created layers', async () => {
    const {dispatch, execute} = setup();
    const signal = new AbortController().signal;
    const result = await execute({...input, variable: 'temperature'}, signal);
    expect(result.success).toBe(true);
    expect(getZarrMetadata).toHaveBeenCalledWith(input.url, {variable: 'temperature', signal});
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].payload).toMatchObject({
      datasets: [
        {
          info: {id: result.data.datasetId, label: 'Forecast', type: DatasetType.ZARR},
          data: {fields: [], rows: []},
          metadata,
          disableDataOperation: true
        }
      ],
      options: {autoCreateLayers: false}
    });
    expect(result.data.variables).toEqual([
      {
        path: 'temperature',
        name: 'temperature',
        dimensions: [{name: 'time', size: 10, kind: 'time'}],
        dataRange: [250, 310]
      }
    ]);
  });

  it.each([
    {...input, url: 'file:///tmp/data.zarr'},
    {...input, url: ''},
    {...input, datasetName: ''},
    {}
  ])('rejects invalid imports without fetching: %j', async args => {
    const {dispatch, execute} = setup();
    expect((await execute(args)).success).toBe(false);
    expect(getZarrMetadata).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not import after cancellation during metadata loading', async () => {
    const {dispatch, execute} = setup();
    const controller = new AbortController();
    (getZarrMetadata as jest.Mock).mockImplementation(async () => {
      controller.abort();
      return metadata;
    });
    expect((await execute(input, controller.signal)).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('reports metadata failures without creating a dataset', async () => {
    const {dispatch, execute} = setup();
    (getZarrMetadata as jest.Mock).mockRejectedValue(new Error('Store unavailable'));
    expect(await execute(input)).toMatchObject({success: false, error: 'Store unavailable'});
    expect(dispatch).not.toHaveBeenCalled();
  });
});

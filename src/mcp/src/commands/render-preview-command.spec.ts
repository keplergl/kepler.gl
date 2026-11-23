// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getRenderPreviewCommand} from './render-preview-command';
import type {KeplerContext, RoomCommandResult} from './types';

const dimensions = {width: 1920, height: 1080};
const image = {...dimensions, mimeType: 'image/png', data: 'cG5n'};

function setup(renderer: jest.Mock | undefined = jest.fn().mockResolvedValue(image)) {
  const dispatch = jest.fn();
  const command = getRenderPreviewCommand({
    renderPreviewFrame: renderer,
    dispatch
  } as unknown as KeplerContext);
  return {
    dispatch,
    renderer,
    execute: async (input: unknown, signal?: AbortSignal) =>
      (await command.execute({signal} as any, input)) as RoomCommandResult<any>
  };
}

describe('map.render-preview', () => {
  it('returns the native PNG at the requested time, camera and resolution without dispatching', async () => {
    const {execute, renderer, dispatch} = setup();
    const signal = new AbortController().signal;
    const options = {...dimensions, dataTime: 0, cameraTimeMs: 1200};
    expect(await execute(options, signal)).toEqual({
      success: true,
      commandId: 'map.render-preview',
      data: {...image, ...options}
    });
    expect(renderer).toHaveBeenCalledWith(options, signal);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('leaves omitted timestamps for the renderer to preserve', async () => {
    const {execute, renderer} = setup();
    expect((await execute(dimensions)).success).toBe(true);
    expect(renderer).toHaveBeenCalledWith(dimensions, undefined);
  });

  it.each([
    {},
    null,
    {...dimensions, width: 0},
    {...dimensions, width: 1.5},
    {...dimensions, height: -1},
    {...dimensions, height: 8193},
    {...dimensions, width: '1920'},
    {width: 8192, height: 8192},
    {...dimensions, dataTime: NaN},
    {...dimensions, dataTime: Infinity},
    {...dimensions, cameraTimeMs: -1},
    {...dimensions, cameraTimeMs: Infinity}
  ])('rejects invalid input without rendering: %j', async input => {
    const {execute, renderer, dispatch} = setup();
    expect((await execute(input)).success).toBe(false);
    expect(renderer).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('explains when the host does not support preview rendering', async () => {
    const command = getRenderPreviewCommand({} as KeplerContext);
    expect(await command.execute({} as any, dimensions)).toMatchObject({
      success: false,
      error: expect.stringContaining('host does not support native preview rendering')
    });
  });

  it('does not start rendering after cancellation', async () => {
    const {execute, renderer} = setup();
    const controller = new AbortController();
    controller.abort();
    expect(await execute(dimensions, controller.signal)).toMatchObject({
      success: false,
      error: expect.stringContaining('cancelled')
    });
    expect(renderer).not.toHaveBeenCalled();
  });

  it('does not return a frame after cancellation during rendering', async () => {
    const controller = new AbortController();
    const {execute} = setup(
      jest.fn().mockImplementation(async () => {
        controller.abort();
        return image;
      })
    );
    expect(await execute(dimensions, controller.signal)).toMatchObject({
      success: false,
      error: expect.stringContaining('cancelled')
    });
  });

  it('reports native renderer failures', async () => {
    const {execute} = setup(jest.fn().mockRejectedValue(new Error('Tiles did not finish loading')));
    expect(await execute(dimensions)).toMatchObject({
      success: false,
      error: 'Cannot render preview frame: Tiles did not finish loading'
    });
  });

  it('reports oversized images before they reach the bridge message limit', async () => {
    const {execute} = setup(
      jest.fn().mockResolvedValue({...image, data: 'A'.repeat(64 * 1024 * 1024 + 1)})
    );
    expect(await execute(dimensions)).toMatchObject({
      success: false,
      error: expect.stringContaining('Reduce the output dimensions')
    });
  });

  it.each([
    {...image, data: ''},
    {...image, width: 100},
    {...image, mimeType: 'image/jpeg'}
  ])('rejects missing or mismatched frame output: %j', async output => {
    const {execute} = setup(jest.fn().mockResolvedValue(output));
    expect(await execute(dimensions)).toMatchObject({
      success: false,
      error: expect.stringContaining('PNG at the requested dimensions')
    });
  });
});

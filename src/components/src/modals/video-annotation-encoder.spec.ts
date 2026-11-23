// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAnnotationVideoEncoder, VideoAnnotationFrame} from './video-annotation-encoder';
import {compositeVideoAnnotations} from './video-annotation-overlay';
import type {FrameEncoder} from '@hubble.gl/core';

jest.mock('./video-annotation-overlay', () => ({compositeVideoAnnotations: jest.fn()}));

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => {
    resolve = done;
  });
  return {promise, resolve};
}

const annotation = {id: 'label', isVisible: true, mapIndex: 0};
const mockAdd = jest.fn();
const mockCancel = jest.fn();
class BaseEncoder {
  extension = '.webm';
  mimeType = 'video/webm';
  async add(canvas: HTMLCanvasElement) {
    mockAdd(canvas);
  }
  cancel() {
    mockCancel();
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage: jest.fn()
  } as any);
});
afterEach(() => jest.restoreAllMocks());

function setup(annotations = [annotation]) {
  const frame = {
    annotations,
    mapState: {longitude: 10, latitude: 20, zoom: 4},
    width: 320,
    height: 180
  } as unknown as VideoAnnotationFrame;
  let active = true;
  const onError = jest.fn();
  const Encoder = createAnnotationVideoEncoder(
    BaseEncoder as unknown as typeof FrameEncoder,
    () => frame,
    () => active,
    onError
  );
  const encoder = new Encoder();
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  return {frame, encoder, canvas, onError, stop: () => (active = false)};
}

test.each(
  [[], [{...annotation, isVisible: false}], [{...annotation, mapIndex: 1}]].map(annotations => ({
    annotations
  }))
)(
  'skips rasterization and preserves the source canvas without visible annotations: %j',
  async ({annotations}) => {
    const {encoder, canvas} = setup(annotations);
    await encoder.add(canvas);
    expect(mockAdd).toHaveBeenCalledWith(canvas);
    expect(compositeVideoAnnotations).not.toHaveBeenCalled();
    expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
  }
);

test('freezes pixels, camera, animation time and readouts before annotation composition and encoding', async () => {
  const pending = deferred();
  jest.mocked(compositeVideoAnnotations).mockReturnValueOnce(pending.promise);
  const {frame, encoder, canvas} = setup();
  frame.animationTimeMs = 2500;
  frame.readoutValues = {label: '2026-01-01'};
  const result = encoder.add(canvas);
  frame.mapState.zoom = 10;
  frame.animationTimeMs = 9000;
  frame.readoutValues.label = '2026-01-02';
  await Promise.resolve();
  await Promise.resolve();
  expect(mockAdd).not.toHaveBeenCalled();
  const [output, snapshot] = jest.mocked(compositeVideoAnnotations).mock.calls[0];
  expect(output).not.toBe(canvas);
  expect([output.width, output.height]).toEqual([1280, 720]);
  expect(output.getContext('2d')!.drawImage).toHaveBeenCalledWith(canvas, 0, 0);
  expect(snapshot.mapState.zoom).toBe(4);
  expect(snapshot.animationTimeMs).toBe(2500);
  expect(snapshot.readoutValues).toEqual({label: '2026-01-01'});
  pending.resolve();
  await result;
  expect(mockAdd).toHaveBeenCalledWith(output);
  expect(encoder.extension).toBe('.webm');
});

test('does not submit an annotated frame after recording is canceled', async () => {
  const pending = deferred();
  jest.mocked(compositeVideoAnnotations).mockReturnValueOnce(pending.promise);
  const {encoder, canvas, stop, onError} = setup();
  const result = encoder.add(canvas);
  await Promise.resolve();
  await Promise.resolve();
  stop();
  pending.resolve();
  await expect(result).rejects.toMatchObject({name: 'AbortError'});
  expect(mockAdd).not.toHaveBeenCalled();
  expect(onError).not.toHaveBeenCalled();
});

test('reports rasterization failure without submitting a missing-annotation frame', async () => {
  const error = new Error('rasterization failed');
  jest.mocked(compositeVideoAnnotations).mockRejectedValueOnce(error);
  const {encoder, canvas, onError} = setup();
  await expect(encoder.add(canvas)).rejects.toBe(error);
  expect(onError).toHaveBeenCalledWith(error);
  expect(mockAdd).not.toHaveBeenCalled();
});

test('can cancel annotation rasterization without discarding partial encoder output', async () => {
  const pending = deferred();
  jest.mocked(compositeVideoAnnotations).mockReturnValueOnce(pending.promise);
  const {encoder, canvas, stop} = setup();
  const result = encoder.add(canvas);
  await Promise.resolve();
  await Promise.resolve();
  const signal = jest.mocked(compositeVideoAnnotations).mock.calls[0][2]!;
  (encoder as any).cancelAnnotationCapture();
  expect(signal.aborted).toBe(true);
  expect(mockCancel).not.toHaveBeenCalled();
  (encoder as any).cancel();
  expect(mockCancel).toHaveBeenCalledTimes(1);
  stop();
  pending.resolve();
  await expect(result).rejects.toMatchObject({name: 'AbortError'});
});

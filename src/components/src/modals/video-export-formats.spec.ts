// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getNativeWebMConfig} from './video-export-formats';

const encoder = Object.getOwnPropertyDescriptor(globalThis, 'VideoEncoder');
const frame = Object.getOwnPropertyDescriptor(globalThis, 'VideoFrame');
afterEach(() => {
  if (encoder) Object.defineProperty(globalThis, 'VideoEncoder', encoder);
  else Reflect.deleteProperty(globalThis, 'VideoEncoder');
  if (frame) Object.defineProperty(globalThis, 'VideoFrame', frame);
  else Reflect.deleteProperty(globalThis, 'VideoFrame');
});
function install(probe: jest.Mock) {
  Object.defineProperty(globalThis, 'VideoEncoder', {
    configurable: true,
    value: {isConfigSupported: probe}
  });
  Object.defineProperty(globalThis, 'VideoFrame', {configurable: true, value: class {}});
}
test('chooses VP8 when VP9 is unavailable, using requested dimensions and cadence', async () => {
  const probe = jest.fn(async config => ({supported: config.codec === 'vp8', config}));
  install(probe);
  expect(await getNativeWebMConfig(1920, 1080, 30)).toMatchObject({
    codec: 'vp8',
    config: {width: 1920, height: 1080, framerate: 30}
  });
  expect(probe.mock.calls.map(([config]) => config.codec)).toEqual(['vp09.00.51.08', 'vp8']);
});
test('returns no native config when capability probes reject', async () => {
  install(jest.fn().mockRejectedValue(new Error('not supported')));
  expect(await getNativeWebMConfig(1280, 720)).toBeUndefined();
});
test('works without browser codec globals (including SSR)', async () => {
  Reflect.deleteProperty(globalThis, 'VideoEncoder');
  Reflect.deleteProperty(globalThis, 'VideoFrame');
  expect(await getNativeWebMConfig(1280, 720)).toBeUndefined();
});

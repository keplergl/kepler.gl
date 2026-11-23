// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {getVideoExportCommand} from './video-export-command';
import type {KeplerContext, RoomCommandResult} from './types';
import type {VideoExportProvider} from '../video-export';

const settings = {width: 1920, height: 1080, durationMs: 20000, frameRate: 30, format: 'webm'};
function fixture() {
  const videoExport = {
    getCapabilities: jest.fn(async () => ({
      available: true,
      formats: ['webm'],
      dimensions: [{width: 1920, height: 1080}],
      frameRates: [30]
    })),
    start: jest.fn(async () => ({jobId: 'video-1', status: 'queued', progress: 0, settings})),
    status: jest.fn(() => ({jobId: 'video-1', status: 'rendering', progress: 0.5, settings})),
    cancel: jest.fn(() => ({jobId: 'video-1', status: 'cancelled', progress: 0.5, settings})),
    read: jest.fn(async () => ({
      base64: 'YQ==',
      offset: 0,
      nextOffset: 1,
      totalBytes: 1,
      mimeType: 'video/webm',
      fileName: 'video.webm'
    })),
    cancelActive: jest.fn(),
    dispose: jest.fn()
  };
  const command = getVideoExportCommand({
    videoExport: videoExport as unknown as VideoExportProvider
  } as KeplerContext);
  const execute = async (input: unknown, signal?: AbortSignal) =>
    (await command.execute({signal} as any, input)) as RoomCommandResult;
  return {videoExport, execute};
}

test('reports the connected renderer capabilities and probes requested dimensions', async () => {
  const {videoExport, execute} = fixture();
  expect(await execute({action: 'capabilities', width: 1920, height: 1080})).toMatchObject({
    success: true,
    data: {available: true, frameRates: [30]}
  });
  expect(videoExport.getCapabilities).toHaveBeenCalledWith({width: 1920, height: 1080});
});

test('starts an asynchronous export and exposes status, cancellation, and chunk retrieval', async () => {
  const {videoExport, execute} = fixture();
  expect(await execute({action: 'start', settings})).toMatchObject({
    success: true,
    data: {jobId: 'video-1', status: 'queued'}
  });
  expect(videoExport.start).toHaveBeenCalledWith(settings);
  expect(await execute({action: 'status', jobId: 'video-1'})).toMatchObject({
    success: true,
    data: {progress: 0.5}
  });
  expect(await execute({action: 'cancel', jobId: 'video-1'})).toMatchObject({
    success: true,
    data: {status: 'cancelled'}
  });
  expect(await execute({action: 'read', jobId: 'video-1', offset: 0})).toMatchObject({
    success: true,
    data: {nextOffset: 1}
  });
  expect(videoExport.read).toHaveBeenCalledWith('video-1', 0);
});

test.each([
  undefined,
  {},
  {action: 'start'},
  {action: 'start', settings: {...settings, durationMs: 0}},
  {action: 'start', settings: {...settings, frameRate: 60}},
  {action: 'start', settings: {...settings, width: '1920'}},
  {action: 'status', jobId: ''},
  {action: 'read', jobId: 'video-1', offset: -1},
  {action: 'capabilities', width: 1920}
])('rejects invalid input without starting a job (%j)', async input => {
  const {videoExport, execute} = fixture();
  expect(await execute(input)).toMatchObject({success: false, error: expect.any(String)});
  expect(videoExport.start).not.toHaveBeenCalled();
});

test('a host without a renderer reports unavailable capabilities and actionable start failure', async () => {
  const command = getVideoExportCommand({} as KeplerContext);
  expect(await command.execute({} as any, {action: 'capabilities'})).toMatchObject({
    success: true,
    data: {available: false, formats: []}
  });
  expect(await command.execute({} as any, {action: 'start', settings})).toMatchObject({
    success: false,
    error: expect.stringMatching(/Update or reconnect/)
  });
});

test('preserves actionable service failures', async () => {
  const {videoExport, execute} = fixture();
  videoExport.start.mockRejectedValue(
    new Error('A video export is already running. Wait and retry.')
  );
  expect(await execute({action: 'start', settings})).toMatchObject({
    success: false,
    error: 'A video export is already running. Wait and retry.'
  });
});

test('does not start a video after its command has already been cancelled', async () => {
  const {videoExport, execute} = fixture();
  const controller = new AbortController();
  controller.abort();

  expect(await execute({action: 'start', settings}, controller.signal)).toMatchObject({
    success: false,
    error: expect.stringContaining('start was cancelled')
  });
  expect(videoExport.start).not.toHaveBeenCalled();
});

test('cancels an undelivered job if the command aborts while start is pending', async () => {
  const {videoExport, execute} = fixture();
  const controller = new AbortController();
  let finishStart!: (job: Awaited<ReturnType<typeof videoExport.start>>) => void;
  videoExport.start.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finishStart = resolve;
      })
  );

  const pending = execute({action: 'start', settings}, controller.signal);
  controller.abort();
  finishStart({jobId: 'video-1', status: 'queued', progress: 0, settings});

  expect(await pending).toMatchObject({
    success: false,
    error: expect.stringContaining('start was cancelled')
  });
  expect(videoExport.cancel).toHaveBeenCalledWith('video-1');
});

test('a delivered job continues after its start command signal is released', async () => {
  const {videoExport, execute} = fixture();
  const controller = new AbortController();

  expect(await execute({action: 'start', settings}, controller.signal)).toMatchObject({
    success: true,
    data: {jobId: 'video-1'}
  });
  controller.abort();
  expect(videoExport.cancel).not.toHaveBeenCalled();
});

test('advertises an MCP-compatible object input schema', () => {
  const command = getVideoExportCommand({} as KeplerContext);
  expect(z.toJSONSchema(command.inputSchema!)).toMatchObject({
    type: 'object',
    required: ['action']
  });
});

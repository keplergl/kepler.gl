// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {randomUUID} from 'node:crypto';
import {mkdtemp, open, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const MAX_VIDEO_BYTES = 256 * 1024 * 1024;
const MAX_CHUNK_BYTES = 256 * 1024;
const MAX_VIDEO_RESOURCES = 5;

export type VideoResource = {
  uri: string;
  name: string;
  fileName: string;
  filePath: string;
  mimeType: 'video/webm';
  size: number;
};

type StoredVideo = {resource: VideoResource; directory: string};

/** Files belong to this bridge session, never to a path supplied by the page. */
export class VideoArtifacts {
  private readonly stored = new Map<string, StoredVideo>();
  private readonly pending = new Map<string, Promise<VideoResource>>();
  private closed = false;

  list(): VideoResource[] {
    return [...this.stored.values()].map(({resource}) => ({...resource}));
  }

  async read(uri: string): Promise<{uri: string; mimeType: string; blob: string}> {
    const video = [...this.stored.values()].find(item => item.resource.uri === uri);
    if (!video) {
      throw new Error('Video resource is unavailable or expired. Export the video again.');
    }
    return {
      uri,
      mimeType: video.resource.mimeType,
      blob: (await readFile(video.resource.filePath)).toString('base64')
    };
  }

  async collect(
    key: string,
    artifact: {size?: unknown; mimeType?: unknown},
    readChunk: (offset: number) => Promise<unknown>
  ): Promise<VideoResource> {
    if (this.closed) throw new Error('The bridge was closed before the video could be retrieved.');
    const cached = this.stored.get(key);
    if (cached) return {...cached.resource};
    const existing = this.pending.get(key);
    if (existing) return existing;
    const {size, mimeType} = artifact;
    if (
      !Number.isSafeInteger(size) ||
      (size as number) <= 0 ||
      (size as number) > MAX_VIDEO_BYTES ||
      mimeType !== 'video/webm'
    ) {
      throw new Error(
        'The video artifact must be a non-empty WebM file no larger than 256 MiB. Retry with a shorter duration or lower resolution.'
      );
    }
    const transfer = this.transfer(key, size as number, readChunk);
    this.pending.set(key, transfer);
    try {
      return await transfer;
    } finally {
      this.pending.delete(key);
    }
  }

  private async transfer(
    key: string,
    size: number,
    readChunk: (offset: number) => Promise<unknown>
  ): Promise<VideoResource> {
    const directory = await mkdtemp(join(tmpdir(), 'kepler-video-'));
    const id = randomUUID();
    const fileName = `kepler-${id}.webm`;
    const filePath = join(directory, fileName);
    let complete = false;
    try {
      const file = await open(filePath, 'wx', 0o600);
      try {
        let offset = 0;
        while (offset < size) {
          const chunk = (await readChunk(offset)) as any;
          if (
            this.closed ||
            !chunk ||
            chunk.offset !== offset ||
            chunk.totalBytes !== size ||
            chunk.mimeType !== 'video/webm' ||
            typeof chunk.base64 !== 'string' ||
            chunk.base64.length > Math.ceil(MAX_CHUNK_BYTES / 3) * 4 ||
            !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(chunk.base64)
          ) {
            throw new Error(
              'Video transfer was interrupted or returned invalid data. Retry the status request.'
            );
          }
          const bytes = Buffer.from(chunk.base64, 'base64');
          if (
            !bytes.length ||
            bytes.length > MAX_CHUNK_BYTES ||
            offset + bytes.length > size ||
            chunk.nextOffset !== offset + bytes.length
          ) {
            throw new Error(
              'Video transfer returned an invalid chunk size. Retry the status request.'
            );
          }
          // FileHandle.write may make partial progress; writeFile handles the
          // entire chunk at the descriptor's current position.
          await file.writeFile(bytes);
          offset = chunk.nextOffset;
        }
      } finally {
        await file.close();
      }
      if (this.closed)
        throw new Error('The bridge was closed before the video could be retrieved.');
      while (
        this.stored.size >= MAX_VIDEO_RESOURCES ||
        [...this.stored.values()].reduce((total, video) => total + video.resource.size, size) >
          MAX_VIDEO_BYTES
      ) {
        const oldest = this.stored.entries().next().value!;
        this.stored.delete(oldest[0]);
        await rm(oldest[1].directory, {recursive: true, force: true});
      }
      const resource: VideoResource = {
        uri: `kepler://video/${id}`,
        name: fileName,
        fileName,
        filePath,
        mimeType: 'video/webm',
        size
      };
      this.stored.set(key, {resource, directory});
      complete = true;
      return {...resource};
    } finally {
      if (!complete) await rm(directory, {recursive: true, force: true});
    }
  }

  async close(): Promise<void> {
    this.closed = true;
    await Promise.allSettled(this.pending.values());
    const videos = [...this.stored.values()];
    this.stored.clear();
    await Promise.all(videos.map(video => rm(video.directory, {recursive: true, force: true})));
  }
}

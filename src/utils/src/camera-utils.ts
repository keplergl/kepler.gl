// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CameraBookmark, CameraSnapshot} from '@kepler.gl/types';

/** Copy only the saved camera fields; never retain transitions or viewport dimensions. */
export function getCameraSnapshot(value: unknown): CameraSnapshot | null {
  if (!value || typeof value !== 'object') return null;
  const {longitude, latitude, zoom, bearing, pitch} = value as CameraSnapshot;
  if (
    ![longitude, latitude, zoom, bearing, pitch].every(Number.isFinite) ||
    Math.abs(latitude) > 90 ||
    pitch < 0 ||
    pitch > 90
  ) {
    return null;
  }
  return {longitude, latitude, zoom, bearing, pitch};
}

/** Validate imported bookmarks, preserving order and the first occurrence of each ID. */
export function normalizeCameraBookmarks(value: unknown): CameraBookmark[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  const bookmarks: CameraBookmark[] = [];
  for (const item of value) {
    if (
      !item ||
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      typeof item.name !== 'string' ||
      ids.has(item.id)
    )
      continue;
    const camera = getCameraSnapshot(item.camera);
    if (!camera) continue;
    ids.add(item.id);
    bookmarks.push({id: item.id, name: item.name, camera});
  }
  return bookmarks;
}

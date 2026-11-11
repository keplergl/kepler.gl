// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GLOBE_MIN_ZOOM, GLOBE_MAX_ZOOM, GLOBE_MAX_LATITUDE} from '@kepler.gl/constants';
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

/** Adapt a saved camera to the current projection without changing the saved view. */
export function cameraForMap(camera: CameraSnapshot, globe = false): CameraSnapshot {
  if (!globe) return camera;
  const latitude = Math.max(-GLOBE_MAX_LATITUDE, Math.min(GLOBE_MAX_LATITUDE, camera.latitude));
  const adjustment = Math.log2(Math.cos((latitude * Math.PI) / 180));
  return {
    ...camera,
    latitude,
    pitch: 0,
    bearing: 0,
    zoom: Math.min(GLOBE_MAX_ZOOM + adjustment, Math.max(GLOBE_MIN_ZOOM + adjustment, camera.zoom))
  };
}

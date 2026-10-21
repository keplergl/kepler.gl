// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** A saved Mercator view, independent of viewport size and animation state. */
export type CameraSnapshot = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
};

export type CameraBookmark = {
  id: string;
  name: string;
  camera: CameraSnapshot;
};

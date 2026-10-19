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

/** Stops own their camera snapshots; there is no live bookmark reference. */
export type CameraTourStop = CameraBookmark & {
  holdDurationMs: number;
  /** Travel to the next stop; ignored for the final stop. */
  travelDurationMs: number;
};

export type CameraTour = {
  stops: CameraTourStop[];
};

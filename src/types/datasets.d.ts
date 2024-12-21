// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export type ZoomStops = number[][];

export type DomainStops = {
  z: number[];
  stops: ZoomStops;
  interpolation: 'interpolate';
};

export type ZoomStopsConfig = {
  enabled?: boolean;
  stops: ZoomStops | null;
};

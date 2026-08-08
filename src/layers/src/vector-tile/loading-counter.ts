// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Global counter that represents the number of tiles currently being loaded across all the vector tile layers
let vectorTilesBeingLoaded = 0;

// This is a temp solution to track loading
export const getNumVectorTilesBeingLoaded = () => {
  return vectorTilesBeingLoaded;
};

export const incrementVectorTileLoading = () => {
  vectorTilesBeingLoaded++;
};

export const decrementVectorTileLoading = () => {
  vectorTilesBeingLoaded--;
};

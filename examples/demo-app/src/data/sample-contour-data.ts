// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const contourDataId = 'scalar-contour-sample';

/** Deterministic synthetic scalar field, sampled on a grid or at scattered positions. */
export function createContourSamples(scattered = false) {
  let seed = 42;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const bumps = Array.from({length: 95}, () => ({
    x: (random() - 0.5) * 1.7,
    y: (random() - 0.5) * 1.7,
    width: 0.025 + random() * 0.065,
    strength: 7 + random() * 21
  }));
  const samples: {longitude: number; latitude: number; value: number}[] = [];
  const size = scattered ? 65 : 201;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const x = scattered ? (col + (random() - 0.5) * 0.8) / 32 - 1 : col / 100 - 1;
      const y = scattered ? (row + (random() - 0.5) * 0.8) / 32 - 1 : row / 100 - 1;
      const warpedX = x + 0.07 * Math.sin(y * 13) + 0.03 * Math.sin(y * 27);
      const warpedY = y + 0.05 * Math.cos(x * 17);
      let surface = 65 * Math.exp(-(warpedX ** 2 / 0.22 + warpedY ** 2 / 0.13));
      surface += 16 * Math.exp(-((x + 0.3) ** 2 / 0.15 + (y - 0.13) ** 2 / 0.035));
      for (const bump of bumps) {
        surface +=
          bump.strength *
          Math.exp(-((x - bump.x) ** 2 + (y - bump.y) ** 2) / (2 * bump.width ** 2));
      }
      samples.push({
        longitude: Number((8.6821 + x * 0.32).toFixed(6)),
        latitude: Number((50.1109 + y * 0.22).toFixed(6)),
        value: Number((100 - surface).toFixed(4))
      });
    }
  }
  return samples;
}

export function createContourCsv(scattered = false) {
  return `longitude,latitude,value\n${createContourSamples(scattered)
    .map(d => `${d.longitude},${d.latitude},${d.value}`)
    .join('\n')}`;
}

export const contourConfig = {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          id: 'scalar-contours',
          type: 'contour',
          config: {
            dataId: contourDataId,
            label: 'Synthetic scalar contours',
            color: [36, 218, 211],
            isVisible: true,
            columns: {lat: 'latitude', lng: 'longitude', value: 'value'},
            visConfig: {
              opacity: 0.85,
              smoothing: 1.5,
              levels: 8,
              below: true,
              customRange: true,
              minimum: 28,
              maximum: 88,
              filled: true,
              stroked: true,
              fillOpacity: 0.075,
              thickness: 1.5
            }
          }
        }
      ]
    },
    mapState: {latitude: 50.1109, longitude: 8.6821, zoom: 10.5, pitch: 0, bearing: 0},
    mapStyle: {styleType: 'dark'}
  }
};

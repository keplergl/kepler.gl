// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  aggregationBinIsDrawn,
  collectGridCountLabels,
  collectHexagonCountLabels,
  getHexbinCentroid
} from './aggregation-count-labels';

describe('aggregationBinIsDrawn', () => {
  test('hides bins outside the cell shader cutoff', () => {
    const colors = {domain: [0, 10] as [number, number], cutoff: [2, 8] as [number, number]};
    const elevations = {domain: [0, 10] as [number, number], cutoff: null};
    expect(aggregationBinIsDrawn(1, 5, colors, elevations, [0, 10], [0, 10])).toBe(false);
    expect(aggregationBinIsDrawn(2, 5, colors, elevations, [0, 10], [0, 10])).toBe(true);
    expect(aggregationBinIsDrawn(Number.NaN, 5, colors, elevations, [0, 10], [0, 10])).toBe(false);
  });
});

describe('collectHexagonCountLabels', () => {
  test('places the count at the hex centroid and drops filtered-out points', () => {
    const radius = 10;
    const origin: [number, number] = [5, 7];
    const [cx, cy] = getHexbinCentroid([1, 0], radius);
    const layer = fakeLayer({
      radiusCommon: radius,
      hexOriginCommon: origin,
      unprojectFlat: xy => [xy[0] / 100, xy[1] / 100],
      bins: [
        {id: [1, 0], count: 2, pointIndices: [0, 1], color: 4, elevation: 4},
        {id: [2, 0], count: 1, pointIndices: [2], color: 0, elevation: 4}
      ],
      colorCutoff: [2, 10],
      filterData: point => point.index !== 0
    });

    expect(collectHexagonCountLabels(layer)).toEqual([
      {count: 1, position: [(cx + origin[0]) / 100, (cy + origin[1]) / 100]}
    ]);
  });
});

describe('collectGridCountLabels', () => {
  test('places the count at the cell center', () => {
    const layer = fakeLayer({
      cellOriginCommon: [100, 200],
      cellSizeCommon: [10, 20],
      unprojectFlat: xy => xy,
      bins: [{id: [0, 1], count: 3, pointIndices: [0], color: 3, elevation: 3}]
    });

    expect(collectGridCountLabels(layer)).toEqual([{count: 3, position: [105, 230]}]);
  });
});

function fakeLayer({
  bins,
  unprojectFlat,
  radiusCommon,
  hexOriginCommon,
  cellOriginCommon,
  cellSizeCommon,
  colorCutoff = null,
  filterData
}: {
  bins: {id: number[]; count: number; pointIndices: number[]; color: number; elevation: number}[];
  unprojectFlat: (xy: number[]) => number[];
  radiusCommon?: number;
  hexOriginCommon?: [number, number];
  cellOriginCommon?: [number, number];
  cellSizeCommon?: [number, number];
  colorCutoff?: [number, number] | null;
  filterData?: (point: any) => boolean;
}) {
  const data = bins.flatMap(bin => bin.pointIndices.map(index => ({index})));
  return {
    state: {
      radiusCommon,
      hexOriginCommon,
      cellOriginCommon,
      cellSizeCommon,
      aggregatorViewport: {unprojectFlat},
      aggregator: {
        binCount: bins.length,
        getBin: (index: number) => bins[index] ?? null,
        getResultDomain: () => [0, 10] as [number, number]
      },
      colors: {
        attribute: {value: bins.map(bin => bin.color)},
        domain: [0, 10] as [number, number],
        cutoff: colorCutoff
      },
      elevations: {
        attribute: {value: bins.map(bin => bin.elevation)},
        domain: [0, 10] as [number, number],
        cutoff: null
      }
    },
    props: {
      data,
      colorDomain: null,
      elevationDomain: null,
      _filterData: filterData
    }
  };
}

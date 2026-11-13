// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Protobuf from 'pbf';
import {decodeTile} from './3d-building-utils';

// Minimal MVT polygon writer. Exercise the real PBF parser and geometry decoder,
// rather than mocking their private geometry state.
function tileBuffer(features, {name = 'building', extent = 4096} = {}) {
  const tile = new Protobuf();
  tile.writeMessage(3, (_, layer) => {
    layer.writeVarintField(15, 2);
    layer.writeStringField(1, name);
    layer.writeVarintField(5, extent);
    layer.writeStringField(3, 'height');
    features.forEach(({height}, index) => {
      layer.writeMessage(4, (value, pbf) => pbf.writeDoubleField(3, value), height ?? 0);
      layer.writeMessage(2, (_, feature) => {
        feature.writeVarintField(3, 3);
        if (height !== undefined) feature.writePackedVarint(2, [0, index]);
        feature.writePackedVarint(4, geometry(features[index].rings));
      });
    });
  });
  const bytes = tile.finish();
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function geometry(rings) {
  const commands = [];
  let x = 0;
  let y = 0;
  const zigzag = value => (value < 0 ? -value * 2 - 1 : value * 2);
  rings.forEach(ring => {
    ring.forEach(([nextX, nextY], index) => {
      if (index === 0) commands.push(9); // MoveTo, one point
      if (index === 1) commands.push(((ring.length - 1) << 3) | 2); // LineTo
      commands.push(zigzag(nextX - x), zigzag(nextY - y));
      x = nextX;
      y = nextY;
    });
    commands.push(15); // ClosePath
  });
  return commands;
}

const shell = [
  [1024, 1024],
  [3072, 1024],
  [3072, 3072],
  [1024, 3072]
];

function expectPosition(actual, longitude, latitude) {
  expect(actual[0]).toBeCloseTo(longitude, 8);
  expect(actual[1]).toBeCloseTo(latitude, 8);
}

describe('3D building tile decoding', () => {
  test('ignores tiles without a building layer', () => {
    expect(
      decodeTile(0, 0, 0, tileBuffer([{height: 20, rings: [shell]}], {name: 'landuse'}))
    ).toEqual([]);
  });

  test('handles an empty building layer', () => {
    expect(decodeTile(0, 0, 0, tileBuffer([]))).toEqual([]);
  });

  test('projects tile coordinates to longitude/latitude and closes rings', () => {
    const result = decodeTile(0, 0, 0, tileBuffer([{height: 20, rings: [shell]}]));
    expect(result).toHaveLength(1);
    expect(result[0].properties).toEqual({height: 20, layer: 'building'});
    const ring = result[0].coordinates[0];
    expect(ring).toHaveLength(5);
    expectPosition(ring[0], -90, 66.51326044311186);
    expectPosition(ring[2], 90, -66.51326044311186);
    expect(ring[4]).toEqual(ring[0]);
  });

  test.each([256, 4096, 8192])('honors extent %i and nonzero tile coordinates at zoom', extent => {
    const ring = [
      [0, 0],
      [extent, 0],
      [extent, extent],
      [0, extent]
    ];
    const [building] = decodeTile(1, 1, 2, tileBuffer([{height: 12, rings: [ring]}], {extent}));
    expect(building.coordinates).toHaveLength(1);
    expectPosition(building.coordinates[0][0], -90, 66.51326044311186);
    expectPosition(building.coordinates[0][2], 0, 0);
  });

  test('keeps holes with their shell and emits disjoint shells separately', () => {
    const hole = [
      [1536, 1536],
      [1536, 2048],
      [2048, 2048],
      [2048, 1536]
    ];
    const otherShell = [
      [0, 0],
      [512, 0],
      [512, 512],
      [0, 512]
    ];
    const result = decodeTile(
      0,
      0,
      0,
      tileBuffer([{height: 15, rings: [shell, hole, otherShell]}])
    );
    expect(result).toHaveLength(2);
    expect(result.map(building => building.coordinates.length)).toEqual([2, 1]);
    expectPosition(result[0].coordinates[1][0], -45, 40.97989806962013);
    expectPosition(result[1].coordinates[0][2], -135, 79.17133464081945);
    result.forEach(building => {
      expect(building.properties).toEqual({height: 15, layer: 'building'});
      building.coordinates.forEach(ring => expect(ring[ring.length - 1]).toEqual(ring[0]));
    });
  });

  test('omits missing and zero heights without losing subsequent buildings', () => {
    const result = decodeTile(
      0,
      0,
      0,
      tileBuffer([{rings: [shell]}, {height: 0, rings: [shell]}, {height: 7.5, rings: [shell]}])
    );
    expect(result).toHaveLength(1);
    expect(result[0].properties).toEqual({height: 7.5, layer: 'building'});
  });
});

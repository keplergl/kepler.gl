// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ModifyMode, Feature, LineString, Point} from '@deck.gl-community/editable-layers';
import {Viewport} from '@deck.gl/core';
import {EDITOR_LAYER_PICKING_RADIUS} from '@kepler.gl/constants';
import {ModifyModeExtended} from './modify-mode-extended';

const line: Feature<LineString> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [0, 0],
      [10, 0]
    ]
  }
};

function handlePick(editHandleType = 'intermediate', featureIndex = 0) {
  return {
    isGuide: true,
    object: {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [5, 0]},
      properties: {
        guideType: 'editHandle',
        editHandleType,
        featureIndex,
        positionIndexes: [1]
      }
    }
  };
}

function makeProps(geometryType = 'LineString') {
  return {
    data: {
      type: 'FeatureCollection',
      features: [{...line, geometry: {...line.geometry, type: geometryType}}]
    },
    selectedIndexes: [0],
    onEdit: jest.fn(),
    onUpdateCursor: jest.fn()
  };
}

afterEach(() => jest.restoreAllMocks());

describe('ModifyModeExtended nearest-point picking', () => {
  const nearest = {
    type: 'Feature' as const,
    geometry: {type: 'Point' as const, coordinates: [0, 0]},
    properties: {dist: 0, index: 0, location: 0}
  };

  it.each([
    [EDITOR_LAYER_PICKING_RADIUS - 0.01, true],
    [EDITOR_LAYER_PICKING_RADIUS, true],
    [EDITOR_LAYER_PICKING_RADIUS + 0.01, false]
  ])('accepts screen distance %s only within the picking radius', (distance, accepted) => {
    jest.spyOn(ModifyMode.prototype, 'getNearestPoint').mockReturnValue(nearest);
    const inPoint: Feature<Point> = {
      type: 'Feature',
      properties: {},
      geometry: {type: 'Point', coordinates: [3, 4]}
    };
    // Use a 3:4 diagonal, so neither axis alone can determine proximity.
    const viewport = {
      project: jest.fn(([x, y]) => [(x * distance) / 5, (y * distance) / 5])
    } as unknown as Viewport;
    const result = new ModifyModeExtended().getNearestPoint(line, inPoint, viewport);
    expect(result).toBe(accepted ? nearest : undefined);
    expect(viewport.project).toHaveBeenCalledWith(nearest.geometry.coordinates);
    expect(viewport.project).toHaveBeenCalledWith(inPoint.geometry.coordinates);
  });

  it.each([null, undefined])('preserves the nearest point without a viewport (%s)', viewport => {
    jest.spyOn(ModifyMode.prototype, 'getNearestPoint').mockReturnValue(nearest);
    expect(new ModifyModeExtended().getNearestPoint(line, nearest, viewport)).toBe(nearest);
  });
});

describe('ModifyModeExtended clicks', () => {
  it.each([0, undefined])('inserts an intermediate line vertex for a normal click (%s)', button => {
    const props = makeProps();
    new ModifyModeExtended().handleClick(
      {picks: [handlePick()], ...(button === undefined ? {} : {sourceEvent: {button}})},
      props
    );
    expect(props.onEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        editType: 'addPosition',
        updatedData: expect.objectContaining({
          features: [
            expect.objectContaining({
              geometry: {
                type: 'LineString',
                coordinates: [
                  [0, 0],
                  [5, 0],
                  [10, 0]
                ]
              }
            })
          ]
        })
      })
    );
    expect(props.data.features[0].geometry.coordinates).toEqual([
      [0, 0],
      [10, 0]
    ]);
  });

  it('does not insert a vertex on right-click', () => {
    const props = makeProps();
    new ModifyModeExtended().handleClick({picks: [handlePick()], sourceEvent: {button: 2}}, props);
    expect(props.onEdit).not.toHaveBeenCalled();
  });
});

describe('ModifyModeExtended drag routing', () => {
  const methods = [
    'handlePointerMove',
    'handleStartDragging',
    'handleDragging',
    'handleStopDragging'
  ] as const;

  it.each(['LineString', 'MultiLineString'])(
    'leaves intermediate %s drags to translation',
    type => {
      const props = makeProps(type);
      const mode = new ModifyModeExtended();
      for (const method of methods) {
        const base = jest.spyOn(ModifyMode.prototype, method).mockImplementation(() => undefined);
        const picksKey =
          method === 'handleDragging' || method === 'handleStopDragging'
            ? 'pointerDownPicks'
            : 'picks';
        mode[method]({[picksKey]: [handlePick()]}, props);
        expect(base).not.toHaveBeenCalled();
      }
      expect(props.onUpdateCursor).toHaveBeenCalledWith('move');
      expect(props.onEdit).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['polygon intermediate handle', 'Polygon', [handlePick()]],
    ['multipolygon intermediate handle', 'MultiPolygon', [handlePick()]],
    ['existing line vertex', 'LineString', [handlePick('existing')]],
    ['ordinary feature pick', 'LineString', [{...handlePick(), isGuide: false}]],
    [
      'non-edit guide',
      'LineString',
      [{...handlePick(), object: {properties: {guideType: 'tentative'}}}]
    ],
    ['missing feature', 'LineString', [handlePick('intermediate', 1)]],
    ['empty picks', 'LineString', []],
    ['missing picks', 'LineString', undefined]
  ])('keeps base modify behavior for %s', (_name, type, picks) => {
    const props = makeProps(type as string);
    const mode = new ModifyModeExtended();
    for (const method of methods) {
      const base = jest.spyOn(ModifyMode.prototype, method).mockImplementation(() => undefined);
      const event = {picks, pointerDownPicks: picks};
      mode[method](event, props);
      expect(base).toHaveBeenCalledWith(event, props);
    }
    expect(props.onUpdateCursor).not.toHaveBeenCalled();
  });

  it('uses the pointer-down handle even after the pointer leaves the line', () => {
    const props = makeProps();
    const mode = new ModifyModeExtended();
    for (const method of ['handleDragging', 'handleStopDragging'] as const) {
      const base = jest.spyOn(ModifyMode.prototype, method).mockImplementation(() => undefined);
      mode[method]({picks: [], pointerDownPicks: [handlePick()]}, props);
      expect(base).not.toHaveBeenCalled();
      const event = {picks: [handlePick()], pointerDownPicks: []};
      mode[method](event, props);
      expect(base).toHaveBeenCalledWith(event, props);
    }
  });
});

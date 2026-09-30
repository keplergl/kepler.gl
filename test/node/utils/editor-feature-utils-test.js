// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  editorFeaturesToFeatureCollection,
  sanitizeEditorFeature,
  toSketchFeature,
  getFilterFeatureAnchor,
  getUserFeatureProperties,
  mergeUserFeatureProperties
} from '@kepler.gl/utils';

test('editor-feature-utils -> sanitizeEditorFeature', t => {
  const feature = {
    type: 'Feature',
    id: 'line-1',
    properties: {
      isClosed: true,
      filterId: 'abc',
      bbox: {xmin: 0, xmax: 1, ymin: 0, ymax: 1},
      name: 'route'
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1]
      ]
    }
  };

  t.deepEqual(
    sanitizeEditorFeature(feature),
    {
      type: 'Feature',
      id: 'line-1',
      properties: {name: 'route'},
      geometry: feature.geometry
    },
    'Should keep geometry and drop editor-only properties'
  );
  t.end();
});

test('editor-feature-utils -> sanitizeEditorFeature circle is a regular polygon', t => {
  const ring = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
  ];
  const feature = {
    type: 'Feature',
    id: 'circle-1',
    properties: {
      isClosed: true,
      shape: 'Circle',
      editProperties: {
        shape: 'Circle',
        center: [0, 0],
        radius: {value: 1, unit: 'kilometers'}
      }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [ring]
    }
  };

  t.deepEqual(
    sanitizeEditorFeature(feature),
    {
      type: 'Feature',
      id: 'circle-1',
      properties: {},
      geometry: feature.geometry
    },
    'Should keep tessellated Polygon geometry and drop circle editor metadata'
  );
  t.end();
});

test('editor-feature-utils -> editorFeaturesToFeatureCollection', t => {
  const point = {
    id: 'point-1',
    properties: {isClosed: false},
    geometry: {type: 'Point', coordinates: [10, 20]}
  };
  const line = {
    type: 'Feature',
    id: 'line-1',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1]
      ]
    }
  };
  const withoutGeometry = {
    id: 'empty',
    properties: {},
    geometry: null
  };

  t.deepEqual(
    editorFeaturesToFeatureCollection([point, line, withoutGeometry]),
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'point-1',
          properties: {},
          geometry: point.geometry
        },
        {
          type: 'Feature',
          id: 'line-1',
          properties: {},
          geometry: line.geometry
        }
      ]
    },
    'Should wrap sketch features as a FeatureCollection and skip invalid geometries'
  );
  t.end();
});

test('editor-feature-utils -> toSketchFeature', t => {
  const feature = {
    type: 'Feature',
    id: 'poly-1',
    properties: {
      isClosed: true,
      filterId: 'filter-1',
      name: 'keep-me'
    },
    geometry: {type: 'Polygon', coordinates: []}
  };

  t.deepEqual(
    toSketchFeature(feature).properties,
    {isClosed: true, name: 'keep-me'},
    'Should drop filterId so the polygon becomes a sketch again'
  );
  t.end();
});

test('editor-feature-utils -> getFilterFeatureAnchor', t => {
  const feature = {
    type: 'Feature',
    id: 'poly-1',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [4, 0],
          [4, 3],
          [0, 3],
          [0, 0]
        ]
      ]
    }
  };

  t.deepEqual(
    getFilterFeatureAnchor(feature),
    [4, 3],
    'Should use the north-east vertex for the filter badge'
  );
  t.end();
});

test('editor-feature-utils -> getUserFeatureProperties / mergeUserFeatureProperties', t => {
  const feature = {
    type: 'Feature',
    id: 'line-1',
    properties: {
      isClosed: false,
      filterId: 'keep-internal',
      name: 'route'
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1]
      ]
    }
  };

  t.deepEqual(
    getUserFeatureProperties(feature),
    {name: 'route'},
    'Should return only user-facing properties'
  );

  t.deepEqual(
    mergeUserFeatureProperties(feature, {name: 'updated', capacity: '12', filterId: 'nope'})
      .properties,
    {
      isClosed: false,
      filterId: 'keep-internal',
      name: 'updated',
      capacity: '12'
    },
    'Should replace user properties and ignore reserved keys'
  );

  t.deepEqual(
    mergeUserFeatureProperties(feature, {}).properties,
    {isClosed: false, filterId: 'keep-internal'},
    'Should drop previous user properties when the next set is empty'
  );

  t.end();
});

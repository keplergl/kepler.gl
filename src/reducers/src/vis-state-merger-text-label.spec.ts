// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_TEXT_LABEL} from '@kepler.gl/constants';
import {defaultAggregationCountLabel} from '@kepler.gl/layers';

import {fallbackTextLabelForLoadedLayer, validateSavedTextLabel} from './vis-state-merger';

describe('validateSavedTextLabel point count', () => {
  test('restores the synthetic field and keeps collision disabled', () => {
    const defaults = [defaultAggregationCountLabel()];
    const saved = [
      {
        ...defaults[0],
        field: {name: 'pointCount', type: 'integer'},
        collisionEnabled: false,
        anchor: 'start'
      }
    ];

    const [label] = validateSavedTextLabel([], defaults, saved, {
      layerType: 'hexagon',
      throwOnError: true
    });

    expect(label.field).toMatchObject({name: 'pointCount', fieldIdx: -1});
    expect(label.collisionEnabled).toBe(false);
    expect(label.anchor).toBe('start');
  });

  test('binds a real pointCount column on non-aggregation layers', () => {
    const datasetField = {
      name: 'pointCount',
      type: 'integer',
      fieldIdx: 4,
      valueAccessor: () => 1
    };
    const saved = [{...DEFAULT_TEXT_LABEL, field: {name: 'pointCount', type: 'integer'}}];

    const [label] = validateSavedTextLabel([datasetField], [DEFAULT_TEXT_LABEL], saved, {
      layerType: 'point',
      throwOnError: true
    });

    expect(label.field).toBe(datasetField);
  });

  test('omitted textLabel on a hexagon stays unlabeled', () => {
    const labels = fallbackTextLabelForLoadedLayer('hexagon', [defaultAggregationCountLabel()]);

    expect(labels).toHaveLength(1);
    expect(labels[0].field).toBeNull();
    expect(labels[0].collisionEnabled).toBe(false);
  });

  test('omitted textLabel on a point layer keeps the layer default', () => {
    const defaults = [DEFAULT_TEXT_LABEL];

    expect(fallbackTextLabelForLoadedLayer('point', defaults)).toBe(defaults);
  });
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_TEXT_LABEL} from '@kepler.gl/constants';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {layerPropsV1} from '../../schemas/src/vis-state-schema';

import {fallbackTextLabelForLoadedLayer, validateSavedTextLabel} from './vis-state-merger';

const aggregationTextLabelDefaults = () =>
  new KeplerGlLayers.HexagonLayer({id: 'hexagon'}).config.textLabel;

describe('validateSavedTextLabel point count', () => {
  test('restores the synthetic field and keeps collision disabled', () => {
    const defaults = aggregationTextLabelDefaults();
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
    const labels = fallbackTextLabelForLoadedLayer('hexagon', aggregationTextLabelDefaults());

    expect(labels).toHaveLength(1);
    expect(labels[0].field).toBeNull();
    expect(labels[0].collisionEnabled).toBe(false);
  });

  test('omitted textLabel on a point layer keeps the layer default', () => {
    const defaults = [DEFAULT_TEXT_LABEL];

    expect(fallbackTextLabelForLoadedLayer('point', defaults)).toBe(defaults);
  });
});

test('saves and restores a configured point label angle without changing old saves', () => {
  const layer = new KeplerGlLayers.PointLayer({id: 'point'});
  const defaults = layer.config.textLabel;
  const field = {name: 'label', type: 'string', fieldIdx: 0, valueAccessor: () => 'A'};
  const label = {...defaults[0], field};
  const save = (value: object) => layerPropsV1.config.save(value).config.textLabel;
  const restore = (saved: object[], layerType = 'point') =>
    validateSavedTextLabel(
      [field],
      defaults,
      layerPropsV1.config.load({textLabel: saved}).config.textLabel,
      {layerType}
    );

  const saved = save({textLabel: [{...label, angleField: 'heading'}]});
  expect(saved[0].angleField).toBe('heading');
  expect(restore(saved)[0]).toMatchObject({field, angleField: 'heading'});
  expect(restore(saved, 'arc')[0]).not.toHaveProperty('angleField');

  const old = save({textLabel: [label]});
  expect(old[0]).not.toHaveProperty('angleField');
  const [restoredOld] = restore(old);
  expect(restoredOld).toMatchObject({field});
  expect(restoredOld).not.toHaveProperty('angleField');
});

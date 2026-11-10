// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {LayerManager, WebMercatorViewport} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import {DataFilterExtension} from '@deck.gl/extensions';
import {device} from '@deck.gl/test-utils';
import {KeplerTable, getGpuFilterProps, assignGpuChannels} from '@kepler.gl/table';
import {FILTER_TYPES} from '@kepler.gl/constants';
import {getDefaultFilter} from '@kepler.gl/utils';
import DonutLayer from '../../../src/layers/src/donut-layer/donut-layer';
import DonutExtension from '../../../src/layers/src/donut-layer/donut-extension';

test('#DonutLayer -> GPU attributes coexist with filtering and picking', t => {
  const errors = [];
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({
      longitude: 0,
      latitude: 0,
      zoom: 1,
      width: 400,
      height: 400
    }),
    onError: error => errors.push(error)
  });
  try {
    const layer = new ScatterplotLayer({
      id: 'donut-gpu',
      data: [{position: [0, 0], shares: [0.3, 1, 1, 1, 1, 1]}],
      getPosition: row => row.position,
      getRadius: 24,
      radiusUnits: 'pixels',
      pickable: true,
      extensions: [new DataFilterExtension({filterSize: 1}), new DonutExtension()],
      getFilterValue: () => 1,
      filterRange: [0, 2],
      getDonutStart: row => row.shares.slice(0, 3),
      getDonutEnd: row => row.shares.slice(3, 6)
    });
    manager.setLayers([layer]);
    const attributes = layer.getAttributeManager().getAttributes();
    t.ok(
      Math.abs(attributes.instanceDonutStart.value[0] - 0.3) < 1e-6,
      'first slice retains its share'
    );
    t.deepEqual(
      Array.from(attributes.instanceDonutEnd.value.slice(0, 3)),
      [1, 1, 1],
      'remaining boundaries close the ring'
    );
    t.ok(attributes.instancePickingColors.value, 'source record remains pickable');
    t.deepEqual(errors, [], 'layer initializes alongside the data filter');
  } finally {
    manager.finalize();
  }
  t.end();
});

test('#DonutLayer -> clustering updates filters, zoom and totals without attribute errors', async t => {
  const errors = [];
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({
      longitude: 30.51,
      latitude: 50.45,
      zoom: 4,
      width: 400,
      height: 400
    }),
    onError: error => errors.push(error.message)
  });
  try {
    const dataset = new KeplerTable({info: {id: 'donut-cluster'}, color: [0, 0, 0]});
    await dataset.importData({
      data: {
        fields: ['longitude', 'latitude', 'bus', 'car'].map(name => ({name, type: 'real'})),
        rows: [
          [30.51, 50.45, 90, 10],
          [30.52, 50.45, 1, 9]
        ]
      }
    });
    dataset.gpuFilter = getGpuFilterProps([], dataset.id, dataset.fields);
    const layer = new DonutLayer({
      id: 'donut-cluster',
      dataId: dataset.id,
      columns: {
        lng: {value: 'longitude', fieldIdx: 0},
        lat: {value: 'latitude', fieldIdx: 1}
      }
    });
    layer.updateLayerVisConfig({
      showTotal: true,
      composition: {categories: [{field: 'bus'}, {field: 'car'}]}
    });
    const filter = {
      ...getDefaultFilter({dataId: [dataset.id]}),
      type: FILTER_TYPES.range,
      name: ['bus'],
      fieldIdx: [2],
      domain: [1, 90],
      gpu: true
    };
    let data;
    for (const {zoom, value, totals, members} of [
      {zoom: 4, value: [1, 90], totals: [110], members: 2},
      {zoom: 18, value: [1, 90], totals: [10, 100], members: 2},
      {zoom: 4, value: [1, 1], totals: [10], members: 1},
      {zoom: 4, value: [20, 30], totals: [], members: 0},
      {zoom: 4, value: [1, 90], totals: [110], members: 2}
    ]) {
      dataset.filterTable(assignGpuChannels([{...filter, value}]), [layer]);
      data = layer.formatLayerData({[dataset.id]: dataset}, data);
      const rendered = layer.renderLayer({
        data,
        idx: 0,
        gpuFilter: dataset.gpuFilter,
        mapState: {zoom},
        visible: true
      });
      manager.setLayers(rendered);
      const [rings, labels] = rendered;
      t.deepEqual(errors, [], 'rings and total labels update without errors');
      t.equal(rings.props.filterEnabled, false, 'group indices are not GPU-filtered');
      t.equal(labels.props.filterEnabled, false, 'totals use the same filtering');
      t.deepEqual(
        rings.props.data.map(point => point.total).sort((a, b) => a - b),
        totals,
        'zoom and filters produce the expected totals'
      );
      t.deepEqual(labels.props.data, rings.props.data, 'labels use the rendered groups');
      t.equal(
        rings.props.data.reduce((sum, point) => sum + point.pointCount, 0),
        members,
        'group counts include only matching source rows'
      );
      if (rings.props.data.length) {
        const group = rings.props.data[0];
        rings.updateAutoHighlight({
          picked: true,
          color: rings.encodePickingColor(0),
          index: 0,
          object: group,
          layer: rings
        });
        const picking = rings.getModels()[0].shaderInputs.getUniformValues().picking;
        t.equal(picking.isHighlightActive, true, 'hover visibly highlights the donut');
        t.deepEqual(
          picking.highlightColor.slice(0, 3),
          [1, 1, 1],
          'hover brightens category colors with white instead of tinting them yellow'
        );
        t.ok(
          picking.highlightColor[3] > 0 && picking.highlightColor[3] < 0.25,
          'highlight is subtle and translucent so segment colors remain distinct'
        );
        t.deepEqual(
          picking.highlightedObjectColor,
          rings.encodePickingColor(0),
          'only the hovered donut is highlighted'
        );
        t.equal(rings.props.stroked, false, 'hover does not add a border');
        t.equal(rings.props.pickable, true, 'hovered donuts remain pickable for tooltips');
        rings.updateAutoHighlight({picked: false});
        t.equal(
          rings.getModels()[0].shaderInputs.getUniformValues().picking.isHighlightActive,
          false,
          'leaving the donut restores its normal colors'
        );
        t.equal(rings.props.getRadius(group), 25, 'default donut radius is 25 pixels');
        t.equal(labels.props.getText(group), String(group.total), 'label shows the filtered total');
        const attributes = rings.getAttributeManager().getAttributes();
        t.ok(
          Math.abs(attributes.instanceDonutStart.value[0] - group.shares[0]) < 1e-6,
          'rendered slice updates to the group ratio'
        );
        t.ok(
          Array.from(attributes.filterValues.value.slice(0, attributes.filterValues.size)).every(
            value => value === 0
          ),
          'GPU filter attributes contain neutral values for the group'
        );
        t.equal(
          layer.getHoverData(group, dataset.dataContainer, dataset.fields).donut.total,
          group.total,
          'picking retains the group total'
        );
      }
    }
  } catch (error) {
    t.fail(error.stack || error.message);
  } finally {
    manager.finalize();
  }
  t.end();
});

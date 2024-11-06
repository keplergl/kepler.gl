// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {
  LayerConfiguratorFactory,
  LayerColumnModeConfigFactory,
  LayerColumnConfigFactory,
  LayerConfigGroupFactory,
  FieldSelectorFactory,
  ColumnSelectorFactory,
  appInjector,
  dropdownListClassList,
  Checkbox
} from '@kepler.gl/components';

import {StateWFiles, StateWTripGeojson, testCsvDataId} from 'test/helpers/mock-state';
import {
  IntlWrapper,
  mountWithTheme,
  clickItemSelector,
  getItemSelectorListText,
  clickItemSelectList
} from 'test/helpers/component-utils';
import {act} from 'react-dom/test-utils';

// components
const LayerConfigurator = appInjector.get(LayerConfiguratorFactory);
const LayerColumnModeConfig = appInjector.get(LayerColumnModeConfigFactory);
const LayerColumnConfig = appInjector.get(LayerColumnConfigFactory);
const LayerConfigGroup = appInjector.get(LayerConfigGroupFactory);
const ColumnSelector = appInjector.get(ColumnSelectorFactory);
const FieldSelector = appInjector.get(FieldSelectorFactory);

// components
const openModal = () => {};
const updateLayerColorUI = () => {};
const updateLayerConfig = () => {};
const updateLayerVisualChannelConfig = () => {};
const updateLayerType = () => {};
const updateLayerTextLabel = () => {};
const updateLayerVisConfig = () => {};

const defaultProps = {
  layer: StateWFiles.visState.layers[0],
  datasets: StateWFiles.visState.datasets,
  layerTypeOptions: [],
  openModal,
  updateLayerColorUI,
  updateLayerConfig,
  updateLayerVisualChannelConfig,
  updateLayerType,
  updateLayerTextLabel,
  updateLayerVisConfig
};

test('Components -> LayerConfigurator.mount -> default prop 1', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerConfigurator {...defaultProps} />
      </IntlWrapper>
    );
  }, 'LayerConfigurator should not fail without props');

  const component = wrapper.find(LayerConfigurator).instance();

  const spy = sinon.spy(component, '_renderScatterplotLayerConfig');
  act(() => {
    component.forceUpdate();
  });

  wrapper.update();
  t.ok(spy.calledOnce, 'should call _renderScatterplotLayerConfig');

  const expectedDataset = StateWFiles.visState.datasets[testCsvDataId];
  const expectedLayer = StateWFiles.visState.layers[0];

  const expectedArgs = {
    layer: expectedLayer,
    dataset: expectedDataset,
    visConfiguratorProps: {
      layer: expectedLayer,
      fields: expectedDataset.fields,
      onChange: updateLayerVisConfig,
      setColorUI: updateLayerColorUI
    },
    layerConfiguratorProps: {
      layer: expectedLayer,
      fields: expectedDataset.fields,
      onChange: updateLayerConfig,
      setColorUI: updateLayerColorUI
    },
    layerChannelConfigProps: {
      layer: expectedLayer,
      fields: expectedDataset.fields,
      onChange: updateLayerVisualChannelConfig,
      setColorUI: updateLayerColorUI
    }
  };

  const args = spy.args[0][0];

  t.deepEqual(
    Object.keys(args).sort(),
    Object.keys(expectedArgs).sort(),
    'render layer method should receive 5 arguments'
  );

  t.equal(args.layer, expectedArgs.layer, 'render layer method should receive corrent layer arg');
  t.equal(
    args.dataset,
    expectedArgs.dataset,
    'render layer method should receive corrent dataset arg'
  );
  t.deepEqual(
    args.visConfiguratorProps,
    expectedArgs.visConfiguratorProps,
    'render layer method should receive corrent visConfiguratorProps arg'
  );
  t.deepEqual(
    args.layerConfiguratorProps,
    expectedArgs.layerConfiguratorProps,
    'render layer method should receive corrent layerConfiguratorProps arg'
  );
  t.deepEqual(
    args.layerChannelConfigProps,
    expectedArgs.layerChannelConfigProps,
    'render layer method should receive corrent layerChannelConfigProps arg'
  );

  t.end();
});

test('Components -> LayerConfigurator.mount -> LayerColumnConfig', t => {
  // mount
  const updateLayerConfigSpy = sinon.spy();

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerConfigurator {...defaultProps} updateLayerConfig={updateLayerConfigSpy} />
      </IntlWrapper>
    );
  }, 'LayerConfigurator should not fail without props');
  const baseConfigGroup = wrapper.find(LayerConfigGroup).at(0);
  t.equal(
    baseConfigGroup.find(LayerColumnModeConfig).length,
    1,
    'should render 1 LayerColumnModeConfig'
  );
  t.equal(baseConfigGroup.find(LayerColumnConfig).length, 3, 'should render 2 LayerColumnConfig');

  t.equal(
    baseConfigGroup.find(LayerColumnConfig).at(0).find(ColumnSelector).length,
    4,
    'Should render 4 ColumnSelector for Point columns'
  );

  t.equal(
    baseConfigGroup.find(LayerColumnConfig).at(1).find(ColumnSelector).length,
    1,
    'Should render 1 ColumnSelector for GeoJSON feature'
  );

  // open fieldSelector
  // t.equal(
  const fieldSelector = baseConfigGroup
    .find(LayerColumnConfig)
    .at(0)
    .find(ColumnSelector)
    .at(0)
    .find(FieldSelector)
    .at(0);

  // open dropdown
  clickItemSelector(fieldSelector);
  const fieldSelector2 = wrapper
    .find(LayerColumnConfig)
    .at(0)
    .find(ColumnSelector)
    .at(0)
    .find(FieldSelector)
    .at(0);

  t.equal(
    fieldSelector2.find(`.list__item.${dropdownListClassList.listItemFixed}`).length,
    1,
    'should render 1 fixed item'
  );

  t.equal(
    getItemSelectorListText(fieldSelector2, 0),
    'gps_data',
    'should render correct field pair name'
  );

  // click list item suggested field pair
  clickItemSelectList(fieldSelector2, 0);

  t.ok(updateLayerConfigSpy.calledOnce, 'should call updateLayerConfigSpy');
  t.deepEqual(
    updateLayerConfigSpy.args[0],
    [
      {
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          },
          altitude: {value: null, fieldIdx: -1, optional: true},
          neighbors: {value: null, fieldIdx: -1, optional: true},
          geojson: {value: null, fieldIdx: -1},
          geoarrow: {value: null, fieldIdx: -1}
        }
      }
    ],
    'should update field pairs'
  );
  t.equal(
    getItemSelectorListText(fieldSelector2, 2),
    'gps_data.lng',
    'should render correct field pair name'
  );

  // TODO: still need to fix this one
  // for some reason the update config callback is only called once

  // click single column
  // clickItemSelectList(fieldSelector2, 2);

  // t.ok(updateLayerConfigSpy.calledTwice, 'should call updateLayerConfigSpy twice');
  // t.deepEqual(
  //   updateLayerConfigSpy.args[1],
  // [
  //    {
  //      columns: {
  //        lat: {
  //          value: 'gps_data.lng',
  //          fieldIdx: 2
  //        },
  //        lng: {
  //          value: 'gps_data.lng',
  //          fieldIdx: 2
  //        },
  //        altitude: {value: null, fieldIdx: -1, optional: true},
  //        neighbors: {value: null, fieldIdx: -1, optional: true},
  //        geojson: {value: null, fieldIdx: -1}
  //      }
  //    }
  //  ],
  //  'should update single column'
  // );
  t.end();
});

test('Components -> LayerConfigurator.mount -> collapsed / expand config group ', t => {
  const propsWithTripLayer = {
    ...defaultProps,
    layer: StateWTripGeojson.visState.layers[0],
    datasets: StateWTripGeojson.visState.datasets
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerConfigurator {...propsWithTripLayer} />
      </IntlWrapper>
    );
  }, 'LayerConfigurator should not fail without props');

  const component = wrapper.find(LayerConfigurator).instance();
  t.equal(
    wrapper.find(LayerConfigGroup).at(0).find('.layer-config-group.collapsed').length,
    3,
    'LayerColumnModeConfig should be collapsed'
  );

  const spy = sinon.spy(component, '_renderScatterplotLayerConfig');
  const spy2 = sinon.spy(component, '_renderTripLayerConfig');

  act(() => {
    component.forceUpdate();
  });

  wrapper.update();

  t.ok(spy.notCalled, 'should not call _renderScatterplotLayerConfig');
  t.ok(spy2.calledOnce, 'should call _renderTripLayerConfig');

  // click layer config group header
  wrapper.find('.layer-config-group__header').at(0).simulate('click');

  t.equal(
    wrapper.find(LayerConfigGroup).at(0).find('.layer-config-group.collapsed').length,
    0,
    'LayerColumnModeConfig should be expanded'
  );

  t.end();
});

test('Components -> LayerConfigurator.mount -> LayerColumnModeConfig ', t => {
  const updateLayerConfigSpy = sinon.spy();

  const propsWithTripLayer = {
    ...defaultProps,
    updateLayerConfig: updateLayerConfigSpy,
    layer: StateWTripGeojson.visState.layers[0],
    datasets: StateWTripGeojson.visState.datasets
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerConfigurator {...propsWithTripLayer} />
      </IntlWrapper>
    );
  }, 'LayerConfigurator should not fail without props');
  const baseConfigGroup = wrapper.find(LayerConfigGroup).at(0);
  t.equal(
    baseConfigGroup.find(LayerColumnModeConfig).length,
    1,
    'should render 1 LayerColumnModeConfig'
  );
  t.equal(baseConfigGroup.find(LayerColumnConfig).length, 2, 'should render 2 LayerColumnConfig');

  // 1 columne mode panel
  const checkbox = baseConfigGroup
    .find(LayerColumnModeConfig)
    .find('.layer-column-mode-panel')
    .at(0)
    .find(Checkbox);

  t.equal(checkbox.props().label, 'GeoJSON', 'should render correct checkbox prop');
  t.equal(checkbox.props().checked, true, 'should render correct checkbox prop');

  // check the other selection
  const checkbox2 = baseConfigGroup
    .find(LayerColumnModeConfig)
    .find('.layer-column-mode-panel')
    .at(1)
    .find(Checkbox);

  checkbox2.find('input').at(0).simulate('change', {target: {}});
  t.ok(updateLayerConfigSpy.calledOnce, 'updateLayerConfig called');

  t.deepEqual(
    updateLayerConfigSpy.args[0],
    [
      {
        columnMode: 'table'
      }
    ],
    'should update columnMode'
  );

  t.end();
});

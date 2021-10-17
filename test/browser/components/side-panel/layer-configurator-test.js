// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
  appInjector
} from '@kepler.gl/components';

import ColumnSelectorFactory from 'components/side-panel/layer-panel/column-selector';

import Checkbox from 'components/common/checkbox';

import {StateWFiles, StateWTripGeojson, testCsvDataId} from 'test/helpers/mock-state';
import {
  IntlWrapper,
  mountWithTheme,
  clickItemSelector,
  getItemSelectorListText,
  clickItemSelectList
} from 'test/helpers/component-utils';

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

test('Components -> LayerConfigurator.mount -> defaut prop', t => {
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
  component.forceUpdate();
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
      onChange: updateLayerVisualChannelConfig
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

test('Components -> LayerConfigurator.mount -> defaut prop', t => {
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
  t.equal(baseConfigGroup.find(LayerColumnConfig).length, 1, 'should render 1 LayerColumnConfig');

  t.equal(
    baseConfigGroup
      .find(LayerColumnConfig)
      .at(0)
      .find(ColumnSelector).length,
    3,
    'Should render 3 ColumnSelector'
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

  t.equal(fieldSelector2.find('.list__item.fixed').length, 1, 'should render 1 fixed item');

  t.equal(
    getItemSelectorListText(fieldSelector2, 0),
    'gps_data',
    'should render correct field paid name'
  );

  // click list item suggested field pair
  clickItemSelectList(fieldSelector2, 0);

  t.ok(updateLayerConfigSpy.calledOnce, 'shoudl call updateLayerConfigSpy');
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
          altitude: {value: null, fieldIdx: -1, optional: true}
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

  // click single column
  clickItemSelectList(fieldSelector2, 2);

  t.ok(updateLayerConfigSpy.calledTwice, 'shoudl call updateLayerConfigSpy');
  t.deepEqual(
    updateLayerConfigSpy.args[1],
    [
      {
        columns: {
          lat: {
            value: 'gps_data.lng',
            fieldIdx: 2
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          },
          altitude: {value: null, fieldIdx: -1, optional: true}
        }
      }
    ],
    'should update single column'
  );
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
    wrapper
      .find(LayerConfigGroup)
      .at(0)
      .find('.layer-config-group.collapsed').length,
    3,
    'LayerColumnModeConfig should be collapsed'
  );

  const spy = sinon.spy(component, '_renderScatterplotLayerConfig');
  const spy2 = sinon.spy(component, '_renderTripLayerConfig');
  component.forceUpdate();
  wrapper.update();

  t.ok(spy.notCalled, 'should not call _renderScatterplotLayerConfig');
  t.ok(spy2.calledOnce, 'should call _renderTripLayerConfig');

  // click layer config group header
  wrapper
    .find('.layer-config-group__header')
    .at(0)
    .simulate('click');

  t.equal(
    wrapper
      .find(LayerConfigGroup)
      .at(0)
      .find('.layer-config-group.collapsed').length,
    0,
    'LayerColumnModeConfig should be expanded'
  );

  // t.equal(
  //   wrapper.find(LayerColumnModeConfig).length,
  //   1,
  //   'LayerColumnModeConfig should be expanded'
  // );
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

  checkbox2
    .find('input')
    .at(0)
    .simulate('change', {target: {}});
  t.ok(updateLayerConfigSpy.calledOnce, 'updateLayerConfig called');

  t.deepEqual(
    updateLayerConfigSpy.args[0],
    [
      {
        columnMode: 'table',
        columns: {
          geojson: {value: '_geojson', fieldIdx: 0, optional: true},
          id: {value: null, fieldIdx: -1, optional: false},
          lat: {value: null, fieldIdx: -1, optional: false},
          lng: {value: null, fieldIdx: -1, optional: false},
          altitude: {value: null, fieldIdx: -1, optional: true},
          timestamp: {value: null, fieldIdx: -1, optional: false}
        }
      }
    ],
    'should update columnMode and columns'
  );

  t.end();
});

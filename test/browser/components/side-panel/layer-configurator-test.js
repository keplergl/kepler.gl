// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {fireEvent, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {KeplerTable} from '@kepler.gl/table';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import {
  LayerConfiguratorFactory,
  LayerColumnModeConfigFactory,
  LayerColumnConfigFactory,
  LayerConfigGroupFactory,
  TextLabelPanelFactory,
  FieldSelectorFactory,
  ColumnSelectorFactory,
  appInjector,
  dropdownListClassList,
  Checkbox,
  getLayerFields,
  getLayerDataset
} from '@kepler.gl/components';
import {LayerClasses} from '@kepler.gl/layers';

import {StateWFiles, StateWTripGeojson, testCsvDataId} from 'test/helpers/mock-state';
import {
  IntlWrapper,
  mountWithTheme,
  clickItemSelector,
  getItemSelectorListText,
  clickItemSelectList
} from 'test/helpers/component-utils';
import {act} from 'react-dom/test-utils';
import {STYLED_COMPONENTS_DUPLICATED_ENTRIES} from '../../../helpers/utils';
import {KeplerGlLayers} from '@kepler.gl/layers';

// components
const LayerConfigurator = appInjector.get(LayerConfiguratorFactory);
const LayerColumnModeConfig = appInjector.get(LayerColumnModeConfigFactory);
const LayerColumnConfig = appInjector.get(LayerColumnConfigFactory);
const LayerConfigGroup = appInjector.get(LayerConfigGroupFactory);
const ColumnSelector = appInjector.get(ColumnSelectorFactory);
const FieldSelector = appInjector.get(FieldSelectorFactory);
const TextLabelPanel = appInjector.get(TextLabelPanelFactory);

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
      setColorUI: updateLayerColorUI,
      setLayerTextLabel: updateLayerTextLabel
    },
    layerChannelConfigProps: {
      layer: expectedLayer,
      dataset: expectedDataset,
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
    'render layer method should receive correct layerChannelConfigProps arg'
  );

  t.end();
});

test('Components -> LayerConfigurator localizes the aggregation count label', t => {
  const layer = new KeplerGlLayers.ClusterLayer({id: 'cluster', dataId: testCsvDataId});
  const wrapper = mountWithTheme(
    <IntlWrapper locale="es">
      <LayerConfigurator {...defaultProps} layer={layer} />
    </IntlWrapper>
  );

  t.ok(
    wrapper.find(TextLabelPanel).text().includes('Recuento de puntos'),
    'should render the localized Point Count field name'
  );

  t.end();
});

function contourRangeDataset(
  id = 'contour-range-data',
  rows = [
    [-2, 1000],
    [8, 2000]
  ],
  names = ['value', 'other']
) {
  return new KeplerTable({info: {id}, color: [0, 0, 0]}).updateSchema({
    fields: names.map(name => ({name, type: 'real', analyzerType: 'FLOAT'})),
    rows
  });
}

function contourRangeLayer(dataset) {
  return new LayerClasses.contour({
    id: 'contour-range',
    dataId: dataset.id,
    columns: {value: {value: 'value', fieldIdx: 0}}
  });
}

function renderContourRange(layer, datasets, onChange) {
  const props = {...defaultProps, layer, datasets, updateLayerVisConfig: onChange};
  const view = render(<LayerConfigurator {...props} />, {
    wrapper: ({children}) => (
      <ThemeProvider theme={theme}>
        <IntlWrapper>{children}</IntlWrapper>
      </ThemeProvider>
    )
  });
  return {...view, update: () => view.rerender(<LayerConfigurator {...props} />)};
}

function dragContourHandle(container, index, percent) {
  const range = container.querySelector('.contour-level-range');
  const slider = range.querySelector('.kg-slider');
  Object.defineProperty(slider, 'offsetWidth', {configurable: true, value: 100});
  const handles = range.querySelectorAll('.kg-range-slider__handle');
  fireEvent.mouseDown(handles[index], {clientX: percent});
  fireEvent.mouseMove(document, {clientX: percent});
  fireEvent.mouseUp(document);
}

function contourRangeLabels(container) {
  return Array.from(container.querySelectorAll('.contour-range-values output'), item =>
    Number(item.textContent)
  );
}

test('Components -> LayerConfigurator -> contour custom range uses one two-handle slider without manual inputs', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  layer.updateLayerVisConfig({customRange: true, minimum: -2, maximum: 8});
  const onChange = sinon.spy();
  const {container, unmount} = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    const range = container.querySelector('.contour-level-range');
    t.equal(range.querySelectorAll('.kg-range-slider__handle').length, 2, 'shows both handles');
    t.equal(
      range.querySelectorAll('input').length,
      0,
      'has no manual numeric inputs or custom-input checkbox'
    );
    t.deepEqual(contourRangeLabels(container), [-2, 8], 'shows numeric endpoint labels');
    t.ok(onChange.notCalled, 'rendering a valid saved range does not change it');

    dragContourHandle(container, 0, 25);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: 0.5, maximum: 8},
      'dragging the lower handle updates the paired thresholds'
    );
    dragContourHandle(container, 1, 85);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: -2, maximum: 6.5},
      'dragging the upper handle updates the paired thresholds'
    );
    t.notOk(
      'contourRange' in layer.config.visConfig,
      'does not add a new saved configuration property'
    );
  } finally {
    unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour custom range starts with the column bounds and stays a slider', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    t.notOk(
      view.container.querySelector('.contour-level-range'),
      'hides the slider in automatic mode'
    );
    fireEvent.click(view.container.querySelector('#contour-range-customRange-switch'));
    t.deepEqual(
      onChange.lastCall.args[0],
      {customRange: true, minimum: -2, maximum: 8},
      'enabling custom levels starts at the actual column minimum and maximum'
    );
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.deepEqual(contourRangeLabels(view.container), [-2, 8], 'displays the data-derived range');

    layer.updateLayerVisConfig({minimum: -500, maximum: 2500});
    view.update();
    t.equal(
      view.container.querySelectorAll('.contour-level-range .kg-range-slider__handle').length,
      2,
      'saved out-of-domain values do not replace the slider with inputs'
    );
    t.equal(
      view.container.querySelectorAll('.contour-level-range input').length,
      0,
      'never falls back to manual fields'
    );
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: -2, maximum: 8},
      'synchronizes out-of-domain thresholds with the displayed slider'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour slider bounds follow the full selected column and dataset', t => {
  const dataset = contourRangeDataset('contour-range-data', [
    [-2.25, 1000.125],
    [8.75, 5000.875],
    [null, null],
    [NaN, NaN],
    [Infinity, Infinity],
    [-Infinity, -Infinity]
  ]);
  dataset.filteredIndex = [0];
  const nextDataset = contourRangeDataset(
    'contour-range-next',
    [
      [10, -0.0042],
      [20, 0.0048]
    ],
    ['other', 'value']
  );
  const datasets = {[dataset.id]: dataset, [nextDataset.id]: nextDataset};
  const layer = contourRangeLayer(dataset);
  layer.updateLayerVisConfig({customRange: true, minimum: -2, maximum: 8});
  const onChange = sinon.spy();
  const view = renderContourRange(layer, datasets, onChange);
  try {
    dragContourHandle(view.container, 0, 0);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: -2.25, maximum: 8},
      'uses the exact finite minimum, ignoring null and nonfinite entries'
    );
    dragContourHandle(view.container, 1, 100);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: -2, maximum: 8.75},
      'uses the full-column maximum even when filters exclude that row'
    );

    layer.updateLayerConfig({
      columns: {...layer.config.columns, value: {value: 'other', fieldIdx: 1}}
    });
    view.update();
    t.deepEqual(
      contourRangeLabels(view.container),
      [1000.125, 5000.875],
      'refreshes to the new column range without manual input'
    );
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: 1000.125, maximum: 5000.875},
      'synchronizes thresholds when the old selection is disjoint'
    );
    layer.updateLayerVisConfig({minimum: 1500, maximum: 4000});
    view.update();
    dragContourHandle(view.container, 1, 100);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: 1500, maximum: 5000.875},
      'uses both new column bounds when dragging'
    );

    layer.updateLayerConfig({
      dataId: nextDataset.id,
      columns: {...layer.config.columns, value: {value: 'value', fieldIdx: 0}}
    });
    view.update();
    t.deepEqual(
      contourRangeLabels(view.container),
      [-0.0042, 0.0048],
      'resolves the value column by name when a new dataset reorders fields'
    );
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: -0.0042, maximum: 0.0048},
      'updates stored thresholds to match the new dataset slider'
    );
    dragContourHandle(view.container, 1, 70);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: -0.0042, maximum: 0.0021},
      'scales the slider step for small decimal data'
    );

    datasets[nextDataset.id] = contourRangeDataset(
      nextDataset.id,
      [
        [0, -10.5],
        [0, 12.5]
      ],
      ['other', 'value']
    );
    view.update();
    t.deepEqual(
      contourRangeLabels(view.container),
      [-10.5, 12.5],
      'refreshes bounds when a dataset is replaced under the same id'
    );
    t.equal(
      view.container.querySelectorAll('.contour-level-range input').length,
      0,
      'dataset changes keep the graphical slider'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour slider handles missing, empty, and constant value columns', t => {
  for (const rows of [[], [[null]], [[NaN], [Infinity], [-Infinity]], [[7]], [[7], [7]]]) {
    const dataset = contourRangeDataset('contour-invalid-range', rows);
    const layer = contourRangeLayer(dataset);
    layer.updateLayerVisConfig({customRange: true});
    const onChange = sinon.spy();
    const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
    try {
      t.equal(
        view.container.querySelectorAll('.contour-level-range .kg-range-slider__handle').length,
        0,
        'does not invent slider bounds without a nonzero finite span'
      );
      t.ok(
        view.container.querySelector('.contour-level-range').textContent.length > 0,
        'explains why no slider is available'
      );
      t.ok(onChange.notCalled, 'preserves saved settings while bounds are unavailable');
    } finally {
      view.unmount();
    }
  }
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  layer.updateLayerConfig({
    columns: {...layer.config.columns, value: {value: 'missing', fieldIdx: 0}}
  });
  layer.updateLayerVisConfig({customRange: true});
  const view = renderContourRange(layer, {[dataset.id]: dataset}, sinon.spy());
  t.equal(
    view.container.querySelectorAll('.contour-level-range .kg-range-slider__handle').length,
    0,
    'does not use a stale index for a missing column'
  );
  view.unmount();
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

  // Re-open the field selector dropdown after the field pair was selected
  const fieldSelector3 = wrapper
    .find(LayerColumnConfig)
    .at(0)
    .find(ColumnSelector)
    .at(0)
    .find(FieldSelector)
    .at(0);
  clickItemSelector(fieldSelector3);
  const fieldSelector4 = wrapper
    .find(LayerColumnConfig)
    .at(0)
    .find(ColumnSelector)
    .at(0)
    .find(FieldSelector)
    .at(0);

  t.equal(
    getItemSelectorListText(fieldSelector4, 2),
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
    STYLED_COMPONENTS_DUPLICATED_ENTRIES,
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

test('Components -> LayerConfigurator -> getLayerFields', t => {
  const layer = StateWTripGeojson.visState.layers[0];
  const datasets = StateWTripGeojson.visState.datasets;

  const fields = getLayerFields(datasets, layer);

  t.equal(fields.length, 5, 'should get 4 fields');

  const expectedFields = datasets.trip_data.fields;
  t.deepEqual(fields, expectedFields, 'should get 4 fields from the first layer');

  t.end();
});

test('Components -> LayerConfigurator -> getLayerDataset', t => {
  const layer = StateWTripGeojson.visState.layers[0];
  const datasets = StateWTripGeojson.visState.datasets;

  const ds = getLayerDataset(datasets, layer);

  t.equal(ds.id, 'trip_data', 'should get 1 dataset: trip_data');

  const expectedDS = datasets.trip_data;
  t.deepEqual(ds, expectedDS, 'should get 1 dataset for the input layer');

  t.end();
});

const ZARR_DATASET = {
  id: 'zarr_data',
  type: 'zarr',
  label: 'Zarr Dataset',
  color: [143, 47, 191],
  fields: [],
  metadata: {
    url: 'https://example.com/store.zarr',
    variable: 'FUTUR/qtot',
    crs: {code: 'EPSG:4326'},
    axes: ['lat', 'lon'],
    xAxisIndex: 1,
    yAxisIndex: 0,
    levels: [{path: '.', shape: [360, 720], chunks: [360, 720]}],
    // Same array name under two scenario groups, so the picker has to show the
    // qualified display name to tell them apart.
    variables: [
      {
        path: 'FUTUR/qtot',
        name: 'qtot',
        displayName: 'FUTUR/qtot',
        shape: [3, 360, 720],
        chunks: [1, 360, 720],
        dtype: 'float32',
        nonSpatialDims: [{name: 'season', size: 3, values: [0.5, 1.5, 2.5]}]
      },
      {
        path: 'HISTO/qtot',
        name: 'qtot',
        displayName: 'HISTO/qtot',
        shape: [3, 360, 720],
        chunks: [1, 360, 720],
        dtype: 'float32',
        nonSpatialDims: [{name: 'season', size: 3, values: [0.5, 1.5, 2.5]}]
      }
    ],
    nonSpatialDims: [{name: 'season', size: 3, values: [0.5, 1.5, 2.5]}]
  }
};

function mountZarrConfigurator(layer, updateLayerVisConfigSpy) {
  return mountWithTheme(
    <IntlWrapper>
      <LayerConfigurator
        {...defaultProps}
        layer={layer}
        datasets={{zarr_data: ZARR_DATASET}}
        updateLayerVisConfig={updateLayerVisConfigSpy}
      />
    </IntlWrapper>
  );
}

test('Components -> LayerConfigurator -> automatic Zarr range remains editable', t => {
  const layer = new LayerClasses.zarr({id: 'zarr-layer', dataId: 'zarr_data'});
  const updateLayerVisConfigSpy = sinon.spy();
  const {container, unmount} = renderWithTheme(
    <IntlWrapper>
      <LayerConfigurator
        {...defaultProps}
        layer={layer}
        datasets={{zarr_data: ZARR_DATASET}}
        updateLayerVisConfig={updateLayerVisConfigSpy}
      />
    </IntlWrapper>
  );
  try {
    const [minimum, maximum] = container.querySelectorAll('.kg-range-slider__input');
    t.equal(minimum.value, '0', 'shows the fallback lower bound while automatic');
    t.equal(maximum.value, '1', 'shows the fallback upper bound while automatic');
    t.equal(
      layer.config.visConfig.rescale,
      null,
      'displaying fallback bounds does not select them'
    );
    fireEvent.change(minimum, {target: {value: '0.25'}});
    fireEvent.blur(minimum);
    t.deepEqual(
      updateLayerVisConfigSpy.lastCall.args[0],
      {rescale: [0.25, 1]},
      'editing the slider selects an explicit color range'
    );
  } finally {
    unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> zarr variable selector shows the active variable', t => {
  const ZarrLayer = LayerClasses.zarr;
  const layer = new ZarrLayer({id: 'zarr-layer', dataId: 'zarr_data'});

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountZarrConfigurator(layer, () => {});
  }, 'should render the zarr layer config');

  // Regression: selectedItems used to be the variable path string, which the
  // display accessor could not read, so the dropdown rendered no selection.
  const value = wrapper
    .find('.zarr-variable-selector')
    .find('.item-selector__dropdown__value')
    .at(0);
  t.equal(
    value.text(),
    'FUTUR/qtot',
    'should display the dataset variable as the current selection'
  );

  t.end();
});

test('Components -> LayerConfigurator -> zarr dimension selector shows the pinned index', t => {
  const ZarrLayer = LayerClasses.zarr;
  const layer = new ZarrLayer({id: 'zarr-layer', dataId: 'zarr_data'});
  layer.updateLayerVisConfig({dimensionIndexes: {season: 2}});

  const wrapper = mountZarrConfigurator(layer, () => {});
  const value = wrapper
    .find('.zarr-dimension-selector')
    .find('.item-selector__dropdown__value')
    .at(0);

  // Labeled by coordinate value rather than raw index.
  t.equal(value.text(), '2.5', 'should display the pinned coordinate value');

  t.end();
});

test('Components -> LayerConfigurator -> zarr variable selector changes the variable and resets its frame', t => {
  const ZarrLayer = LayerClasses.zarr;
  const layer = new ZarrLayer({id: 'zarr-layer', dataId: 'zarr_data'});
  layer.updateLayerVisConfig({zarrFrame: 2});
  const updateLayerVisConfig = sinon.spy();

  const wrapper = mountZarrConfigurator(layer, updateLayerVisConfig);

  const variableSelector = () => wrapper.find('.zarr-variable-selector').at(0);

  clickItemSelector(variableSelector());
  wrapper.update();
  t.deepEqual(
    getItemSelectorListText(variableSelector(), 1),
    'HISTO/qtot',
    'should list variables by their qualified display name'
  );
  clickItemSelectList(variableSelector(), 1);

  t.ok(updateLayerVisConfig.calledOnce, 'should call updateLayerVisConfig once');
  t.deepEqual(
    updateLayerVisConfig.firstCall.args[0],
    {zarrVariable: 'HISTO/qtot', zarrFrame: 0},
    'should emit the selected variable path and start at its first frame'
  );

  t.end();
});

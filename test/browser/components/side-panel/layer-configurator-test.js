// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {fireEvent, render, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {KeplerTable} from '@kepler.gl/table';
import {Int64, Uint64, Table, vectorFromArray} from 'apache-arrow';
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
  VisConfigSlider,
  getLayerFields,
  getLayerDataset
} from '@kepler.gl/components';
import {LayerClasses} from '@kepler.gl/layers';
import {messages} from '@kepler.gl/localization';

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

function renderVisConfigSlider(property, initialValue, {layerType = 'point', ...sliderProps} = {}) {
  const changed = sinon.spy();
  function Editor() {
    const [value, setValue] = React.useState(initialValue);
    const layer = new LayerClasses[layerType]({id: 'slider-regression'});
    layer.updateLayerVisConfig({[property]: value});
    return (
      <VisConfigSlider
        {...layer.visConfigSettings[property]}
        {...sliderProps}
        layer={layer}
        onChange={next => {
          changed(next);
          setValue(next[property]);
        }}
      />
    );
  }
  const view = renderWithTheme(
    <IntlWrapper>
      <Editor />
    </IntlWrapper>
  );
  return {view, changed};
}

test('Components -> VisConfigSlider -> edits a single custom radius using the keyboard', async t => {
  const {view, changed} = renderVisConfigSlider('radius', 10);
  const slider = within(view.container);
  const user = userEvent.setup();
  try {
    t.ok(slider.getByText('10'), 'shows the slider value before editing');
    t.notOk(slider.queryByRole('spinbutton'), 'manual input starts closed');
    const edit = slider.getByRole('button', {name: 'Enter custom value for Radius'});
    edit.focus();
    t.equal(document.activeElement, edit, 'the edit button is keyboard reachable');
    await user.keyboard('{Enter}');
    const input = slider.getByRole('spinbutton', {name: 'Radius'});
    t.equal(document.activeElement, input, 'opening the editor focuses the value');
    t.equal(input.value, '10', 'the editor starts with the current radius');
    t.ok(
      slider.getByRole('button', {name: 'Use slider for Radius'}),
      'return action names the setting'
    );
    t.ok(changed.notCalled, 'opening the editor keeps the value');
    await user.clear(input);
    await user.type(input, '125');
    await user.tab();
    t.deepEqual(changed.lastCall.args[0], {radius: 125}, 'accepts values outside the slider range');
    await user.keyboard('{Enter}');
    t.deepEqual(changed.lastCall.args[0], {radius: 100}, 'clamps on return to the slider');
    t.notOk(slider.queryByRole('spinbutton'), 'manual input closes');
    await user.click(slider.getByText('100'));
    t.equal(
      slider.getByRole('spinbutton', {name: 'Radius'}).value,
      '100',
      'clicking the displayed value opens the editor with the clamped value'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> VisConfigSlider -> reopens saved custom ranges and edits both bounds', async t => {
  const {view, changed} = renderVisConfigSlider('radiusRange', [10, 600]);
  const slider = within(view.container);
  const user = userEvent.setup();
  try {
    t.equal(
      slider.getByRole('spinbutton', {name: 'Max'}).value,
      '600',
      'loads the saved custom bound'
    );
    t.ok(changed.notCalled, 'loading does not clamp a saved range');
    t.notOk(
      slider.getAllByRole('spinbutton').includes(document.activeElement),
      'loading a saved custom range does not move keyboard focus'
    );
    await user.click(slider.getByRole('button', {name: 'Use slider for Radius Range'}));
    t.deepEqual(changed.lastCall.args[0], {radiusRange: [10, 500]}, 'clamps the upper bound');
    t.notOk(slider.queryByRole('spinbutton'), 'both inputs close with the editor');
    await user.click(slider.getByRole('button', {name: 'Enter custom value for Radius Range'}));
    const min = slider.getByRole('spinbutton', {name: 'Min'});
    const max = slider.getByRole('spinbutton', {name: 'Max'});
    t.equal(min.value, '10', 'reopens with the current lower bound');
    t.equal(max.value, '500', 'reopens with the current upper bound');
    await user.clear(min);
    await user.type(min, '5.5{Enter}');
    t.deepEqual(
      changed.lastCall.args[0],
      {radiusRange: [5.5, 500]},
      'Enter commits the lower bound'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> VisConfigSlider -> names actions by the localized setting with hidden labels', t => {
  const layer = new LayerClasses.point({id: 'named-slider-actions'});
  const onChange = sinon.spy();
  const view = renderWithTheme(
    <IntlWrapper locale="es">
      <VisConfigSlider
        {...layer.visConfigSettings.radius}
        layer={layer}
        label={false}
        onChange={onChange}
      />
      <VisConfigSlider
        {...layer.visConfigSettings.radiusRange}
        layer={layer}
        label={() => 'layerVisConfigs.radiusRange'}
        onChange={onChange}
      />
    </IntlWrapper>
  );
  const sliders = within(view.container);
  try {
    const editRadius = sliders.getByRole('button', {name: 'Enter custom value for Radio'});
    const editRange = sliders.getByRole('button', {name: 'Enter custom value for Rango de radio'});
    t.notEqual(editRadius, editRange, 'each setting has a distinct localized accessible name');
    t.notOk(sliders.queryByText('Radio'), 'a hidden visual label still names the action');
    fireEvent.click(editRadius);
    t.ok(
      sliders.getByRole('button', {name: 'Use slider for Radio'}),
      'return action names the radius'
    );
    fireEvent.click(editRange);
    t.ok(
      sliders.getByRole('button', {name: 'Use slider for Rango de radio'}),
      'return action uses the functional setting label'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> VisConfigSlider -> returning directly from an input commits its latest value', async t => {
  const user = userEvent.setup();
  for (const [property, initialValue, inputIndex, entered, expected] of [
    ['radius', 10, 0, '23.4', 23.4],
    ['radiusRange', [10, 100], 1, '600', [10, 500]]
  ]) {
    const {view, changed} = renderVisConfigSlider(property, initialValue);
    const slider = within(view.container);
    try {
      await user.click(slider.getByRole('button', {name: /^Enter custom value for /}));
      const input = slider.getAllByRole('spinbutton')[inputIndex];
      await user.clear(input);
      await user.type(input, entered);
      await user.click(slider.getByRole('button', {name: /^Use slider for /}));
      t.deepEqual(
        changed.lastCall.args[0],
        {[property]: expected},
        `${property} commits the draft before clamping and switching modes`
      );
      t.notOk(slider.queryByRole('spinbutton'), 'returns to the graphical slider');
      await user.click(slider.getByRole('button', {name: /^Enter custom value for /}));
      t.equal(
        slider.getAllByRole('spinbutton')[inputIndex].value,
        String(Array.isArray(expected) ? expected[inputIndex] : expected),
        'reopening preserves the committed value'
      );
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> VisConfigSlider -> dragging preserves scalar, range, and focused-scale values', t => {
  for (const [property, initialValue, handleIndex, clientX, expected] of [
    ['radius', 10, 1, 23.4, 23.4],
    ['radiusRange', [10, 100], 0, 10, [50, 100]],
    ['radiusRange', [10, 100], 1, 50, [10, 250]],
    ['thickness', 0.25, 1, 10, 0.5]
  ]) {
    const {view, changed} = renderVisConfigSlider(property, initialValue);
    try {
      const track = view.container.querySelector('.kg-slider');
      Object.defineProperty(track, 'offsetWidth', {configurable: true, value: 100});
      const handle = view.container.querySelectorAll('.kg-range-slider__handle')[handleIndex];
      fireEvent.mouseDown(handle, {clientX});
      fireEvent.mouseMove(document, {clientX});
      t.deepEqual(
        changed.lastCall.args[0],
        {[property]: expected},
        `${property} retains its step and scale while dragging handle ${handleIndex}`
      );
      t.equal(
        within(view.container).getByRole('button', {name: /^Enter custom value for /}).textContent,
        Array.isArray(expected) ? expected.join(' – ') : String(expected),
        'the readout updates during dragging'
      );
    } finally {
      fireEvent.mouseUp(document);
      view.unmount();
    }
  }
  t.end();
});

test('Components -> VisConfigSlider -> bounded controls retain their numeric inputs and limits', t => {
  for (const [layerType, property, initialValue, edits] of [
    ['point', 'opacity', 0.5, [[0, '1.5', 1]]],
    [
      'grid',
      'percentile',
      [10, 80],
      [
        [0, '-12', [0, 80]],
        [1, '125', [0, 100]]
      ]
    ]
  ]) {
    const {view, changed} = renderVisConfigSlider(property, initialValue, {layerType});
    const slider = within(view.container);
    try {
      t.notOk(slider.queryByRole('button'), `${property} has no custom-mode action`);
      const inputs = slider.getAllByRole('spinbutton');
      t.equal(inputs.length, Array.isArray(initialValue) ? 2 : 1, 'keeps the numeric inputs');
      for (const [index, entered, expected] of edits) {
        fireEvent.change(inputs[index], {target: {value: entered}});
        fireEvent.blur(inputs[index]);
        t.deepEqual(changed.lastCall.args[0], {[property]: expected}, 'keeps edits within bounds');
      }
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> VisConfigSlider -> disabled custom controls cannot change mode or value', async t => {
  const user = userEvent.setup({pointerEventsCheck: 0});
  for (const initialValue of [10, 125]) {
    const {view, changed} = renderVisConfigSlider('radius', initialValue, {disabled: true});
    const slider = within(view.container);
    try {
      const button = slider.getByRole('button');
      t.ok(button.disabled, 'the mode action is disabled');
      await user.click(button);
      const input = slider.queryByRole('spinbutton');
      t.equal(Boolean(input), initialValue === 125, 'clicking does not change mode');
      if (input) {
        t.ok(input.disabled, 'a saved custom input is disabled');
      }
      t.ok(changed.notCalled, 'disabled controls preserve the saved value');
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> LayerConfigurator -> bitmap bounds keep sliders across the dateline', t => {
  for (const [west, east] of [
    [-180.5, -170],
    [170, 190],
    [-550, -530],
    [-170, 170]
  ]) {
    const dataset = new KeplerTable({info: {id: 'bitmap-bounds'}, color: [0, 0, 0]});
    const layer = new LayerClasses.bitmap({id: 'bitmap-bounds', dataId: dataset.id});
    layer.updateLayerVisConfig({
      boundsWest: west,
      boundsEast: east,
      boundsSouth: -10,
      boundsNorth: 10
    });
    const changed = sinon.spy();
    const view = renderWithTheme(
      <IntlWrapper>
        <LayerConfigurator
          {...defaultProps}
          layer={layer}
          datasets={{[dataset.id]: dataset}}
          updateLayerVisConfig={changed}
        />
      </IntlWrapper>
    );
    try {
      const bounds = view.container.querySelector('.bitmap-bounds-sliders');
      const inputs = bounds.querySelectorAll('.kg-range-slider__input');
      t.equal(bounds.querySelectorAll('.kg-slider').length, 4, 'all bounds have sliders');
      t.deepEqual(
        Array.from(inputs, input => Number(input.value)),
        [west, east, -10, 10],
        'all four slider inputs preserve the saved bounds, including unwrapped longitudes'
      );
      t.ok(changed.notCalled, 'opening the configurator does not rewrite the saved bounds');
      for (const [index, property, value] of [
        [0, 'boundsWest', west - 0.25],
        [1, 'boundsEast', east + 0.25]
      ]) {
        fireEvent.change(inputs[index], {target: {value: String(value)}});
        fireEvent.blur(inputs[index]);
        t.deepEqual(
          changed.lastCall.args[0],
          {[property]: value},
          'edits retain the longitude world'
        );
      }
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> LayerConfigurator -> bitmap slider drags stay continuous across world boundaries', t => {
  for (const {west, east, index, start, positions, expected} of [
    {west: -181, east: -170, index: 0, start: 179, positions: [180, 181], expected: [-180, -179]},
    {west: 170, east: 181, index: 1, start: 361, positions: [360, 359], expected: [180, 179]}
  ]) {
    const dataset = new KeplerTable({info: {id: 'bitmap-drag'}, color: [0, 0, 0]});
    const layer = new LayerClasses.bitmap({id: 'bitmap-drag', dataId: dataset.id});
    layer.updateLayerVisConfig({
      boundsWest: west,
      boundsEast: east,
      boundsSouth: -10,
      boundsNorth: 10
    });
    const changes = [];
    const Editor = () => {
      const [, redraw] = React.useState(0);
      return (
        <IntlWrapper>
          <LayerConfigurator
            {...defaultProps}
            layer={layer}
            datasets={{[dataset.id]: dataset}}
            updateLayerVisConfig={change => {
              changes.push(change);
              layer.updateLayerVisConfig(change);
              redraw(version => version + 1);
            }}
          />
        </IntlWrapper>
      );
    };
    const view = renderWithTheme(<Editor />);
    try {
      const slider = view.container.querySelectorAll('.bitmap-bounds-sliders .kg-slider')[index];
      Object.defineProperty(slider, 'offsetWidth', {configurable: true, value: 540});
      const handle = slider.querySelectorAll('.kg-range-slider__handle')[1];
      fireEvent.mouseDown(handle, {clientX: start});
      for (const clientX of positions) {
        fireEvent.mouseMove(document, {clientX});
      }
      fireEvent.mouseUp(document);
      const property = index === 0 ? 'boundsWest' : 'boundsEast';
      t.deepEqual(
        changes,
        expected.map(value => ({[property]: value})),
        'consecutive pointer movements remain one degree apart after rerendering'
      );
      t.equal(
        layer.config.visConfig[property],
        expected[1],
        'release retains the final drag value'
      );
      t.equal(
        layer.config.visConfig[index === 0 ? 'boundsEast' : 'boundsWest'],
        index === 0 ? east : west,
        'dragging one bound leaves the opposite bound unchanged'
      );
    } finally {
      view.unmount();
    }
  }
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

function renderContourRange(layer, datasets, onChange, overrides = {}) {
  const props = {...defaultProps, layer, datasets, updateLayerVisConfig: onChange, ...overrides};
  const view = render(<LayerConfigurator {...props} />, {
    wrapper: ({children}) => (
      <ThemeProvider theme={theme}>
        <IntlWrapper>{children}</IntlWrapper>
      </ThemeProvider>
    )
  });
  return {
    ...view,
    ...within(view.container),
    update: () => view.rerender(<LayerConfigurator {...props} />)
  };
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

function contourConfigGroup(view, label) {
  return view
    .getByText(label, {selector: '.layer-config-group__label span'})
    .closest('.layer-config-group');
}

function toggleConfigGroup(group) {
  fireEvent.click(group.querySelector('.layer-config-group__header'));
}

test('Components -> LayerConfigurator -> contour weight lives before Color and can switch to density', t => {
  for (const columnMode of ['grid', 'geojson']) {
    const dataset = contourRangeDataset();
    const layer = contourRangeLayer(dataset);
    layer.updateLayerConfig({columnMode});
    const originalColumns = layer.config.columns;
    const onChange = sinon.spy(config => layer.updateLayerConfig(config));
    const view = renderContourRange(layer, {[dataset.id]: dataset}, sinon.spy(), {
      updateLayerConfig: onChange
    });
    try {
      const weight = contourConfigGroup(view, 'Weight');
      const visual = view.container.querySelector('.layer-panel__config__visualC-config');
      t.equal(weight.parentElement, visual, 'weight is in the main settings');
      t.equal(
        weight.nextElementSibling,
        contourConfigGroup(view, 'Color'),
        'weight precedes Color'
      );
      t.equal(
        view.queryAllByText('Weight', {selector: '.layer-config-group__label span'}).length,
        1,
        'Data Source has no duplicate weight selector'
      );
      t.ok(within(weight).getByText('value'), 'retains the saved weight selection');
      t.ok(
        weight.querySelector('[data-for="columns.contour.weight"] [data-id="tooltip"]'),
        'weight includes help for averages and the density fallback'
      );

      fireEvent.click(weight.querySelector('.item-selector__dropdown'));
      fireEvent.click(within(document.body).getByText('other', {selector: '.list__item__anchor'}));
      t.deepEqual(
        layer.config.columns.value,
        {...originalColumns.value, value: 'other', fieldIdx: 1},
        'selecting a weight updates the existing value column'
      );
      t.equal(
        layer.config.columnMode,
        columnMode,
        'selecting a weight preserves the position mode'
      );
      t.deepEqual(layer.config.columns.lat, originalColumns.lat, 'preserves latitude');
      t.deepEqual(layer.config.columns.lng, originalColumns.lng, 'preserves longitude');
      t.deepEqual(layer.config.columns.geojson, originalColumns.geojson, 'preserves geometry');
      view.update();

      fireEvent.click(weight.querySelector('.data-ex-icons-delete'));
      t.deepEqual(
        layer.config.columns.value,
        {...originalColumns.value, value: null, fieldIdx: -1},
        'clearing the weight selects point density'
      );
      view.update();
      t.ok(within(weight).getByText('Point count'), 'shows the density fallback');
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> LayerConfigurator -> contour switches between plain color and the palette picker', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  const plainColor = layer.config.color;
  const colorLegends = {[JSON.stringify(['value', true, 2])]: 'Low'};
  layer.updateLayerVisConfig({colorRange: {...layer.config.visConfig.colorRange, colorLegends}});
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange, {
    updateLayerColorUI: (property, config) => layer.updateLayerColorUI(property, config)
  });
  try {
    const group = contourConfigGroup(view, 'Color');
    const toggle = group.querySelector('#contour-range-colorByLevel-switch');
    t.ok(toggle.checked, 'new contours enable color by level');
    t.ok(group.querySelector('.color-range-palette'), 'shows the default palette preview');
    fireEvent.click(toggle);
    t.deepEqual(onChange.lastCall.args[0], {colorByLevel: false}, 'allows selecting plain color');
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.ok(group.querySelector('.color-selector__selector__block'), 'shows the plain color picker');
    t.notOk(
      toggle.closest('.layer-config-group__content__collapsible'),
      'color mode is available without expanding'
    );
    fireEvent.click(toggle);
    t.deepEqual(onChange.lastCall.args[0], {colorByLevel: true}, 'enables color by level');
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.notOk(
      group.querySelector('.color-selector__selector__block'),
      'replaces the single-color picker'
    );
    t.ok(group.querySelector('.color-range-palette'), 'shows a palette preview');

    fireEvent.click(group.querySelector('.color-selector__selector'));
    view.update();
    t.ok(group.querySelector('.color-range-selector'), 'opens the standard palette picker');
    const initialPalette = layer.config.visConfig.colorRange;
    fireEvent.click(group.querySelector('.color-palette-outer'));
    const {colorRange} = onChange.lastCall.args[0];
    t.equal(colorRange.name, initialPalette.name, 'the default palette is first in the picker');
    t.deepEqual(
      colorRange.colors,
      initialPalette.colors,
      'the default uses the first palette colors'
    );
    t.ok(colorRange.colors.length > 1, 'selecting a palette emits multiple colors');
    t.deepEqual(
      colorRange.colorLegends,
      colorLegends,
      'palette selection retains threshold labels'
    );
    layer.updateLayerVisConfig({colorRange});
    view.update();
    fireEvent.click(group.querySelector('#reversed-toggle'));
    view.update();
    t.deepEqual(
      layer.config.visConfig.colorRange.colors,
      [...colorRange.colors].reverse(),
      'standard reverse control reverses the palette'
    );
    t.deepEqual(
      layer.config.visConfig.colorRange.colorLegends,
      colorLegends,
      'reversing preserves threshold labels'
    );
    const savedPalette = layer.config.visConfig.colorRange;

    fireEvent.click(toggle);
    t.deepEqual(onChange.lastCall.args[0], {colorByLevel: false}, 'returns to plain color');
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.ok(
      group.querySelector('.color-selector__selector__block'),
      'restores the plain color picker'
    );
    t.deepEqual(layer.config.color, plainColor, 'retains the original plain color');
    fireEvent.click(toggle);
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.deepEqual(
      layer.config.visConfig.colorRange,
      savedPalette,
      'retains the chosen palette when switching modes'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour groups expand independently without changing settings', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    const groups = ['Color', 'Contour levels', 'Surface'].map(label =>
      contourConfigGroup(view, label)
    );
    t.ok(
      groups.every(group => group.classList.contains('collapsed')),
      'details start collapsed'
    );
    for (const label of ['Number of levels', 'Smoothing']) {
      t.notOk(
        view.getByText(label).closest('.layer-config-group__content__collapsible'),
        `${label} remains available without expanding a group`
      );
    }
    toggleConfigGroup(groups[1]);
    t.notOk(groups[1].classList.contains('collapsed'), 'opens the level controls');
    t.ok(groups[2].classList.contains('collapsed'), 'surface details stay closed');
    toggleConfigGroup(groups[2]);
    t.notOk(groups[2].classList.contains('collapsed'), 'opens the surface controls independently');
    toggleConfigGroup(groups[1]);
    t.ok(groups[1].classList.contains('collapsed'), 'closes the level controls');
    t.notOk(groups[2].classList.contains('collapsed'), 'leaves the surface controls open');

    toggleConfigGroup(groups[0]);
    t.notOk(groups[0].classList.contains('collapsed'), 'opens the color controls');
    toggleConfigGroup(groups[0]);
    t.ok(groups[0].classList.contains('collapsed'), 'closes the color controls');
    t.ok(onChange.notCalled, 'expanding and collapsing groups does not change layer settings');

    t.notOk(groups[2].querySelector('.item-selector'), 'surface has no input-type selector');
    const input = groups[2].querySelector('.kg-range-slider__input');
    t.equal(input.value, '3', 'smoothing starts at three cells');
    fireEvent.change(input, {target: {value: '2'}});
    fireEvent.blur(input);
    t.deepEqual(onChange.lastCall.args[0], {smoothing: 2}, 'smoothing remains editable');
    const resolutionInput = Array.from(groups[2].querySelectorAll('.kg-range-slider__input')).find(
      element => element.value === '64'
    );
    t.ok(resolutionInput, 'grid resolution starts at 64 cells');
    fireEvent.change(resolutionInput, {target: {value: '128'}});
    fireEvent.blur(resolutionInput);
    t.deepEqual(
      onChange.lastCall.args[0],
      {gridResolution: 128},
      'maximum axis resolution controls aggregation detail'
    );
    t.notOk(groups[2].classList.contains('collapsed'), 'editing settings keeps the group open');
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour 3D switch and multiplier preserve the 2D style', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  const original = {...layer.config.visConfig};
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    const group = contourConfigGroup(view, 'Surface');
    const smoothing = group.querySelector('.kg-range-slider__input');
    const toggle = view.container.querySelector('#contour-range-enable3d-switch');
    t.ok(
      smoothing.compareDocumentPosition(toggle) & window.Node.DOCUMENT_POSITION_FOLLOWING,
      'smoothing comes before the 3D switch in reading order'
    );
    t.notOk(toggle.checked, 'existing contours start flat');
    t.notOk(view.queryByText('Elevation multiplier'), 'height control is hidden in 2D');
    fireEvent.click(toggle);
    t.deepEqual(onChange.lastCall.args[0], {enable3d: true}, 'enables the surface');
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    const multiplier = group.querySelectorAll('.kg-range-slider__input')[1];
    t.notOk(
      group.querySelector('[id="property.elevationScale"]'),
      'elevation multiplier has no custom-input toggle'
    );
    t.ok(
      toggle.compareDocumentPosition(multiplier) & window.Node.DOCUMENT_POSITION_FOLLOWING,
      'the elevation multiplier follows the 3D switch'
    );
    t.equal(multiplier.value, '1', 'relief starts at 1x');
    fireEvent.change(multiplier, {target: {value: '2.5'}});
    fireEvent.blur(multiplier);
    t.deepEqual(onChange.lastCall.args[0], {elevationScale: 2.5}, 'changes only height');
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    fireEvent.click(toggle);
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.notOk(view.queryByText('Elevation multiplier'), 'returns to 2D');
    t.deepEqual(
      layer.config.visConfig,
      {...original, elevationScale: 2.5},
      'retains style and multiplier'
    );
    fireEvent.click(toggle);
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.equal(
      group.querySelectorAll('.kg-range-slider__input')[1].value,
      '2.5',
      'restores the chosen multiplier'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> density custom levels use the cell count range', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  layer.updateLayerConfig({columns: layer.assignColumn('value', null)});
  layer.updateMeta({contourDomain: [0, 12]});
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    toggleConfigGroup(contourConfigGroup(view, 'Contour levels'));
    fireEvent.click(view.container.querySelector('#contour-range-customRange-switch'));
    t.deepEqual(
      onChange.lastCall.args[0],
      {customRange: true, minimum: 0, maximum: 12},
      'initializes thresholds from point counts without a selected column'
    );
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    view.update();
    t.deepEqual(contourRangeLabels(view.container), [0, 12], 'shows the count range');
    dragContourHandle(view.container, 1, 50);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: 0, maximum: 6},
      'density thresholds are editable'
    );
    layer.updateMeta({contourDomain: null});
    view.update();
    t.equal(
      view.container.querySelectorAll('.contour-level-range .kg-range-slider__handle').length,
      0,
      'clears the range when density has no observations'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour settings preserve saved directions without an Invert control', t => {
  for (const below of [true, false]) {
    const dataset = contourRangeDataset();
    const layer = contourRangeLayer(dataset);
    layer.updateLayerVisConfig({below});
    const onChange = sinon.spy();
    const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
    try {
      toggleConfigGroup(contourConfigGroup(view, 'Contour levels'));
      t.notOk(view.queryByRole('checkbox', {name: 'Invert'}), 'does not offer an Invert toggle');
      t.ok(onChange.notCalled, 'loading the controls preserves the saved map');
      fireEvent.click(view.container.querySelector('#contour-range-customRange-switch'));
      t.deepEqual(
        onChange.lastCall.args[0],
        {customRange: true, minimum: -2, maximum: 8},
        'level edits update thresholds without changing direction'
      );
      layer.updateLayerVisConfig(onChange.lastCall.args[0]);
      view.update();
      t.equal(
        layer.config.visConfig.below,
        below,
        'keeps the saved direction after editing levels'
      );
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> LayerConfigurator -> contour fill and outline groups retain independent settings', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  layer.updateLayerVisConfig({fillOpacity: 0.12, thickness: 2.5});
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    for (const [property, label, controlLabel, savedProperty, savedValue] of [
      ['filled', 'Fill', 'Opacity', 'fillOpacity', 0.12],
      ['stroked', 'Outline', 'Outline width', 'thickness', 2.5]
    ]) {
      const group = contourConfigGroup(view, label);
      const controls = within(group);
      const toggle = group.querySelector('.layer-config-group__header input');
      t.ok(toggle.checked, `${label} is enabled in its header`);
      t.notOk(
        controls.getByText(controlLabel).closest('.layer-config-group__content__collapsible'),
        `${controlLabel} is available immediately without expanding a group`
      );
      const slider = group.querySelector('.kg-slider');
      Object.defineProperty(slider, 'offsetWidth', {configurable: true, value: 100});
      fireEvent.mouseDown(group.querySelectorAll('.kg-range-slider__handle')[1], {clientX: 60});
      fireEvent.mouseMove(document, {clientX: 60});
      fireEvent.mouseUp(document);
      t.deepEqual(
        onChange.lastCall.args[0],
        {[savedProperty]: property === 'filled' ? 0.6 : 3.2},
        `${controlLabel} slider edits only its own setting`
      );
      if (property === 'filled') {
        for (const percent of [0, 100]) {
          fireEvent.mouseDown(group.querySelectorAll('.kg-range-slider__handle')[1], {
            clientX: percent
          });
          fireEvent.mouseMove(document, {clientX: percent});
          fireEvent.mouseUp(document);
          t.deepEqual(
            onChange.lastCall.args[0],
            {fillOpacity: percent / 100},
            `fill opacity can reach ${percent}%`
          );
        }
      }
      const control = controls.getByText(controlLabel);
      fireEvent.click(toggle);
      t.deepEqual(onChange.lastCall.args[0], {[property]: false}, `disables only ${label}`);
      layer.updateLayerVisConfig(onChange.lastCall.args[0]);
      view.update();
      t.equal(controls.getByText(controlLabel), control, `keeps the ${label} control visible`);
      t.ok(control.closest('[inert]'), `makes the disabled ${label} control inactive`);
      t.equal(layer.config.visConfig[savedProperty], savedValue, 'preserves the stored setting');

      fireEvent.click(toggle);
      t.deepEqual(onChange.lastCall.args[0], {[property]: true}, `re-enables only ${label}`);
      layer.updateLayerVisConfig(onChange.lastCall.args[0]);
      view.update();
      t.notOk(control.closest('[inert]'), `restores interaction with the ${label} control`);
      t.equal(layer.config.visConfig[savedProperty], savedValue, 'restores the previous value');
    }
  } finally {
    view.unmount();
    t.end();
  }
});

test('Components -> LayerConfigurator -> contour custom range is revealed on load and survives collapsing', t => {
  const dataset = contourRangeDataset();
  const layer = contourRangeLayer(dataset);
  layer.updateLayerVisConfig({customRange: true, minimum: -1, maximum: 6});
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    const group = contourConfigGroup(view, 'Contour levels');
    t.notOk(group.classList.contains('collapsed'), 'reveals the saved custom range on load');
    toggleConfigGroup(group);
    t.ok(group.classList.contains('collapsed'), 'allows the custom range to be collapsed');
    toggleConfigGroup(group);
    t.notOk(group.classList.contains('collapsed'), 'reveals the custom range again');
    t.deepEqual(contourRangeLabels(view.container), [-1, 6], 'preserves both slider endpoints');
    t.ok(onChange.notCalled, 'does not reset saved thresholds while collapsing');
    dragContourHandle(view.container, 1, 85);
    t.deepEqual(onChange.lastCall.args[0], {minimum: -1, maximum: 6.5}, 'slider remains editable');
  } finally {
    view.unmount();
    t.end();
  }
});

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
    toggleConfigGroup(contourConfigGroup(view, 'Contour levels'));
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

test('Components -> LayerConfigurator -> sparse weighted contours retain usable custom thresholds', t => {
  for (const weights of [
    [10, 20],
    [10, 10],
    [-20, -10]
  ]) {
    const dataset = contourRangeDataset(
      'sparse-contour-range',
      weights.map((value, index) => [index, index, value]),
      ['longitude', 'latitude', 'value']
    );
    const layer = new LayerClasses.contour({
      id: 'contour-range',
      dataId: dataset.id,
      columns: {
        lng: {value: 'longitude', fieldIdx: 0},
        lat: {value: 'latitude', fieldIdx: 1},
        value: {value: 'value', fieldIdx: 2}
      }
    });
    layer.updateLayerVisConfig({gridResolution: 32});
    const datasets = {[dataset.id]: dataset};
    const automatic = layer.formatLayerData(datasets).data;
    t.ok(automatic.length > 0, 'sparse weighted samples generate automatic contours');
    const minimum = Math.min(...weights);
    const maximum = Math.max(...weights);
    if (minimum > 0) {
      t.ok(
        automatic.every(feature => feature.properties.threshold < minimum),
        'smoothing puts the surface below the raw column minimum'
      );
    }

    const onChange = sinon.spy();
    const view = renderContourRange(layer, datasets, onChange);
    try {
      toggleConfigGroup(contourConfigGroup(view, 'Contour levels'));
      fireEvent.click(view.container.querySelector('#contour-range-customRange-switch'));
      const range = [Math.min(0, minimum), Math.max(0, maximum)];
      t.deepEqual(
        onChange.lastCall.args[0],
        {customRange: true, minimum: range[0], maximum: range[1]},
        'custom levels include the empty-cell baseline and raw weights'
      );
      layer.updateLayerVisConfig(onChange.lastCall.args[0]);
      view.update();
      t.ok(layer.formatLayerData(datasets).data.length > 0, 'enabling custom range keeps contours');
      t.deepEqual(
        contourRangeLabels(view.container),
        range,
        'the slider exposes the surface range'
      );

      // Narrow the thresholds entirely into the smoothed surface, below the positive raw weights.
      if (minimum > 0) {
        dragContourHandle(view.container, 1, 10);
        layer.updateLayerVisConfig(onChange.lastCall.args[0]);
        view.update();
        dragContourHandle(view.container, 0, 5);
        layer.updateLayerVisConfig(onChange.lastCall.args[0]);
        view.update();
        const contours = layer.formatLayerData(datasets).data;
        t.ok(contours.length > 0, 'both handles can select thresholds that restore peak contours');
        t.ok(
          contours.every(
            feature => feature.properties.threshold > 0 && feature.properties.threshold < minimum
          ),
          'restored contours enclose positive peaks below the raw minimum'
        );
      }
    } finally {
      view.unmount();
    }
  }
  t.end();
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

test('Components -> LayerConfigurator -> contour slider supports Arrow Int64 and Uint64 ranges', async t => {
  for (const ArrowType of [Int64, Uint64]) {
    const dataset = new KeplerTable({info: {id: 'contour-arrow-range'}, color: [0, 0, 0]});
    const arrowTable = new Table({value: vectorFromArray([10n, 20n, null], new ArrowType())});
    await dataset.importData({
      data: {
        fields: [{name: 'value', type: 'integer', analyzerType: 'INT'}],
        rows: [],
        cols: [arrowTable.getChildAt(0)],
        arrowTable
      }
    });
    const layer = contourRangeLayer(dataset);
    const onChange = sinon.spy();
    const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
    try {
      toggleConfigGroup(contourConfigGroup(view, 'Contour levels'));
      fireEvent.click(view.container.querySelector('#contour-range-customRange-switch'));
      t.deepEqual(
        onChange.lastCall.args[0],
        {customRange: true, minimum: 10, maximum: 20},
        'initializes from numeric field accessors and ignores nulls'
      );
      layer.updateLayerVisConfig(onChange.lastCall.args[0]);
      view.update();
      t.deepEqual(contourRangeLabels(view.container), [10, 20], 'shows both Arrow bounds');
      dragContourHandle(view.container, 0, 50);
      t.deepEqual(
        onChange.lastCall.args[0],
        {minimum: 15, maximum: 20},
        'Arrow ranges remain adjustable'
      );
    } finally {
      view.unmount();
    }
  }
  t.end();
});

test('Components -> LayerConfigurator -> contour slider refreshes after in-place data changes', async t => {
  const dataset = contourRangeDataset('contour-refresh-range', [[10], [20]], ['value']);
  const container = dataset.dataContainer;
  const layer = contourRangeLayer(dataset);
  layer.updateLayerVisConfig({customRange: true, minimum: 10, maximum: 20});
  const onChange = sinon.spy();
  const view = renderContourRange(layer, {[dataset.id]: dataset}, onChange);
  try {
    t.deepEqual(contourRangeLabels(view.container), [10, 20], 'starts at the original range');
    await dataset.update({fields: dataset.fields, rows: [[100], [200]]});
    t.equal(dataset.dataContainer, container, 'snapshot updates keep the container identity');
    view.update();
    t.deepEqual(
      contourRangeLabels(view.container),
      [100, 200],
      'refreshes the range after a snapshot'
    );
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: 100, maximum: 200},
      'synchronizes disjoint saved thresholds'
    );
    layer.updateLayerVisConfig(onChange.lastCall.args[0]);
    t.ok(dataset.appendRows([[300]]), 'appends a value to the same container');
    view.update();
    t.deepEqual(
      contourRangeLabels(view.container),
      [100, 200],
      'preserves the selection within expanded bounds'
    );
    dragContourHandle(view.container, 1, 100);
    t.deepEqual(
      onChange.lastCall.args[0],
      {minimum: 100, maximum: 300},
      'allows selecting an appended maximum'
    );
    await dataset.update({fields: dataset.fields, rows: [[null], [NaN]]});
    view.update();
    t.equal(
      view.container.querySelectorAll('.contour-level-range .kg-range-slider__handle').length,
      0,
      'clears stale bounds when no finite values remain'
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

for (const locale of ['en', 'es']) {
  test(`Components -> Flow Field column labels resolve in ${locale}`, t => {
    const layer = new LayerClasses.flowField({id: 'flow-field', dataId: testCsvDataId});
    const fields = ['height', 'wind_speed'].map((name, fieldIdx) => ({
      name,
      displayName: name,
      fieldIdx,
      type: 'real',
      format: ''
    }));
    layer.updateLayerConfig({columns: layer.assignColumn('altitude', fields[0])});
    const update = sinon.spy();
    const {container, unmount} = renderWithTheme(
      <IntlWrapper locale={locale}>
        <LayerColumnModeConfig
          id={layer.id}
          layer={layer}
          layerConfig={layer.config}
          supportedColumnModes={layer.supportedColumnModes}
          fields={fields}
          openModal={openModal}
          updateLayerConfig={update}
          updateLayerType={updateLayerType}
        />
      </IntlWrapper>
    );
    const modes = [
      {key: 'UV', fields: ['flowField.u', 'flowField.v']},
      {key: 'SPEED_DIR', fields: ['flowField.speed', 'flowField.direction']},
      {key: 'ELEVATION', fields: []}
    ];
    try {
      const panels = container.querySelectorAll('.layer-column-mode-panel');
      t.equal(panels.length, modes.length, 'retains all three column modes');
      modes.forEach((mode, index) => {
        const panel = panels[index];
        const labels = () =>
          Array.from(panel.querySelectorAll('.layer-config__column__name'), element =>
            element.textContent.replace(/\s*\*$/, '').trim()
          );
        const expectedLabels = position =>
          [...position, ...mode.fields, 'altitude'].map(key => messages[locale][`columns.${key}`]);
        t.deepEqual(
          labels(),
          expectedLabels(['lat', 'lng']),
          `${mode.key} resolves position and attribute labels from the message catalog`
        );
        const altitude = panel.querySelector('.layer-config__column__selector:last-child');
        t.equal(
          altitude.querySelector('.layer-config__column__name').textContent.includes('*'),
          mode.key === 'ELEVATION',
          'altitude is required only in elevation mode'
        );
        t.ok(
          within(altitude.querySelector('.item-selector__dropdown__value')).getByText('height'),
          'preserves the selected data column'
        );
        fireEvent.click(within(panel).getByRole('checkbox'));
        t.deepEqual(update.lastCall.args[0], {columnMode: mode.key}, 'selects the existing mode');
        fireEvent.click(within(panel).getByRole('tab', {name: 'GeoJSON'}));
        t.deepEqual(
          labels(),
          expectedLabels(['geojson']),
          `${mode.key} resolves labels with GeoJSON positions too`
        );
      });

      const speedRow = panels[1].querySelectorAll('.layer-config__column__selector')[1];
      fireEvent.keyDown(within(speedRow).getByRole('button'), {key: 'Enter', keyCode: 13});
      fireEvent.click(within(document.body).getByText('wind_speed'));
      t.deepEqual(
        update.lastCall.args[0],
        {columns: layer.assignColumn('speed', fields[1]), columnMode: 'SPEED_DIR'},
        'selecting a field in another mode preserves other columns and activates that mode'
      );
    } finally {
      unmount();
      t.end();
    }
  });
}

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

test('Components -> LayerConfigurator -> automatic Zarr range remains editable', async t => {
  const layer = new LayerClasses.zarr({id: 'zarr-layer', dataId: 'zarr_data'});
  layer.updateLayerMeta(ZARR_DATASET);
  const variable = ZARR_DATASET.metadata.variables[0];
  const runtime = await layer._loadRuntime();
  layer._loadRuntime = async () => ({
    ...runtime,
    get: async () => ({data: new Float32Array([250, 320])})
  });
  layer._nodeKey = `${ZARR_DATASET.metadata.url}#${variable.path}`;
  layer._node = {};
  const updateLayerVisConfigSpy = sinon.spy();
  const configurator = () => (
    <ThemeProvider theme={theme}>
      <IntlWrapper>
        <LayerConfigurator
          {...defaultProps}
          layer={layer}
          datasets={{zarr_data: ZARR_DATASET}}
          updateLayerVisConfig={updateLayerVisConfigSpy}
        />
      </IntlWrapper>
    </ThemeProvider>
  );
  const {container, unmount, rerender} = render(configurator());
  try {
    const [minimum, maximum] = container.querySelectorAll('.kg-range-slider__input');
    t.equal(minimum.value, '0', 'shows the fallback lower bound while automatic');
    t.equal(maximum.value, '1', 'shows the fallback upper bound while automatic');
    t.equal(
      layer.config.visConfig.rescale,
      null,
      'displaying fallback bounds does not select them'
    );
    const [deckLayer] = layer.renderLayer({
      data: {metadata: ZARR_DATASET.metadata, variable},
      mapState: {},
      visible: true,
      layerCallbacks: {onRedrawNeeded: () => rerender(configurator())}
    });
    await act(async () => {
      await deckLayer.props.getTileData(layer._node, {sliceSpec: [], width: 2, height: 1});
    });
    t.equal(minimum.value, '250', 'shows the sampled lower bound after loading');
    t.equal(maximum.value, '320', 'shows the sampled upper bound after loading');
    t.equal(layer.config.visConfig.rescale, null, 'sampling keeps automatic range intent');
    fireEvent.change(minimum, {target: {value: '264'}});
    fireEvent.blur(minimum);
    t.deepEqual(
      updateLayerVisConfigSpy.lastCall.args[0],
      {rescale: [264, 320]},
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

test('Components -> LayerConfigurator -> collapsed Heatmap surface toggle group', t => {
  const layer = new KeplerGlLayers.HeatmapLayer({id: 'surface-controls', dataId: testCsvDataId});
  const changed = sinon.spy();
  function Editor() {
    const [, setVersion] = React.useState(0);
    return (
      <IntlWrapper>
        <LayerConfigurator
          {...defaultProps}
          layer={layer}
          updateLayerVisConfig={value => {
            changed(value);
            layer.updateLayerVisConfig(value);
            setVersion(v => v + 1);
          }}
        />
      </IntlWrapper>
    );
  }
  const view = renderWithTheme(<Editor />);
  const group = view.getByText('3D Surface').closest('.layer-config-group');
  const header = group.querySelector('.layer-config-group__header');
  const toggle = within(header).getByRole('checkbox');
  const content = group.querySelector('.layer-config-group__content');
  const options = content.querySelector('.layer-config-group__content__collapsible');
  try {
    t.equal(group, group.parentElement.lastElementChild, '3D Surface is the last settings group');
    t.notOk(view.queryByText('Contour step'), 'contour step is hidden until contours are enabled');
    t.notOk(toggle.checked, '3D Surface is off by default');
    t.equal(layer.config.visConfig.surfaceEnabled, false, 'default display remains 2D');
    t.ok(group.classList.contains('collapsed'), 'surface group starts collapsed');
    t.ok(content.classList.contains('disabled'), 'surface options are disabled while 2D');
    t.ok(
      options.contains(view.getByText('Maximum height (m)')),
      'height is inside the collapsible options'
    );
    t.ok(
      options.contains(view.getByText('Surface shading')),
      'shading is inside the collapsible options'
    );
    t.ok(
      options.contains(view.getByText('Surface contours')),
      'contours are inside the collapsible options'
    );

    fireEvent.click(toggle);
    t.ok(toggle.checked, 'toggle enables 3D Surface');
    t.deepEqual(
      changed.lastCall.args[0],
      {surfaceEnabled: true},
      'enabling emits the boolean setting directly'
    );
    t.notOk(content.classList.contains('disabled'), 'enabled surface options can be edited');
    t.notOk(group.classList.contains('collapsed'), 'enabling expands the surface options');

    const calls = changed.callCount;
    fireEvent.click(header);
    t.ok(group.classList.contains('collapsed'), 'header can collapse all surface options');
    t.equal(changed.callCount, calls, 'collapsing does not change the selected display mode');
    fireEvent.click(header);
    t.notOk(group.classList.contains('collapsed'), 'header can expand the options again');

    const heightInput = Array.from(options.querySelectorAll('.kg-range-slider__input')).find(
      input => input.value === '1000'
    );
    fireEvent.change(heightInput, {target: {value: '2500'}});
    fireEvent.blur(heightInput);
    t.deepEqual(changed.lastCall.args[0], {surfaceHeight: 2500}, 'height edits update the surface');
    fireEvent.click(options.querySelector('#surface-controls-surfaceLighting-switch'));
    t.deepEqual(changed.lastCall.args[0], {surfaceLighting: false}, 'shading can be disabled');
    fireEvent.click(options.querySelector('#surface-controls-surfaceContours-switch'));
    t.deepEqual(changed.lastCall.args[0], {surfaceContours: true}, 'contours can be enabled');
    t.ok(options.contains(view.getByText('Contour step')), 'contour step is in the surface group');
    const contourInput = Array.from(options.querySelectorAll('.kg-range-slider__input')).find(
      input => input.value === '0.1'
    );
    for (const step of [0.01, 0.2, 5, 100]) {
      fireEvent.change(contourInput, {target: {value: String(step)}});
      fireEvent.blur(contourInput);
      t.deepEqual(
        changed.lastCall.args[0],
        {surfaceContourStep: step},
        `contour step ${step} can be selected without clamping`
      );
    }
    fireEvent.click(options.querySelector('#surface-controls-surfaceContours-switch'));
    t.notOk(view.queryByText('Contour step'), 'disabling contours hides their step control');
    fireEvent.click(options.querySelector('#surface-controls-surfaceContours-switch'));
    t.equal(layer.config.visConfig.surfaceContourStep, 100, 'reenabling contours retains the step');
    fireEvent.click(toggle);
    t.notOk(toggle.checked, 'toggle returns to 2D');
    t.deepEqual(changed.lastCall.args[0], {surfaceEnabled: false}, 'disabling stores false');
    t.ok(content.classList.contains('disabled'), '2D disables the surface options again');
    fireEvent.click(toggle);
    t.equal(layer.config.visConfig.surfaceHeight, 2500, 'switching modes retains surface settings');
    t.equal(layer.config.visConfig.surfaceContourStep, 100, 'switching modes retains contour step');
  } finally {
    view.unmount();
  }
  const restored = renderWithTheme(<Editor />);
  try {
    const restoredGroup = restored.getByText('3D Surface').closest('.layer-config-group');
    t.ok(
      within(restoredGroup.querySelector('.layer-config-group__header')).getByRole('checkbox')
        .checked,
      'saved Surface mode restores an enabled toggle'
    );
    t.ok(
      restoredGroup.classList.contains('collapsed'),
      'reopened surface settings start collapsed'
    );
  } finally {
    restored.unmount();
    t.end();
  }
});

[
  {
    label: 'Glow',
    enabled: 'glowEnabled',
    other: 'pulseEnabled',
    values: [
      ['glowExtent', '2', '3'],
      ['glowStrength', '0.5', '0.7']
    ]
  },
  {
    label: 'Pulse / Ripple',
    enabled: 'pulseEnabled',
    other: 'glowEnabled',
    values: [
      ['pulseSpeed', '1', '0.5'],
      ['pulseExpansion', '2', '49.99']
    ]
  }
].forEach(({label, enabled, other, values}) => {
  test(`Components -> LayerConfigurator -> Point Visual -> ${label}`, async t => {
    const layer = new KeplerGlLayers.PointLayer({id: 'visual-controls', dataId: testCsvDataId});
    const changed = sinon.spy();
    function Editor() {
      const [, setVersion] = React.useState(0);
      return (
        <IntlWrapper>
          <LayerConfigurator
            {...defaultProps}
            layer={layer}
            updateLayerVisConfig={value => {
              changed(value);
              layer.updateLayerVisConfig(value);
              setVersion(version => version + 1);
            }}
          />
        </IntlWrapper>
      );
    }
    const view = renderWithTheme(<Editor />);
    const group = within(view.container).getByText('Visual').closest('.layer-config-group');
    const header = group.querySelector('.layer-config-group__header');
    const content = within(group).getByText(label).closest('fieldset');
    const toggle = within(content).getByRole('checkbox', {hidden: true});
    const otherToggle = within(group)
      .getAllByRole('checkbox', {hidden: true})
      .find(input => input !== toggle);
    const user = userEvent.setup();
    // A focusable marker immediately before the group checks the whole collapsed section.
    const tabStart = document.createElement('button');
    group.before(tabStart);
    const assertCollapsedSkipped = async message => {
      tabStart.focus();
      await user.tab();
      t.notOk(group.contains(document.activeElement), message);
    };
    try {
      t.equal(
        within(group).getAllByRole('checkbox', {hidden: true}).length,
        2,
        'both effects share one group'
      );
      t.notOk(group.querySelector('.layer-config-group'), 'effects do not add nested groups');
      t.notOk(toggle.checked, 'effect is off by default');
      t.ok(group.classList.contains('collapsed'), 'Visual starts collapsed');
      t.ok(content.disabled, 'effect settings start disabled');
      await assertCollapsedSkipped('collapsed toggles and settings are skipped by Tab');
      fireEvent.click(header);
      toggle.focus();
      await user.tab();
      t.notOk(
        content.contains(document.activeElement),
        'expanded disabled settings are skipped by Tab'
      );
      const selector = content.querySelector('.item-selector');
      if (selector) {
        fireEvent.keyDown(selector, {key: 'Enter'});
        t.equal(
          selector.getAttribute('aria-expanded'),
          'false',
          'disabled selector cannot open from the keyboard'
        );
      }
      toggle.focus();
      await user.keyboard(' ');
      t.deepEqual(changed.lastCall.args[0], {[enabled]: true}, 'keyboard enables the effect');
      t.notOk(content.disabled, 'enabled settings can be edited');
      t.equal(layer.config.visConfig[other], false, 'enabling one effect leaves the other off');
      t.notOk(group.classList.contains('collapsed'), 'toggling an effect keeps Visual open');
      await user.tab();
      t.ok(content.contains(document.activeElement), 'enabled settings are keyboard reachable');
      if (selector) {
        t.equal(document.activeElement, selector, 'effect selector receives focus');
        await user.keyboard('{Enter}');
        t.equal(
          selector.getAttribute('aria-expanded'),
          'true',
          'enabled selector opens from the keyboard'
        );
        await user.keyboard('{Escape}');
        fireEvent.click(content.querySelector('.item-selector__dropdown'));
        fireEvent.click(view.getByText('Ripple'));
        t.deepEqual(changed.lastCall.args[0], {pulseMode: 'ripple'}, 'selector chooses Ripple');
      }
      for (const [property, initial, next] of values) {
        const input = Array.from(content.querySelectorAll('.kg-range-slider__input')).find(
          item => item.value === initial
        );
        input.focus();
        await user.clear(input);
        await user.type(input, next);
        await user.tab();
        t.deepEqual(
          changed.lastCall.args[0],
          {[property]: Number(next)},
          `keyboard adjusts ${property}`
        );
      }
      if (enabled === 'pulseEnabled') {
        fireEvent.click(content.querySelectorAll('.item-selector__dropdown')[1]);
        fireEvent.click(view.getByText('At event time'));
        t.deepEqual(
          changed.lastCall.args[0],
          {pulseTrigger: 'event'},
          'trigger selects recorded events'
        );
        t.notOk(
          within(content).queryByText('Speed (cycles/s)'),
          'recorded events use duration instead of repetition speed'
        );
        const duration = within(content).getByLabelText('Duration (timeline seconds)');
        const beforeEdit = changed.callCount;
        await user.clear(duration);
        t.equal(duration.value, '', 'duration can be cleared while editing');
        await user.type(duration, '0.5');
        t.equal(duration.value, '0.5', 'fractional duration can be typed from an empty input');
        t.equal(changed.callCount, beforeEdit, 'draft edits do not update the timeline');
        await user.tab();
        t.deepEqual(changed.lastCall.args[0], {pulseDurationMs: 500}, 'blur commits a half second');
        await user.clear(duration);
        await user.type(duration, '2.5{Enter}');
        t.deepEqual(
          changed.lastCall.args[0],
          {pulseDurationMs: 2500},
          'Enter commits duration in milliseconds'
        );
        const durationChanges = () =>
          changed.getCalls().filter(call => 'pulseDurationMs' in call.args[0]).length;
        const beforeInvalid = durationChanges();
        for (const value of ['', '0', '-1']) {
          await user.clear(duration);
          if (value) await user.type(duration, value);
          await user.tab();
          t.equal(durationChanges(), beforeInvalid, 'invalid duration is rejected on commit');
          t.equal(duration.value, '2.5', 'invalid duration restores the saved value');
        }
        const timeField = defaultProps.datasets[testCsvDataId].fields.find(
          f => f.type === 'timestamp'
        );
        fireEvent.click(content.querySelectorAll('.item-selector__dropdown')[2]);
        const timestampDropdown = view
          .getByText(timeField.name, {selector: '.list-selector .list__item__anchor[title]'})
          .closest('.typeahead');
        await user.type(within(timestampDropdown).getByRole('textbox'), timeField.name);
        fireEvent.click(
          view.getByText(timeField.name, {selector: '.list-selector .list__item__anchor[title]'})
        );
        t.equal(
          layer.config.visConfig.pulseTimeField,
          timeField.name,
          'searching timestamps by name selects the recorded event field'
        );
        const helpSelector = `[data-for="${layer.id}-pulse-time-filter-help"] [data-id="tooltip"]`;
        t.ok(content.querySelector(helpSelector), 'event timestamp includes timeline guidance');
        t.notOk(within(content).queryByRole('status'), 'guidance adds no inline message');
        t.equal(
          content.querySelectorAll('.item-selector__dropdown').length,
          3,
          'event controls only offer effect, trigger and timestamp choices'
        );
        fireEvent.click(content.querySelectorAll('.item-selector__dropdown')[1]);
        fireEvent.click(
          view.getByText('Continuous', {
            selector: '.list-selector .list__item__anchor:not(.disabled)'
          })
        );
        t.equal(
          layer.config.visConfig.pulseSpeed,
          0.5,
          'returning to continuous preserves its speed'
        );
        t.notOk(content.querySelector(helpSelector), 'continuous mode needs no timeline guidance');
      }
      fireEvent.click(otherToggle);
      t.equal(
        layer.config.visConfig[enabled],
        true,
        'enabling the other effect preserves this effect'
      );
      t.equal(layer.config.visConfig[other], true, 'both effects can be enabled');
      const calls = changed.callCount;
      fireEvent.click(header);
      t.ok(group.classList.contains('collapsed'), 'Visual collapses both sets of controls');
      t.equal(changed.callCount, calls, 'collapse does not change either effect');
      await assertCollapsedSkipped('collapsed enabled toggles and settings are skipped by Tab');
      fireEvent.click(header);
      fireEvent.click(toggle);
      t.deepEqual(changed.lastCall.args[0], {[enabled]: false}, 'toggle disables only its effect');
      t.equal(layer.config.visConfig[other], true, 'other effect remains enabled');
      t.ok(content.disabled, 'disabled settings cannot be edited');
      fireEvent.click(toggle);
      for (const [property, , next] of values) {
        t.equal(layer.config.visConfig[property], Number(next), `reenabling retains ${property}`);
      }
      if (selector)
        t.equal(layer.config.visConfig.pulseMode, 'ripple', 'reenabling retains Ripple');
    } finally {
      view.unmount();
    }
    const restored = renderWithTheme(<Editor />);
    try {
      const restoredGroup = within(restored.container)
        .getByText('Visual')
        .closest('.layer-config-group');
      t.ok(
        within(restoredGroup)
          .getAllByRole('checkbox', {hidden: true})
          .every(input => input.checked),
        'saved effects restore both toggles'
      );
      t.ok(restoredGroup.classList.contains('collapsed'), 'reopened Visual starts collapsed');
    } finally {
      restored.unmount();
      t.end();
    }
  });
});

test('Components -> LayerConfigurator -> Voronoi fill, outline and bounds controls', async t => {
  const layer = new KeplerGlLayers.VoronoiLayer({dataId: testCsvDataId});
  const changed = sinon.spy();
  function Editor() {
    const [, setVersion] = React.useState(0);
    return (
      <IntlWrapper>
        <LayerConfigurator
          {...defaultProps}
          layer={layer}
          updateLayerConfig={value => {
            layer.updateLayerConfig(value);
            setVersion(version => version + 1);
          }}
          updateLayerVisConfig={value => {
            changed(value);
            layer.updateLayerVisConfig(value);
            setVersion(version => version + 1);
          }}
        />
      </IntlWrapper>
    );
  }
  const view = renderWithTheme(<Editor />);
  const editor = within(view.container);
  const user = userEvent.setup();
  try {
    fireEvent.click(editor.getByLabelText('GeoJSON Centroids'));
    t.equal(layer.config.columnMode, 'geojson', 'selects GeoJSON centroid input');
    t.equal(layer.hasAllColumns(), false, 'requires a geometry column before rendering');
    fireEvent.click(editor.getByLabelText('Point Columns'));
    t.equal(layer.config.columnMode, 'points', 'can return to latitude/longitude input');
    const fill = editor.getByText('Fill Color').closest('.layer-config-group');
    const stroke = editor.getByText('Stroke Color').closest('.layer-config-group');
    fireEvent.click(stroke.querySelector('.layer-config-group__header'));
    t.notOk(
      stroke.querySelector('[id="property.thickness"]'),
      'stroke width does not offer a custom-input toggle'
    );
    const strokeWidth = stroke.querySelector('.kg-range-slider__input');
    await user.clear(strokeWidth);
    await user.type(strokeWidth, '2');
    await user.tab();
    t.deepEqual(changed.lastCall.args[0], {thickness: 2}, 'stroke width uses the standard slider');
    fireEvent.click(
      within(fill.querySelector('.layer-config-group__header')).getByRole('checkbox', {
        hidden: true
      })
    );
    t.equal(layer.config.visConfig.filled, false, 'fill can be disabled');
    t.equal(layer.config.visConfig.stroked, true, 'disabling fill preserves outlines');
    fireEvent.click(
      within(stroke.querySelector('.layer-config-group__header')).getByRole('checkbox', {
        hidden: true
      })
    );
    t.equal(layer.config.visConfig.stroked, false, 'outline can be disabled independently');
    const bounds = editor.getByText('Cell Bounds').closest('.layer-config-group');
    fireEvent.click(bounds.querySelector('.layer-config-group__header'));
    const input = bounds.querySelector('.kg-range-slider__input');
    await user.clear(input);
    await user.type(input, '25');
    await user.tab();
    t.deepEqual(
      changed.lastCall.args[0],
      {boundsPadding: 25},
      'padding commits through the standard slider'
    );
  } finally {
    view.unmount();
    t.end();
  }
});

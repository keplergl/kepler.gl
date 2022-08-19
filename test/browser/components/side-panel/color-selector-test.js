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

/* eslint-disable max-statements */ import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import sinon from 'sinon';
import cloneDeep from 'lodash.clonedeep';

import ColorSelector, {
  ColorSelectorInput,
  ColorBlock
} from 'components/side-panel/layer-panel/color-selector';
import {
  LayerColorSelector,
  LayerColorRangeSelector,
  ArcLayerColorSelector,
  getLayerConfiguratorProps,
  getVisConfiguratorProps
} from 'components/side-panel/layer-panel/layer-configurator';
import SingleColorPalette from 'components/side-panel/layer-panel/single-color-palette';
import ColorRangeSelector, {
  PaletteConfig,
  ColorPaletteGroup,
  ALL_TYPES
} from 'components/side-panel/layer-panel/color-range-selector';
import ColorPalette from 'components/side-panel/layer-panel/color-palette';
import CustomPalette from 'components/side-panel/layer-panel/custom-palette';
import CustomPicker from 'components/side-panel/layer-panel/custom-picker';
import {Button} from 'components/common/styled-components';

import {COLOR_RANGES} from '@kepler.gl/constants';

import {StateWFilesFiltersLayerColor, StateWTrips} from 'test/helpers/mock-state';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {hexToRgb} from '../utils';

test('Components -> ColorSelector.render', t => {
  t.doesNotThrow(() => {
    mount(<ColorSelector />);
  }, 'Should not fail without props');

  t.end();
});

test('Components -> LayerColorSelector.render -> render layer color', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor.visState);
  const {layers} = initialState;
  const pointLayer = layers[0];

  let wrapper;

  // create spies
  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };

  const layerConfiguratorProps = getLayerConfiguratorProps(mockProps);

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorSelector {...layerConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail with layers');
  const CSInstance = wrapper.find(ColorSelector);

  t.equal(CSInstance.length, 1, 'should render 1 ColorSelector');

  const cSProps = CSInstance.at(0).props();
  const expectedColorSets = [
    {
      selectedColor: pointLayer.config.color,
      setColor: () => {}
    }
  ];
  t.equal(cSProps.colorSets.length, expectedColorSets.length, 'should pass correct colorSets');
  t.deepEqual(
    Object.keys(cSProps.colorSets[0]),
    Object.keys(expectedColorSets[0]),
    'should pass correct colorSets[0]'
  );
  t.equal(
    cSProps.colorSets[0].selectedColor,
    expectedColorSets[0].selectedColor,
    'should pass correct colorSets.selectedColor'
  );

  // color block
  const cblk = wrapper.find(ColorBlock);
  t.equal(cblk.length, 1, 'should render 1 ColorBlock');

  const csInput = wrapper.find(ColorSelectorInput);
  t.equal(csInput.length, 1, 'should render 1 ColorSelectorInput');
  csInput.simulate('mousedown');

  t.ok(updateLayerColorUI.calledOnce, 'should call updateLayerColorUI');
  t.ok(updateLayerVisConfig.notCalled, 'should not call updateLayerColorUI');
  t.ok(updateLayerConfig.notCalled, 'should not call updateLayerConfig');

  // should open dropdown
  t.ok(updateLayerColorUI.calledWith('color', {showDropdown: 0}));

  t.end();
});

test('Components -> LayerColorSelector.render -> render single color click', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor.visState);
  const {layers} = initialState;
  // should dropdown for layer color select
  const pointLayer = layers[0].updateLayerColorUI('color', {showDropdown: 0});

  let wrapper;

  // create spies
  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };

  const layerConfiguratorProps = getLayerConfiguratorProps(mockProps);

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorSelector {...layerConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail render color select');
  const CSInstance = wrapper.find(ColorSelector);

  t.equal(CSInstance.length, 1, 'should render 1 ColorSelector');

  // open color dropdown
  const scp = wrapper.find(SingleColorPalette);
  t.equal(scp.length, 1, 'should render 1 SingleColorPalette');

  t.ok(wrapper.find('.single-color-palette__block'), 'should render color blocks');

  // click color block
  wrapper
    .find('.single-color-palette__block')
    .at(0)
    .simulate('click');

  t.ok(updateLayerConfig.calledOnce, 'should call updateLayerConfig');
  t.ok(updateLayerConfig.calledWith({color: [255, 254, 230]}));

  t.end();
});

test('Components -> ArcLayerColorSelector.render -> render single color', t => {
  const initialState = StateWTrips.visState;
  const {layers} = initialState;
  const arcLayer = layers.find(l => l.type === 'arc');
  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: arcLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };

  const layerConfiguratorProps = getLayerConfiguratorProps(mockProps);
  const visConfiguratorProps = getVisConfiguratorProps(mockProps);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ArcLayerColorSelector
          layer={arcLayer}
          setColorUI={layerConfiguratorProps.setColorUI}
          onChangeConfig={layerConfiguratorProps.onChange}
          onChangeVisConfig={visConfiguratorProps.onChange}
        />
      </IntlWrapper>
    );
  }, 'Should not fail render arc color select');

  const CSInstance = wrapper.find(ColorSelector);
  t.equal(CSInstance.length, 1, 'should render 1 ColorSelector');

  const cSProps = CSInstance.at(0).props();
  const expectedColorSets = [
    {
      selectedColor: arcLayer.config.color,
      setColor: () => {},
      label: 'Source'
    },
    {
      selectedColor: arcLayer.config.color,
      setColor: () => {},
      label: 'Target'
    }
  ];
  t.equal(cSProps.colorSets.length, expectedColorSets.length, 'should pass correct colorSets');
  t.deepEqual(
    Object.keys(cSProps.colorSets[0]),
    Object.keys(expectedColorSets[0]),
    'should pass correct colorSets[0]'
  );
  t.equal(
    cSProps.colorSets[0].selectedColor,
    expectedColorSets[0].selectedColor,
    'should pass correct colorSets.selectedColor'
  );

  // color block
  const cblk = wrapper.find(ColorBlock);
  t.equal(cblk.length, 2, 'should render 2 ColorBlocks');

  const csInput = wrapper.find(ColorSelectorInput);
  t.equal(csInput.length, 2, 'should render 2 ColorSelectorInput');
  csInput.at(1).simulate('mousedown');

  t.ok(updateLayerColorUI.calledOnce, 'should call updateLayerColorUI when mousedown 2nd block');
  t.ok(
    updateLayerVisConfig.notCalled,
    'should not call updateLayerColorUI when mousedown 2nd block'
  );
  t.ok(updateLayerConfig.notCalled, 'should not call updateLayerConfig when mousedown 2nd block');

  // should open dropdown
  t.ok(updateLayerColorUI.calledWith('color', {showDropdown: 1}));

  t.end();
});

test('Components -> ArcLayerColorSelector.render -> render single color click', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor.visState);
  const {layers} = initialState;
  // should dropdown for arc layer target color select
  const arcLayer = layers[1].updateLayerColorUI('color', {showDropdown: 1});

  // create spies
  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: arcLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };

  const layerConfiguratorProps = getLayerConfiguratorProps(mockProps);
  const visConfiguratorProps = getVisConfiguratorProps(mockProps);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ArcLayerColorSelector
          layer={arcLayer}
          setColorUI={layerConfiguratorProps.setColorUI}
          onChangeConfig={layerConfiguratorProps.onChange}
          onChangeVisConfig={visConfiguratorProps.onChange}
        />
      </IntlWrapper>
    );
  }, 'Should not fail render arc color select');
  const CSInstance = wrapper.find(ColorSelector);
  t.equal(CSInstance.length, 1, 'should render 1 ColorSelector');

  // open color dropdown
  const scp = wrapper.find(SingleColorPalette);
  t.equal(scp.length, 1, 'should render 1 SingleColorPalette');

  t.ok(wrapper.find('.single-color-palette__block'), 'should render color blocks');

  // click color block
  wrapper
    .find('.single-color-palette__block')
    .at(0)
    .simulate('click');

  t.ok(updateLayerVisConfig.calledOnce, 'should call updateLayerVisConfig');
  t.ok(updateLayerVisConfig.calledWith({targetColor: [255, 254, 230]}));

  t.end();
});

test('Components -> LayerColorRangeSelector.render -> ColorSelector', t => {
  const initialState = StateWTrips.visState;
  const {layers} = initialState;
  const pointLayer = layers.find(l => l.type === 'point');

  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };
  const visConfiguratorProps = getVisConfiguratorProps(mockProps);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorRangeSelector {...visConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail render color range select');
  const CPInstance = wrapper.find(ColorPalette);
  t.equal(CPInstance.length, 1, 'should render 1 ColorPalette');

  // render color blocks
  const cblks = CPInstance.at(0).find('.color-range-palette__block');
  t.equal(cblks.length, 8, 'should render 8 ColorBlocks');

  const expectedColor = `rgb(${hexToRgb('#7F1941').join(', ')})`;
  const firstColor = cblks
    .at(0)
    .getDOMNode()
    .style.getPropertyValue('background-color');

  t.equal(firstColor, expectedColor, 'should render correct background color');

  // simulate click
  const csInput = wrapper.find(ColorSelectorInput);
  t.equal(csInput.length, 1, 'should render 2 ColorSelectorInput');
  csInput.at(0).simulate('mousedown');

  t.ok(updateLayerColorUI.calledOnce, 'should call updateLayerColorUI when mousedown 2nd block');
  t.ok(
    updateLayerVisConfig.notCalled,
    'should not call updateLayerColorUI when mousedown 2nd block'
  );
  t.ok(updateLayerConfig.notCalled, 'should not call updateLayerConfig when mousedown 2nd block');

  // should open dropdown
  t.ok(updateLayerColorUI.calledWith('colorRange', {showDropdown: 0}));

  t.end();
});

test('Components -> LayerColorRangeSelector.render -> ColorSelector -> ColorRangeSelector -> select type', t => {
  const initialState = StateWTrips.visState;
  const {layers} = initialState;

  // set showDropdown to true
  const pointLayer = layers
    .find(l => l.type === 'point')
    .updateLayerColorUI('colorRange', {showDropdown: 0});

  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };
  const visConfiguratorProps = getVisConfiguratorProps(mockProps);
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorRangeSelector {...visConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail render color range select');

  // open color dropdown
  t.equal(wrapper.find('.color-range-selector').length, 1, 'should render 1 color-range-selector');

  const crs = wrapper.find(ColorRangeSelector);
  t.equal(crs.length, 1, 'should render 1 ColorRangeSelector');

  const pc = crs.find(PaletteConfig);
  t.equal(pc.length, 4, 'should render 4 PaletteConfig');

  const cpg = crs.find(ColorPaletteGroup);
  t.equal(cpg.length, 1, 'should render 1 ColorPaletteGroup');

  const expectedGroups = COLOR_RANGES.filter(cr => cr.colors.length === 6).length + 1;

  t.equal(
    wrapper.find(ColorPalette).length,
    expectedGroups,
    `should render ${expectedGroups} ColorPalette`
  );
  const typeSelect = crs.find(PaletteConfig).at(0);
  t.equal(typeSelect.find('.side-panel-panel__label').text(), 'type', 'should render type');

  // click on type select
  t.equal(
    typeSelect.find('.item-selector__dropdown').length,
    1,
    'should render item selector dropdown input'
  );

  typeSelect
    .find('.item-selector__dropdown')
    .at(0)
    .simulate('click');

  wrapper.update();

  const listItem = wrapper.find('.list__item');
  t.equal(listItem.length, 6, 'should render item selector typeahead');

  t.deepEqual(
    listItem.map(nd =>
      nd
        .at(0)
        .find('.list__item__anchor')
        .at(0)
        .text()
    ),
    ALL_TYPES,
    'should render all types'
  );

  // click on 1 type
  listItem.at(2).simulate('click');
  t.ok(updateLayerColorUI.calledOnce, 'updateLayerColorUI should be called');
  const expectedArgs = [
    'colorRange',
    {
      colorRangeConfig: {
        type: 'qualitative'
      }
    }
  ];

  t.deepEqual(
    updateLayerColorUI.args[0],
    expectedArgs,
    'should call updateLayerColorUI with correct args'
  );

  const reverseSwitch = crs.find(PaletteConfig).at(2);
  t.equal(
    reverseSwitch.find('.side-panel-panel__label').text(),
    'reversed',
    'should render reversed switch'
  );

  const switchInput = reverseSwitch.find('input').at(0);
  switchInput.simulate('change');

  t.ok(
    updateLayerColorUI.calledTwice,
    'updateLayerColorUI should be called when click reserved switch'
  );
  const expectedArgs1 = [
    'colorRange',
    {
      colorRangeConfig: {
        reversed: false
      }
    }
  ];
  t.deepEqual(
    updateLayerColorUI.args[1],
    expectedArgs1,
    'should call updateLayerColorUI with reversed: true'
  );

  const customSwitch = crs.find(PaletteConfig).at(3);
  t.equal(
    customSwitch.find('.side-panel-panel__label').text(),
    'Custom Palette',
    'should render custom switch'
  );

  customSwitch
    .find('input')
    .at(0)
    .simulate('change');

  t.ok(
    updateLayerColorUI.callCount === 3,
    'updateLayerColorUI should be called when click custom switch'
  );
  const expectedArgs3 = [
    'colorRange',
    {
      colorRangeConfig: {
        custom: true
      }
    }
  ];
  t.deepEqual(
    updateLayerColorUI.args[2],
    expectedArgs3,
    'should call updateLayerColorUI with custom: true'
  );
  t.end();
});

test('Components -> LayerColorRangeSelector.render -> ColorSelector -> ColorRangeSelector -> CustomPalette.render', t => {
  const initialState = StateWTrips.visState;
  const {layers} = initialState;

  // set showDropdown to true
  const pointLayer = layers
    .find(l => l.type === 'point')
    .updateLayerColorUI('colorRange', {showDropdown: 0})
    .updateLayerColorUI('colorRange', {colorRangeConfig: {custom: true}});

  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };
  const visConfiguratorProps = getVisConfiguratorProps(mockProps);
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorRangeSelector {...visConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail render color range select');

  // open color dropdown
  t.equal(wrapper.find('.color-range-selector').length, 1, 'should render 1 color-range-selector');
  const crs = wrapper.find(ColorRangeSelector);
  t.equal(crs.length, 1, 'should render 1 ColorRangeSelector');

  const pc = crs.find(PaletteConfig);
  t.equal(pc.length, 1, 'should render 1 PaletteConfig');

  const cp = crs.find(CustomPalette);
  t.equal(cp.length, 1, 'should render 1 CustomPalette');

  t.equal(
    cp.find('.custom-palette__sortable-items').length,
    pointLayer.config.colorUI.colorRange.customPalette.colors.length * 3,
    'should render same number of custom palette swatch'
  );

  t.end();
});

test('Components -> LayerColorRangeSelector.render -> ColorSelector -> ColorRangeSelector -> CustomPalette.update', t => {
  const initialState = StateWTrips.visState;
  const {layers} = initialState;

  // set showDropdown to true
  const pointLayer = layers
    .find(l => l.type === 'point')
    .updateLayerColorUI('colorRange', {showDropdown: 0})
    .updateLayerColorUI('colorRange', {colorRangeConfig: {custom: true}});

  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };
  const visConfiguratorProps = getVisConfiguratorProps(mockProps);
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorRangeSelector {...visConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail render color range select');
  // current colorRange
  // { name: 'Ice And Fire 8',
  // type: 'diverging',
  // category: 'Uber',
  // colors:
  //  [ '#7F1941',
  //    '#D50255',
  //    '#FEAD54',
  //    '#FEEDB1',
  //    '#E8FEB5',
  //    '#49E3CE',
  //    '#0198BD',
  //    '#007A99' ],
  // reversed: true }
  const cp = wrapper.find(CustomPalette);
  t.equal(cp.length, 1, 'should render 1 CustomPalette');

  // add step
  t.equal(cp.find(Button).length, 3, 'should render 3 buttons');

  // click add step
  cp.find(Button)
    .at(0)
    .simulate('click');

  t.deepEqual(
    updateLayerColorUI.args[0],
    [
      'colorRange',
      {
        customPalette: {
          colors: [
            '#7F1941',
            '#D50255',
            '#FEAD54',
            '#FEEDB1',
            '#E8FEB5',
            '#49E3CE',
            '#0198BD',
            '#007A99',
            '#007A99'
          ]
        }
      }
    ],
    'should add color to custom palette when click add step'
  );

  // click cancel
  cp.find(Button)
    .at(1)
    .simulate('click');

  t.deepEqual(
    updateLayerColorUI.args[1],
    [
      'colorRange',
      {
        colorRangeConfig: {custom: false},
        showSketcher: false
      }
    ],
    'should set custom: false when cancel'
  );

  // click apply
  cp.find(Button)
    .at(2)
    .simulate('click');

  t.deepEqual(
    updateLayerColorUI.args[2],
    [
      'colorRange',
      {
        colorRangeConfig: {custom: false},
        showSketcher: false
      }
    ],
    'should set custom to false when click apply'
  );

  t.deepEqual(
    updateLayerVisConfig.args[0],
    [
      {
        colorRange: {
          name: 'Custom Palette',
          type: 'custom',
          category: 'Custom',
          colors: [
            '#7F1941',
            '#D50255',
            '#FEAD54',
            '#FEEDB1',
            '#E8FEB5',
            '#49E3CE',
            '#0198BD',
            '#007A99'
          ]
        }
      }
    ],
    'should set colorRange to custom'
  );

  // click swatch
  wrapper
    .find('.custom-palette__swatch')
    .at(3)
    .simulate('click');

  t.ok(
    updateLayerColorUI.calledWith('colorRange', {
      showSketcher: 3
    }),
    'should set showSketcher to swatch index'
  );

  wrapper.update();

  t.end();
});

test('Components -> LayerColorRangeSelector.render -> ColorSelector -> ColorRangeSelector -> CustomPalette -> CustomPicker', t => {
  const initialState = StateWTrips.visState;
  const {layers} = initialState;

  // set showSketcher to true
  const pointLayer = layers
    .find(l => l.type === 'point')
    .updateLayerColorUI('colorRange', {showDropdown: 0})
    .updateLayerColorUI('colorRange', {colorRangeConfig: {custom: true}})
    .updateLayerColorUI('colorRange', {showSketcher: 2});

  const updateLayerConfig = sinon.spy();
  const updateLayerVisConfig = sinon.spy();
  const updateLayerColorUI = sinon.spy();

  const mockProps = {
    layer: pointLayer,
    datasets: initialState.datasets,
    updateLayerConfig,
    updateLayerVisConfig,
    updateLayerColorUI
  };

  const visConfiguratorProps = getVisConfiguratorProps(mockProps);
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerColorRangeSelector {...visConfiguratorProps} />
      </IntlWrapper>
    );
  }, 'Should not fail render color range select');

  const cp = wrapper.find(CustomPalette);
  t.equal(cp.length, 1, 'should render 1 CustomPalette');

  const picker = cp.find(CustomPicker);
  t.equal(picker.length, 1, 'should render 1 CustomPicker');

  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */

import {layerColorUIChange, layerVisualChannelConfigChange} from '@kepler.gl/actions';
import {keplerGlReducerCore as coreReducer} from '@kepler.gl/reducers';
import {ColorBreaksDisplay} from '@kepler.gl/components';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import {
  DropdownSelect,
  ColorBreaksPanelFactory,
  ColorScaleSelectorFactory,
  CustomPaletteFactory,
  DimensionScaleSelectorFactory,
  appInjector,
  ChannelByValueSelectorFactory,
  FieldSelectorFactory,
  DropdownList,
  ListItem,
  Typeahead,
  Button,
  ColorPaletteItem,
  ColorSwatch,
  EditableColorRange
} from '@kepler.gl/components';

import {StateWFilesFiltersLayerColor, expectedColorRangeInLayer} from 'test/helpers/mock-state';

const ChannelByValueSelector = appInjector.get(ChannelByValueSelectorFactory);
const DimensionScaleSelector = appInjector.get(DimensionScaleSelectorFactory);
const ColorScaleSelector = appInjector.get(ColorScaleSelectorFactory);
const FieldSelector = appInjector.get(FieldSelectorFactory);
const ColorBreaksPanel = appInjector.get(ColorBreaksPanelFactory);
const CustomPalette = appInjector.get(CustomPaletteFactory);

function nop() {
  return;
}

const ExpectedCustomPalette = {
  customPalette: {
    name: 'color.customPalette.custom.uid',
    type: 'custom',
    category: 'Custom',
    colors: expectedColorRangeInLayer.colors,
    colorMap: [
      [3032, expectedColorRangeInLayer.colors[0]],
      [6063, expectedColorRangeInLayer.colors[1]],
      [9093, expectedColorRangeInLayer.colors[2]],
      [null, expectedColorRangeInLayer.colors[3]]
    ]
  },
  showSketcher: false,
  showDropdown: false,
  showColorChart: true,
  colorRangeConfig: {
    type: 'all',
    steps: 6,
    reversed: false,
    custom: false,
    customBreaks: true,
    colorBlindSafe: false
  }
};

// const updateLayerVisualChannelConfig = sinon.spy();
// const updateLayerColorUI = sinon.spy();
test('Components -> ChannelByValueSelector -> ColorScaleSelector -> disabled', t => {
  const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers, datasets} = InitialState.visState;
  const pointLayer = layers[0];
  const updateLayerVisualChannelConfig = sinon.spy();

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ChannelByValueSelector
          layer={pointLayer}
          channel={pointLayer.visualChannels.color}
          onChange={updateLayerVisualChannelConfig}
          fields={datasets[pointLayer.config.dataId].fields}
          dataset={datasets[pointLayer.config.dataId]}
          setColorUI={nop}
        />
      </IntlWrapper>
    );
  }, 'Should not fail rendering point layer');

  // colorField: string
  t.equal(wrapper.find(DimensionScaleSelector).length, 1, 'Should render 1 DimensionScaleSelector');
  t.equal(wrapper.find(ColorScaleSelector).length, 1, 'Should render 1 ColorScaleSelector');
  t.equal(
    wrapper.find(ColorScaleSelector).at(0).props().disabled,
    false,
    'Should enable color scale select for string field'
  );

  t.equal(
    wrapper.find(ColorScaleSelector).at(0).find(DropdownSelect).length,
    1,
    'should render 1 DropdownSelect in ColorScaleSelector'
  );
  t.equal(
    wrapper
      .find(ColorScaleSelector)
      .at(0)
      .find(DropdownSelect)
      .at(0)
      .find(ListItem)
      .at(0)
      .find('span')
      .text(),
    'Ordinal',
    'should render correct scale value'
  );

  // change color field
  const fieldSelector = wrapper.find(FieldSelector).at(0);
  fieldSelector.find('.item-selector__dropdown').at(0).simulate('click');

  // dropdownSelect.simulate('click');

  t.equal(wrapper.find(FieldSelector).at(0).find(Typeahead).length, 1, 'should render Typeahead');
  t.equal(
    wrapper.find(FieldSelector).at(0).find(DropdownList).length,
    1,
    'should render 1 DropdownList'
  );
  t.equal(
    wrapper.find(FieldSelector).at(0).find('.list__item').length,
    10,
    'should render 10 ListItem'
  );

  t.equal(
    wrapper.find(FieldSelector).at(0).find('.list__item').at(5).find('.list__item__anchor').text(),
    'uid',
    'Should render id field at index:5'
  );
  // select id field
  wrapper.find(FieldSelector).at(0).find('.list__item').at(5).simulate('click');

  t.ok(updateLayerVisualChannelConfig.calledOnce, 'Should call updateLayerVisualChannelConfig');

  t.deepEqual(
    updateLayerVisualChannelConfig.args[0],
    [{colorField: datasets[pointLayer.config.dataId].fields[6]}, 'color'],
    'should pass color field'
  );

  // set point layer color field to integar id
  const updatedState = coreReducer(
    InitialState,
    layerVisualChannelConfigChange(pointLayer, ...updateLayerVisualChannelConfig.args[0])
  );

  t.equal(
    updatedState.visState.layers[0].config.colorField.name,
    'uid',
    'should set color field to id'
  );

  t.end();
});

test('Components -> ChannelByValueSelector -> ColorScaleSelector -> ColorBreakDisplay', t => {
  const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers, datasets} = InitialState.visState;
  const pointLayer = layers[0];
  const updateLayerVisualChannelConfig = sinon.spy();
  const setColorUI = sinon.spy();

  const updatedState = coreReducer(
    InitialState,
    layerVisualChannelConfigChange(
      pointLayer,
      {colorField: datasets[pointLayer.config.dataId].fields[6]},
      'color'
    )
  );

  const pointLayer1 = updatedState.visState.layers[0];
  t.equal(pointLayer1.config.colorField.name, 'uid', 'should set color field to id');
  const InitialProps = {
    layer: pointLayer1,
    channel: pointLayer1.visualChannels.color,
    onChange: updateLayerVisualChannelConfig,
    fields: updatedState.visState.datasets[pointLayer1.config.dataId].fields,
    dataset: updatedState.visState.datasets[pointLayer1.config.dataId],
    setColorUI
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ChannelByValueSelector {...InitialProps} />
      </IntlWrapper>
    );
  }, 'Should not fail rendering point layer');

  // colorField: string
  t.equal(wrapper.find(DimensionScaleSelector).length, 1, 'Should render 1 DimensionScaleSelector');
  t.equal(wrapper.find(ColorScaleSelector).length, 1, 'Should render 1 ColorScaleSelector');
  t.equal(
    wrapper.find(ColorScaleSelector).at(0).props().disabled,
    false,
    'Should not disabled color scale select'
  );

  // scale optons
  t.equal(
    wrapper.find(ColorScaleSelector).at(0).find('.list__item').length,
    4,
    'should render 4 scale options'
  );

  t.equal(wrapper.find(ColorBreaksPanel).length, 1, 'Should render 1 ColorBreaksPanel');
  t.equal(wrapper.find(ColorBreaksDisplay).length, 1, 'Should render 1 ColorBreaksDisplay');
  t.equal(wrapper.find(CustomPalette).length, 0, 'Should not render CustomPalette');

  t.equal(wrapper.find(ColorPaletteItem).length, 4, 'Should render 4 ColorPaletteItem');

  const expectedText = [
    [expectedColorRangeInLayer.colors[0], '1', '3032'],
    [expectedColorRangeInLayer.colors[1], '3032', '6063'],
    [expectedColorRangeInLayer.colors[2], '6063', '9093'],
    [expectedColorRangeInLayer.colors[3], '9093', '12120']
  ];

  for (let i = 0; i < 4; i++) {
    const inputTexts = wrapper
      .find(ColorPaletteItem)
      .at(i)
      .find('div.custom-palette-hex__input__text');
    t.equal(
      wrapper.find(ColorPaletteItem).at(i).find(ColorSwatch).props().color,
      expectedText[i][0],
      'should display correct color'
    );
    t.equal(inputTexts.at(0).text(), expectedText[i][1], 'should display correct range');
    t.equal(inputTexts.at(1).text(), expectedText[i][2], 'should display correct range');
  }

  // select custom scale
  wrapper.find(ColorScaleSelector).at(0).find('.list__item').at(2).simulate('click');

  t.ok(setColorUI.calledOnce, 'should call setColorUI');
  const expectedArgs = [
    'colorRange',
    {
      showColorChart: true,
      colorRangeConfig: {
        customBreaks: true
      },
      customPalette: {
        name: 'color.customPalette.custom.uid',
        type: 'custom',
        category: 'Custom',
        colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA'],
        colorMap: [
          [3032, '#00939C'],
          [6063, '#6BB5B9'],
          [9093, '#AAD7D9'],
          [null, '#E6FAFA']
        ]
      }
    }
  ];
  const expectedArgs1 = [
    {colorScale: 'custom'},
    'color',
    {
      colorRange: {
        name: 'color.customPalette.custom.uid',
        type: 'custom',
        category: 'Custom',
        colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA'],
        colorMap: [
          [3032, '#00939C'],
          [6063, '#6BB5B9'],
          [9093, '#AAD7D9'],
          [null, '#E6FAFA']
        ]
      }
    }
  ];
  t.deepEqual(setColorUI.args[0], expectedArgs, 'should set customBreaks to true');

  t.ok(updateLayerVisualChannelConfig.calledOnce, 'should call updateLayerVisualChannelConfig');
  t.deepEqual(updateLayerVisualChannelConfig.args[0], expectedArgs1, 'should pass custom scale');

  const updatedStateTemp = coreReducer(
    updatedState,
    layerColorUIChange(pointLayer1, ...expectedArgs)
  );
  const updatedState1 = coreReducer(
    updatedStateTemp,
    layerVisualChannelConfigChange(pointLayer1, ...expectedArgs1)
  );

  t.deepEqual(
    updatedState1.visState.layers[0].config.colorUI.colorRange,
    ExpectedCustomPalette,
    'Should set customPalette and colorMap'
  );

  wrapper.setProps({
    children: <ChannelByValueSelector {...InitialProps} layer={updatedState1.visState.layers[0]} />
  });

  t.equal(wrapper.find(CustomPalette).length, 1, 'should render 1 CustomPalette');
  t.equal(wrapper.find(ColorBreaksDisplay).length, 0, 'should not render ColorBreaksDisplay');
  t.equal(wrapper.find(EditableColorRange).length, 4, 'Should render 4 EditableColorRange');
  t.equal(wrapper.find(ColorSwatch).length, 4, 'Should render 4 ColorSwatch');

  for (let i = 0; i < 4; i++) {
    const inputs = wrapper.find(EditableColorRange).at(i).find('input');
    if (i === 0 || i === 3) {
      t.equal(inputs.length, 1, 'should render 1 input');
      t.equal(
        inputs.at(0).props().value,
        expectedText[i][i === 0 ? 2 : 1],
        `should display correct range i: ${i}`
      );
    } else {
      t.equal(inputs.length, 2, 'should render 2 inputs');

      t.equal(inputs.at(0).props().value, expectedText[i][1], `should display correct range ${i}`);

      t.equal(inputs.at(1).props().value, expectedText[i][2], `should display correct range ${i}`);
    }
  }

  wrapper
    .find(EditableColorRange)
    .at(1)
    .find('input')
    .at(1)
    .simulate('change', {target: {value: '5000'}});
  t.notOk(setColorUI.calledTwice, 'should not call setColorUI');

  wrapper.find(EditableColorRange).at(1).find('input').at(1).simulate('blur');
  t.ok(setColorUI.calledTwice, 'should call setColorUI');
  const expectedCustomPalette1 = {
    ...ExpectedCustomPalette.customPalette,
    colorMap: [
      [3032, expectedColorRangeInLayer.colors[0]],
      [5000, expectedColorRangeInLayer.colors[1]],
      [9093, expectedColorRangeInLayer.colors[2]],
      [null, expectedColorRangeInLayer.colors[3]]
    ]
  };

  const expectedArgs2 = [
    'colorRange',
    {
      customPalette: expectedCustomPalette1
    }
  ];
  t.deepEqual(setColorUI.args[1], expectedArgs2, 'should set customBreaks.colorMap');

  // on confirm custom breaks
  t.equal(wrapper.find(CustomPalette).find(Button).length, 2, 'should render 2 buttons');
  const confirmButton = wrapper.find(CustomPalette).find(Button).at(0);
  t.equal(confirmButton.text(), 'Confirm', 'should render confirm button');
  confirmButton.simulate('click');

  t.ok(updateLayerVisualChannelConfig.calledTwice, 'should call updateLayerVisualChannelConfig');

  const expectedArgs3 = [
    {colorScale: 'custom'},
    'color',
    {colorRange: ExpectedCustomPalette.customPalette}
  ];
  t.deepEqual(
    updateLayerVisualChannelConfig.args[1],
    expectedArgs3,
    'should pass custom scale and custom colorRange'
  );
  const expectedArgs4 = [
    'colorRange',
    {showSketcher: false, colorRangeConfig: {customBreaks: false}}
  ];
  t.deepEqual(setColorUI.args[2], expectedArgs4, 'should set customBreaks to false');

  const pointLayer2 = updatedState1.visState.layers[0];
  const updatedStateTemp1 = coreReducer(
    updatedState1,
    layerVisualChannelConfigChange(pointLayer2, ...expectedArgs3)
  );
  const updatedState2 = coreReducer(
    updatedStateTemp1,
    layerColorUIChange(pointLayer2, ...expectedArgs4)
  );

  t.deepEqual(
    updatedState2.visState.layers[0].config.colorUI.colorRange,
    {
      ...ExpectedCustomPalette,
      colorRangeConfig: {
        ...ExpectedCustomPalette.colorRangeConfig,
        customBreaks: false
      }
    },
    'Should set customPalette and colorMap'
  );
  t.deepEqual(
    updatedState2.visState.layers[0].config.colorScale,
    'custom',
    'Should set color scale to custom'
  );
  t.deepEqual(
    updatedState2.visState.layers[0].config.visConfig.colorRange,
    ExpectedCustomPalette.customPalette,
    'Should set color range to custom palette'
  );

  wrapper.setProps({
    children: <ChannelByValueSelector {...InitialProps} layer={updatedState2.visState.layers[0]} />
  });
  // set scale back to standard scale (:quantile)
  const quantileOption = wrapper.find(ColorScaleSelector).at(0).find('.list__item').at(1);
  t.equal(quantileOption.text(), 'Quantile', '2nd scale option should be quantile');
  quantileOption.simulate('click');

  const expectedArgs5 = [
    {colorScale: 'quantile'},
    'color',
    {
      colorRange: {
        name: 'color.customPalette.custom.uid',
        type: 'custom',
        category: 'Custom',
        colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA']
      }
    }
  ];

  t.deepEqual(
    updateLayerVisualChannelConfig.args[2],
    expectedArgs5,
    'should pass custom scale and custom colorRange'
  );

  t.deepEqual(setColorUI.args.length, 3, 'should not call setColorUI');

  t.end();
});

const GetTickPositions = wrapper => {
  wrapper.find('.color-chart-tick-container').update();
  return wrapper
    .find('.color-chart-tick-container')
    .children()
    .map(x => {
      const style = x.props().style;
      return Math.round(
        parseFloat(style.left) + parseFloat(style.borderWidth) + parseFloat(style.width) / 2
      );
    });
};

const GetInitialPropsFromState = (layer, updatedState) => {
  return {
    layer,
    channel: layer.visualChannels.color,
    onChange: newConfig => layer.updateLayerConfig(newConfig),
    fields: updatedState.visState.datasets[layer.config.dataId].fields,
    dataset: updatedState.visState.datasets[layer.config.dataId],
    setColorUI: (prop, newConfig) => layer.updateLayerColorUI(prop, newConfig)
  };
};

test('Components -> ChannelByValueSelector -> ColorScaleSelector -> ColumnStatsChart', t => {
  const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers, datasets} = InitialState.visState;
  const pointLayer = layers[0];

  // set point layer color field to integar id
  const colorField = datasets[pointLayer.config.dataId].fields[6];
  const updatedState = coreReducer(
    InitialState,
    layerVisualChannelConfigChange(pointLayer, {colorField}, 'color')
  );
  const pointLayer1 = updatedState.visState.layers[0];
  const InitialProps = GetInitialPropsFromState(pointLayer1, updatedState);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ChannelByValueSelector {...InitialProps} />
      </IntlWrapper>
    );
  }, 'Should not fail rendering point layer');

  t.equal(
    wrapper.find('.color-chart-container').length,
    1,
    'Should render color chart with histogram'
  );

  const quantizeTestCase = {
    optionIndex: 0,
    optionName: 'quantize',
    expectedTickPositions: [53, 105, 158]
  };

  const quantileTestCase = {
    optionIndex: 1,
    optionName: 'quantile',
    expectedTickPositions: [0, 0, 1]
  };

  const customTestCase = {
    optionIndex: 2,
    optionName: 'custom',
    // uses tick positions from the previous test case!
    expectedTickPositions: [0, 0, 1]
  };

  [quantizeTestCase, quantileTestCase, customTestCase].forEach(tc => {
    // simulate click color scale option
    wrapper.find(ColorScaleSelector).at(0).find('.list__item').at(tc.optionIndex).simulate('click');

    // trigger action
    const updatedState2 = coreReducer(
      updatedState,
      layerVisualChannelConfigChange(pointLayer1, {colorScale: tc.optionName}, 'color')
    );
    const pointLayer2 = updatedState2.visState.layers[0];
    const InitialProps2 = GetInitialPropsFromState(pointLayer2, updatedState2);
    wrapper.setProps({
      children: <ChannelByValueSelector {...InitialProps2} />
    });

    t.deepEqual(
      GetTickPositions(wrapper),
      tc.expectedTickPositions,
      `Should render three ticks for scale ${tc.optionName}`
    );
  });

  t.end();
});

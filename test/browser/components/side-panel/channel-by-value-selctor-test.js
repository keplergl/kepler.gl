// // SPDX-License-Identifier: MIT
// // Copyright contributors to the kepler.gl project

// /* eslint-disable max-statements */

// import {layerColorUIChange, layerVisualChannelConfigChange} from '@kepler.gl/actions';
// import {keplerGlReducerCore as coreReducer} from '@kepler.gl/reducers';
// import cloneDeep from 'lodash.clonedeep';
// import React from 'react';
// import sinon from 'sinon';
// import test from 'tape';
// import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

// import {
//   DropdownSelect,
//   ColorBreaksPanelFactory,
//   ColorScaleSelectorFactory,
//   DimensionScaleSelectorFactory,
//   appInjector,
//   ChannelByValueSelectorFactory,
//   FieldSelectorFactory,
//   DropdownList,
//   ListItem,
//   Typeahead,
//   Button,
//   ColorPaletteItem,
//   ColorSwatch,
//   EditableColorRange
// } from '@kepler.gl/components';

// import {StateWFilesFiltersLayerColor} from 'test/helpers/mock-state';

// const ChannelByValueSelector = appInjector.get(ChannelByValueSelectorFactory);
// const DimensionScaleSelector = appInjector.get(DimensionScaleSelectorFactory);
// const ColorScaleSelector = appInjector.get(ColorScaleSelectorFactory);
// const FieldSelector = appInjector.get(FieldSelectorFactory);
// const ColorBreaksPanel = appInjector.get(ColorBreaksPanelFactory);
// const CustomPalette = appInjector.get(CustomPaletteFactory);

// function nop() {
//   return;
// }

// const ExpectedCustomPalette = {
//   customPalette: {
//     name: 'Uber Viz Sequential 2',
//     type: 'sequential',
//     category: 'Uber',
//     colors: ['#E6FAFA', '#AAD7DA', '#68B4BB', '#00939C'],
//     colorMap: [
//       [3032, '#E6FAFA'],
//       [6063, '#AAD7DA'],
//       [9093, '#68B4BB'],
//       [12120, '#00939C']
//     ]
//   },
//   showSketcher: false,
//   showDropdown: false,
//   showColorChart: true,
//   colorRangeConfig: {
//     type: 'all',
//     steps: 6,
//     reversed: false,
//     custom: false,
//     customBreaks: true
//   }
// };

// // const updateLayerVisualChannelConfig = sinon.spy();
// // const updateLayerColorUI = sinon.spy();
// test('Components -> ChannelByValueSelector -> ColorScaleSelector -> disabled', t => {
//   const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
//   const {layers, datasets} = InitialState.visState;
//   const pointLayer = layers[0];
//   const updateLayerVisualChannelConfig = sinon.spy();

//   let wrapper;
//   t.doesNotThrow(() => {
//     wrapper = mountWithTheme(
//       <IntlWrapper>
//         <ChannelByValueSelector
//           layer={pointLayer}
//           channel={pointLayer.visualChannels.color}
//           onChange={updateLayerVisualChannelConfig}
//           fields={datasets[pointLayer.config.dataId].fields}
//           setColorUI={nop}
//         />
//       </IntlWrapper>
//     );
//   }, 'Should not fail rendering point layer');

//   // colorField: string
//   t.equal(wrapper.find(DimensionScaleSelector).length, 1, 'Should render 1 DimensionScaleSelector');
//   t.equal(wrapper.find(ColorScaleSelector).length, 1, 'Should render 1 ColorScaleSelector');
//   t.equal(
//     wrapper
//       .find(ColorScaleSelector)
//       .at(0)
//       .props().disabled,
//     true,
//     'Should disabled color scale select if only 1 option'
//   );

//   t.equal(
//     wrapper
//       .find(ColorScaleSelector)
//       .at(0)
//       .find(DropdownSelect).length,
//     1,
//     'should render 1 DropdownSelect in ColorScaleSelector'
//   );
//   t.equal(
//     wrapper
//       .find(ColorScaleSelector)
//       .at(0)
//       .find(DropdownSelect)
//       .at(0)
//       .find(ListItem)
//       .at(0)
//       .find('span')
//       .text(),
//     'Ordinal',
//     'should render correct scale value'
//   );

//   // change color field
//   const fieldSelector = wrapper.find(FieldSelector).at(0);
//   fieldSelector
//     .find('.item-selector__dropdown')
//     .at(0)
//     .simulate('click');

//   // dropdownSelect.simulate('click');

//   t.equal(
//     wrapper
//       .find(FieldSelector)
//       .at(0)
//       .find(Typeahead).length,
//     1,
//     'should render Typeahead'
//   );
//   t.equal(
//     wrapper
//       .find(FieldSelector)
//       .at(0)
//       .find(DropdownList).length,
//     1,
//     'should render 1 DropdownList'
//   );
//   t.equal(
//     wrapper
//       .find(FieldSelector)
//       .at(0)
//       .find('.list__item').length,
//     10,
//     'should render 10 ListItem'
//   );

//   t.equal(
//     wrapper
//       .find(FieldSelector)
//       .at(0)
//       .find('.list__item')
//       .at(5)
//       .find('.list__item__anchor')
//       .text(),
//     'id',
//     'Should render id field at index:5'
//   );
//   // select id field
//   wrapper
//     .find(FieldSelector)
//     .at(0)
//     .find('.list__item')
//     .at(5)
//     .simulate('click');

//   t.ok(updateLayerVisualChannelConfig.calledOnce, 'Should call updateLayerVisualChannelConfig');

//   t.deepEqual(
//     updateLayerVisualChannelConfig.args[0],
//     [{colorField: datasets[pointLayer.config.dataId].fields[6]}, 'color'],
//     'should pass color field'
//   );

//   // set point layer color field to integar id
//   const updatedState = coreReducer(
//     InitialState,
//     layerVisualChannelConfigChange(pointLayer, ...updateLayerVisualChannelConfig.args[0])
//   );

//   t.equal(
//     updatedState.visState.layers[0].config.colorField.name,
//     'id',
//     'should set color field to id'
//   );

//   t.end();
// });

// test('Components -> ChannelByValueSelector -> ColorScaleSelector -> ColorBreakDisplay', t => {
//   const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
//   const {layers, datasets} = InitialState.visState;
//   const pointLayer = layers[0];
//   const updateLayerVisualChannelConfig = sinon.spy();
//   const setColorUI = sinon.spy();

//   const updatedState = coreReducer(
//     InitialState,
//     layerVisualChannelConfigChange(
//       pointLayer,
//       {colorField: datasets[pointLayer.config.dataId].fields[6]},
//       'color'
//     )
//   );

//   const pointLayer1 = updatedState.visState.layers[0];
//   t.equal(pointLayer1.config.colorField.name, 'id', 'should set color field to id');
//   const InitialProps = {
//     layer: pointLayer1,
//     channel: pointLayer1.visualChannels.color,
//     onChange: updateLayerVisualChannelConfig,
//     fields: updatedState.visState.datasets[pointLayer1.config.dataId].fields,
//     setColorUI
//   };
//   let wrapper;
//   t.doesNotThrow(() => {
//     wrapper = mountWithTheme(
//       <IntlWrapper>
//         <ChannelByValueSelector {...InitialProps} />
//       </IntlWrapper>
//     );
//   }, 'Should not fail rendering point layer');

//   // colorField: string
//   t.equal(wrapper.find(DimensionScaleSelector).length, 1, 'Should render 1 DimensionScaleSelector');
//   t.equal(wrapper.find(ColorScaleSelector).length, 1, 'Should render 1 ColorScaleSelector');
//   t.equal(
//     wrapper
//       .find(ColorScaleSelector)
//       .at(0)
//       .props().disabled,
//     false,
//     'Should not disabled color scale select'
//   );

//   // scale optons
//   t.equal(
//     wrapper
//       .find(ColorScaleSelector)
//       .at(0)
//       .find('.list__item').length,
//     3,
//     'should render 3 scale options'
//   );

//   t.equal(wrapper.find(ColorBreaksPanel).length, 1, 'Should render 1 ColorBreaksPanel');
//   t.equal(wrapper.find(ColorPaletteItem).length, 4, 'Should render 4 ColorPaletteItem');

//   const expectedText = [
//     ['#E6FAFA', '1', '3032'],
//     ['#AAD7DA', '3032', '6063'],
//     ['#68B4BB', '6063', '9093'],
//     ['#00939C', '9093', '12120']
//   ];

//   for (let i = 0; i < 4; i++) {
//     const inputTexts = wrapper
//       .find(ColorPaletteItem)
//       .at(i)
//       .find('.custom-palette-hex__input__text');

//     t.equal(
//       wrapper
//         .find(ColorPaletteItem)
//         .at(i)
//         .find(ColorSwatch)
//         .props().color,
//       expectedText[i][0],
//       'should display correct color'
//     );
//     t.equal(inputTexts.at(0).text(), expectedText[i][1], 'should display correct range');
//     t.equal(inputTexts.at(1).text(), expectedText[i][2], 'should display correct range');
//   }

//   // select custom scale
//   wrapper
//     .find(ColorScaleSelector)
//     .at(0)
//     .find('.list__item')
//     .at(2)
//     .simulate('click');

//   t.ok(setColorUI.calledOnce, 'should call setColorUI');
//   const expectedArgs = [
//     'colorRange',
//     {
//       showColorChart: true,
//       colorRangeConfig: {
//         customBreaks: true
//       }
//     }
//   ];
//   t.deepEqual(setColorUI.args[0], expectedArgs, 'should set customBreaks to true');

//   const updatedState1 = coreReducer(updatedState, layerColorUIChange(pointLayer1, ...expectedArgs));

//   t.deepEqual(
//     updatedState1.visState.layers[0].config.colorUI.colorRange,
//     ExpectedCustomPalette,
//     'Should set customPalette and colorMap'
//   );

//   wrapper.setProps({
//     children: <ChannelByValueSelector {...InitialProps} layer={updatedState1.visState.layers[0]} />
//   });

//   t.equal(wrapper.find(CustomPalette).length, 1, 'should render 1 CustomPalette');
//   t.equal(wrapper.find(EditableColorRange).length, 4, 'Should render 4 EditableColorRange');
//   t.equal(wrapper.find(ColorSwatch).length, 4, 'Should render 4 ColorSwatch');

//   for (let i = 0; i < 4; i++) {
//     const inputs = wrapper
//       .find(EditableColorRange)
//       .at(i)
//       .find('input');
//     if (i === 0 || i === 3) {
//       t.equal(inputs.length, 1, 'should render 1 input');
//       t.equal(
//         inputs.at(0).props().value,
//         Number(expectedText[i][i === 0 ? 2 : 1]),
//         'should display correct range'
//       );
//     } else {
//       t.equal(inputs.length, 2, 'should render 2 inputs');

//       t.equal(
//         inputs.at(0).props().value,
//         Number(expectedText[i][1]),
//         'should display correct range'
//       );
//       t.equal(
//         inputs.at(1).props().value,
//         Number(expectedText[i][2]),
//         'should display correct range'
//       );
//     }
//   }

//   wrapper
//     .find(EditableColorRange)
//     .at(1)
//     .find('input')
//     .at(1)
//     .simulate('change', {target: {value: '5000'}});
//   t.notOk(setColorUI.calledTwice, 'should not call setColorUI');

//   wrapper
//     .find(EditableColorRange)
//     .at(1)
//     .find('input')
//     .at(1)
//     .simulate('blur');
//   t.ok(setColorUI.calledTwice, 'should call setColorUI');
//   const expectedCustomPalette1 = {
//     ...ExpectedCustomPalette.customPalette,
//     colorMap: [
//       [3032, '#E6FAFA'],
//       [5000, '#AAD7DA'],
//       [9093, '#68B4BB'],
//       [12120, '#00939C']
//     ]
//   };

//   const expectedArgs2 = [
//     'colorRange',
//     {
//       customPalette: expectedCustomPalette1
//     }
//   ];
//   t.deepEqual(setColorUI.args[1], expectedArgs2, 'should set customBreaks.colorMap');

//   // on confirm
//   t.equal(wrapper.find(CustomPalette).find(Button).length, 2, 'should render 2 buttons');
//   wrapper
//     .find(CustomPalette)
//     .find(Button)
//     .at(0)
//     .simulate('click');

//   t.ok(updateLayerVisualChannelConfig.calledOnce, 'should call updateLayerVisualChannelConfig');

//   t.deepEqual(
//     updateLayerVisualChannelConfig.args[0],
//     [{colorScale: 'custom'}, 'color', {colorRange: ExpectedCustomPalette.customPalette}],
//     'should pass custom scale and custom colorRange'
//   );
//   t.end();
// });

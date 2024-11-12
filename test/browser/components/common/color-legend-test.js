// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';

import {ColorLegendFactory, LegendRowFactory, appInjector} from '@kepler.gl/components';
import {StateWLayerCustomColorBreaks} from 'test/helpers/mock-state';

const ColorLegend = appInjector.get(ColorLegendFactory);
const LegendRow = appInjector.get(LegendRowFactory);

test('Components -> ColorLegend.render ColorMap', t => {
  const layer = StateWLayerCustomColorBreaks.visState.layers[0];

  t.doesNotThrow(() => {
    mountWithTheme(<ColorLegend />);
  }, 'Show not fail without props');

  const width = 180;

  const props = {
    layer,
    domain: layer.config.colorDomain,
    range: layer.config.visConfig.colorRange,
    scaleType: layer.config.colorScale,
    fieldType: layer.config.colorField.type,
    displayLabel: true,
    disableEdit: false,
    width
  };

  const wrapper = mountWithTheme(<ColorLegend {...props} />);
  t.equal(wrapper.find(LegendRow).length, 3, 'Should render 3 legends');

  const expectedLegends = [
    {color: '#FF0000', label: 'Less than 1', customLabel: 'hello'},
    {color: '#00FF00', label: '1 to 3'},
    {color: '#0000FF', label: '3 or more'}
  ];
  for (let i = 0; i < 3; i++) {
    const row = wrapper.find(LegendRow).at(i);
    t.equal(
      row.find('.legend-row-color').at(0).props().style.backgroundColor,
      expectedLegends[i].color,
      'should render color rect'
    );
    row.debug();
    t.equal(
      row.find('.legend__label__title__editor').at(0).props().value,
      expectedLegends[i].customLabel ?? expectedLegends[i].label,
      'should render color text based on colorLegend'
    );
  }

  t.end();
});

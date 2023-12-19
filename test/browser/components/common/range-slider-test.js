// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {RangeSlider, Slider, SliderHandle, SliderBarHandle} from '@kepler.gl/components';

test('Components -> RangeSlider.render', t => {
  let wrapper;
  const onChange = () => {};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <RangeSlider range={[0, 10]} value0={1} value1={3} onChange={onChange} />
      </IntlWrapper>
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find(Slider).length, 1, 'should render Slider');
  t.equal(wrapper.find(SliderHandle).length, 2, 'should render 2 Slider handle');
  t.equal(wrapper.find(SliderBarHandle).length, 1, 'should render 1 Slider bar');

  t.end();
});

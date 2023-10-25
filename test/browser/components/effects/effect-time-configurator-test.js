// Copyright (c) 2023 Uber Technologies, Inc.
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

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {LIGHT_AND_SHADOW_EFFECT_TIME_MODES} from '@kepler.gl/constants';
import {appInjector, EffectTimeConfiguratorFactory} from '@kepler.gl/components';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

const EffectTimeConfigurator = appInjector.get(EffectTimeConfiguratorFactory);

const TEST_TIMESTAMP = 1690303570534;

test('Components -> EffectTimeConfigurator -> render', t => {
  const props = {
    timestamp: TEST_TIMESTAMP,
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <EffectTimeConfigurator {...props} />
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  t.equal(wrapper.find('Checkbox').length, 3, `should render 3 Checkboxes`);
  t.equal(wrapper.find('Button').length, 1, `should render 1 Button`);
  t.equal(wrapper.find('DatePicker').length, 1, `should render 1 DatePicker`);
  t.equal(wrapper.find('TimePicker').length, 1, `should render 1 TimePicker`);

  t.end();
});

test('Components -> EffectTimeConfigurator -> time type', t => {
  const onTimeModeChange = sinon.spy();

  const props = {
    timestamp: TEST_TIMESTAMP,
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onTimeModeChange
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <EffectTimeConfigurator {...props} />
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  wrapper
    .find('Checkbox')
    .at(0)
    .invoke('onChange')();
  t.ok(
    onTimeModeChange.calledWith(LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick),
    `Should set ${LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick} mode`
  );

  wrapper
    .find('Checkbox')
    .at(1)
    .invoke('onChange')();
  t.ok(
    onTimeModeChange.calledWith(LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current),
    `Should set ${LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current} mode`
  );

  wrapper
    .find('Checkbox')
    .at(2)
    .invoke('onChange')();
  t.ok(
    onTimeModeChange.calledWith(LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation),
    `Should set ${LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation} mode`
  );

  t.ok(onTimeModeChange.calledThrice, 'should call onTimeModeChange thrice');

  t.end();
});

test('Components -> EffectTimeConfigurator -> pick time', t => {
  const onDateTimeChange = sinon.spy();

  const props = {
    timestamp: TEST_TIMESTAMP,
    onDateTimeChange,
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onTimeModeChange: () => {}
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <EffectTimeConfigurator {...props} />
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  // date
  const inputs = wrapper.find('input');
  inputs
    .find('.react-date-picker__inputGroup__month')
    .at(0)
    .simulate('change', {target: {value: '2', name: 'month'}});
  inputs
    .find('.react-date-picker__inputGroup__day')
    .at(0)
    .simulate('change', {target: {value: '2', name: 'day'}});
  inputs
    .find('.react-date-picker__inputGroup__year')
    .at(0)
    .simulate('change', {target: {value: '2022', name: 'year'}})
    // properly propagate in tests
    .simulate('change', {target: {value: '2022', name: 'year'}});

  t.equal(onDateTimeChange.getCall(3).args[0], 1643820370000, `Date should be updated`);

  // time
  wrapper
    .find('.react-time-picker__inputGroup__hour')
    .at(0)
    .simulate('change', {target: {value: '20', name: 'hour24'}});
  wrapper
    .find('.react-time-picker__inputGroup__minute')
    .at(0)
    .simulate('change', {target: {value: '30', name: 'minute'}})
    // properly propagate in tests
    .simulate('change', {target: {value: '30', name: 'minute'}});

  t.equal(onDateTimeChange.getCall(6).args[0], 1690317010534, `Time should be updated`);

  // pick current time button
  wrapper
    .find('Button')
    .at(0)
    .simulate('click');
  t.ok(
    Math.abs(onDateTimeChange.getCall(7).args[0] - Date.now()) < 1000,
    `Should pick current date & time`
  );

  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import {LIGHT_AND_SHADOW_EFFECT_TIME_MODES} from '@kepler.gl/constants';
import {appInjector, EffectTimeConfiguratorFactory} from '@kepler.gl/components';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

const EffectTimeConfigurator = appInjector.get(EffectTimeConfiguratorFactory);

const TEST_TIMESTAMP = 1690303570534;

const mockStore = configureStore();
const ititialState = {mapState: {latitude: 0, longitude: 0}};

test('Components -> EffectTimeConfigurator -> render', t => {
  const store = mockStore(ititialState);

  const props = {
    timestamp: TEST_TIMESTAMP,
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectTimeConfigurator {...props} />
        </Provider>
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
  const store = mockStore(ititialState);

  const onTimeModeChange = sinon.spy();
  const props = {
    timestamp: TEST_TIMESTAMP,
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onChange: onTimeModeChange
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectTimeConfigurator {...props} />
        </Provider>
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  wrapper.find('Checkbox').at(0).invoke('onChange')();
  t.ok(
    onTimeModeChange.calledWith({timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick}),
    `Should set ${LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick} mode`
  );

  wrapper.find('Checkbox').at(1).invoke('onChange')();
  t.ok(
    onTimeModeChange.calledWith({timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current}),
    `Should set ${LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current} mode`
  );

  wrapper.find('Checkbox').at(2).invoke('onChange')();
  t.ok(
    onTimeModeChange.calledWith({timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation}),
    `Should set ${LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation} mode`
  );

  t.ok(onTimeModeChange.calledThrice, 'should call onTimeModeChange thrice');

  t.end();
});

test('Components -> EffectTimeConfigurator -> pick time', t => {
  const store = mockStore(ititialState);

  const onDateTimeChange = sinon.spy();
  const props = {
    timestamp: TEST_TIMESTAMP,
    timezone: 'UTC',
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onChange: onDateTimeChange
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectTimeConfigurator {...props} />
        </Provider>
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

  t.deepEqual(
    onDateTimeChange.getCall(3).args[0],
    {timestamp: 1643820360000},
    `Date should be updated`
  );

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

  t.deepEqual(
    onDateTimeChange.getCall(6).args[0],
    {timestamp: 1690317000000},
    `Time should be updated`
  );

  // pick current time button
  wrapper.find('Button').at(0).simulate('click');
  t.ok(
    Math.abs(onDateTimeChange.getCall(7).args[0].timestamp - Date.now()) < 1000,
    `Should pick current date & time`
  );

  t.end();
});

const getDisplayedDateTimeValues = wrapper => {
  return {
    year: wrapper.find('.react-date-picker__inputGroup__year').at(0).props().value,
    month: wrapper.find('.react-date-picker__inputGroup__month').at(0).props().value,
    day: wrapper.find('.react-date-picker__inputGroup__day').at(0).props().value,
    hour: wrapper.find('.react-time-picker__inputGroup__hour').at(0).props().value,
    minute: wrapper.find('.react-time-picker__inputGroup__minute').at(0).props().value,
    amPm: wrapper.find('.react-time-picker__inputGroup__amPm').at(0).props().value
  };
};

test('Components -> EffectTimeConfigurator -> time zone update', t => {
  const store = mockStore(ititialState);

  const onDateTimeChange = sinon.spy();
  const props = {
    timestamp: 1690851835534,
    timezone: 'America/Los_Angeles',
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onChange: onDateTimeChange
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectTimeConfigurator {...props} />
        </Provider>
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  // Los Angeles timezone is 7 hours ahead of UTC
  // UTC time: 2023 Aug 1 01:03:55
  // Displayed time: 2023 July 31 06:03:00 pm

  let values = getDisplayedDateTimeValues(wrapper);
  t.equal(values.year, '2023', `Year should be correctly set`);
  t.equal(values.month, '7', `Month should be correctly set`);
  t.equal(values.day, '31', `Day should be correctly set`);
  t.equal(values.hour, '6', `Hour should be correctly set`);
  t.equal(values.minute, '3', `Minute should be correctly set`);
  t.equal(values.amPm, 'pm', `AM/PM should be correctly set`);

  // Change time zone
  wrapper.find('.item-selector__dropdown').at(1).simulate('click');
  wrapper.find({children: 'America/Barbados'}).at(0).simulate('click');

  t.deepEqual(
    onDateTimeChange.getCall(0).args[0],
    {timestamp: 1690840980000, timezone: 'America/Barbados'},
    `New time zone should be selected and timestamp updated`
  );

  // Timestamp should be updated internally,
  // but displayed date and time shouldn't change
  values = getDisplayedDateTimeValues(wrapper);
  t.equal(values.year, '2023', `Year should be correctly set`);
  t.equal(values.month, '7', `Month should be correctly set`);
  t.equal(values.day, '31', `Day should be correctly set`);
  t.equal(values.hour, '6', `Hour should be correctly set`);
  t.equal(values.minute, '3', `Minute should be correctly set`);
  t.equal(values.amPm, 'pm', `AM/PM should be correctly set`);

  t.end();
});

test('Components -> EffectTimeConfigurator -> time with custom timezone update', t => {
  const store = mockStore(ititialState);

  const onDateTimeChange = sinon.spy();
  const props = {
    timestamp: 1690840980000,
    timezone: 'America/Barbados',
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onChange: onDateTimeChange
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectTimeConfigurator {...props} />
        </Provider>
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  // Internal UTC timestamp should take time zone into account
  wrapper
    .find('.react-time-picker__inputGroup__hour')
    .at(0)
    .simulate('change', {target: {value: '20', name: 'hour24'}})
    // Call twice to propagate chagne in date-time-picker
    .simulate('change', {target: {value: '20', name: 'hour24'}});
  t.deepEqual(
    onDateTimeChange.getCall(1).args[0],
    {timestamp: 1690848180000},
    `time changed & timezone taken into account`
  );

  t.end();
});

test('Components -> EffectTimeConfigurator -> date with custom timezone update', t => {
  const store = mockStore(ititialState);

  const onDateTimeChange = sinon.spy();
  const props = {
    timestamp: 1690840980000,
    timezone: 'America/Barbados',
    timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick,
    onChange: onDateTimeChange
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectTimeConfigurator {...props} />
        </Provider>
      </IntlWrapper>
    );
  }, `EffectTimeConfigurator should not fail`);

  // Internal UTC timestamp should take time zone into account
  wrapper
    .find('input')
    .find('.react-date-picker__inputGroup__day')
    .at(0)
    .simulate('change', {target: {value: '10', name: 'day'}})
    // Call twice to propagate chagne in date-time-picker
    .simulate('change', {target: {value: '10', name: 'day'}});

  t.deepEqual(
    onDateTimeChange.getCall(1).args[0],
    {timestamp: 1689026580000},
    `date changed & timezone taken into account`
  );

  t.end();
});

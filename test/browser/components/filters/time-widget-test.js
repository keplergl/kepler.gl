// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import moment from 'moment';

import {IntlWrapper, mountWithTheme, mockHTMLElementClientSize} from 'test/helpers/component-utils';
import {setFilterAnimationTimeConfig} from '@kepler.gl/actions';
import {visStateReducer as reducer, DEFAULT_ANIMATION_CONFIG} from '@kepler.gl/reducers';

import {
  TimeWidgetFactory,
  FloatingTimeDisplayFactory,
  TimeRangeSliderFactory,
  RangeSliderFactory,
  FieldSelectorFactory,
  PlaybackControlsFactory,
  AnimationSpeedSliderFactory,
  Icons,
  TimeSliderMarkerFactory,
  TimeRangeSliderTimeTitleFactory,
  IconButton,
  SliderHandle,
  Typeahead,
  appInjector
} from '@kepler.gl/components';

const TimeWidget = appInjector.get(TimeWidgetFactory);
const TimeRangeSlider = appInjector.get(TimeRangeSliderFactory);
const RangeSlider = appInjector.get(RangeSliderFactory);
const FloatingTimeDisplay = appInjector.get(FloatingTimeDisplayFactory);
const FieldSelector = appInjector.get(FieldSelectorFactory);
const PlaybackControls = appInjector.get(PlaybackControlsFactory);
const AnimationSpeedSlider = appInjector.get(AnimationSpeedSliderFactory);
const TimeSliderMarker = appInjector.get(TimeSliderMarkerFactory);
const TimeRangeSliderTimeTitle = appInjector.get(TimeRangeSliderTimeTitleFactory);

// mock state
import {StateWFilters} from 'test/helpers/mock-state';

const nop = () => {};
// default props from initial state
const defaultProps = {
  datasets: StateWFilters.visState.datasets,
  filter: StateWFilters.visState.filters[0],
  index: 0,
  readOnly: false,
  showTimeDisplay: true,
  isAnimatable: true,
  setFilterAnimationTime: nop,
  resetAnimation: nop,
  updateAnimationSpeed: nop,
  toggleAnimation: nop,
  onClose: nop,
  onToggleMinify: nop,
  setFilterPlot: nop,
  setFilterAnimationWindow: nop,
  animationConfig: DEFAULT_ANIMATION_CONFIG
};

// call to set filter timezone and timeformat
const nextState = reducer(
  StateWFilters.visState,
  setFilterAnimationTimeConfig(0, {
    timezone: 'America/New_York',
    timeFormat: 'YYYY MMM DD hh:mm a'
  })
);

test('Components -> TimeWidget.mount -> with time filter', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} />
      </IntlWrapper>
    );
  }, 'TimeWidget should not fail without props');

  t.equal(wrapper.find(TimeWidget).length, 1, 'should render TimeWidget');
  t.equal(wrapper.find(FloatingTimeDisplay).length, 1, 'should render FloatingTimeDisplay');
  t.equal(wrapper.find(TimeRangeSlider).length, 1, 'should render TimeRangeSlider');
  t.equal(wrapper.find(FieldSelector).length, 1, 'should render FieldSelector');
  t.equal(wrapper.find(PlaybackControls).length, 1, 'should render PlaybackControls');

  // check yAxisFields
  const yAxisFields = wrapper.find(FieldSelector).at(0).props().fields;
  t.deepEqual(
    yAxisFields.map(f => f.name),
    ['gps_data.lat', 'gps_data.lng', 'uid'],
    'should only pass real / integer fields to yAxis'
  );

  t.end();
});

test('Components -> TimeWidget.mount -> test actions', t => {
  const onClose = sinon.spy();
  const toggleAnimation = sinon.spy();
  const updateAnimationSpeed = sinon.spy();
  const setFilterAnimationWindow = sinon.spy();
  const setFilterPlot = sinon.spy();
  const setFilterAnimationTime = sinon.spy();

  // mock slider client size width so that value calculation works
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget
          {...defaultProps}
          onClose={onClose}
          toggleAnimation={toggleAnimation}
          updateAnimationSpeed={updateAnimationSpeed}
          setFilterAnimationWindow={setFilterAnimationWindow}
          setFilterPlot={setFilterPlot}
          setFilterAnimationTime={setFilterAnimationTime}
        />
      </IntlWrapper>,
      {
        attachTo: document.body
      }
    );
  }, 'mount TimeWidget should not fail');

  // t.ok(setFilterPlot.calledOnce, 'should call setFilterPlot when 1st mount to set plotType');
  // t.deepEqual(
  //   setFilterPlot.getCall(0).args,
  //   [0, {plotType: {type: 'histogram'}}, undefined],
  //   'should set plotType to linechart'
  // );
  t.equal(wrapper.find(Icons.Close).length, 1, 'should render Close icon');
  t.equal(wrapper.find(Icons.Reset).length, 1, 'should render Reset icon');
  t.equal(wrapper.find(Icons.Play).length, 1, 'should render Play icon');
  t.equal(wrapper.find(Icons.FreeWindow).length, 1, 'should render Window icon');
  t.equal(
    wrapper.find(AnimationSpeedSlider).length,
    0,
    'should  not render AnimationSpeedSlider iniitally'
  );
  t.equal(
    wrapper.find('.animation-window-control').length,
    0,
    'should not render AnimationWindowControl initially'
  );

  // hit play
  wrapper.find(Icons.Play).at(0).simulate('click');
  t.deepEqual(toggleAnimation.args[0], [0], 'should call toggle animation');

  // hit speed icon
  wrapper.find(Icons.Rocket).at(0).simulate('click');

  t.equal(wrapper.find(AnimationSpeedSlider).length, 1, 'should render AnimationSpeedSlider');
  t.equal(
    wrapper.find(AnimationSpeedSlider).at(0).find('.kg-range-slider__handle').length,
    2,
    'should render 2 speed slider handle'
  );
  const sliderHandle = wrapper
    .find(AnimationSpeedSlider)
    .at(0)
    .find('.kg-range-slider__handle')
    .at(1);

  sliderHandle.simulate('mousedown', {clientX: 0});

  // simulate slider move
  const mouseMove = new window.MouseEvent('mousemove', {clientX: 100});
  document.dispatchEvent(mouseMove);

  // test updateAnimationSpeed
  t.deepEqual(updateAnimationSpeed.args[0], [0, 2], 'should call updateAnimationSpeed with speed');

  // hit animation window
  wrapper.find(Icons.FreeWindow).at(0).simulate('click');
  t.equal(
    wrapper.find('.animation-window-control').length,
    1,
    'should render AnimationWindowControl initially'
  );
  t.equal(
    wrapper.find('.animation-window-control').at(0).find(IconButton).length,
    1,
    'should render 1 animate window options'
  );

  // select an animation option
  wrapper.find('.animation-window-control').at(0).find(IconButton).at(0).simulate('click');

  t.deepEqual(
    setFilterAnimationWindow.args[0],
    [{id: StateWFilters.visState.filters[0].id, animationWindow: 'incremental'}],
    'should call setFilterAnimationWindow'
  );

  // click yaxis select
  wrapper.find('.item-selector__dropdown').at(0).simulate('click');
  t.equal(wrapper.find(Typeahead).length, 1, 'should render dropdown select');

  wrapper.find(Typeahead).find('.field-selector_list-item').at(0).simulate('click');
  t.ok(setFilterPlot.calledOnce, 'should call setFilterPlot again');
  t.equal(setFilterPlot.getCall(0).args[0], 0, 'should pass filteridx to setFilterPlot');
  t.equal(
    setFilterPlot.getCall(0).args[1].yAxis.name,
    'gps_data.lat',
    'should pass correct yAxis to setFilterPlot'
  );

  // hit close
  wrapper.find(Icons.Close).at(0).simulate('click');

  t.deepEqual(onClose.calledOnce, true, 'should call enlarged filter to close');

  wrapper.detach();
  clientSizeStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> test setFilterAnimationTime', t => {
  const setFilterAnimationTime = sinon.spy();
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} setFilterAnimationTime={setFilterAnimationTime} />
      </IntlWrapper>,
      {
        attachTo: document.body
      }
    );
  }, 'mount TimeWidget should not fail');

  // mock slider client size width so that value calculation works
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);
  t.equal(wrapper.find(RangeSlider).length, 1, 'should render RangeSlider');
  const rangeSlider = wrapper.find(RangeSlider).at(0);

  t.equal(rangeSlider.find(SliderHandle).length, 2, 'should render 2 slider handle');

  rangeSlider
    .find(SliderHandle)
    .at(0)
    .find('.kg-range-slider__handle')
    .at(0)
    .simulate('mousedown', {clientX: 0});
  // simulate slider move
  const mouseMove = new window.MouseEvent('mousemove', {clientX: 100});
  document.dispatchEvent(mouseMove);

  // test updateAnimationSpeed
  t.deepEqual(
    setFilterAnimationTime.args[0],
    [0, 'value', [1474594560000, 1474617600000]],
    'should call setFilterAnimationTime with new value'
  );

  // cleanup
  wrapper.detach();
  clientSizeStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> test floating time display', t => {
  const topSelector = '.animation-control__time-display__top';
  const bottomSelector = '.animation-control__time-display__bottom';
  let wrapper;
  // because we are using locale based formats, we set a locale here to make sure
  // result are always the same
  moment.locale('en');

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} />
      </IntlWrapper>
    );
  }, 'mount TimeWidget should not fail');

  const timeDisplay = wrapper.find(FloatingTimeDisplay);
  t.equal(timeDisplay.find(topSelector).length, 1, 'should render 1 top row');
  t.equal(
    timeDisplay.find(topSelector).at(0).find('.time-value').text(),
    '09/23/2016',
    'should render correct date'
  );

  t.equal(timeDisplay.find(bottomSelector).length, 1, 'should render 1 bottom row');
  t.equal(
    timeDisplay.find(bottomSelector).at(0).find('.time-value').length,
    2,
    'should render 2 time value'
  );
  t.equal(
    timeDisplay.find(bottomSelector).at(0).find('.time-value').at(0).text(),
    '5:00:00 AM',
    'should render correct time'
  );
  t.equal(
    timeDisplay.find(bottomSelector).at(0).find('.time-value').at(1).text(),
    '8:00:00 AM',
    'should render correct time'
  );

  // set TimeWidget prop
  // filter with timezone and custom Format
  wrapper.setProps({
    children: <TimeWidget {...defaultProps} filter={nextState.filters[0]} />
  });

  // check time display again
  const timeDisplay2 = wrapper.find(FloatingTimeDisplay);
  t.equal(
    timeDisplay2.find(bottomSelector).at(0).find('.time-value').at(0).text(),
    '2016 Sep 23 01:00 am',
    'should render correct time format and timezone'
  );

  t.equal(
    timeDisplay2.find(bottomSelector).at(0).find('.time-value').at(1).text(),
    '2016 Sep 23 04:00 am',
    'should render correct time format and timezone'
  );

  t.end();
});

test('Components -> TimeWidget.mount -> TimeSliderMarker', t => {
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} />
      </IntlWrapper>
    );
  }, 'mount TimeWidget should not fail');

  t.equal(wrapper.find(TimeSliderMarker).length, 1, 'should render TimeSliderMarker');
  let d3Html = wrapper.find(TimeSliderMarker).at(0).find('.x.axis').html();

  // moment.utc(1474588800000) -> "2016-09-23 00:00"
  // moment.utc(1474617600000) -> "2016-09-23 08:00"
  // Enzyme cant detect element appended by d3
  const expectedMarks = [
    'Fri 23',
    '01 AM',
    '02 AM',
    '03 AM',
    '04 AM',
    '05 AM',
    '06 AM',
    '07 AM',
    '08 AM'
  ];

  expectedMarks.forEach(mark => {
    t.ok(
      d3Html.includes(`<text fill="currentColor" y="8" dy="0.71em">${mark}</text>`),
      `should render correct time marker ${mark}`
    );
  });

  // set TimeWidget prop
  wrapper.setProps({
    children: <TimeWidget {...defaultProps} filter={nextState.filters[0]} />
  });

  d3Html = wrapper.find(TimeSliderMarker).at(0).find('.x.axis').html();

  // moment.utc(1474588800000).tz('America/New_York') -> "2016-09-22 20:00"
  // moment.utc(1474617600000).tz('America/New_York') -> "2016-09-23 04:00"
  // Enyme cant detect element appended by d3
  const expectedMarks2 = [
    '20 PM',
    '21 PM',
    '22 PM',
    '23 PM',
    'Fri 23',
    '01 AM',
    '02 AM',
    '03 AM',
    '04 AM'
  ];

  expectedMarks2.forEach(mark => {
    t.ok(
      d3Html.includes(`<text fill="currentColor" y="8" dy="0.71em">${mark}</text>`),
      `should render correct time marker ${mark}`
    );
  });

  const invalidFilter = {
    ...StateWFilters.visState.filters[0],
    domain: null
  };

  // set TimeWidget prop
  t.doesNotThrow(() => {
    wrapper.setProps({
      children: <TimeWidget {...defaultProps} filter={invalidFilter} />
    });
  }, 'mount TimeWidget with invalid filter should not fail');

  clientSizeStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> TimeTitle', t => {
  const selector = '.time-range-slider__time-title .time-value span';
  let wrapper;
  // because we are using locale based formats, we set a locale here to make sure
  // result are always the same
  moment.locale('en');

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} showTimeDisplay={false} />
      </IntlWrapper>
    );
  }, 'mount TimeWidget with showTimeDisplay false');

  t.equal(
    wrapper.find(TimeRangeSliderTimeTitle).length,
    1,
    'should render TimeRangeSliderTimeTitle'
  );
  t.equal(wrapper.find(selector).length, 2, 'Should render 2 time title value');

  let expected = ['09/23/2016 5:00:00 AM', '09/23/2016 8:00:00 AM'];
  wrapper.find(selector).forEach((span, i) => {
    t.equal(span.text(), expected[i], `should render correct time value ${expected[i]}`);
  });

  // set TimeWidget prop with timezone and custom Format time filter
  wrapper.setProps({
    children: <TimeWidget {...defaultProps} showTimeDisplay={false} filter={nextState.filters[0]} />
  });

  expected = ['2016 Sep 23 01:00 am', '2016 Sep 23 04:00 am'];
  wrapper.find(selector).forEach((span, i) => {
    t.equal(span.text(), expected[i], `should render correct time value ${expected[i]}`);
  });

  t.end();
});

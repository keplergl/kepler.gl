// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import React, {act} from 'react';
import test from 'tape';
import sinon from 'sinon';
import moment from 'moment';
import 'moment/locale/en-gb';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';

import {IntlWrapper, mountWithTheme, mockHTMLElementClientSize} from 'test/helpers/component-utils';
import {
  setFilter,
  setFilterAnimationTimeConfig,
  setFilterAnimationWindow
} from '@kepler.gl/actions';
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
  SliderHandle,
  Typeahead,
  ItemSelector,
  TimezoneSelector,
  appInjector
} from '@kepler.gl/components';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {getTimelineFromFilter} from '@kepler.gl/utils';

moment.locale('en');

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
  setFilterAnimationTimeConfig: nop,
  setFilterAnimationWindow: nop,
  animationConfig: DEFAULT_ANIMATION_CONFIG
};

function openTimelineModes(wrapper) {
  wrapper.find('[data-testid="time-widget-animation-mode"]').hostNodes().simulate('click');
  wrapper.update();
}

function openTimelineSettings(wrapper) {
  wrapper.find('button.time-widget-settings').hostNodes().simulate('click');
  wrapper.update();
}

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
  t.equal(wrapper.find(PlaybackControls).length, 0, 'should not duplicate playback controls');
  t.equal(
    wrapper.find('[data-testid="time-widget-play"]').hostNodes().length,
    1,
    'should expose playback in the header'
  );

  openTimelineSettings(wrapper);

  t.deepEqual(
    wrapper.find(FieldSelector).map(selector => selector.props().id),
    ['selected-time-widget-field', 'time-widget-group-by-field'],
    'should render Y-axis and category field selectors'
  );
  t.equal(wrapper.find(TimezoneSelector).length, 1, 'should render TimezoneSelector');

  // check yAxisFields
  const yAxisFields = wrapper.find(FieldSelector).at(0).props().fields;
  t.deepEqual(
    yAxisFields.map(f => f.name),
    ['gps_data.lat', 'gps_data.lng', 'uid'],
    'should only pass real / integer fields to yAxis'
  );

  t.end();
});

test('Components -> TimeWidget.mount -> timezone selector', t => {
  const setFilterAnimationTimeConfig = sinon.spy();
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} setFilterAnimationTimeConfig={setFilterAnimationTimeConfig} />
      </IntlWrapper>
    );
  }, 'TimeWidget should not fail without props');

  openTimelineSettings(wrapper);

  t.equal(wrapper.find(TimezoneSelector).length, 1, 'should render TimezoneSelector');
  t.equal(
    wrapper.find('[data-testid="time-widget-timezone"]').hostNodes().length,
    1,
    'should render timezone field selector'
  );

  const timezoneSelector = wrapper.find(TimezoneSelector).at(0);
  t.ok(timezoneSelector.props().timezone == null, 'should default timezone to null (UTC display)');

  timezoneSelector.props().onChange('America/Los_Angeles');

  t.deepEqual(
    setFilterAnimationTimeConfig.args[0],
    [0, {timezone: 'America/Los_Angeles'}],
    'should call setFilterAnimationTimeConfig with selected timezone'
  );

  wrapper.setProps({
    children: (
      <TimeWidget
        {...defaultProps}
        filter={nextState.filters[0]}
        setFilterAnimationTimeConfig={setFilterAnimationTimeConfig}
      />
    )
  });
  wrapper.update();

  t.equal(
    wrapper.find(TimezoneSelector).at(0).props().timezone,
    'America/New_York',
    'should show the filter timezone'
  );

  t.end();
});

test('Components -> TimeWidget.mount -> time format selector', t => {
  const setFilterAnimationTimeConfig = sinon.spy();
  const mountTimeWidget = filter => {
    const mounted = mountWithTheme(
      <IntlWrapper>
        <TimeWidget
          {...defaultProps}
          filter={filter}
          setFilterAnimationTimeConfig={setFilterAnimationTimeConfig}
        />
      </IntlWrapper>
    );
    openTimelineSettings(mounted);
    return mounted;
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountTimeWidget(defaultProps.filter);
  }, 'TimeWidget should not fail without props');

  t.equal(
    wrapper.find('[data-testid="time-widget-time-format"]').hostNodes().length,
    1,
    'should render time format selector'
  );

  const getTimeFormatSelector = () =>
    wrapper.find('[data-testid="time-widget-time-format"]').find(ItemSelector).at(0);

  t.equal(getTimeFormatSelector().length, 1, 'should expose the time format options');
  t.equal(
    wrapper.find('[data-testid="time-widget-time-format"]').hostNodes().prop('aria-labelledby'),
    'time-widget-time-format-label',
    'should associate the selector with its label'
  );
  t.equal(
    getTimeFormatSelector().prop('searchable'),
    false,
    'should use a non-searchable kepler item selector'
  );

  t.equal(
    getTimeFormatSelector().prop('selectedItems'),
    '12-hour',
    'should default to 12-hour format'
  );

  getTimeFormatSelector().prop('onChange')('24-hour');

  t.deepEqual(
    setFilterAnimationTimeConfig.args[0],
    [0, {timeFormat: 'L HH:mm:ss'}],
    'should call setFilterAnimationTimeConfig with 24-hour format'
  );

  wrapper.unmount();
  wrapper = mountTimeWidget({...defaultProps.filter, timeFormat: 'L HH:mm:ss'});

  t.equal(
    getTimeFormatSelector().prop('selectedItems'),
    '24-hour',
    'should show the filter time format'
  );
  t.equal(
    wrapper
      .find(FloatingTimeDisplay)
      .find('.animation-control__time-display__bottom')
      .at(0)
      .find('.time-value')
      .at(0)
      .text(),
    '09/23/2016 05:00:00',
    'should render time without an AM/PM suffix'
  );

  getTimeFormatSelector().prop('onChange')('12-hour');

  t.deepEqual(
    setFilterAnimationTimeConfig.lastCall.args,
    [0, {timeFormat: 'L hh:mm:ss A'}],
    'should call setFilterAnimationTimeConfig with 12-hour format'
  );

  wrapper.unmount();
  wrapper = mountTimeWidget({...defaultProps.filter, timeFormat: 'L hh:mm:ss A'});

  t.equal(
    wrapper
      .find(FloatingTimeDisplay)
      .find('.animation-control__time-display__bottom')
      .at(0)
      .find('.time-value')
      .at(0)
      .text(),
    '09/23/2016 05:00:00 AM',
    'should render time with an AM/PM suffix'
  );

  wrapper.unmount();
  wrapper = mountTimeWidget({
    ...defaultProps.filter,
    timeFormat: null,
    defaultTimeFormat: 'L LTS.SSS'
  });
  getTimeFormatSelector().prop('onChange')('24-hour');

  t.deepEqual(
    setFilterAnimationTimeConfig.lastCall.args,
    [0, {timeFormat: 'L HH:mm:ss.SSS'}],
    'should preserve millisecond precision when changing the hour cycle'
  );

  wrapper.unmount();
  wrapper = mountTimeWidget({
    ...defaultProps.filter,
    timeFormat: 'L hmmss A'
  });
  getTimeFormatSelector().prop('onChange')('24-hour');

  t.deepEqual(
    setFilterAnimationTimeConfig.lastCall.args,
    [0, {timeFormat: 'L Hmmss'}],
    'should convert a compact time without appending a second time format'
  );

  wrapper.unmount();
  const previousLocale = moment.locale();
  moment.locale('en-gb');
  wrapper = mountTimeWidget({
    ...defaultProps.filter,
    timeFormat: null,
    defaultTimeFormat: 'L LT'
  });

  t.equal(
    getTimeFormatSelector().prop('selectedItems'),
    '24-hour',
    'should derive the hour cycle from a localized default format'
  );
  wrapper.unmount();
  moment.locale(previousLocale);

  wrapper = mountTimeWidget({
    ...defaultProps.filter,
    timeFormat: null,
    defaultTimeFormat: 'L'
  });

  t.equal(
    getTimeFormatSelector().prop('disabled'),
    undefined,
    'should keep hour-cycle selection enabled when the effective format has no hour'
  );

  getTimeFormatSelector().prop('onChange')('24-hour');

  t.deepEqual(
    setFilterAnimationTimeConfig.lastCall.args,
    [0, {timeFormat: 'L HH:mm'}],
    'should add a zero-padded 24-hour time to a date-only format'
  );

  wrapper.unmount();
  t.end();
});

test('Components -> TimeWidget.mount -> test actions', t => {
  const onClose = sinon.spy();
  const resetAnimation = sinon.spy();
  const exportAnimation = sinon.spy();
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
          resetAnimation={resetAnimation}
          exportAnimation={exportAnimation}
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
  t.equal(wrapper.find(Icons.Play).length, 1, 'should render Play icon');
  t.equal(
    wrapper.find('[data-testid="time-widget-export"]').hostNodes().length,
    1,
    'should expose animation export directly in the header'
  );
  t.ok(
    wrapper.find('[data-testid="time-widget-export"]').hostNodes().prop('aria-label'),
    'should name the export button for assistive technology'
  );
  t.equal(
    wrapper.find(AnimationSpeedSlider).length,
    0,
    'should not render AnimationSpeedSlider initially'
  );
  t.equal(
    wrapper.find('div.time-widget-animation-menu').hostNodes().length,
    0,
    'should keep animation modes closed initially'
  );

  // hit play
  wrapper.find(Icons.Play).at(0).simulate('click');
  t.deepEqual(toggleAnimation.args[0], [0], 'should call toggle animation');

  wrapper.find('[data-testid="time-widget-speed"]').hostNodes().simulate('click');

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

  wrapper
    .find(AnimationSpeedSlider)
    .find('.animation-control__speed-slider')
    .hostNodes()
    .simulate('keydown', {key: 'Escape', keyCode: 27});
  t.equal(wrapper.find(AnimationSpeedSlider).length, 0, 'Escape should close the speed popup');

  wrapper.find('[data-testid="time-widget-reset"]').hostNodes().simulate('click');
  t.ok(resetAnimation.calledOnce, 'should reset directly from the header');
  t.equal(
    wrapper.find('div.time-widget-animation-menu').hostNodes().length,
    0,
    'reset should not open animation modes'
  );

  ['free', 'incremental', 'interval'].forEach(animationWindow => {
    openTimelineModes(wrapper);
    t.equal(
      wrapper.find(`button.time-widget-animation-${animationWindow}`).hostNodes().length,
      1,
      `should expose ${animationWindow} animation mode`
    );
    wrapper.find(`button.time-widget-animation-${animationWindow}`).hostNodes().simulate('click');
    t.deepEqual(
      setFilterAnimationWindow.lastCall.args,
      [{id: StateWFilters.visState.filters[0].id, animationWindow}],
      `should select ${animationWindow} animation mode`
    );
    t.equal(
      wrapper.find('div.time-widget-animation-menu').hostNodes().length,
      0,
      'choosing an animation mode should close the menu'
    );
  });

  wrapper.find('button.time-widget-export').hostNodes().simulate('click');
  t.ok(exportAnimation.calledOnce, 'should export animation directly from the header');

  openTimelineSettings(wrapper);
  t.equal(
    wrapper.find('div.time-widget--settings').hostNodes().length,
    1,
    'should open chart settings directly from the header'
  );

  const settingsButton = wrapper.find('button.time-widget-settings').hostNodes();
  t.equal(
    settingsButton.getDOMNode().getAttribute('aria-expanded'),
    'true',
    'gear should announce expanded settings'
  );
  wrapper.find('button[aria-label="Hide settings"]').hostNodes().simulate('click');
  t.equal(
    wrapper.find('div.time-widget--settings').hostNodes().length,
    0,
    'chevron should hide settings'
  );
  t.equal(
    wrapper
      .find('button.time-widget-settings')
      .hostNodes()
      .getDOMNode()
      .getAttribute('aria-expanded'),
    'false',
    'gear should reflect the closed panel'
  );
  t.equal(
    document.activeElement,
    settingsButton.getDOMNode(),
    'closing should restore focus to the gear'
  );
  t.equal(wrapper.find(TimeRangeSlider).length, 1, 'hiding settings should keep the timeline open');
  openTimelineSettings(wrapper);

  wrapper.find(FieldSelector).find('.item-selector__dropdown').at(0).simulate('click');
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

  // Dragging 20% across the nine populated hourly bins selects 01:48.
  t.deepEqual(
    setFilterAnimationTime.args[0],
    [0, 'value', [1474595280000, 1474617600000]],
    'should call setFilterAnimationTime with new value'
  );

  // cleanup
  wrapper.detach();
  clientSizeStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> inline selected range', t => {
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

  const selectedRange = wrapper.find('[role="group"][aria-label="Selected range"]').hostNodes();
  t.equal(selectedRange.length, 1, 'should identify the selected range for assistive technology');
  t.ok(
    selectedRange
      .getDOMNode()
      .parentElement.contains(
        wrapper.find('[data-testid="time-widget-play"]').hostNodes().getDOMNode()
      ),
    'selected range should share the playback row with its controls'
  );
  t.equal(
    selectedRange.find('div.floating-time-display').hostNodes().length,
    1,
    'should place the existing range display inside the playback row'
  );
  t.equal(
    wrapper.find('div.floating-time-display').hostNodes().length,
    1,
    'should not render an additional standalone range badge'
  );
  t.equal(wrapper.find(TimeRangeSliderTimeTitle).length, 0, 'should not repeat the slider title');
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

test('Components -> TimeWidget.mount -> inline range when floating display is disabled', t => {
  const selector =
    '[aria-label="Selected range"] .animation-control__time-display__bottom .time-value';
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
    0,
    'should keep the separate slider title hidden'
  );
  t.equal(
    wrapper.find('[role="group"][aria-label="Selected range"]').hostNodes().length,
    1,
    'should retain the inline selected range when the floating display is disabled'
  );
  t.equal(wrapper.find(selector).length, 2, 'should render both selected range endpoints');

  let expected = ['5:00:00 AM', '8:00:00 AM'];
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

test('Components -> TimeWidget.mount -> timeline zoom reset button', t => {
  const setFilterAnimationTime = sinon.spy();
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} setFilterAnimationTime={setFilterAnimationTime} />
      </IntlWrapper>,
      {attachTo: document.body}
    );
  }, 'mount TimeWidget should not fail');

  // Initially, no reset button should be visible (timeline not zoomed)
  t.equal(
    wrapper.find('[data-testid="time-widget-timeline-reset"]').hostNodes().length,
    0,
    'should not render Reset button when timeline is not zoomed'
  );

  wrapper.detach();
  clientSizeStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> fractional numeric timeline zoom and reset', t => {
  const setFilterAnimationTime = sinon.spy();
  const numericState = reducer(StateWFilters.visState, setFilter(0, 'name', 'gps_data.lat'));
  const numericFilter = {
    ...numericState.filters[0],
    domain: [0, 0.1],
    value: [0.02, 0.08]
  };
  const rectStub = sinon.stub(HTMLElement.prototype, 'getBoundingClientRect').returns({
    left: 0,
    right: 500,
    top: 0,
    bottom: 100,
    width: 500,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({})
  });

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <TimeWidget
        {...defaultProps}
        filter={numericFilter}
        setFilterAnimationTime={setFilterAnimationTime}
      />
    </IntlWrapper>,
    {attachTo: document.body}
  );
  const timeDisplay = wrapper.find(FloatingTimeDisplay);
  t.equal(
    wrapper
      .find('[role="group"][aria-label="Selected range"] div.floating-time-display')
      .hostNodes().length,
    1,
    'numeric selection should appear in the playback row'
  );
  t.equal(
    timeDisplay.find('.animation-control__time-display__top').text(),
    'gps_data.lat',
    'numeric selected range should identify its column'
  );
  t.deepEqual(
    timeDisplay
      .find('.animation-control__time-display__bottom')
      .find('.time-value')
      .map(n => n.text()),
    ['0.02', '0.08'],
    'numeric selected range should retain its formatted values'
  );
  const container = wrapper
    .find('[data-testid="time-widget-timeline-container"]')
    .hostNodes()
    .getDOMNode();

  act(() => {
    container.dispatchEvent(
      new window.WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        clientX: 250,
        ctrlKey: true,
        deltaY: -100
      })
    );
  });
  wrapper.update();
  t.equal(
    wrapper.find('[data-testid="time-widget-timeline-reset"]').hostNodes().length,
    1,
    'fractional numeric timeline can zoom below a one-unit domain'
  );

  act(() => {
    wrapper.find('[data-testid="time-widget-timeline-reset"]').hostNodes().simulate('click');
  });
  wrapper.update();
  t.equal(
    wrapper.find('[data-testid="time-widget-timeline-reset"]').hostNodes().length,
    0,
    'reset restores the full fractional numeric domain'
  );

  act(() => {
    container.dispatchEvent(
      new window.WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        clientX: 250,
        deltaY: -100
      })
    );
  });
  const selectedRange = setFilterAnimationTime.lastCall.args[2];
  t.ok(selectedRange[1] - selectedRange[0] < 0.06, 'fractional selection can zoom in');
  t.ok(selectedRange[1] > selectedRange[0], 'fractional selection keeps a positive width');

  wrapper.detach();
  rectStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> minimized numeric timeline formats numeric bounds', t => {
  const toggleAnimation = sinon.spy();
  const onToggleMinify = sinon.spy();
  const numericState = reducer(StateWFilters.visState, setFilter(0, 'name', 'gps_data.lat'));
  const numericFilter = {
    ...numericState.filters[0],
    domain: [0.02, 0.08],
    value: [0.02, 0.08],
    view: FILTER_VIEW_TYPES.minified
  };
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <TimeWidget
        {...defaultProps}
        filter={numericFilter}
        toggleAnimation={toggleAnimation}
        onToggleMinify={onToggleMinify}
      />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find('.animation-control__time-domain.domain-start').find('span').text(),
    '0.02',
    'compact numeric timeline formats its domain start as a number'
  );
  t.equal(
    wrapper.find('.animation-control__time-domain.domain-end').find('span').text(),
    '0.08',
    'compact numeric timeline formats its domain end as a number'
  );
  t.equal(
    wrapper.find(PlaybackControls).length,
    0,
    'collapsed slider should not duplicate controls'
  );
  wrapper.find('[data-testid="time-widget-play"]').hostNodes().simulate('click');
  t.deepEqual(toggleAnimation.lastCall.args, [0], 'collapsed timeline should retain playback');

  t.equal(
    wrapper.find('button.time-widget-settings').hostNodes().length,
    0,
    'chart settings should stay hidden while the chart is collapsed'
  );
  t.equal(
    wrapper.find('button.time-widget-export').hostNodes().length,
    0,
    'should not offer export without an export callback'
  );
  openTimelineModes(wrapper);
  ['free', 'incremental', 'interval'].forEach(animationWindow => {
    t.equal(
      wrapper.find(`button.time-widget-animation-${animationWindow}`).hostNodes().length,
      1,
      `collapsed timeline should retain ${animationWindow} animation mode`
    );
  });
  wrapper
    .find('div.time-widget-animation-menu')
    .hostNodes()
    .simulate('keydown', {key: 'Escape', keyCode: 27});
  t.equal(
    wrapper.find('div.time-widget-animation-menu').hostNodes().length,
    0,
    'Escape should dismiss animation modes'
  );
  wrapper.find('[aria-label="Expand timeline"]').hostNodes().simulate('click');
  t.ok(onToggleMinify.calledOnce, 'collapsed timeline should retain its expand action');

  wrapper.unmount();
  t.end();
});

test('Components -> TimeWidget.mount -> collapsed header follows the supplied timeline', t => {
  const updateAnimationSpeed = sinon.spy();
  const filter = {
    ...defaultProps.filter,
    speed: 1,
    animationWindow: 'free',
    view: FILTER_VIEW_TYPES.minified
  };
  const timeline = {
    ...getTimelineFromFilter(filter),
    speed: 4,
    animationWindow: 'incremental',
    value: [1474610400000, 1474614000000],
    timezone: 'America/New_York',
    timeFormat: 'YYYY-MM-DD HH:mm'
  };
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <TimeWidget
        {...defaultProps}
        index={3}
        filter={filter}
        timeline={timeline}
        updateAnimationSpeed={updateAnimationSpeed}
      />
    </IntlWrapper>
  );

  t.equal(
    Number.parseFloat(wrapper.find('[data-testid="time-widget-speed"]').hostNodes().text()),
    4,
    'collapsed header should display the supplied timeline speed'
  );
  t.deepEqual(
    wrapper
      .find('[aria-label="Selected range"] .animation-control__time-display__bottom .time-value')
      .map(value => value.text()),
    ['2016-09-23 02:00', '2016-09-23 03:00'],
    'collapsed range should use the supplied timeline selection, timezone, and custom format'
  );
  openTimelineModes(wrapper);
  t.equal(
    wrapper.find('button.time-widget-animation-incremental').hostNodes().prop('aria-pressed'),
    true,
    'collapsed modes should select the supplied timeline animation mode'
  );
  t.equal(
    wrapper.find('button.time-widget-animation-free').hostNodes().prop('aria-pressed'),
    false,
    'the original filter mode should not be marked selected'
  );
  wrapper
    .find('div.time-widget-animation-menu')
    .hostNodes()
    .simulate('keydown', {key: 'Escape', keyCode: 27});

  wrapper.find('[data-testid="time-widget-speed"]').hostNodes().simulate('click');
  const speedInput = wrapper.find(AnimationSpeedSlider).find('input').hostNodes();
  t.equal(
    speedInput.getDOMNode().value,
    '4',
    'the speed editor should match the supplied timeline'
  );
  speedInput.simulate('change', {target: {value: '2'}});
  speedInput.simulate('blur', {target: {value: '2'}});
  t.deepEqual(
    updateAnimationSpeed.lastCall.args,
    [3, 2],
    'speed edits should still route to the filter index'
  );

  wrapper.setProps({
    children: (
      <TimeWidget
        {...defaultProps}
        filter={{...filter, view: FILTER_VIEW_TYPES.enlarged}}
        timeline={timeline}
      />
    )
  });
  t.deepEqual(
    wrapper
      .find('[aria-label="Selected range"] .animation-control__time-display__bottom .time-value')
      .map(value => value.text()),
    ['5:00:00 AM', '8:00:00 AM'],
    'expanded range should follow the histogram filter selection and formatting'
  );

  wrapper.unmount();
  t.end();
});

test('Components -> TimeWidget.mount -> timeline container renders', t => {
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} />
      </IntlWrapper>,
      {attachTo: document.body}
    );
  }, 'mount TimeWidget should not fail');

  // Should have the timeline container for wheel events
  t.equal(
    wrapper.find(TimeRangeSlider).length,
    1,
    'should render TimeRangeSlider inside timeline container'
  );

  wrapper.detach();
  clientSizeStub.restore();
  t.end();
});

function renderSteppingWidget(filter, onChange, otherProps = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return render(
    <ThemeProvider theme={theme}>
      <IntlWrapper>
        <TimeWidget
          {...defaultProps}
          filter={filter}
          setFilterAnimationTime={onChange}
          {...otherProps}
        />
      </IntlWrapper>
    </ThemeProvider>,
    {container, baseElement: container}
  );
}

[false, true].forEach(isMinified => {
  test(`Components -> TimeWidget -> step controls and scoped shortcuts (minified=${isMinified})`, t => {
    const setFilterAnimationTime = sinon.spy();
    const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);
    const filter = {
      ...defaultProps.filter,
      view: isMinified ? FILTER_VIEW_TYPES.minified : FILTER_VIEW_TYPES.enlarged,
      value: [1474595000000, 1474605000000]
    };
    const view = renderSteppingWidget(filter, setFilterAnimationTime);
    const previous = view.getByRole('button', {name: 'Previous interval'});
    const next = view.getByRole('button', {name: 'Next interval'});
    fireEvent.click(next);
    t.deepEqual(
      setFilterAnimationTime.lastCall.args,
      [0, 'value', [1474605000000, 1474615000000]],
      'next button advances one selected window'
    );
    fireEvent.click(previous);
    t.deepEqual(
      setFilterAnimationTime.lastCall.args,
      [0, 'value', [1474588800000, 1474595000000]],
      'previous button clips the leading edge at the domain boundary'
    );

    const playback = view.getByRole('button', {name: 'Play'});
    fireEvent.keyDown(playback, {key: 'ArrowRight', ctrlKey: true});
    t.deepEqual(
      setFilterAnimationTime.lastCall.args[2],
      [1474605000000, 1474615000000],
      'Ctrl+Right uses the same next-window behavior'
    );
    fireEvent.keyDown(playback, {key: 'ArrowLeft', metaKey: true});
    t.deepEqual(
      setFilterAnimationTime.lastCall.args[2],
      [1474588800000, 1474595000000],
      'Cmd+Left uses the same previous-window behavior'
    );
    const callCount = setFilterAnimationTime.callCount;
    fireEvent.keyDown(playback, {key: 'ArrowRight'});
    fireEvent.keyDown(document.body, {key: 'ArrowRight', ctrlKey: true});
    const input = document.createElement('input');
    const widget = view.container.querySelector('.bottom-widget--inner');
    widget.appendChild(input);
    fireEvent.keyDown(input, {key: 'ArrowRight', ctrlKey: true});
    input.remove();
    const editor = document.createElement('div');
    editor.setAttribute('contenteditable', 'true');
    widget.appendChild(editor);
    fireEvent.keyDown(editor, {key: 'ArrowRight', ctrlKey: true});
    editor.remove();
    t.equal(
      setFilterAnimationTime.callCount,
      callCount,
      'unmodified arrows, focus outside the timeline, and text editors do not step'
    );
    cleanup();
    clientSizeStub.restore();
    t.end();
  });
});

test('Components -> TimeWidget -> step boundaries and unavailable data', t => {
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);
  const domain = defaultProps.filter.domain;
  [
    {value: [domain[0], domain[0] + 1000], disabled: 'Previous interval'},
    {value: [domain[1] - 1000, domain[1]], disabled: 'Next interval'},
    {value: [...domain], disabled: 'both'},
    {value: [domain[0], domain[0]], disabled: 'both'},
    {value: [NaN, NaN], disabled: 'both'},
    {value: [...domain], disabled: 'both', isAnimatable: false}
  ].forEach(({value, disabled, isAnimatable = true}) => {
    const onChange = sinon.spy();
    const view = renderSteppingWidget({...defaultProps.filter, value}, onChange, {isAnimatable});
    const names = disabled === 'both' ? ['Previous interval', 'Next interval'] : [disabled];
    names.forEach(name => {
      const button = view.getByRole('button', {name});
      t.equal(button.disabled, true, `${name} is unavailable for ${value}`);
      fireEvent.click(button);
    });
    t.equal(onChange.callCount, 0, 'disabled steps do not change the selection');
    cleanup();
  });
  clientSizeStub.restore();
  t.end();
});

[false, true].forEach(isMinified => {
  test(`Components -> TimeWidget -> fractional steps retain shared boundaries (minified=${isMinified})`, t => {
    const onChange = sinon.spy();
    const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);
    const numericState = reducer(StateWFilters.visState, setFilter(0, 'name', 'gps_data.lat'));
    const filter = {
      ...numericState.filters[0],
      domain: [-1, 1],
      value: [-0.1, 0.3],
      view: isMinified ? FILTER_VIEW_TYPES.minified : FILTER_VIEW_TYPES.enlarged
    };
    const view = renderSteppingWidget(filter, onChange);
    fireEvent.click(view.getByRole('button', {name: 'Next interval'}));
    t.deepEqual(
      onChange.lastCall.args,
      [0, 'value', [0.3, 0.7]],
      'forward stepping starts exactly on the previous end, retaining records at 0.3'
    );
    fireEvent.click(view.getByRole('button', {name: 'Previous interval'}));
    t.deepEqual(
      onChange.lastCall.args,
      [0, 'value', [-0.5, -0.1]],
      'backward stepping ends exactly on the previous start, retaining records at -0.1'
    );
    cleanup();
    clientSizeStub.restore();
    t.end();
  });
});

test('Components -> TimeWidget -> interval stepping follows adjacent bins', t => {
  const clientSizeStub = mockHTMLElementClientSize('offsetWidth', 500);
  const filterId = defaultProps.filter.id;
  const visState = reducer(
    StateWFilters.visState,
    setFilterAnimationWindow({id: filterId, animationWindow: 'interval'})
  );
  const filter = visState.filters[0];
  const marks = getTimelineFromFilter(filter).marks;
  const onChange = sinon.spy();
  const view = renderSteppingWidget({...filter, value: [marks[1], marks[2] - 1]}, onChange, {
    datasets: visState.datasets
  });
  fireEvent.click(view.getByRole('button', {name: 'Previous interval'}));
  t.deepEqual(
    onChange.lastCall.args[2],
    [marks[0], marks[1] - 1],
    'previous selects the preceding bin'
  );
  fireEvent.click(view.getByRole('button', {name: 'Next interval'}));
  t.deepEqual(
    onChange.lastCall.args[2],
    [marks[2], marks[3] - 1],
    'next selects the following bin'
  );
  cleanup();
  const empty = renderSteppingWidget(filter, onChange, {
    timeline: {...getTimelineFromFilter(filter), marks: []}
  });
  t.equal(
    empty.getByRole('button', {name: 'Previous interval'}).disabled,
    true,
    'empty bins disable previous'
  );
  t.equal(
    empty.getByRole('button', {name: 'Next interval'}).disabled,
    true,
    'empty bins disable next'
  );
  cleanup();
  clientSizeStub.restore();
  t.end();
});

test('Components -> TimeWidget.mount -> group by field', t => {
  const setFilterPlot = sinon.spy();
  const filter = {
    ...defaultProps.filter,
    yAxis: {name: 'uid', type: 'integer'},
    plotType: {
      ...(defaultProps.filter.plotType || {}),
      type: 'lineChart',
      aggregation: 'average'
    }
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget {...defaultProps} filter={filter} setFilterPlot={setFilterPlot} />
      </IntlWrapper>,
      {attachTo: document.body}
    );
  }, 'mount TimeWidget should not fail');

  openTimelineSettings(wrapper);

  t.ok(wrapper.find('.time-widget__group-by').length > 0, 'should render group by settings');

  const selectors = wrapper.find(FieldSelector);
  let groupBySelector = null;
  for (let i = 0; i < selectors.length; i++) {
    if (selectors.at(i).props().id === 'time-widget-group-by-field') {
      groupBySelector = selectors.at(i);
    }
  }
  t.ok(groupBySelector, 'should render a group by field selector');

  const field = groupBySelector.props().fields[0];
  t.ok(field && field.name, 'group by fields include dataset columns');
  groupBySelector.props().onSelect(field);
  t.equal(
    setFilterPlot.lastCall.args[1].plotType.groupBy.fieldName,
    field.name,
    'should set the group by field'
  );

  groupBySelector.props().onSelect(null);
  t.equal(
    setFilterPlot.lastCall.args[1].plotType.groupBy,
    null,
    'should clear group by when the field is removed'
  );

  wrapper.detach();
  t.end();
});

test('Components -> TimeWidget -> interval window locks the histogram brush to one bin', t => {
  const filterId = StateWFilters.visState.filters[0].id;
  const visState = reducer(
    StateWFilters.visState,
    setFilterAnimationWindow({id: filterId, animationWindow: 'interval'})
  );
  const setFilterAnimationTime = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TimeWidget
          {...defaultProps}
          datasets={visState.datasets}
          filter={visState.filters[0]}
          setFilterAnimationTime={setFilterAnimationTime}
        />
      </IntlWrapper>
    );
  }, 'TimeWidget should render in interval mode');

  const slider = wrapper.find(RangeSlider);
  t.equal(slider.length, 1, 'should render the histogram slider');
  t.equal(slider.first().props().isRanged, false, 'brush should select one bin, not a free range');

  const marks = slider.first().props().marks;
  t.ok(Array.isArray(marks) && marks.length > 1, 'brush should snap to histogram bin edges');

  slider.first().props().onChange([marks[0], marks[0]]);
  t.deepEqual(
    setFilterAnimationTime.lastCall.args[2],
    [marks[0], marks[1] - 1],
    'should set the filter to that bin'
  );
  openTimelineModes(wrapper);
  t.equal(
    wrapper.find('button.time-widget-animation-interval').hostNodes().prop('aria-pressed'),
    true,
    'animation modes should identify Step by Interval as selected'
  );
  ['free', 'incremental'].forEach(animationWindow => {
    t.equal(
      wrapper
        .find(`button.time-widget-animation-${animationWindow}`)
        .hostNodes()
        .prop('aria-pressed'),
      false,
      `${animationWindow} should not be marked selected in interval mode`
    );
  });

  wrapper.detach();
  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import moment from 'moment';
import {
  setFilter,
  setFilterAnimationTime,
  setFilterAnimationWindow,
  setFilterPlot,
  setLayerAnimationTimeConfig
} from '@kepler.gl/actions';
import {getNumericRangeMinimum, getTimelineFromAnimationConfig} from '@kepler.gl/utils';

import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {
  AnimationControlFactory,
  AnimationControllerFactory,
  FilterAnimationControllerFactory,
  PlaybackControlsFactory,
  FloatingTimeDisplayFactory,
  appInjector,
  IconButton
} from '@kepler.gl/components';
import {StateWFilters, StateWTripGeojson} from 'test/helpers/mock-state';

import {visStateReducer as reducer} from '@kepler.gl/reducers';

const AnimationControl = appInjector.get(AnimationControlFactory);
const PlaybackControls = appInjector.get(PlaybackControlsFactory);
const FloatingTimeDisplay = appInjector.get(FloatingTimeDisplayFactory);

test('Components -> AnimationControl.render', t => {
  t.doesNotThrow(() => {
    mountWithTheme(<AnimationControl />);
  }, 'Should not fail without props');

  t.end();
});

test('Components -> AnimationControl -> render with props', t => {
  let wrapper;
  const toggleAnimation = sinon.spy();
  const setLayerAnimationTime = sinon.spy();

  const timeline = getTimelineFromAnimationConfig(StateWTripGeojson.visState.animationConfig);

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        {/* Error: Uncaught [Error: [React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.] */}
        <AnimationControl
          isAnimatable
          setTimelineValue={setLayerAnimationTime}
          toggleAnimation={toggleAnimation}
          timeline={timeline}
        />
      </IntlWrapper>
    );
  }, 'Should not fail with trip layer props');

  t.equal(
    wrapper.find('.animation-window-control').length,
    0,
    'should not render AnimationWindowControl'
  );
  t.ok(wrapper.find(PlaybackControls), 'should render PlaybackControls');
  t.ok(wrapper.find(FloatingTimeDisplay), 'should render FloatingTimeDisplay');

  wrapper.find(IconButton).at(0).simulate('click');
  t.ok(toggleAnimation.calledOnce, 'should call toggleAnimation');
  t.end();
});

test('Components -> AnimationControl -> time display', t => {
  let wrapper;

  const timeline = getTimelineFromAnimationConfig(StateWTripGeojson.visState.animationConfig);
  // because we are using locale based formats, we set a locale here to make sure
  // result are always the same
  moment.locale('en');
  const toggleAnimation = () => {};
  const setLayerAnimationTime = () => {};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        {/* Error: Uncaught [Error: [React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.] */}
        <AnimationControl
          isAnimatable
          setTimelineValue={setLayerAnimationTime}
          toggleAnimation={toggleAnimation}
          timeline={timeline}
        />
      </IntlWrapper>
    );
  }, 'Should not fail with props');

  const timeDisplay = wrapper.find(FloatingTimeDisplay);
  const timeDomainStart = wrapper.find('.animation-control__time-domain.domain-start');
  const timeDomainEnd = wrapper.find('.animation-control__time-domain.domain-end');
  t.equal(timeDisplay.length, 1, 'should render FloatingTimeDisplay');
  t.equal(timeDomainStart.length, 1, 'should render timeDomainStart');
  t.equal(timeDomainEnd.length, 1, 'should render timeDomainEnd');

  t.equal(
    timeDomainStart.find('span').at(0).text(),
    '08/12/2019 2:34:21 AM',
    'should render current domain start'
  );
  t.equal(
    timeDomainEnd.find('span').at(0).text(),
    '08/12/2019 3:00:36 AM',
    'should render current domain end'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__top').length,
    1,
    'should render 1 top row time'
  );
  t.equal(
    timeDisplay.find('.animation-control__time-display__top').at(0).find('.time-value').text(),
    '08/12/2019',
    'should render correct date'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__bottom').length,
    1,
    'should render 1 top row time'
  );
  t.equal(
    timeDisplay.find('.animation-control__time-display__bottom').at(0).find('.time-value').text(),
    '2:34:21 AM',
    'should render correct time'
  );

  t.end();
});

test('Components -> AnimationControl -> time display -> custom timezone and timeFormat', t => {
  let wrapper;

  const nextState = reducer(
    StateWTripGeojson.visState,
    setLayerAnimationTimeConfig({
      timezone: 'America/New_York',
      timeFormat: 'YYYY MMM DD hh:mm'
    })
  );

  const timeline = getTimelineFromAnimationConfig(nextState.animationConfig);

  const toggleAnimation = () => {};
  const setLayerAnimationTime = () => {};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        {/* Error: Uncaught [Error: [React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.] */}
        <AnimationControl
          isAnimatable
          setTimelineValue={setLayerAnimationTime}
          toggleAnimation={toggleAnimation}
          timeline={timeline}
        />
      </IntlWrapper>
    );
  }, 'Should not fail with props');
  const timeDisplay = wrapper.find(FloatingTimeDisplay);
  const timeDomainStart = wrapper.find('.animation-control__time-domain.domain-start');
  const timeDomainEnd = wrapper.find('.animation-control__time-domain.domain-end');
  t.equal(timeDisplay.length, 1, 'should render FloatingTimeDisplay');
  t.equal(timeDomainStart.length, 1, 'should render timeDomainStart');
  t.equal(timeDomainEnd.length, 1, 'should render timeDomainEnd');

  t.equal(
    timeDomainStart.find('span').at(0).text(),
    '2019 Aug 11 10:34',
    'should render current domain start'
  );
  t.equal(
    timeDomainEnd.find('span').at(0).text(),
    '2019 Aug 11 11:00',
    'should render current domain end'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__bottom').length,
    1,
    'should render 1 bottom row time'
  );
  t.equal(
    timeDisplay.find('.animation-control__time-display__bottom').at(0).find('.time-value').text(),
    '2019 Aug 11 10:34',
    'should render correct date'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__top').length,
    0,
    'should render 0 bottom row'
  );

  t.end();
});

test('Components -> AnimationController -> incremental window sweeps to the end of the data', t => {
  const AnimationController = AnimationControllerFactory();
  // domain runs from the first timestamp to the last one; the histogram bins
  // extend past it, so steps (bin thresholds with the last one popped) end at
  // 900 and the last bin covers [900, 1000]
  const domain = [0, 950];
  const steps = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  // delta = (domain[1] - domain[0]) / baseSpeed * speed = 100 per frame
  const baseSpeed = 9.5;

  const nextFrame = (value, stepsProp = steps) =>
    new AnimationController({
      animationWindow: ANIMATION_WINDOW.incremental,
      domain,
      value,
      steps: stepsProp,
      speed: 1,
      baseSpeed,
      setTimelineValue: () => {}
    })._nextFrameByDomain();

  t.deepEqual(
    nextFrame([0, 900]),
    [0, 1000],
    'should grow the window past the last timestamp to the end of the last bin'
  );
  t.deepEqual(
    nextFrame([0, 920]),
    [0, 1000],
    'should clamp the final step at the end of the last bin instead of discarding it'
  );
  t.deepEqual(
    nextFrame([0, 1000]),
    [0, 1],
    'should loop back to the anchor only after the final frame was emitted'
  );
  t.deepEqual(
    nextFrame([0, 900], null),
    [0, 950],
    'should clamp to the domain end when there are no bins to go by'
  );
  t.deepEqual(
    nextFrame([0, 950], null),
    [0, 1],
    'should loop back to the anchor at the domain end when there are no bins'
  );

  t.end();
});

test('Components -> AnimationController -> fractional incremental window resets in numeric units', t => {
  const AnimationController = AnimationControllerFactory();
  const setTimelineValue = sinon.spy();
  const controller = new AnimationController({
    animationWindow: ANIMATION_WINDOW.incremental,
    domain: [0, 0.1],
    value: [0, 0.1],
    speed: 1,
    baseSpeed: 10,
    minimumIncrement: 0.001,
    setTimelineValue
  });

  t.deepEqual(
    controller._nextFrameByDomain(),
    [0, 0.001],
    'numeric playback should loop to a fractional window inside its domain'
  );

  controller._resetAnimationByDomain();
  t.deepEqual(
    setTimelineValue.firstCall.args[0],
    [0, 0.001],
    'numeric reset should use its supplied fractional minimum increment'
  );

  const midSweep = new AnimationController({
    animationWindow: ANIMATION_WINDOW.incremental,
    domain: [0, 0.1],
    value: [0, 0.095],
    speed: 1,
    baseSpeed: 10,
    minimumIncrement: 0.001,
    setTimelineValue: () => {}
  })._nextFrameByDomain();
  t.deepEqual(midSweep, [0, 0.1], 'numeric playback should clamp its final frame to the maximum');

  t.end();
});

test('Components -> AnimationController -> numeric playback advances at representable extremes', t => {
  const AnimationController = AnimationControllerFactory();

  for (const domain of [
    [0, 1e-20],
    [1e12, 1e12 + 0.001],
    [0, 0.1]
  ]) {
    const minimumIncrement = getNumericRangeMinimum(domain);
    const reset = new AnimationController({
      animationWindow: ANIMATION_WINDOW.incremental,
      domain,
      value: [...domain],
      speed: 1,
      minimumIncrement,
      setTimelineValue: () => {}
    })._nextFrameByDomain();
    t.ok(reset[1] > domain[0], `${domain} reset should advance beyond its anchor`);
    t.ok(reset[1] < domain[1], `${domain} reset should not jump to the domain maximum`);

    const advanced = new AnimationController({
      animationWindow: ANIMATION_WINDOW.incremental,
      domain,
      value: reset,
      speed: 1,
      minimumIncrement,
      setTimelineValue: () => {}
    })._nextFrameByDomain();
    t.ok(advanced[1] > reset[1], `${domain} should advance after looping instead of freezing`);
    t.ok(advanced[1] <= domain[1], `${domain} should remain inside its domain`);
  }

  t.end();
});

test('Components -> FilterAnimationController -> numeric incremental bins stay in domain', t => {
  const AnimationController = AnimationControllerFactory();
  const FilterAnimationController = FilterAnimationControllerFactory(AnimationController);
  let visState = reducer(StateWFilters.visState, setFilter(0, 'name', 'gps_data.lat'));
  visState = reducer(
    visState,
    setFilterPlot(0, {plotType: {numericInterval: 0.01}})
  );
  visState = reducer(
    visState,
    setFilterAnimationWindow({
      id: visState.filters[0].id,
      animationWindow: ANIMATION_WINDOW.incremental
    })
  );

  const filter = visState.filters[0];
  const domain = [29.987000000000005, 30.061420000000005];
  t.deepEqual(filter.domain, domain, 'fixture should use the gps_data.lat numeric domain');

  const wrapper = mountWithTheme(
    <FilterAnimationController
      filter={filter}
      filterIdx={0}
      setFilterAnimationTime={(idx, prop, value) => {
        visState = reducer(visState, setFilterAnimationTime(idx, prop, value));
      }}
    >
      {() => null}
    </FilterAnimationController>
  );
  const controllerProps = wrapper.find(AnimationController).props();
  t.equal(
    controllerProps.steps[controllerProps.steps.length - 1],
    domain[1],
    'explicit numeric bins should exercise the terminal maximum step'
  );

  let value = [...domain];
  let resets = 0;
  let reachedMaximum = false;
  const violations = [];
  for (let frame = 0; frame < 1300 && resets < 2; frame++) {
    const nextValue = new AnimationController({
      ...controllerProps,
      value,
      baseSpeed: 600
    })._nextFrameByDomain();
    if (
      !Array.isArray(nextValue) ||
      nextValue[0] !== domain[0] ||
      nextValue[1] < domain[0] ||
      nextValue[1] > domain[1]
    ) {
      violations.push({frame, value: nextValue});
    }
    reachedMaximum ||= nextValue[1] === domain[1];
    if (nextValue[1] < value[1]) {
      resets++;
    }
    controllerProps.updateAnimation(nextValue);
    value = visState.filters[0].value;
  }

  t.deepEqual(violations, [], 'every reducer-applied frame should stay inside the numeric domain');
  t.ok(reachedMaximum, 'a complete numeric sweep should include the exact domain maximum');
  t.equal(resets, 2, 'numeric incremental playback should complete and restart two cycles');
  wrapper.unmount();
  t.end();
});

test('Components -> PlaybackControls -> offers Step by Interval', t => {
  const setFilterAnimationWindow = sinon.spy();
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <PlaybackControls
        isAnimatable
        speed={1}
        animationWindow={ANIMATION_WINDOW.free}
        setFilterAnimationWindow={setFilterAnimationWindow}
        startAnimation={() => {}}
        pauseAnimation={() => {}}
        resetAnimation={() => {}}
      />
    </IntlWrapper>
  );

  t.equal(wrapper.find('.animation-window-control').length, 0, 'menu starts closed');
  wrapper.find('button[data-for="animate-window"]').simulate('click');
  wrapper.update();

  const intervalButton = wrapper.find('button[data-for="interval-tooltip"]');
  t.equal(intervalButton.length, 1, 'should offer Step by Interval');
  intervalButton.simulate('click');
  t.equal(
    setFilterAnimationWindow.args[0][0],
    ANIMATION_WINDOW.interval,
    'should select the interval window'
  );

  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import moment from 'moment';
import {setLayerAnimationTimeConfig} from '@kepler.gl/actions';
import {getTimelineFromAnimationConfig} from '@kepler.gl/utils';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {
  AnimationControlFactory,
  PlaybackControlsFactory,
  FloatingTimeDisplayFactory,
  appInjector,
  IconButton
} from '@kepler.gl/components';
import {StateWTripGeojson} from 'test/helpers/mock-state';

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

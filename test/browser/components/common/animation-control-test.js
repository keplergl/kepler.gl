// Copyright (c) 2021 Uber Technologies, Inc.
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
import moment from 'moment';
import {setLayerAnimationTimeConfig} from 'actions/vis-state-actions';

import {mountWithTheme} from 'test/helpers/component-utils';
import {
  AnimationControlFactory,
  PlaybackControlsFactory,
  FloatingTimeDisplayFactory
} from 'components';
import {appInjector} from 'components/container';
import {StateWTripGeojson} from 'test/helpers/mock-state';
import {
  AnimationWindowControl,
  IconButton
} from 'components/common/animation-control/playback-controls';
import reducer from 'reducers/vis-state';

const AnimationControl = appInjector.get(AnimationControlFactory);
const PlaybackControls = appInjector.get(PlaybackControlsFactory);
const FloatingTimeDisplay = appInjector.get(FloatingTimeDisplayFactory);

test('Components -> AnimationControl.render', t => {
  t.doesNotThrow(() => {
    mountWithTheme(<AnimationControl />);
  }, 'Show not fail without props');

  t.end();
});

test('Components -> AnimationControl -> render with props', t => {
  let wrapper;
  const toggleAnimation = sinon.spy();
  const setLayerAnimationTime = sinon.spy();

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <AnimationControl
        isAnimatable
        setLayerAnimationTime={setLayerAnimationTime}
        toggleAnimation={toggleAnimation}
        animationConfig={StateWTripGeojson.visState.animationConfig}
      />
    );
  }, 'Show not fail with trip layer props');

  t.equal(
    wrapper.find(AnimationWindowControl).length,
    0,
    'should not render AnimationWindowControl'
  );
  t.ok(wrapper.find(PlaybackControls), 'should render PlaybackControls');
  t.ok(wrapper.find(FloatingTimeDisplay), 'should render FloatingTimeDisplay');

  wrapper
    .find(IconButton)
    .at(2)
    .simulate('click');
  t.ok(toggleAnimation.calledOnce, 'should call toggleAnimation');
  t.end();
});

test('Components -> AnimationControl -> time display', t => {
  let wrapper;

  // because we are using locale based formats, we set a locale here to make sure
  // result are always the same
  moment.locale('en');
  const toggleAnimation = () => {};
  const setLayerAnimationTime = () => {};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <AnimationControl
        isAnimatable
        setLayerAnimationTime={setLayerAnimationTime}
        toggleAnimation={toggleAnimation}
        animationConfig={StateWTripGeojson.visState.animationConfig}
      />
    );
  }, 'Show not fail with props');

  const timeDisplay = wrapper.find(FloatingTimeDisplay);
  const timeDomainStart = wrapper.find('.animation-control__time-domain.domain-start');
  const timeDomainEnd = wrapper.find('.animation-control__time-domain.domain-end');
  t.equal(timeDisplay.length, 1, 'should render FloatingTimeDisplay');
  t.equal(timeDomainStart.length, 1, 'should render timeDomainStart');
  t.equal(timeDomainEnd.length, 1, 'should render timeDomainEnd');

  t.equal(
    timeDomainStart
      .find('span')
      .at(0)
      .text(),
    '08/12/2019 2:34:21 AM',
    'should render current domain start'
  );
  t.equal(
    timeDomainEnd
      .find('span')
      .at(0)
      .text(),
    '08/12/2019 3:00:36 AM',
    'should render current domain end'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__top').length,
    1,
    'should render 1 top row time'
  );
  t.equal(
    timeDisplay
      .find('.animation-control__time-display__top')
      .at(0)
      .find('.time-value')
      .text(),
    '08/12/2019',
    'should render correct date'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__bottom').length,
    1,
    'should render 1 top row time'
  );
  t.equal(
    timeDisplay
      .find('.animation-control__time-display__bottom')
      .at(0)
      .find('.time-value')
      .text(),
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

  const toggleAnimation = () => {};
  const setLayerAnimationTime = () => {};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <AnimationControl
        isAnimatable
        setLayerAnimationTime={setLayerAnimationTime}
        toggleAnimation={toggleAnimation}
        animationConfig={nextState.animationConfig}
      />
    );
  }, 'Show not fail with props');
  const timeDisplay = wrapper.find(FloatingTimeDisplay);
  const timeDomainStart = wrapper.find('.animation-control__time-domain.domain-start');
  const timeDomainEnd = wrapper.find('.animation-control__time-domain.domain-end');
  t.equal(timeDisplay.length, 1, 'should render FloatingTimeDisplay');
  t.equal(timeDomainStart.length, 1, 'should render timeDomainStart');
  t.equal(timeDomainEnd.length, 1, 'should render timeDomainEnd');

  t.equal(
    timeDomainStart
      .find('span')
      .at(0)
      .text(),
    '2019 Aug 11 10:34',
    'should render current domain start'
  );
  t.equal(
    timeDomainEnd
      .find('span')
      .at(0)
      .text(),
    '2019 Aug 11 11:00',
    'should render current domain end'
  );

  t.equal(
    timeDisplay.find('.animation-control__time-display__bottom').length,
    1,
    'should render 1 bottom row time'
  );
  t.equal(
    timeDisplay
      .find('.animation-control__time-display__bottom')
      .at(0)
      .find('.time-value')
      .text(),
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

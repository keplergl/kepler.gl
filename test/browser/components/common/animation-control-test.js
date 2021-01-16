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
import {mountWithTheme} from 'test/helpers/component-utils';
import {AnimationControlFactory, PlaybackControlsFactory} from 'components';
import {appInjector} from 'components/container';
import {StateWTripGeojson} from 'test/helpers/mock-state';
import {
  AnimationWindowControl,
  IconButton
} from 'components/common/animation-control/playback-controls';

const AnimationControl = appInjector.get(AnimationControlFactory);
const PlaybackControls = appInjector.get(PlaybackControlsFactory);

test('Components -> AnimationControl.render', t => {
  t.doesNotThrow(() => {
    mountWithTheme(<AnimationControl />);
  }, 'Show not fail without props');

  t.end();
});

test('Components -> AnimationControl.render with props', t => {
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
  }, 'Show not fail without props');

  t.equal(
    wrapper.find(AnimationWindowControl).length,
    0,
    'should not render AnimationWindowControl'
  );
  t.ok(wrapper.find(PlaybackControls), 'should render PlaybackControls');

  wrapper
    .find(IconButton)
    .at(2)
    .simulate('click');
  t.ok(toggleAnimation.calledOnce, 'should call toggleAnimation');
  t.end();
});

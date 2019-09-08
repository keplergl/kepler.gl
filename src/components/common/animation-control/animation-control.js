// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {requestAnimationFrame, cancelAnimationFrame} from 'global/window';

import Slider from 'components/common/slider/slider';
import {BottomWidgetInner} from 'components/common/styled-components';
import SpeedControlFactory from './speed-control';
import AnimationPlaybacksFactory from './playback-controls';
import FloatingTimeDisplayFactory from './floating-time-display';
import {BASE_SPEED} from 'constants/default-settings';

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-right: 24px;
  margin-left: 24px;
`;

const AnimationWidgetInner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;

  .animation-control__speed-control {
    margin-right: -10px;

    .animation-control__speed-slider {
      right: calc(0% - 10px);
    }
  }
`;

const StyledDomain = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-weight: 400;
  font-size: 10px;
`;

const defaultTimeFormat = 'MM/DD/YY hh:mm:ss';
const BUTTON_HEIGHT = '18px';

AnimationControlFactory.deps = [
  SpeedControlFactory,
  AnimationPlaybacksFactory,
  FloatingTimeDisplayFactory
];

function AnimationControlFactory(
  SpeedControl,
  AnimationPlaybacks,
  FloatingTimeDisplay
) {
  class AnimationControl extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isAnimating: false,
        width: 288,
        showSpeedControl: false
      };
      this._animation = null;
    }

    componentDidUpdate() {
      if (!this._animation && this.state.isAnimating) {
        this._animation = requestAnimationFrame(this._nextFrame);
      }
    }

    onSlider1Change = val => {
      const {domain} = this.props.animationConfig;
      if (val >= domain[0] && val <= domain[1]) {
        this.props.updateAnimationTime(val);
      }
    };

    _updateAnimationTime = () => {
      const {domain} = this.props.animationConfig;
      this.props.updateAnimationTime(domain[0]);
      this._startAnimation();
    };

    _startAnimation = () => {
      this._pauseAnimation();
      this.setState({isAnimating: true});
    };

    _nextFrame = () => {
      this._animation = null;
      const {currentTime, domain, speed} = this.props.animationConfig;
      const adjustedSpeed = ((domain[1] - domain[0]) / BASE_SPEED) * speed;
      const nextTime =
        currentTime + speed > domain[1]
          ? domain[0]
          : currentTime + adjustedSpeed;
      this.props.updateAnimationTime(nextTime);
    };

    _pauseAnimation = () => {
      if (this._animation) {
        cancelAnimationFrame(this._animation);
        this._animation = null;
      }
      this.setState({isAnimating: false});
    };

    toggleSpeedControl = () => {
      this.setState({showSpeedControl: !this.state.showSpeedControl});
    };

    onChange = () => {
      this.toggleSpeedControl();
    };

    render() {
      const {currentTime, domain, speed} = this.props.animationConfig;
      const {showSpeedControl} = this.state;

      return (
        <BottomWidgetInner className="bottom-widget--inner">
          <AnimationWidgetInner className="animation-widget--inner">
            <div style={{marginLeft: '-10px'}}>
              <AnimationPlaybacks
                className="animation-control-playpause"
                startAnimation={this._startAnimation}
                isAnimating={this.state.isAnimating}
                pauseAnimation={this._pauseAnimation}
                resetAnimation={this._resetAnimation}
                buttonHeight={BUTTON_HEIGHT}
                buttonStyle="link"
              />
            </div>
            <StyledDomain className="animation-control__time-domain">
              <span>{moment.utc(domain[0]).format(defaultTimeFormat)}</span>
            </StyledDomain>
            <SliderWrapper className="animation-control__slider">
              <Slider
                showValues={false}
                isRanged={false}
                minValue={domain ? domain[0] : 0}
                maxValue={domain ? domain[1] : 1}
                value1={currentTime}
                onSlider1Change={this.onSlider1Change}
                enableBarDrag={true}
              />
            </SliderWrapper>
            <StyledDomain className="animation-control__time-domain">
              <span>{moment.utc(domain[1]).format(defaultTimeFormat)}</span>
            </StyledDomain>
            <div className="animation-control__speed-control">
              <SpeedControl
                onClick={this.toggleSpeedControl}
                showSpeedControl={showSpeedControl}
                updateAnimationSpeed={this.props.updateAnimationSpeed}
                speed={speed}
                buttonHeight={BUTTON_HEIGHT}
              />
            </div>
          </AnimationWidgetInner>
          <FloatingTimeDisplay currentTime={currentTime} />
        </BottomWidgetInner>
      );
    }
  }

  AnimationControl.defaultProps = {
    sliderHandleWidth: 12,
    onChange: () => {}
  };

  return AnimationControl;
}

export default AnimationControlFactory;

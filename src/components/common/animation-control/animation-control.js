// Copyright (c) 2020 Uber Technologies, Inc.
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
import styled from 'styled-components';
import moment from 'moment';

import Slider from 'components/common/slider/slider';
import {BottomWidgetInner, Button} from 'components/common/styled-components';
import SpeedControlFactory from './speed-control';
import AnimationPlaybacksFactory from './playback-controls';
import FloatingTimeDisplayFactory from './floating-time-display';
import AnimationControllerFactory from './animation-controller';
import {snapToMarks} from 'utils/data-utils';
import {DEFAULT_TIME_FORMAT, ANIMATION_TYPE} from 'constants';

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

const BUTTON_HEIGHT = '18px';

AnimationControlFactory.deps = [
  SpeedControlFactory,
  AnimationPlaybacksFactory,
  FloatingTimeDisplayFactory,
  AnimationControllerFactory
];

function AnimationControlFactory(
  SpeedControl,
  AnimationPlaybacks,
  FloatingTimeDisplay,
  AnimationController
) {
  class AnimationControl extends React.PureComponent {
    state = {
      showSpeedControl: false
    };
    onSlider1Change = val => {
      const {domain} = this.props.animationConfig;
      if (Array.isArray(this.props.timeSteps)) {
        this.props.updateAnimationTime(snapToMarks(val, this.props.timeSteps));
        // TODO: merge slider in to avoid this step
      } else if (val >= domain[0] && val <= domain[1]) {
        this.props.updateAnimationTime(val);
      }
    };

    toggleSpeedControl = () => {
      this.setState({showSpeedControl: !this.state.showSpeedControl});
    };

    onChange = () => {
      this.toggleSpeedControl();
    };

    _updateAnimation = value => {
      this.props.updateAnimationTime(Array.isArray(value) ? value[0] : value);
    };

    render() {
      const {currentTime, domain, speed, step, timeSteps} = this.props.animationConfig;
      const {showSpeedControl} = this.state;
      const animationType = Array.isArray(timeSteps)
        ? ANIMATION_TYPE.interval
        : ANIMATION_TYPE.continuous;

      return (
        <BottomWidgetInner className="bottom-widget--inner">
          <AnimationWidgetInner className="animation-widget--inner">
            <div style={{marginLeft: '-10px'}}>
              <AnimationController
                value={currentTime}
                domain={domain}
                speed={speed}
                updateAnimation={this._updateAnimation}
                steps={timeSteps}
                animationType={animationType}
              >
                {(isAnimating, start, pause, reset) => (
                  <AnimationPlaybacks
                    className="animation-control-playpause"
                    startAnimation={start}
                    isAnimating={isAnimating}
                    pauseAnimation={pause}
                    resetAnimation={reset}
                    buttonHeight={BUTTON_HEIGHT}
                    buttonStyle="link"
                  />
                )}
              </AnimationController>
            </div>
            <StyledDomain className="animation-control__time-domain">
              <span>{moment.utc(domain[0]).format(DEFAULT_TIME_FORMAT)}</span>
            </StyledDomain>
            <SliderWrapper className="animation-control__slider">
              <Slider
                showValues={false}
                isRanged={false}
                step={step}
                minValue={domain ? domain[0] : 0}
                maxValue={domain ? domain[1] : 1}
                value1={currentTime}
                onSlider1Change={this.onSlider1Change}
                enableBarDrag={true}
              />
            </SliderWrapper>
            <StyledDomain className="animation-control__time-domain">
              <span>{moment.utc(domain[1]).format(DEFAULT_TIME_FORMAT)}</span>
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
          <Button onClick="">Export</Button>
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

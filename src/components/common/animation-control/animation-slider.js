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
import {createSelector} from 'reselect';
import moment from 'moment';

import Slider from 'components/common/slider/slider';
import {WidgetContainer} from 'components/common/styled-components';
import TimeSliderMarker from 'components/common/time-slider-marker';
import {Play, Reset, Pause} from 'components/common/icons';
import {Button, ButtonGroup} from 'components/common/styled-components';
import {getTimeWidgetTitleFormatter} from 'utils/filter-utils';

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-top: 5px;
`;

const AnimationWidgetInner = styled.div`
  background-color: ${props => props.theme.panelBackground};
  padding: 7px 12px;
  position: relative;
  display: flex;
`;

const StyledAnimationControls = styled.div`
  margin-right: 20px;
  display: flex;
`;

const IconButton = styled(Button)`
  padding: 6px 4px;
  svg {
    margin: 0 6px;
  }
`;

const buttonHeight = '16px';
const AnimationControls = ({
  isAnimating,
  pauseAnimation = () => {},
  resetAnimation = () => {},
  startAnimation = () => {}
}) => (
  <StyledAnimationControls>
    <ButtonGroup>
      <IconButton
        onClick={isAnimating ? pauseAnimation : startAnimation} link>
        {isAnimating ? <Pause height={buttonHeight}/> : <Play height={buttonHeight}/>}
      </IconButton>
      <IconButton
        onClick={resetAnimation} link>
        <Reset height={buttonHeight}/>
      </IconButton>
    </ButtonGroup>
  </StyledAnimationControls>
);

const TimeDisplay = styled.div`
  height: 36px;
  width: 105px;
  background-color: ${props => props.theme.secondaryInputBgd};
  color: white;
  margin-left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1px;

  span {
    color: white;
    font-size: 11px;
    font-weight: 400;
  }
`
// const speed = 100;

const AnimationControlFactory = () => {
  class AnimationControl extends Component{
    constructor(props) {
      super(props);
      this.state = {
        isAnimating: false,
        width: 288
      };
      this._animation = null;
      this._currentStep = 0;
      this._isAnimating = false;
    }

    domainSelector = props => props.animation.domain.domain;
    titleFormatter = createSelector(this.domainSelector, domain =>
      getTimeWidgetTitleFormatter(domain)
    );

    onSlider1Change = (val) => {
      this.props.layerAnimationChange(this.props.layer, 'currentTime', val);
    };

    onSlider0Change = (val) => {
      return;
    };

    _resetAnimation = () => {
      // const {domain, value} = this.props;
      // const value0 = domain[0];
      // const value1 = value0 + value[1] - value[0];
      // this.props.onChange([value0, value1]);
      
      this._currentStep = -1;
      this._startAnimation();
    };

    _startAnimation = () => {
      const {duration} = this.props.animation;
      this._pauseAnimation();
      // this.props.toggleAnimation();
      this.setState({isAnimating: true});
      this._isAnimating = true;
      this._animation = window.setInterval(this._nextFrame.bind(this), duration);
    };

    _nextFrame = () => {
      const {timeSteps} = this.props.animation.domain;
      this._currentStep += 1;
      this._currentStep = this._currentStep > timeSteps.length - 1 ? 0 :  this._currentStep;
      const nextTimeStep = timeSteps[this._currentStep];
      // console.log(nextTimeStep)
      this.onSlider1Change(nextTimeStep);
    }

    _pauseAnimation = () => {
      if (this._animation) {
        // cancelAnimationFrame(this._animation);
        // this.props.toggleAnimation();
        window.clearInterval(this._animation);
        this._animation = null;
        this._isAnimating = false;
      }
      this.setState({isAnimating: false});
    };

    render() {
      const {animation, width, sliderHandleWidth, onChange} = this.props;
      const {domain, currentTime} = animation;
      // const plotWidth =  width - sliderHandleWidth;
      const timeFormat = this.titleFormatter(this.props)

      return (
        <WidgetContainer width={width}>
          <AnimationWidgetInner className="animation-widget--inner">
            <AnimationControls
              startAnimation={this._startAnimation}
              isAnimating={this.state.isAnimating}
              pauseAnimation={this._pauseAnimation}
              resetAnimation={this._resetAnimation}
            />
            <SliderWrapper
              className="kg-animation-control__slider">
              {/*<TimeSliderMarker width={plotWidth - 64} top={8} domain={domain.domain}/>*/}
              <Slider
                showValues={false}
                isRanged={false}
                minValue={domain.domain[0]}
                maxValue={domain.domain[1]}
                value0={domain.domain[0]}
                value1={currentTime}
                step={domain.step}
                onSlider0Change={this.onSlider0Change}
                onSlider1Change={this.onSlider1Change}
              />
            </SliderWrapper>
            <TimeDisplay>
              <span>{moment.utc(currentTime).format(timeFormat)}</span>
            </TimeDisplay>
          </AnimationWidgetInner>
        </WidgetContainer>
      )
    }
  }

  AnimationControl.defaultProps = {
    sliderHandleWidth: 12,
    onChange: () => {}
  };

  return AnimationControl;
};

export default AnimationControlFactory;

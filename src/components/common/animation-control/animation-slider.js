import React, {Component} from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Slider from 'components/common/slider/slider';
import {
  WidgetContainer,
  Button,
  ButtonGroup
} from 'components/common/styled-components';
import {Play, Reset, Pause} from 'components/common/icons';
import SpeedControl from './speed-control';
import {requestAnimationFrame, cancelAnimationFrame} from 'global/window';

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

const TimeDisplay = styled.div`
  height: 36px;
  width: 125px;
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
`;

const defaultTimeFormat = 'MM/DD/YY hh:mm:ss';

const buttonHeight = '16px';
const AnimationControls = ({
  isAnimating,
  pauseAnimation = () => {},
  updateAnimationTime = () => {},
  startAnimation = () => {}
}) => (
  <StyledAnimationControls>
    <ButtonGroup>
      <IconButton onClick={updateAnimationTime} link>
        <Reset height={buttonHeight} />
      </IconButton>
      <IconButton onClick={isAnimating ? pauseAnimation : startAnimation} link>
        {isAnimating ? (
          <Pause height={buttonHeight} />
        ) : (
          <Play height={buttonHeight} />
        )}
      </IconButton>
    </ButtonGroup>
  </StyledAnimationControls>
);

const AnimationControlFactory = () => {
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
      const {domain} = this.props.animation;
      if (val >= domain[0] && val <= domain[1]) {
        this.props.updateAnimationTime(val);
      }
    };

    _updateAnimationTime = () => {
      const {domain} = this.props.animation;
      this.props.updateAnimationTime(domain[0]);
      this._startAnimation();
    };

    _startAnimation = () => {
      this._pauseAnimation();
      this.setState({isAnimating: true});
    };

    _nextFrame = () => {
      this._animation = null;
      const {currentTime, domain, speed} = this.props.animation;
      const BASE_SPEED = 600;
      const adjustedSpeed = ((domain[1] - domain[0]) / BASE_SPEED) * speed;
      const nextTime =
        currentTime + speed > domain[1] ? domain[0] : currentTime + adjustedSpeed;
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
      const {animation, width} = this.props;
      const {currentTime, domain, speed} = animation;
      const {showSpeedControl} = this.state;

      return (
        <WidgetContainer width={width}>
          <AnimationWidgetInner className="animation-widget--inner">
            <AnimationControls
              className="animation-control-playpause"
              startAnimation={this._startAnimation}
              isAnimating={this.state.isAnimating}
              pauseAnimation={this._pauseAnimation}
              updateAnimationTime={this._updateAnimationTime}
            />
            <SliderWrapper className="kg-animation-control__slider">
              <Slider
                showValues={false}
                isRanged={false}
                minValue={domain[0]}
                maxValue={domain[1]}
                value1={currentTime}
                onSlider1Change={this.onSlider1Change}
                enableBarDrag={true}
              />
            </SliderWrapper>

            <SpeedControl
              onClick={this.toggleSpeedControl}
              showSpeedControl={showSpeedControl}
              updateAnimationSpeed={speedMultiplier=>this.props.updateAnimationSpeed(speedMultiplier)}
              speed={speed}
            />

            <TimeDisplay>
              <span>{moment(currentTime, 'X').format(defaultTimeFormat)}</span>
            </TimeDisplay>
          </AnimationWidgetInner>
        </WidgetContainer>
      );
    }
  }

  AnimationControl.defaultProps = {
    sliderHandleWidth: 12,
    onChange: () => {}
  };

  return AnimationControl;
};

export default AnimationControlFactory;

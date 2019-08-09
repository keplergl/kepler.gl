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

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-top: 7px;
  margin-right: 5px;
`;

const StyledControl = styled.div`
  background-color: ${props => props.theme.panelBackground};
  // height: 60px;
`;

const AnimationWidgetInner = styled.div`
  padding: 10px 12px 2px 12px;
  position: relative;
  display: flex;
`;

const StyledAnimationControls = styled.div`
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
  resetAnimation = () => {},
  startAnimation = () => {}
}) => (
  <StyledAnimationControls>
    <ButtonGroup>
      <IconButton onClick={resetAnimation} link>
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
      this._isAnimating = false;
    }

    onSlider1Change = val => {
      const {domain} = this.props.animation;
      if (val >= domain[0]) {
        this.props.resetAnimation(val);
      }
    };

    _resetAnimation = () => {
      const {domain} = this.props.animation;
      this.props.resetAnimation(domain[0]);
      this._startAnimation();
    };

    _startAnimation = () => {
      const {duration} = this.props.animation;
      this._pauseAnimation();
      this.setState({isAnimating: true});
      this._isAnimating = true;
      this._animation = window.setInterval(this._nextFrame.bind(this), duration);
    };

    _nextFrame = () => {
      const {currentTime, domain, speed} = this.props.animation;
      if (currentTime <= domain[1] - speed) {
        this.props.playAnimation(speed);
      } else if (
        currentTime > domain[1] - speed &&
        currentTime <= domain[1] + speed
      ) {
        this.props.playAnimation(domain[1] - currentTime);
      } else {
        this._pauseAnimation();
      }
    };

    _pauseAnimation = () => {
      if (this._animation) {
        window.clearInterval(this._animation);
        this._animation = null;
        this._isAnimating = false;
      }
      this.setState({isAnimating: false});
    };

    toggleSpeedControl = () => {
      this.setState({showSpeedControl: !this.state.showSpeedControl});
    };

    _updateSpeed = speed => {
      this.props.updateSpeed(speed);
    };

    onChange = () => {
      this.toggleSpeedControl();
    };

    render() {
      const {animation, width} = this.props;
      const {currentTime, domain, speed} = animation;
      const { showSpeedControl } = this.state;

      return (
        <WidgetContainer width={width}>
          <AnimationWidgetInner className="animation-widget--inner">
            <AnimationControls
              className="animation-control-playpause"
              startAnimation={this._startAnimation}
              isAnimating={this.state.isAnimating}
              pauseAnimation={this._pauseAnimation}
              resetAnimation={this._resetAnimation}
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
              updateAnimationSpeed={this._updateSpeed}
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

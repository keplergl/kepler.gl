import React, {Component} from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';
import moment from 'moment';

import Slider from 'components/common/slider/slider';
import {WidgetContainer} from 'components/common/styled-components';
import {Play, Reset, Pause} from 'components/common/icons';
import {Button, ButtonGroup} from 'components/common/styled-components';
import {
  getTimeWidgetTitleFormatter,
  getTimeAnimationDomain
} from 'utils/filter-utils';

//import {getTimeAnimationDomain} from 'utils/la-utils';

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

const isUnixTs = 1;

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

const AnimationControlFactory = () => {
  class AnimationControl extends Component {
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

    componentDidMount() {
      this.props.enableLayerAnimation(this.props.layer, this.props.datasets);
    }

    domainSelector = props => props.animation.domain.domain;
    titleFormatter = createSelector(
      this.domainSelector,
      domain => getTimeWidgetTitleFormatter(domain)
    );

    onSlider1Change = val => {
      this.props.playAnimation(val);
      console.log('slider1val', val);
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
      this.setState({isAnimating: true});
      this._isAnimating = true;
      this._animation = window.setInterval(
        this._nextFrame.bind(this),
        duration
      );
    };

    _nextFrame = () => {
      const {domain} = this.props.animation;
      console.log('domain', domain[0], domain[1]);
      this._currentStep > domain[1] - domain[0] - 1
        ? 0
        : (this._currentStep += 3);
      this.onSlider1Change(this._currentStep);
    };

    _pauseAnimation = () => {
      if (this._animation) {
        window.clearInterval(this._animation);
        this._animation = null;
        this._isAnimating = false;
      }
      this.setState({isAnimating: false});
    };

    render() {
      const {animation, width, sliderHandleWidth, onChange} = this.props;
      const {currentTime, domain} = animation;
      // const plotWidth =  width - sliderHandleWidth;
      const timeFormat = this.titleFormatter(this.props);

      // console.log(
      //   'getTimeAnimationDomain',
      //   getTimeAnimationDomain(this.props.datasets)
      // );

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
                showValues={true}
                isRanged={false}
                minValue={domain[0]}
                maxValue={domain[1]}
                value1={currentTime}
                onSlider1Change={this.onSlider1Change}
              />
            </SliderWrapper>
            <TimeDisplay>
              {isUnixTs ? (
                <span>{moment(currentTime, 'X').format('MM-DD hh:mm:ss')}</span>
              ) : (
                <span>{moment.utc(currentTime).format('MM-DD hh:mm:ss')}</span>
              )}
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

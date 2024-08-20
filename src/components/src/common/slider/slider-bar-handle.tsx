// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, RefObject} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import MouseEventHandler from './mouse-event';
import {StyleRangeSliderType} from './slider';

interface StyledSliderProps {
  active?: boolean;
  vertical?: boolean;
}

const StyledSlider = styled.div<StyledSliderProps>`
  position: relative;
  background-color: ${props =>
    props.active ? props.theme.sliderBarHoverColor : props.theme.sliderBarColor};
  ${props => `${props.vertical ? 'width' : 'height'}: ${props.theme.sliderBarHeight}px`};
  border-radius: ${props => props.theme.sliderBarRadius};
  :hover {
    cursor: pointer;
  }
`;

function nope() {
  return;
}

type SliderBarHandleProps = {
  width: number;
  v0Left: number;
  sliderBarListener: (distance: number) => void;
  enableBarDrag: boolean;
  vertical: boolean;
  track: RefObject<StyleRangeSliderType>;
  setAnchor: (distance: number) => void;
};

export default class SliderBarHandle extends Component {
  static defaultProps = {
    sliderBarListener: nope,
    enableBarDrag: false,
    vertical: false
  };

  public mouseEvent: MouseEventHandler;

  constructor(public props: SliderBarHandleProps) {
    super(props);
    this.mouseEvent = new MouseEventHandler({
      vertical: props.vertical,
      valueListener: props.sliderBarListener,
      toggleMouseOver: this.toggleMouseOver,
      track: props.track,
      setAnchor: props.setAnchor
    });
  }

  state = {mouseOver: false};

  toggleMouseOver = () => {
    this.setState({mouseOver: !this.state.mouseOver});
  };

  render() {
    const {width, v0Left} = this.props;

    const style = this.props.vertical
      ? {
          height: `${width}%`,
          bottom: `${-100 + width + v0Left}%`
        }
      : {
          width: `${width}%`,
          left: `${v0Left}%`
        };

    return (
      <StyledSlider
        active={this.state.mouseOver}
        className={classnames('kg-range-slider__bar', {
          'kg-range-slider__bar--active': this.state.mouseOver
        })}
        style={style}
        onMouseDown={this.props.enableBarDrag ? this.mouseEvent.handleMouseDown : nope}
        onTouchStart={this.props.enableBarDrag ? this.mouseEvent.handleTouchStart : nope}
      />
    );
  }
}

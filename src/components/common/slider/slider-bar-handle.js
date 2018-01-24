import document from 'global/document';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

const propTypes = {
  width: PropTypes.number,
  left: PropTypes.string,
  sliderBarListener: PropTypes.func,
  enableBarDrag: PropTypes.bool
};

const defaultProps = {
  sliderBarListener: function sliderBarListenerTn() {},
  enableBarDrag: false
};

const StyledSlider = styled.div`
  position: relative;
  background-color: ${props =>
    props.active
      ? props.theme.sliderBarHoverColor
      : props.theme.sliderBarColor};
  height: ${props => props.theme.sliderBarHeight};
  border-radius: ${props => props.theme.sliderBarRadius};

  :hover {
    cursor: pointer;
  }
`;
/**
 *
 * props:
 *  width : default 23
 *  height : default 23
 *  left
 *  onMove
 *  sliderBarListener
 */
class SliderHandle extends React.Component {
  prevX = 0;
  state = {mouseOver: false};

  handleMouseDown = () => {
    document.addEventListener('mouseup', this.mouseup);
    document.addEventListener('mousemove', this.mousemove);
    this.setState({mouseOver: true});
  };

  mouseup = () => {
    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('mousemove', this.mousemove);
    this.setState({mouseOver: false});
  };

  mousemove = e => {
    e.preventDefault();
    this.props.sliderBarListener(e.movementX);
  };

  handleTouchStart = e => {
    document.addEventListener('touchend', this.touchend);
    document.addEventListener('touchmove', this.touchmove);
    this.prevX = e.touches[0].clientX;
    this.setState({mouseOver: true});
  };

  touchmove = e => {
    const deltaX = e.touches[0].clientX - this.prevX;
    this.prevX = e.touches[0].clientX;
    this.props.sliderBarListener(deltaX);
  };

  touchend = () => {
    document.removeEventListener('touchend', this.touchend);
    document.removeEventListener('touchmove', this.touchmove);
    this.setState({mouseOver: false});
  };

  render() {
    return (
      <StyledSlider
        active={this.state.mouseOver}
        className={classnames('range-slider__bar', {
          'range-slider__bar--active': this.state.mouseOver
        })}
        style={{
          width: `${this.props.width}%`,
          left: `${this.props.length}%`
        }}
        onMouseDown={this.props.enableBarDrag && this.handleMouseDown}
        onTouchStart={this.props.enableBarDrag && this.handleTouchStart}
      />
    );
  }
}

SliderHandle.propTypes = propTypes;
SliderHandle.defaultProps = defaultProps;

export default SliderHandle;

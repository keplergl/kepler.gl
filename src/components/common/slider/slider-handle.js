import document from 'global/document';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  left: PropTypes.string,
  display: PropTypes.bool,
  valueListener: PropTypes.func
};

const defaultProps = {
  left: '50%',
  display: true,
  valueListener: function valueListenerFn() {}
};

const StyledSliderHandle = styled.span`
  position: absolute;
  z-index: 10;
  display: ${props => (props.hidden ? 'none' : 'block')};
  margin-top: -4px;
  height: ${props =>
    Number.isFinite(props.sliderHandleWidth)
      ? `${props.sliderHandleWidth}px`
      : props.theme.sliderHandleHeight};
  width: ${props =>
    Number.isFinite(props.sliderHandleWidth)
      ? `${props.sliderHandleWidth}px`
      : props.theme.sliderHandleHeight};
  box-shadow: ${props => props.theme.sliderHandleShadow};
  background-color: ${props => props.theme.sliderHandleColor};
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.active
      ? props.theme.selectBorderColor
      : props.theme.sliderHandleColor};

  :hover {
    background-color: ${props => props.theme.sliderHandleHoverColor};
    cursor: pointer;
  }
`;

/**
 *
 * props:
 *  width : default 23
 *  height : default 23
 *  display
 *  left
 *  onMove
 *  valueListener
 */
class SliderHandle extends React.Component {
  state = {mouseOver: false};
  prevX = 0;

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
    this.props.valueListener(e.movementX);
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
    this.props.valueListener(deltaX);
  };

  touchend = () => {
    document.removeEventListener('touchend', this.touchend);
    document.removeEventListener('touchmove', this.touchmove);
    this.setState({mouseOver: false});
  };

  render() {
    return (
      <StyledSliderHandle
        className={classnames('range-slider__handle', {
          'range-slider__handle--active': this.state.mouseOver
        })}
        sliderHandleWidth={this.props.sliderHandleWidth}
        active={this.state.mouseOver}
        hidden={!this.props.display}
        style={{left: this.props.left}}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}
      />
    );
  }
}

SliderHandle.defaultProps = defaultProps;
SliderHandle.propTypes = propTypes;

export default SliderHandle;

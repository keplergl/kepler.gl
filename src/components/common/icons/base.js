import React from 'react';
import PropTypes from 'prop-types';

const Base = React.createClass({
  displayName: 'Base Icon',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    /** Set the width of the icon, ex. '16px' */
    width: PropTypes.string,
    /** Set the viewbox of the svg */
    viewBox: PropTypes.string,
    /** Path element */
    children: React.PropTypes.node,
    predefinedClassName: PropTypes.string,
    className: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      width: null,
      viewBox: '0 0 64 64',
      predefinedClassName: '',
      className: ''
    };
  },
  render() {
    const {
      height,
      width,
      viewBox,
      style = {},
      children,
      predefinedClassName,
      className,
      ...props
    } = this.props;
    const svgHeight = height;
    const svgWidth = width || svgHeight;
    /* 'currentColor' will inherit the color of the parent element */
    style.fill = 'currentColor';
    return (
      <svg
        viewBox={viewBox}
        width={svgWidth}
        height={svgHeight}
        style={style}
        className={`${predefinedClassName} ${className}`}
        {...props}
      >
        {children}
      </svg>
    );
  }
});

export default Base;

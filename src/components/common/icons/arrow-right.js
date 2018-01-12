import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const ArrowRight = React.createClass({
  displayName: 'ArrowRight',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-arrowright'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M26.7,54.7l-4.5-4.4c-0.4-0.4-0.4-1,0-1.4L38.6,33L22.2,17c-0.4-0.4-0.4-1,0-1.5l4.5-4.4c0.4-0.4,1.1-0.4,1.5,0
	l17.1,16.7l4.5,4.4c0.4,0.4,0.4,1,0,1.4L45.2,38L28.2,54.7C27.8,55.1,27.1,55.1,26.7,54.7"/>
      </Base>
    );
  }
});

export default ArrowRight;

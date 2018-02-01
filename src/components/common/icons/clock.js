import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const Clock = React.createClass({
  displayName: 'Clock',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-clock'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M41.68,41.16l-11.36-5a3,3,0,0,1-1.74-3L29.86,19h3l1.48,13.29,8.86,5.91Z" />
        <path d="M32.21,11.7A20.06,20.06,0,1,1,12.15,31.77,20.09,20.09,0,0,1,32.21,11.7m0-3.65A23.71,23.71,0,1,0,55.92,31.77,23.71,23.71,0,0,0,32.21,8.06Z" />
      </Base>
    );
  }
});

export default Clock;

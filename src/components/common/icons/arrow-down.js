import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const ArrowDown = React.createClass({
  displayName: 'ArrowDown',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-arrowdown'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M53,26.21l-4.2-4.3a1,1,0,0,0-1.4,0L32,37.67,16.61,21.92a1,1,0,0,0-1.4,0L11,26.21a1,1,0,0,0,0,1.43L27.1,44.11l4.2,4.3a1,1,0,0,0,1.4,0l4.2-4.3L53,27.65a1,1,0,0,0,0-1.43"/>
      </Base>
    );
  }
});

export default ArrowDown;

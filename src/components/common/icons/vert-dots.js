import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const VertDots = React.createClass({
  displayName: 'VertDot',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-vertdot'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <rect x="35.01" y="48.31" width="6.44" height="6.44"/>
        <rect x="35.01" y="35.43" width="6.44" height="6.44"/>
        <rect x="35.01" y="22.55" width="6.44" height="6.44"/>
        <rect x="35.01" y="9.67" width="6.44" height="6.44"/>
        <rect x="22.13" y="48.31" width="6.44" height="6.44"/>
        <rect x="22.13" y="35.43" width="6.44" height="6.44"/>
        <rect x="22.13" y="22.55" width="6.44" height="6.44"/>
        <rect x="22.13" y="9.67" width="6.44" height="6.44"/>
      </Base>
    );
  }
});

export default VertDots;

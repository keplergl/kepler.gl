import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const ArrowLeft = React.createClass({
  displayName: 'ArrowLeft',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-arrowleft'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
      </Base>
    );
  }
});

export default ArrowLeft;

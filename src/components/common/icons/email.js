import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const Email = React.createClass({
  displayName: 'Email',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      size: 'tiny',
      predefinedClassName: 'data-ex-icons-email'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M23.85,23a1,1,0,0,1,.38.08,1,1,0,0,0-.76,0A1,1,0,0,1,23.85,23Z" />
        <path d="M8.35,24.41V47.18a3.37,3.37,0,0,0,3.37,3.37H52.2a3.37,3.37,0,0,0,3.37-3.37V24.41L32,37.9Z" />
        <path d="M55.57,16.82a3.37,3.37,0,0,0-3.37-3.37H11.72a3.37,3.37,0,0,0-3.37,3.37L32,30.31Z" />
      </Base>
    );
  }
});

// this export method must be used for generated documentation to work
export default Email;

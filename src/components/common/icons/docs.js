import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const Docs = React.createClass({
  displayName: 'Docs',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-docs'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M23.62,23.41a1,1,0,0,1,.39.08,1,1,0,0,0-.78,0A1,1,0,0,1,23.62,23.41Z" />
        <path d="M32,57.5A24.83,24.83,0,1,1,56.83,32.67,24.86,24.86,0,0,1,32,57.5Zm0-44.86a20,20,0,1,0,20,20A20,20,0,0,0,32,12.64Z" />
        <rect
          x="28.8"
          y="29.46"
          width="6.41"
          height="16.02"
          rx="1.6"
          ry="1.6"
        />
        <rect x="28.8" y="19.85" width="6.41" height="6.41" rx="1.6" ry="1.6" />
      </Base>
    );
  }
});

export default Docs;

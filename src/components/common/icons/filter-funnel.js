import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const FilterFunnel = React.createClass({
  displayName: 'FilterFunnel',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-filterfunnel'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M52.5,19.67l-16,20h0a6.24,6.24,0,0,0-1.37,3.9V57L30.6,54.74a3.12,3.12,0,0,1-1.73-2.79V43.58h0a6.24,6.24,0,0,0-1.37-3.9l-16-20a5,5,0,0,1-1.35-3.24c0-5.17,9.78-9.36,21.85-9.36s21.85,4.19,21.85,9.36A5,5,0,0,1,52.5,19.67Zm-20.5,3c8.62,0,15.61-2.79,15.61-6.24s-7-6.24-15.61-6.24S16.39,13,16.39,16.43,23.38,22.67,32,22.67Z" />
      </Base>
    );
  }
});

// this export method must be used for generated documentation to work
export default FilterFunnel;

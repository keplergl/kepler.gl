import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const Search = React.createClass({
  displayName: 'Search',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-search'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M56.74,53.21l-3.53,3.53a1.67,1.67,0,0,1-2.35,0L40.21,46.09A24.32,24.32,0,0,0,46.1,40.2L56.74,50.85A1.66,1.66,0,0,1,56.74,53.21Z"/>
        <path d="M26.22,6.78A19.46,19.46,0,1,0,42.6,36.7a19.18,19.18,0,0,0,3.08-10.47A19.45,19.45,0,0,0,26.22,6.78ZM11.64,26.22A14.58,14.58,0,1,1,26.22,40.81,14.6,14.6,0,0,1,11.64,26.22Z"/>
      </Base>
    );
  }
});

export default Search;

import React from 'react';
import PropTypes from 'prop-types';
import Base from './base';

const Table = React.createClass({
  displayName: 'Table',
  propTypes: {
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-table'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M56.0384598,50.5v-8.3076935H8.9615383V50.5H56.0384598z M8.9615383,22.8076916h13.8461533V14.5H8.9615383
	V22.8076916z M25.5769234,22.8076916h13.8461533V14.5H25.5769234V22.8076916z M42.1923065,22.8076916h13.8461533V14.5H42.1923065
	V22.8076916z M8.9615383,36.6538467h47.0769196v-8.3076935H8.9615383V36.6538467z" />
      </Base>
    );
  }
});

export default Table;

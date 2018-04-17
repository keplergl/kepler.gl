import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

class LeftArrow extends React.Component {
  static displayName = 'LeftArrow';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-left-arrow'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M39.425 53.21L23.16 36.947l-4.242-4.243a1 1 0 0 1 0-1.414l4.242-4.243 16.264-16.263a1 1 0 0 1 1.414 0l4.242 4.242a1 1 0 0 1 0 1.414L29.525 31.997l15.556 15.556a1 1 0 0 1 0 1.414L40.84 53.21a1 1 0 0 1-1.414 0z"/>
      </Base>
    );
  }
}

export default LeftArrow;

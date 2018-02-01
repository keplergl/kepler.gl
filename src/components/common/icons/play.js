import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

class Play extends React.Component {
  static displayName = 'Play';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: null,
    predefinedClassName: 'data-ex-icons-play'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M15.625 7.434l36.738 23.378a2 2 0 0 1 0 3.375L15.625 57.566c-1.997 1.27-4.61-.164-4.61-2.531V9.965c0-2.368 2.613-3.802 4.61-2.531z"/>
      </Base>
    );
  }
}

export default Play;

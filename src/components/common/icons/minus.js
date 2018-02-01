import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

class Minus extends React.Component {
  static displayName = 'Minus';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: null
  };

  render() {
    return (
      <Base {...this.props}>
        <g><path d="M55 36H9a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h46a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1z"/></g>
      </Base>
    );
  }
}

export default Minus;

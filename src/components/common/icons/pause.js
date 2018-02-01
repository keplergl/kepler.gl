import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

class Pause extends React.Component {
  static displayName = 'Pause';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-pause'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M23.015 56h-9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2zm29-2V10a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v44a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2z"/>
      </Base>
    );
  }
}

export default Pause;

import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

class Pin extends React.Component {
  static displayName = 'Pin';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    size: 'tiny',
    predefinedClassName: 'data-ex-icons-pin'

  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M36 35.476V59a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V35.476C21.103 33.696 16 27.453 16 20c0-8.836 7.163-16 16-16s16 7.164 16 16c0 7.453-5.103 13.697-12 15.476z"/>
      </Base>
    );
  }
}

export default Pin;

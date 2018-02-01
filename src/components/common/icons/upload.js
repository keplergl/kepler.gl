import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

class Upload extends React.Component {
  static displayName = 'Upload';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    predefinedClassName: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-upload'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M52 9v6a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h38a1 1 0 0 1 1 1zm-4 31L34.426 21.336a3 3 0 0 0-4.852 0L16 40h8v16h16V40h8z"/>
      </Base>
    );
  }
}

export default Upload;

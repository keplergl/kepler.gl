import React from 'react';
import PropTypes from 'prop-types'
import Base from './base';

const Cube3D = React.createClass({
  displayName: 'Cube3D',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-cube3d'
    };
  },
  render() {
    return (
      <Base {...this.props}>
        <path d="M29.2,29.57,9.52,40.93V20a2.81,2.81,0,0,1,1.4-2.43L29.2,7.06Z"/>
        <path d="M32.08,34.38l21,10.82L33.4,56.56a2.78,2.78,0,0,1-2.8,0L12.12,45.91Z"/>
        <path d="M54.48,20v19.6L34.8,29.49V7.06L53.09,17.61A2.81,2.81,0,0,1,54.48,20Z"/>
      </Base>
    );
  }
});

export default Cube3D;

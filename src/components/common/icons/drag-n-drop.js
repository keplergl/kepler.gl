import React from 'react';
import PropTypes from 'prop-types'
import Base from './base';


const DragNDrop = React.createClass({
  displayName: 'DragNDrop',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  },
  getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-dragndrop'
    };
  },
  render() {
    return (
      <Base {...this.props}>

    <path d="M53.11,56.13H10.89A3.11,3.11,0,0,1,7.79,53V31.92a1.86,1.86,0,0,1,3.72,0V52.4h41V31.92a1.86,1.86,0,0,1,3.72,0V53A3.11,3.11,0,0,1,53.11,56.13Z"/>
    <path d="M33.86,33l8-8a1.86,1.86,0,1,1,2.63,2.63L33.32,38.82a1.86,1.86,0,0,1-2.63,0L19.51,27.64A1.86,1.86,0,0,1,22.14,25l8,8V11.43a1.86,1.86,0,0,1,3.72,0Z"/>

      </Base>
    );
  }
});

export default DragNDrop;

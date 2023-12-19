// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class Magnify extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-magnify'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.90479 10.5143H2.66669V12.1905C2.66669 12.8217 3.17836 13.3334 3.80955 13.3334H5.48574V14.0953H3.80955C2.75758 14.0953 1.90479 13.2425 1.90479 12.1905V10.5143Z" />
          <path d="M1.90479 9.67621H2.66669V6.32383H1.90479V9.67621Z" />
          <path d="M1.90479 5.48574H2.66669V3.80955C2.66669 3.17836 3.17836 2.66669 3.80955 2.66669H5.48574V1.90479H3.80955C2.75758 1.90479 1.90479 2.75758 1.90479 3.80955V5.48574Z" />
          <path d="M6.32383 1.90479V2.66669H9.67621V1.90479H6.32383Z" />
          <path d="M10.5143 1.90479V2.66669H12.1905C12.8217 2.66669 13.3334 3.17836 13.3334 3.80955V5.48574H14.0953V3.80955C14.0953 2.75758 13.2425 1.90479 12.1905 1.90479H10.5143Z" />
          <path d="M14.0953 6.32383H13.3334V6.85717H14.0953V6.32383Z" />
          <path d="M6.32383 13.3334H7.23812V14.0953H6.32383V13.3334Z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.4286 6.85718C12.5592 7.98786 12.6772 9.74776 11.7824 11.0097L13.9482 13.1755L13.4094 13.7143L11.2712 11.576C10.0014 12.6889 8.06829 12.6398 6.85714 11.4286C5.59478 10.1662 5.59478 8.11954 6.85714 6.85718C8.1195 5.59482 10.1662 5.59482 11.4286 6.85718ZM10.8898 10.8899C11.8546 9.92503 11.8546 8.36075 10.8898 7.39593C9.92498 6.43111 8.3607 6.43111 7.39588 7.39593C6.43107 8.36075 6.43107 9.92503 7.39588 10.8899C8.3607 11.8547 9.92498 11.8547 10.8898 10.8899Z"
          />
        </svg>
      </Base>
    );
  }
}

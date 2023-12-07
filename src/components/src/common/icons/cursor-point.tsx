// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base, {BaseProps} from './base';

export default class CursorPoint extends Component<Partial<BaseProps>> {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-cursorpoint'
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="scale(4, 4)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.11516 0.69784C0.869317 0.556367 0.562398 0.57724 0.337968 0.750693C0.113538 0.924147 0.0159658 1.21589 0.0908917 1.48946L3.32832 13.31C3.40524 13.5909 3.648 13.7948 3.93792 13.8221C4.22784 13.8493 4.50435 13.6943 4.63228 13.4327L6.3441 9.93235L9.41359 13.9039C9.65 14.2098 10.0896 14.2661 10.3955 14.0297C10.7014 13.7933 10.7577 13.3537 10.5213 13.0478L7.35388 8.94949L11.5277 8.10342C11.8131 8.04556 12.0329 7.81707 12.0796 7.52964C12.1263 7.24222 11.9902 6.95589 11.7378 6.81065L1.11516 0.69784ZM4.18896 11.1525L1.89017 2.75907L9.43295 7.09958L6.15023 7.76501C5.93703 7.80823 5.75604 7.94811 5.66047 8.14353L4.18896 11.1525Z"
            fill="#54638C"
          />
        </g>
      </Base>
    );
  }
}

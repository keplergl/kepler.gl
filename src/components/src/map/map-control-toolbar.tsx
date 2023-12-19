// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled from 'styled-components';
import VerticalToolbar from '../common/vertical-toolbar';

function MapControlToolbar() {
  const StyledToolbar = styled(VerticalToolbar)`
    position: absolute;
    right: 32px;
    transform: translateX(calc(-50% + 45px));

    .toolbar-item {
      width: 120px;
      padding: 13px 16px;
      flex-direction: row;
      justify-content: flex-start;

      .toolbar-item__svg-container {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }

      .toolbar-item__title {
        margin-left: auto;
        margin-right: auto;
      }
    }
  `;

  return StyledToolbar;
}

export default MapControlToolbar;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled from 'styled-components';

export const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;

  thead {
    tr th {
      background: ${props => props.theme.panelBackgroundLT};
      color: ${props => props.theme.titleColorLT};
      padding: 18px 12px;
      text-align: start;
    }
  }

  tbody {
    tr td {
      border-bottom: ${props => props.theme.panelBorderLT};
      padding: 12px;
    }
  }
`;

export default StyledTable;

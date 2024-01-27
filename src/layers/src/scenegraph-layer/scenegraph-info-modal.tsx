// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

export const Table = styled.table`
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

const StyledTitle = styled.div`
  font-size: 20px;
  letter-spacing: 1.25px;
  margin: 18px 0 14px 0;
  color: ${props => props.theme.titleColorLT};
`;

const ExampleTable = () => (
  <Table className="scenegraph-example-table">
    <thead>
      <tr>
        <th>point_lat</th>
        <th>point_lng</th>
        <th>alt</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>37.769897</td>
        <td>-122.41168</td>
        <td>0</td>
      </tr>
      <tr>
        <td>37.806928</td>
        <td>-122.40218</td>
        <td>0</td>
      </tr>
      <tr>
        <td>37.778564</td>
        <td>-122.39096</td>
        <td>1000</td>
      </tr>
      <tr>
        <td>37.745995</td>
        <td>-122.30220</td>
        <td>2000</td>
      </tr>
      <tr>
        <td>37.329841</td>
        <td>-122.103847</td>
        <td>3000</td>
      </tr>
    </tbody>
  </Table>
);

const ScenegraphInfoModalFactory = () => {
  const ScenegraphInfoModal = () => (
    <div className="scenegraph-info-modal">
      <div className="scenegraph-info-modal__description">
        <span>
          In your csv you can specify points with optional altitude. The models will show at each
          point you specify. You can use a sample model or upload one in{' '}
        </span>
        <code>glTF (GLB or Embedded)</code>
        <span> format.</span>
      </div>
      <div className="scenegraph-info-modal__example">
        <StyledTitle>Example:</StyledTitle>
        <ExampleTable />
      </div>
      <div className="scenegraph-info-modal__icons">
        <StyledTitle>Sample Models</StyledTitle>
        <div>Duck</div>
        <div>Use your own model</div>
      </div>
    </div>
  );

  return ScenegraphInfoModal;
};

export default ScenegraphInfoModalFactory;

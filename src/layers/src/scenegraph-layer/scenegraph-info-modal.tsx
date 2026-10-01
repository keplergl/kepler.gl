// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import Table from '../example-table';

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
          In your csv you can specify points with optional altitude. A model is placed at each
          point. Pick one from the gallery, or provide a URL to a{' '}
        </span>
        <code>glTF (GLB or Embedded)</code>
        <span> file.</span>
      </div>
      <div className="scenegraph-info-modal__example">
        <StyledTitle>Example:</StyledTitle>
        <ExampleTable />
      </div>
      <div className="scenegraph-info-modal__icons">
        <StyledTitle>Models</StyledTitle>
        <div>Airplane, car, ship, and the rest of the gallery</div>
        <div>Ducky</div>
        <div>Custom model URL</div>
      </div>
    </div>
  );

  return ScenegraphInfoModal;
};

export default ScenegraphInfoModalFactory;

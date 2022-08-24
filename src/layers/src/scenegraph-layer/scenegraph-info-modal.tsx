// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import styled from 'styled-components';
import {StyledTable as Table} from 'components/common/styled-components';

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

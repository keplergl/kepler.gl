// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {CenterFlexbox, DatasetSquare} from './styled-components';
import {RGBColor} from '@kepler.gl/types';

const DatasetName = styled.div.attrs({
  className: 'dataset-name'
})`
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.titleColorLT};
  white-space: nowrap;
`;

interface DatasetLabelType {
  dataset: {
    color: RGBColor;
    label: string;
  };
}

const DatasetLabel = ({dataset}: DatasetLabelType) => (
  <CenterFlexbox>
    <DatasetSquare className="dataset-color" backgroundColor={dataset.color} />
    <DatasetName>{dataset.label}</DatasetName>
  </CenterFlexbox>
);

export default DatasetLabel;

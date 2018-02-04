import React from 'react';
import styled from 'styled-components';
import {CenterFlexbox, DatasetSquare} from 'components/common/styled-components';

const DatasetName = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.titleColorLT};
`;

const DatasetLabel = ({dataset}) => (
  <CenterFlexbox>
    <DatasetSquare className="dataset-clolor" color={dataset.color} />
    <DatasetName className="dataset-name">{dataset.label}</DatasetName>
  </CenterFlexbox>
);

export default DatasetLabel;

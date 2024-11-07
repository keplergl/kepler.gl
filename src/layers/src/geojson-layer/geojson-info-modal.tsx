// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import {useIntl} from 'react-intl';

import {FormattedMessage} from '@kepler.gl/localization';

import Table from '../table';

const InfoModal = styled.div`
  font-size: 13px;
  color: ${props => props.theme.titleColorLT};

  pre {
    padding: 12px;
    background-color: #f8f8f9;
  }
`;

const StyledTitle = styled.div`
  font-size: 20px;
  letter-spacing: 1.25px;
  margin: 18px 0 14px 0;
  color: ${props => props.theme.titleColorLT};
`;

const StyledCode = styled.code`
  color: ${props => props.theme.titleColorLT};
`;

const exampleTableHeader = ['id', 'latitude', 'longitude', 'sort by'];
const exampleTabbleRows = [
  ['A', '40.81773', '-74.20986', '0'],
  ['A', '40.81765', '-74.20987', '1'],
  ['A', '40.81746', '-74.20998', '2'],
  ['B', '40.64375', '-74.33242', '0'],
  ['B', '40.64353', '-74.20987', '1'],
  ['B', '40.64222', '-74.33001', '2']
];

const ExampleTable = () => (
  <Table className="geojson-example-table">
    <thead>
      <tr>
        {exampleTableHeader.map(v => (
          <th key={v}>{v}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {exampleTabbleRows.map((row, i) => (
        <tr key={i}>
          {row.map((v, j) => (
            <td key={j}>
              <StyledCode>{v}</StyledCode>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);

const GeojsonInfoModalFactory = columnMode => {
  const GeojsonInfoModal = () => {
    const intl = useIntl();
    return (
      <InfoModal className="geojson-info-modal">
        <div className="geojson-info-modal__description">
          <ReactMarkdown
            children={intl.formatMessage({
              id:
                columnMode === 'geojson'
                  ? 'modal.polygonInfo.description'
                  : 'modal.polygonInfo.descriptionTable'
            })}
          />
        </div>
        {columnMode === 'table' ? (
          <div className="geojson-info-modal__example">
            <StyledTitle>
              <FormattedMessage id="modal.polygonInfo.exampleTable" />
            </StyledTitle>
            <ExampleTable />
          </div>
        ) : null}
      </InfoModal>
    );
  };
  return GeojsonInfoModal;
};

export default GeojsonInfoModalFactory;

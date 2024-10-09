// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import {useIntl} from 'react-intl';

import {FormattedMessage} from '@kepler.gl/localization';
import {Table} from '@kepler.gl/layers';

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

const codeExampleGeojson = `
${'```json'}
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { 
        "vendor":  "A",
        "vol":20
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-74.20986, 40.81773, 0, 1564184363],
          [-74.20987, 40.81765, 0, 1564184396],
          [-74.20998, 40.81746, 0, 1564184409]
        ]
      }
    }
  ]
}
${'```'}
`;

const exampleTableHeader = ['id', 'latitude', 'longitude', 'timestamp'];
const exampleTabbleRows = [
  ['A', '40.81773', '-74.20986', '1564184363'],
  ['A', '40.81765', '-74.20987', '1564184396'],
  ['A', '40.81746', '-74.20998', '1564184409'],
  ['B', '40.64375', '-74.33242', '1565578213'],
  ['B', '40.64353', '-74.20987', '1565578217'],
  ['B', '40.64222', '-74.33001', '1565578243']
];

const ExampleTable = () => (
  <Table className="trip-example-table">
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

const TripInfoModalFactory = columnMode => {
  const TripInfoModal = () => {
    const intl = useIntl();
    return (
      <InfoModal className="trip-info-modal">
        <div className="trip-info-modal__description">
          <ReactMarkdown
            children={intl.formatMessage({
              id:
                columnMode === 'geojson'
                  ? 'modal.tripInfo.description1'
                  : 'modal.tripInfo.descriptionTable1'
            })}
          />
        </div>
        <div className="trip-info-modal__example">
          <StyledTitle>
            <FormattedMessage
              id={
                columnMode === 'geojson' ? 'modal.tripInfo.example' : 'modal.tripInfo.exampleTable'
              }
            />
          </StyledTitle>
          {columnMode === 'geojson' ? (
            <ReactMarkdown children={codeExampleGeojson} />
          ) : (
            <ExampleTable />
          )}
        </div>
      </InfoModal>
    );
  };
  return TripInfoModal;
};

export default TripInfoModalFactory;

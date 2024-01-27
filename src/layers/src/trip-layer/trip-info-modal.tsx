// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

const StyledCode = styled.code`
  color: ${props => props.theme.titleColorLT};
`;

const StyledTitle = styled.div`
  font-size: 20px;
  letter-spacing: 1.25px;
  margin: 18px 0 14px 0;
  color: ${props => props.theme.titleColorLT};
`;

const TripInfoModalFactory = (svgIcons = []) => {
  const TripInfoModal = () => (
    <div className="trip-info-modal">
      <div className="trip-info-modal__description">
        <p>
          <FormattedMessage id={'modal.tripInfo.description1'} />
          <code>
            <FormattedMessage id={'modal.tripInfo.code'} />
          </code>
          <FormattedMessage id={'modal.tripInfo.description2'} />
        </p>
      </div>
      <div className="trip-info-modal__example">
        <StyledTitle>
          <FormattedMessage id={'modal.tripInfo.example'} />
        </StyledTitle>
        <pre>
          <StyledCode>
            {`
              {
                "type": "FeatureCollection",
                "features": [
                  {
                    "type": "Feature",
                    "properties": { "vendor":  "A",
                    "vol":20},
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
            `}
          </StyledCode>
        </pre>
      </div>
    </div>
  );
  return TripInfoModal;
};

export default TripInfoModalFactory;

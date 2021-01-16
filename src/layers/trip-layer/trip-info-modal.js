// Copyright (c) 2021 Uber Technologies, Inc.
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
import {FormattedMessage} from 'localization';

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

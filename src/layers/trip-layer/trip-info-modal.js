// Copyright (c) 2019 Uber Technologies, Inc.
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
          In order to animate the path, the geoJSON data needs to contain
          `LineString` in its feature geometry, and the coordinates in the LineString
          need to have 4 elements in the formats of
          <code> [longitude, latitude, altitude, timestamp] </code>
          with the last element being a timestamp. Valid timestamp formats include
          unix in seconds such as `1564184363` or in milliseconds such as
          `1564184363000`.
        </p>
      </div>
      <div className="trip-info-modal__example">
        <StyledTitle>Example:</StyledTitle>
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

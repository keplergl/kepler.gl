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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';
import {format} from 'd3-format';

const numFormat = format(',');

const propTypes = {
  sampleData: PropTypes.object.isRequired,
  onLoadSample: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired
};

const StyledSampleGallery = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledSampleMap = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.textColorLT};
  line-height: 22px;
  width: 30%;
  max-width: 480px;
  margin-bottom: 50px;

  .sample-map__image {
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
    opacity: 0.9;
    transition: opacity 0.4s ease;
    position: relative;
    line-height: 0;

    img {
      max-width: 100%;
    }
    :hover {
      cursor: pointer;
      opacity: 1;
    }
  }

  .sample-map__size {
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
  }

  :hover {
    .sample-map__image__caption {
      opacity: 0.8;
      transition: opacity 0.4s ease;
    }
  }
`;

const BackLink = styled.div`
  display: flex;
  font-size: 14px;
  align-items: center;
  color: ${props => props.theme.titleColorLT};
  cursor: pointer;
  margin-bottom: 40px;

  :hover {
    font-weight: 500;
  }

  span {
    white-space: nowrap;
  }
  svg {
    margin-right: 10px;
  }
`;

const StyledImageCaption = styled.div`
  color: ${props => props.theme.labelColorLT};
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  margin-top: 10px;
  opacity: 0;
`;

const StyledError = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 16px;
`;

const SampleMap = ({sample, onClick}) => (
  <StyledSampleMap className="sample-map-gallery__item">
    <div className="sample-map">
      <div className="sample-map__image" onClick={onClick}>
        {sample.imageUrl && <img src={sample.imageUrl} />}
      </div>
      <div className="sample-map__title">{sample.label}</div>
      <div className="sample-map__size">{`${numFormat(sample.size)} rows`}</div>
      <StyledImageCaption className="sample-map__image__caption">
        {sample.description}
      </StyledImageCaption>
    </div>
  </StyledSampleMap>
);

const SampleMapGallery = ({sampleData, sampleMaps, onLoadSample, back, error}) => (
  <div className="sample-data-modal">
    <BackLink onClick={back}>
      <Icons.LeftArrow height="12px" />
      <span>Back</span>
    </BackLink>
    {error && (
      <StyledError>
        {error.message}
      </StyledError>
    )}
    <StyledSampleGallery className="sample-map-gallery">
      {sampleMaps.filter(sp => sp.visible).map(sp => (
        <SampleMap
          sample={sp}
          key={sp.id}
          onClick={() => onLoadSample(sp)}
        />
      ))}
    </StyledSampleGallery>
  </div>
);

SampleMapGallery.propTypes = propTypes;

export default SampleMapGallery;

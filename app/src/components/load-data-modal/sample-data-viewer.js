// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {format} from 'd3-format';
import {LoadingDialog} from '@kepler.gl/components';
import {FormattedMessage} from 'react-intl';

const numFormat = format(',');

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

const SampleMap = ({id, sample, onClick}) => (
  <StyledSampleMap id={id} className="sample-map-gallery__item">
    <div className="sample-map">
      <div className="sample-map__image" onClick={onClick}>
        {sample.imageUrl && <img src={sample.imageUrl} />}
      </div>
      <div className="sample-map__title">{sample.label}</div>
      <div className="sample-map__size">
        <FormattedMessage
          id={'sampleDataViewer.rowCount'}
          values={{rowCount: numFormat(sample.size)}}
        />
      </div>
      <StyledImageCaption className="sample-map__image__caption">
        {sample.description}
      </StyledImageCaption>
    </div>
  </StyledSampleMap>
);

const SampleMapGallery = ({
  sampleMaps,
  onLoadSample,
  error,
  isMapLoading,
  locale,
  loadSampleConfigurations
}) => {
  useEffect(() => {
    if (!sampleMaps.length) {
      loadSampleConfigurations();
    }
  }, [sampleMaps, loadSampleConfigurations]);

  return (
    <div className="sample-data-modal">
      {error ? (
        <StyledError>{error.message}</StyledError>
      ) : isMapLoading ? (
        <LoadingDialog size={64} />
      ) : (
        <StyledSampleGallery className="sample-map-gallery">
          {sampleMaps
            .filter(sp => sp.visible)
            .map(sp => (
              <SampleMap
                id={sp.id}
                sample={sp}
                key={sp.id}
                onClick={() => onLoadSample(sp)}
                locale={locale}
              />
            ))}
        </StyledSampleGallery>
      )}
    </div>
  );
};

SampleMapGallery.propTypes = {
  sampleMaps: PropTypes.arrayOf(PropTypes.object),
  onLoadSample: PropTypes.func.isRequired,
  loadSampleConfigurations: PropTypes.func.isRequired,
  error: PropTypes.object
};

export default SampleMapGallery;

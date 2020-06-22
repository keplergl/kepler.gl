// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {format} from 'd3-format';
import {LoadingDialog} from 'kepler.gl/components';
import {FormattedMessage, IntlProvider} from 'react-intl';
import {messages} from '../../constants/localization';

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

const SampleMap = ({id, sample, onClick, locale}) => (
  <StyledSampleMap id={id} className="sample-map-gallery__item">
    <IntlProvider locale={locale} messages={messages[locale]}>
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
    </IntlProvider>
  </StyledSampleMap>
);

export default class SampleMapGallery extends Component {
  static propTypes = {
    sampleMaps: PropTypes.arrayOf(PropTypes.object),
    onLoadSample: PropTypes.func.isRequired,
    loadSampleConfigurations: PropTypes.func.isRequired,
    error: PropTypes.object
  };
  componentDidMount() {
    if (!this.props.sampleMaps.length) {
      this.props.loadSampleConfigurations();
    }
  }

  render() {
    const {sampleMaps, onLoadSample, error, isMapLoading, locale} = this.props;
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
  }
}

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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import {LeftArrow} from 'components/common/icons';
import {FormattedMessage} from 'localization';

const imageH = 108;

const propTypes = {
  onLoadAsset: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired
};

const StyledAssetGallery = styled.div.attrs({
  className: 'storage-asset-gallery'
})`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const StyledAssetItem = styled.div.attrs({
  className: 'asset__item'
})`
  width: 23%;
  margin-right: 2%;
  max-width: 500px;
  margin-bottom: 40px;
  height: 245px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  :last {
    margin-right: 0;
  }

  .asset__title {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.textColorLT};
    line-height: 18px;
    height: 32px;
  }

  .asset__image {
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
    opacity: 0.9;
    transition: opacity 0.4s ease;
    position: relative;
    line-height: 0;
    height: ${imageH}px;
    flex-shrink: 0;

    img {
      max-width: 100%;
    }
    :hover {
      cursor: pointer;
      opacity: 1;
    }
  }

  .asset__image__caption {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    margin-top: 10px;
    height: 48px;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .asset__last-updated {
    font-size: 11px;
    color: ${props => props.theme.textColorLT};
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

const StyledError = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 16px;
`;

const getDuration = last => moment.duration(new Date().valueOf() - last).humanize();

const AssetItem = ({asset, onClick}) => (
  <StyledAssetItem>
    <div className="asset__image" onClick={onClick}>
      {asset.imageUrl && <img src={asset.imageUrl} />}
    </div>
    <div className="asset__title">{asset.label || asset.title}</div>
    <div className="asset__image__caption">{asset.description}</div>
    {asset.lastUpdated ? (
      <div className="asset__last-updated">
        <FormattedMessage
          id={'modal.storageMapViewer.lastModified'}
          values={{lastUpdated: getDuration(asset.lastUpdated)}}
        />
      </div>
    ) : null}
  </StyledAssetItem>
);

class StorageAssetsViewer extends React.Component {
  static propTypes = propTypes;

  render() {
    const {assets, onLoadAsset, back, error} = this.props;

    return (
      <div className="storage-asset-viewer">
        <BackLink onClick={back}>
          <LeftArrow height="12px" />
          <span>
            <FormattedMessage id={'modal.storageMapViewer.back'} />
          </span>
        </BackLink>
        {error && <StyledError>{error.message}</StyledError>}
        <StyledAssetGallery>
          {assets.map(sp => (
            <AssetItem asset={sp} key={sp.id} onClick={() => onLoadAsset(sp)} />
          ))}
        </StyledAssetGallery>
      </div>
    );
  }
}

export default StorageAssetsViewer;

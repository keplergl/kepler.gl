// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {LeftArrow} from '../common/icons';
import {FormattedMessage} from '@kepler.gl/localization';

const imageH = 108;

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

const getDuration = (last = 0) => moment.duration(new Date().valueOf() - last).humanize();

interface Asset {
  imageUrl?: string;
  label?: string;
  title?: string;
  description?: string;
  lastUpdated?: number;
  id?: string;
}

interface AssetItemProps {
  asset: Asset;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const AssetItem: React.FC<AssetItemProps> = ({asset, onClick}) => (
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

interface StorageAssetsViewerProps {
  assets: Asset[];
  onLoadAsset: (asset: Asset) => void;
  back?: React.MouseEventHandler<HTMLDivElement>;
  error?: {message?: string};
}

class StorageAssetsViewer extends React.Component<StorageAssetsViewerProps> {
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

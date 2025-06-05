// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from './loading-spinner';
import {ExportImage} from '@kepler.gl/types';

const StyledImagePreview = styled.div.attrs({
  className: 'image-preview'
})`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  width: 100%;
  height: 100%;

  .dimension,
  .instruction {
    padding: 8px 0px;
  }

  .preview-image {
    background: #e2e2e2;
    border-radius: 4px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.18);
    width: 100%;
    max-width: 400px;
    position: relative;
    overflow: hidden;
  }

  .preview-image-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: var(--aspect-ratio);
    max-height: 400px;
  }

  .preview-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .preview-image-spinner {
    position: absolute;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
  }

  .preview-image--error {
    font-size: 12px;
    padding: 12px;
    color: ${props => props.theme.errorColor};
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface ImagePreviewProps {
  exportImage?: ExportImage;
  width?: number;
  showDimension?: boolean;
}

/**
 * @param {object} props
 * @param {ExportImage} [props.exportImage]
 * @param {number} [props.width]
 * @param {boolean} [props.showDimension]
 */
const ImagePreview = ({exportImage, showDimension = false}: ImagePreviewProps) => {
  const {
    error,
    imageDataUri,
    processing,
    imageSize: {imageW = 0, imageH = 0} = {}
  } = exportImage || {};

  // Calculate aspect ratio percentage for padding-bottom trick
  const aspectRatio = imageW && imageH ? (imageH / imageW) * 100 : 75; // default to 4:3 if no dimensions

  return (
    <StyledImagePreview style={{'--aspect-ratio': `${aspectRatio}%`} as React.CSSProperties}>
      {showDimension ? (
        <div className="dimension">
          {imageW} pixel x {imageH} pixel
        </div>
      ) : null}
      <div className="preview-image">
        <div className="preview-image-container">
          {processing ? (
            <div className="preview-image-spinner">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="preview-image--error">
              <span>{error.message || 'Generate map image failed!'}</span>
            </div>
          ) : (
            <img className="preview-image-placeholder" src={imageDataUri} alt="Map preview" />
          )}
        </div>
      </div>
    </StyledImagePreview>
  );
};

export default ImagePreview;

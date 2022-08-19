// Copyright (c) 2022 Uber Technologies, Inc.
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
import LoadingSpinner from 'components/common/loading-spinner';
import {ExportImage} from '@kepler.gl/constants';

/** @typedef {import('../../reducers/ui-state-updaters').ExportImage} ExportImage */

const StyledImagePreview = styled.div.attrs({
  className: 'image-preview'
})`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  padding: 30px;

  .dimension,
  .instruction {
    padding: 8px 0px;
  }

  .preview-image {
    background: #e2e2e2;
    border-radius: 4px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.18);
    width: 100%;
    position: relative;
  }

  .preview-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
  }
`;

interface ImagePreviewProps {
  exportImage?: ExportImage;
  width?: number;
  showDimension?: false;
}

/**
 * @param {object} props
 * @param {ExportImage} [props.exportImage]
 * @param {number} [props.width]
 * @param {boolean} [props.showDimension]
 */
const ImagePreview = ({exportImage, width = 400, showDimension = false}: ImagePreviewProps) => {
  const {error, imageDataUri, processing, imageSize: {imageW = 0, imageH = 0} = {}} =
    exportImage || {};

  const imageStyle = {
    width: `${width}px`,
    height: `${(imageH / (imageW || 1)) * width}px`
  };

  return (
    <StyledImagePreview>
      {showDimension ? (
        <div className="dimension">
          {imageW} pixel x {imageH} pixel
        </div>
      ) : null}
      <div className="preview-image" style={imageStyle}>
        {processing ? (
          <div className="preview-image-spinner">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="preview-image--error">
            <span>{error.message || 'Generate map image failed!'}</span>
          </div>
        ) : (
          <img className="preview-image-placeholder" src={imageDataUri} />
        )}
      </div>
    </StyledImagePreview>
  );
};

export default ImagePreview;

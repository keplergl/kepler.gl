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

import React, {useEffect} from 'react';
import get from 'lodash.get';

import {MAP_THUMBNAIL_DIMENSION, EXPORT_IMG_RATIOS} from '@kepler.gl/constants';
import {SetExportImageSettingUpdaterAction} from 'actions';
import {Provider} from '@kepler.gl/cloud-providers';

/** @typedef {import('./image-modal-container').ImageModalContainerProps} ImageModalContainerProps */

export type ImageModalContainerProps = {
  cloudProviders?: Provider[];
  currentProvider?: string | null;
  onUpdateImageSetting: (newSetting: SetExportImageSettingUpdaterAction['payload']) => void;
  cleanupExportImage: () => void;
};

/**
 * A wrapper component in modals contain a image preview of the map with cloud providers
 * It sets export image size based on provider thumbnail size
 * @type {React.FunctionComponent<ImageModalContainerProps>}
 */
const ImageModalContainer: React.FC<ImageModalContainerProps> = ({
  onUpdateImageSetting,
  cleanupExportImage,
  cloudProviders,
  currentProvider,
  children
}) => {
  useEffect(() => {
    onUpdateImageSetting({exporting: true});
    return () => {
      cleanupExportImage();
    };
  }, [onUpdateImageSetting, cleanupExportImage]);

  useEffect(() => {
    if (currentProvider && cloudProviders && cloudProviders.length) {
      const provider = cloudProviders.find(p => p.name === currentProvider);

      if (provider && provider.thumbnail) {
        onUpdateImageSetting({
          mapW: get(provider, ['thumbnail', 'width']) || MAP_THUMBNAIL_DIMENSION.width,
          mapH: get(provider, ['thumbnail', 'height']) || MAP_THUMBNAIL_DIMENSION.height,
          ratio: EXPORT_IMG_RATIOS.CUSTOM,
          legend: false
        });
      }
    } else {
      onUpdateImageSetting({
        mapW: MAP_THUMBNAIL_DIMENSION.width,
        mapH: MAP_THUMBNAIL_DIMENSION.height,
        ratio: EXPORT_IMG_RATIOS.CUSTOM,
        legend: false
      });
    }
  }, [currentProvider, cloudProviders, onUpdateImageSetting]);

  return <>{children}</>;
};

ImageModalContainer.defaultProps = {
  cloudProviders: []
};

export default ImageModalContainer;

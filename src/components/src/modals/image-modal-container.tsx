// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import get from 'lodash.get';

import {MAP_THUMBNAIL_DIMENSION, EXPORT_IMG_RATIOS} from '@kepler.gl/constants';
import {SetExportImageSettingUpdaterAction} from '@kepler.gl/actions';
import {Provider} from '@kepler.gl/cloud-providers';

export type ImageModalContainerProps = {
  provider?: Provider | null;
  onUpdateImageSetting: (newSetting: SetExportImageSettingUpdaterAction['payload']) => void;
  cleanupExportImage: () => void;
  children?: React.ReactNode;
};

// TODO: this should be turned into a custom hook
/**
 * A wrapper component in modals contain a image preview of the map with cloud providers
 * It sets export image size based on provider thumbnail size
 * @type {React.FunctionComponent<ImageModalContainerProps>}
 */
const ImageModalContainer: React.FC<ImageModalContainerProps> = ({
  onUpdateImageSetting,
  cleanupExportImage,
  provider,
  children
}) => {
  useEffect(() => {
    onUpdateImageSetting({exporting: true});
    return () => {
      cleanupExportImage();
    };
  }, [onUpdateImageSetting, cleanupExportImage]);

  useEffect(() => {
    if (provider) {
      if (provider.thumbnail) {
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
  }, [provider, onUpdateImageSetting]);

  return <>{children}</>;
};

export default ImageModalContainer;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VERSIONS} from './versions';
import Schema from './schema';

// version v0
export const propertiesV0 = {
  bearing: null,
  dragRotate: null,
  latitude: null,
  longitude: null,
  pitch: null,
  zoom: null
};

export const propertiesV1 = {
  ...propertiesV0,
  isSplit: null,
  isViewportSynced: null,
  isZoomLocked: null,
  splitMapViewports: null
};

const mapStateSchema = {
  [VERSIONS.v0]: new Schema({
    version: VERSIONS.v0,
    properties: propertiesV0,
    key: 'mapState'
  }),
  [VERSIONS.v1]: new Schema({
    version: VERSIONS.v1,
    properties: propertiesV1,
    key: 'mapState'
  })
};

export default mapStateSchema;

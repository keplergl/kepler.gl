// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VERSIONS} from './versions';
import Schema from './schema';

export const propertiesV1 = {
  mapControls: new Schema({
    version: VERSIONS.v1,
    properties: {
      mapLegend: new Schema({
        version: VERSIONS.v1,
        properties: {
          active: null,
          settings: new Schema({
            version: VERSIONS.v1,
            properties: {
              position: null,
              contentHeight: null
            },
            key: 'settings'
          })
        },
        key: 'mapLegend'
      })
    },
    key: 'mapControls'
  })
};

const uiStateSchema = {
  [VERSIONS.v0]: new Schema({
    version: VERSIONS.v0,
    properties: propertiesV1,
    key: 'uiState'
  }),
  [VERSIONS.v1]: new Schema({
    version: VERSIONS.v1,
    properties: propertiesV1,
    key: 'uiState'
  })
};

export default uiStateSchema;

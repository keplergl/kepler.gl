// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VERSIONS} from './versions';
import Schema from './schema';
import {schemaProperties} from './schema-properties';
import {
  UiStateSchema,
  MapControlsSchema,
  MapLegendSchema,
  ChartControlSchema,
  CameraBookmarksControlSchema,
  MapInfoControlSchema,
  PanelSettingsSchema
} from './zod-schemas/ui-state';

export const propertiesV1 = schemaProperties(UiStateSchema, {
  mapControls: new Schema({
    version: VERSIONS.v1,
    key: 'mapControls',
    properties: schemaProperties(MapControlsSchema, {
      mapLegend: new Schema({
        version: VERSIONS.v1,
        key: 'mapLegend',
        properties: schemaProperties(MapLegendSchema, {
          settings: new Schema({
            version: VERSIONS.v1,
            key: 'settings',
            properties: schemaProperties(PanelSettingsSchema)
          })
        })
      }),
      chart: new Schema({
        version: VERSIONS.v1,
        key: 'chart',
        properties: schemaProperties(ChartControlSchema)
      }),
      cameraBookmarks: new Schema({
        version: VERSIONS.v1,
        key: 'cameraBookmarks',
        properties: schemaProperties(CameraBookmarksControlSchema, {
          settings: new Schema({
            version: VERSIONS.v1,
            key: 'settings',
            properties: schemaProperties(PanelSettingsSchema)
          })
        })
      }),
      mapInfo: new Schema({
        version: VERSIONS.v1,
        key: 'mapInfo',
        properties: schemaProperties(MapInfoControlSchema)
      })
    })
  })
});

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

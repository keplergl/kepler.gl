// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VERSIONS} from './versions';
import Schema from './schema';

export const customMapStylePropsV1 = {
  accessToken: null,
  custom: null,
  icon: null,
  id: null,
  label: null,
  url: null
};

export const CustomMapStyleSchema = new Schema({
  version: VERSIONS.v1,
  key: 'customStyle',
  properties: customMapStylePropsV1
});

export class MapStyleSchemaV1 extends Schema {
  version = VERSIONS.v1;
  key = 'mapStyles';
  save(mapStyles) {
    // save all custom styles
    const saveCustomStyle = Object.keys(mapStyles).reduce(
      (accu, key) => ({
        ...accu,
        ...(mapStyles[key].custom
          ? {[key]: CustomMapStyleSchema.save(mapStyles[key]).customStyle}
          : {})
      }),
      {}
    );

    return {[this.key]: saveCustomStyle};
  }

  load(mapStyles) {
    // If mapStyle is an empty object, do not load it
    return typeof mapStyles === 'object' && Object.keys(mapStyles).length
      ? {[this.key]: mapStyles}
      : {};
  }
}

// version v0
export const propertiesV0 = {
  styleType: null,
  topLayerGroups: null,
  visibleLayerGroups: null,
  buildingLayer: null,
  mapStyles: new MapStyleSchemaV1()
};

export const propertiesV1 = {
  styleType: null,
  topLayerGroups: null,
  visibleLayerGroups: null,
  threeDBuildingColor: null,
  backgroundColor: null,
  mapStyles: new MapStyleSchemaV1()
};

const mapStyleSchema = {
  [VERSIONS.v0]: new Schema({
    version: VERSIONS.v0,
    properties: propertiesV0,
    key: 'mapStyle'
  }),
  [VERSIONS.v1]: new Schema({
    version: VERSIONS.v1,
    properties: propertiesV1,
    key: 'mapStyle'
  })
};

export default mapStyleSchema;

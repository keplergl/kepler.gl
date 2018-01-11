import {VERSIONS} from './versions';
import Schema from './schema';

// version v0
export const propertiesV0 = {
  styleType: null,
  topLayerGroups: null,
  visibleLayerGroups: null,
  buildingLayer: null
};

const mapStyleSchema = {
  [VERSIONS.v0]: new Schema({
    version: VERSIONS.v0,
    properties: propertiesV0,
    key: 'mapStyle'
  }),
  [VERSIONS.v1]: new Schema({
    version: VERSIONS.v1,
    properties: propertiesV0,
    key: 'mapStyle'
  })
};

export default mapStyleSchema;

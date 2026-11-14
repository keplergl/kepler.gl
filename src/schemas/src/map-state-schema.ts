// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VERSIONS} from './versions';
import Schema from './schema';
import {schemaProperties} from './schema-properties';
import {MapStateSchema, ViewportSchema} from './zod-schemas/map-state';

// version v0
export const propertiesV0 = schemaProperties(ViewportSchema);

export const propertiesV1 = schemaProperties(MapStateSchema);

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

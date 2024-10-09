// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Schemas
export {
  default,
  default as KeplerGlSchema,
  reducerSchema,
  KeplerGLSchema as KeplerGLSchemaClass
} from './schema-manager';

// eslint-disable-next-line prettier/prettier
export type {
  SavedConfigV1,
  SavedMap,
  LoadedMap,
  SavedMapState
} from './schema-manager';
export {CURRENT_VERSION, VERSIONS} from './versions';
export {
  visStateSchemaV1,
  FilterSchemaV0,
  LayerSchemaV0,
  InteractionSchemaV1,
  DimensionFieldSchema,
  SplitMapsSchema,
  filterPropsV1,
  default as visStateSchema,
  layerPropsV1,
  layerPropsV0,
  effectPropsV1
} from './vis-state-schema';
export type {SavedField, ParsedField, SavedDatasetV1, ParsedDataset} from './dataset-schema';
export {
  default as datasetSchema,
  DatasetSchema,
  fieldPropertiesV1,
  propertiesV1 as datasetPropertiesV1
} from './dataset-schema';
export * from './vis-state-schema';
/** NOTE: `MapStyleSchemaV1` is actually for `mapStyle.mapStyles` (original naming can be unclear) */
export {
  default as mapStyleSchema,
  MapStyleSchemaV1,
  CustomMapStyleSchema
} from './map-style-schema';
export {default as mapStateSchema} from './map-state-schema';
export {default as Schema} from './schema';

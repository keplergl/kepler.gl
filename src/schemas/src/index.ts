// Copyright (c) 2023 Uber Technologies, Inc.
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
  layerPropsV0
} from './vis-state-schema';
export type {
  SavedField,
  ParsedField,
  SavedDatasetV1,
  ParsedDataset
} from './dataset-schema';
export {
  default as datasetSchema,
  DatasetSchema,
  fieldPropertiesV1,
  propertiesV1 as datasetPropertiesV1
} from './dataset-schema';
export * from './vis-state-schema';
/** NOTE: `MapStyleSchemaV1` is actually for `mapStyle.mapStyles` (original naming can be unclear) */
export {default as mapStyleSchema, MapStyleSchemaV1, CustomMapStyleSchema} from './map-style-schema';
export {default as mapStateSchema} from './map-state-schema';
export {default as Schema} from './schema';

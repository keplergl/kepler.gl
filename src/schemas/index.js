// Copyright (c) 2021 Uber Technologies, Inc.
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
export {CURRENT_VERSION, VERSIONS} from './versions';
export {
  visStateSchemaV1,
  FilterSchemaV0,
  LayerSchemaV0,
  InteractionSchemaV1,
  DimensionFieldSchema,
  SplitMapsSchema,
  filterPropsV1,
  default as visStateSchema
} from './vis-state-schema';
export {default as datasetSchema} from './dataset-schema';
export {default as mapStyleSchema} from './map-style-schema';
export {default as mapStateSchema} from './map-state-schema';
export {default as Schema} from './schema';

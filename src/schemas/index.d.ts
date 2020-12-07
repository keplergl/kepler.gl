import {KeplerGLSchema} from './schema-manager';
import Schema from './schema';

export {
  default,
  default as KeplerGlSchema,
  ParsedConfig,
  ParsedDataset,
  ParsedLayer,
  ParsedFilter,
  SavedConfigV1,
  SavedDatasetV1,
  SavedMap,
  reducerSchema
} from './schema-manager';
export {CURRENT_VERSION, VERSIONS} from './versions';

export const KeplerGLSchemaClass: typeof KeplerGLSchema;
export const visStateSchema: {[key: string]: Schema};
export const datasetSchema: {[key: string]: Schema};
export const mapStyleSchema: {[key: string]: Schema};
export const mapStateSchema: {[key: string]: Schema};

export {default as Schema} from './schema';

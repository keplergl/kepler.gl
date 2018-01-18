// Actions
// require('babel-polyfill');
export * from './actions/actions';

// Constants
export {
  DIMENSIONS,
  ALL_FIELD_TYPES
} from './constants/default-settings';

// Processor
export * as Processor from './processor/data-processor';

// File Handlers
export {
  getFileHandler, getFileType
} from './processor/file-handler';

// Schemas
export {default as KeplerGlSchema} from './schemas';
export {CURRENT_VERSION, VERSIONS} from './schemas/versions';

// Reducers
export {default as keplerGlReducer} from './reducers/root';

// Dispatch
export {
  forwardTo,
  getActionForwardAddress,
  wrapTo
} from './actions/action-wrapper';

// Components
export {default as KeplerGl} from './components/container';
export {default as default} from './components/container';

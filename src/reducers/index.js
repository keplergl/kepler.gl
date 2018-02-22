// Root Reducer, used to register, and remove core reducers of each instance
export {default} from './root';
export {default as keplerGlReducer} from './root';

// Core Reducer
export {
  default as keplerGlReducerCore,
  visStateLens,
  mapStateLens,
  uiStateLens,
  mapStyleLens
} from './core';

// Each individual reducer
export {default as visStateReducer} from './vis-state';
export {default as mapStateReducer} from './map-state';
export {default as mapStyleReducer} from './map-style';
export {default as buildingDataReducer} from './building-data';

// reducer updaters
export * as visStateUpdaters from './vis-state-updaters';
export * as mapStateUpdaters from './map-state-updaters';
export * as mapStyleUpdaters from './map-style-updaters';
export * as uiStateUpdaters from './ui-state-updaters';

// reducer merges
export * as visStateMergers from './vis-state-merger';

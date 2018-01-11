import ActionTypes from '../constants/action-types';
import {createAction} from 'redux-actions';

// create actions
const {
  RECEIVE_MAP_CONFIG,
  RESET_MAP_CONFIG,
  INIT
} = ActionTypes;

// kepler.gl actions accessible outside component
export {
  addFilter,
  addLayer,
  enlargeFilter,
  interactionConfigChange,
  layerConfigChange,
  layerTypeChange,
  layerVisConfigChange,
  layerVisualChannelConfigChange,
  loadFiles,
  loadFilesErr,
  onLayerClick,
  onLayerHover,
  onMapClick,
  removeDataset,
  removeFilter,
  removeLayer,
  reorderLayer,
  setFilter,
  setFilterPlot,
  setVisibleLayersForMap,
  showDatasetTable,
  toggleAnimation,
  toggleLayerForMap,
  updateLayerBlending,
  updateVisData
} from './vis-state-actions';

export {
  toggleSidePanel,
  toggleModal,
  openDeleteModal
} from './ui-state-actions';

export {
  togglePerspective,
  fitBounds,
  updateMap,
  toggleSplitMap,
  toggleFullScreen
} from './map-state-actions';

export {
  mapConfigChange,
  loadMapStyles,
  loadMapStyleErr,
  mapStyleChange,
  mapBuildingChange
} from './map-style-actions';

export {
  registerEntry,
  deleteEntry
} from './identity-actions';

export const [
  receiveMapConfig,
  resetMapConfig,
  keplerGlInit
] = [
  RECEIVE_MAP_CONFIG,
  RESET_MAP_CONFIG,
  INIT
].map(a => createAction(a));

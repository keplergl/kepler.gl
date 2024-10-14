// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LoadDataModalFactory, withState} from '@kepler.gl/components';
import {LOADING_METHODS} from '../constants/default-settings';

import SampleMapGallery from '../components/load-data-modal/sample-data-viewer';
import LoadRemoteMap from '../components/load-data-modal/load-remote-map';
import SampleMapsTab from '../components/load-data-modal/sample-maps-tab';
import {loadRemoteMap, loadSample, loadSampleConfigurations} from '../actions';

const CustomLoadDataModalFactory = (...deps) => {
  const LoadDataModal = LoadDataModalFactory(...deps);
  const defaultLoadingMethods = LoadDataModal.defaultLoadingMethods;
  const additionalMethods = {
    remote: {
      id: LOADING_METHODS.remote,
      label: 'modal.loadData.remote',
      elementType: LoadRemoteMap
    },
    sample: {
      id: LOADING_METHODS.sample,
      label: 'modal.loadData.sample',
      elementType: SampleMapGallery,
      tabElementType: SampleMapsTab
    }
  };

  // add more loading methods
  const loadingMethods = [
    defaultLoadingMethods.find(lm => lm.id === 'upload'),
    additionalMethods.remote,
    defaultLoadingMethods.find(lm => lm.id === 'storage'),
    additionalMethods.sample
  ];

  return withState(
    [],
    state => ({...state.demo.app, ...state.demo.keplerGl.map.uiState, loadingMethods}),
    {
      onLoadSample: loadSample,
      onLoadRemoteMap: loadRemoteMap,
      loadSampleConfigurations
    }
  )(LoadDataModal);
};

CustomLoadDataModalFactory.deps = LoadDataModalFactory.deps;

export function replaceLoadDataModal() {
  return [LoadDataModalFactory, CustomLoadDataModalFactory];
}

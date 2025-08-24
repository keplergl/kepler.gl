// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project
import React from 'react';
import {LoadDataModalFactory} from '@kepler.gl/components';
import type {LoadingMethod} from '@kepler.gl/components/src/modals/load-data-modal';
import {LOADING_METHODS} from '../constants/default-settings';

import SampleMapViewer from '../components/load-data-modal/sample-map-viewer';
import LoadRemoteMap from '../components/load-data-modal/load-remote-map';
import SampleMapsTab from '../components/load-data-modal/sample-maps-tab';

type FactoryDeps = Parameters<typeof LoadDataModalFactory>;
type LoadDataModalComponent = ReturnType<typeof LoadDataModalFactory>;

interface AdditionalMethods {
  remote: LoadingMethod;
  sample: LoadingMethod;
}

const CustomLoadDataModalFactory = (
  ...deps: FactoryDeps
): React.FC<Parameters<LoadDataModalComponent>[0]> => {
  const LoadDataModal = LoadDataModalFactory(...deps);
  const defaultLoadingMethods = LoadDataModal.defaultLoadingMethods;

  const additionalMethods: AdditionalMethods = {
    remote: {
      id: LOADING_METHODS.remote,
      label: 'modal.loadData.remote',
      elementType: LoadRemoteMap
    },
    sample: {
      id: LOADING_METHODS.sample,
      label: 'modal.loadData.sample',
      elementType: SampleMapViewer,
      tabElementType: SampleMapsTab
    }
  };

  // add more loading methods
  const loadingMethods: LoadingMethod[] = [
    defaultLoadingMethods?.find(lm => lm.id === 'upload'),
    defaultLoadingMethods?.find(lm => lm.id === 'tileset'),
    additionalMethods.remote,
    defaultLoadingMethods?.find(lm => lm.id === 'storage'),
    additionalMethods.sample
  ].filter((method): method is LoadingMethod => method !== undefined);

  const DemoLoadDataModal: React.FC<Parameters<LoadDataModalComponent>[0]> = props => {
    return <LoadDataModal {...props} loadingMethods={loadingMethods} />;
  };

  return DemoLoadDataModal;
};

CustomLoadDataModalFactory.deps = LoadDataModalFactory.deps;

export function replaceLoadDataModal(): [
  typeof LoadDataModalFactory,
  typeof CustomLoadDataModalFactory
] {
  return [LoadDataModalFactory, CustomLoadDataModalFactory];
}

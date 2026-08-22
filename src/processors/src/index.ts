// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {initApplicationConfig} from '@kepler.gl/utils';

import {loadExternallyHostedDataset} from './remote-file';

export * from './data-processor';
export * from './file-handler';
export * from './remote-file';
export * from './types';

initApplicationConfig({loadExternallyHostedDataset});

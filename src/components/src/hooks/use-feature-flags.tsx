// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useContext} from 'react';
import {FeatureFlagsContext} from '../context';

type FeatureFlags = {
  // Define your feature flags here
  [flagName: string]: boolean;
};

// @ts-expect-error FeatureFlagsContext is typed as object
const useFeatureFlags = () => useContext<FeatureFlags>(FeatureFlagsContext);

export default useFeatureFlags;

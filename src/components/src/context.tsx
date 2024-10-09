// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, RefObject, ReactNode, ReactElement} from 'react';
import {Provider} from '@kepler.gl/cloud-providers';

const identity = state => state;
// New Context API only supported after 16.3
const KeplerGlContext = createContext({
  selector: identity,
  id: 'map'
});

// TODO: breakdown this file into multiple files
export const FeatureFlagsContext = createContext<object | null>({});

export type FeatureFlags = {[key: string]: string | boolean};

export type FeatureFlagsContextProviderProps = {
  children: ReactNode;
  featureFlags?: FeatureFlags;
};

export type CloudProviderContextType = {
  provider: Provider | null;
  setProvider: (provider: Provider | null) => void;
  cloudProviders: Provider[];
};

export const FeatureFlagsContextProvider = (
  props: FeatureFlagsContextProviderProps
): ReactElement => (
  <FeatureFlagsContext.Provider value={props.featureFlags || null}>
    {props.children}
  </FeatureFlagsContext.Provider>
);

/**
 * This provides keeps track of the ist cloud providers
 * and the current selected one
 */
export const CloudProviderContext = createContext<CloudProviderContextType>({
  provider: null,
  setProvider: () => {
    return;
  },
  cloudProviders: []
});

export const RootContext = createContext<RefObject<HTMLDivElement> | null>(null);

export default KeplerGlContext;

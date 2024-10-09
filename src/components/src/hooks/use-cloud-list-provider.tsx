// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren, useCallback, useContext, useMemo, useRef, useState} from 'react';
import {CloudProviderContext} from '../context';
import {Provider} from '@kepler.gl/cloud-providers';

type CloudListProviderProps = PropsWithChildren<{
  providers: Provider[];
}>;

export const CloudListProvider: React.FC<CloudListProviderProps> = ({children, providers = []}) => {
  const [currentCloudProvider, setCurrentCloudProvider] = useState<Provider | null>(null);
  const cloudProviders = useRef(providers);

  const setProvider = useCallback(
    provider => {
      setCurrentCloudProvider(currentCloudProvider === provider ? null : provider);
    },
    [currentCloudProvider]
  );

  const value = useMemo(
    () => ({
      provider: currentCloudProvider,
      setProvider,
      cloudProviders: cloudProviders.current
    }),
    [currentCloudProvider, setProvider]
  );

  return <CloudProviderContext.Provider value={value}>{children}</CloudProviderContext.Provider>;
};

/**
 * this hook provides access the CloudList provider context
 */
export const useCloudListProvider = () => useContext(CloudProviderContext);

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState, useEffect} from 'react';
import {CloudHeader} from './cloud-components/cloud-header';
import {CloudMaps} from './cloud-components/cloud-maps';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {ProviderSelect} from './cloud-components/provider-select';
import {FlexColContainer} from '../common/flex-container';
import {Provider, MapListItem} from '@kepler.gl/cloud-providers';

function LoadStorageMapFactory() {
  const LoadStorageMap = ({onLoadCloudMap}) => {
    const {provider: currentProvider, setProvider, cloudProviders} = useCloudListProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [maps, setMaps] = useState<MapListItem[] | null>(null);
    const [error, setError] = useState(null);

    const setProviderInfo = useCallback((provider: Provider | null) => {
      setMaps(null);
      setError(null);
      if (provider) {
        setIsLoading(true);
        provider
          .listMaps()
          .then(setMaps)
          .catch(setError)
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      setProviderInfo(currentProvider);
    }, [currentProvider, setProviderInfo]);

    const onSelectMap = useCallback(
      (provider, map) => {
        onLoadCloudMap({
          loadParams: map.loadParams,
          provider
        });
      },
      [onLoadCloudMap]
    );

    return (
      <FlexColContainer>
        {!currentProvider ? (
          <ProviderSelect cloudProviders={cloudProviders} />
        ) : (
          <>
            <CloudHeader provider={currentProvider} onBack={() => setProvider(null)} />
            <CloudMaps
              isLoading={isLoading}
              onSelectMap={onSelectMap}
              provider={currentProvider}
              error={error}
              maps={maps}
            />
          </>
        )}
      </FlexColContainer>
    );
  };

  return LoadStorageMap;
}

export default LoadStorageMapFactory;

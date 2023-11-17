// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
    }, [currentProvider]);

    const onSelectMap = useCallback((provider, map) => {
      onLoadCloudMap({
        loadParams: map.loadParams,
        provider
      });
    }, []);

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

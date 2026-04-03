// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

import {validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, TILE3D_PROVIDERS, Tile3DDatasetMetadata} from '@kepler.gl/constants';

import {MetaResponse, DatasetCreationAttributes} from './common';
import {InputLight} from '../../common';

const TilesetInputContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(4, auto);
  row-gap: 18px;
  font-size: 12px;
`;

const TilesetInputDescription = styled.div`
  text-align: center;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;
`;

const ExampleUrlsContainer = styled.div`
  text-align: left;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;

  .example-url {
    margin-top: 8px;
    display: block;
  }
`;

type Tile3DFormProps = {
  setResponse: (response: MetaResponse) => void;
};

function detectProvider(url: string): string | undefined {
  for (const key of Object.keys(TILE3D_PROVIDERS)) {
    if (url.includes(TILE3D_PROVIDERS[key].urlKey)) {
      return key;
    }
  }
  return undefined;
}

function providerNeedsToken(provider?: string): boolean {
  return provider === 'google' || provider === 'cesium';
}

export function getDatasetAttributesFromTile3D({
  name,
  tileUrl,
  accessToken
}: {
  name: string;
  tileUrl: string;
  accessToken?: string;
}): DatasetCreationAttributes {
  return {
    name,
    type: DatasetType.TILE_3D,
    metadata: {
      tile3dUrl: tileUrl,
      tile3dAccessToken: accessToken || undefined,
      tile3dProvider: detectProvider(tileUrl)
    } as Tile3DDatasetMetadata
  };
}

async function fetchTilesetMetadata(
  url: string,
  provider?: string,
  accessToken?: string
): Promise<Record<string, unknown> | null> {
  try {
    const headers: Record<string, string> = {};
    let fetchUrl = url;

    if (provider === 'google' && accessToken) {
      headers['X-GOOG-API-KEY'] = accessToken;
    } else if (provider === 'cesium' && accessToken) {
      const assetId = url.match(/\/(\d+)\/tileset\.json/)?.[1];
      if (assetId) {
        const endpointRes = await fetch(`https://api.cesium.com/v1/assets/${assetId}/endpoint`, {
          headers: {Authorization: `Bearer ${accessToken}`}
        });
        if (endpointRes.ok) {
          const endpoint = await endpointRes.json();
          fetchUrl = endpoint.url;
          if (endpoint.accessToken) {
            headers['Authorization'] = `Bearer ${endpoint.accessToken}`;
          }
        }
      }
    }

    const response = await fetch(fetchUrl, {headers});
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('json') && !url.endsWith('.json')) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

const TilesetTile3DForm: React.FC<Tile3DFormProps> = ({setResponse}) => {
  const [layerName, setLayerName] = useState<string>('');
  const [tileUrl, setTileUrl] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [tilesetMeta, setTilesetMeta] = useState<Record<string, unknown> | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const fetchIdRef = useRef(0);

  const provider = detectProvider(tileUrl);
  const showTokenField = providerNeedsToken(provider);

  const onLayerNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setLayerName(event.target.value);
    },
    [setLayerName]
  );

  const onTileUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const newUrl = event.target.value;
      setTileUrl(newUrl);

      if (!layerName && validateUrl(newUrl)) {
        const detected = detectProvider(newUrl);
        if (detected) {
          setLayerName(TILE3D_PROVIDERS[detected].name);
        } else {
          setLayerName('3D Tileset');
        }
      }
    },
    [layerName]
  );

  const onAccessTokenChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setAccessToken(event.target.value);
    },
    [setAccessToken]
  );

  // Fetch tileset metadata when URL and (if needed) token are available
  useEffect(() => {
    if (!tileUrl || !validateUrl(tileUrl)) {
      setTilesetMeta(null);
      return;
    }

    const needsToken = providerNeedsToken(detectProvider(tileUrl));
    if (needsToken && !accessToken) {
      setTilesetMeta(null);
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    setMetaLoading(true);

    fetchTilesetMetadata(tileUrl, detectProvider(tileUrl), accessToken || undefined).then(meta => {
      if (currentFetchId === fetchIdRef.current) {
        setTilesetMeta(meta);
        setMetaLoading(false);
      }
    });
  }, [tileUrl, accessToken]);

  // Update response whenever form state or metadata changes
  useEffect(() => {
    if (layerName && tileUrl && validateUrl(tileUrl)) {
      const needsToken = providerNeedsToken(detectProvider(tileUrl));
      if (needsToken && !accessToken) {
        setResponse({
          metadata: null,
          dataset: null,
          loading: metaLoading,
          error: new Error('An access token is required for this tileset provider.')
        });
        return;
      }

      const dataset = getDatasetAttributesFromTile3D({
        name: layerName,
        tileUrl,
        accessToken: accessToken || undefined
      });
      setResponse({
        metadata: tilesetMeta as MetaResponse['metadata'],
        dataset,
        loading: metaLoading,
        error: null
      });
    } else {
      setResponse({
        metadata: tilesetMeta as MetaResponse['metadata'],
        dataset: null,
        loading: metaLoading,
        error: null
      });
    }
  }, [setResponse, layerName, tileUrl, accessToken, tilesetMeta, metaLoading]);

  return (
    <TilesetInputContainer>
      <div>
        <label htmlFor="tile3d-layer-name">Name</label>
        <InputLight
          id="tile3d-layer-name"
          placeholder="Name your 3D tileset"
          value={layerName}
          onChange={onLayerNameChange}
        />
      </div>
      <div>
        <label htmlFor="tile3d-url">Tileset URL</label>
        <InputLight
          id="tile3d-url"
          placeholder="Enter 3D Tiles URL (tileset.json)"
          value={tileUrl}
          onChange={onTileUrlChange}
        />
        <TilesetInputDescription>
          URL to a 3D Tiles tileset.json, Google 3D Tiles, or Cesium Ion asset.
        </TilesetInputDescription>
      </div>
      {showTokenField && (
        <div>
          <label htmlFor="tile3d-token">
            Access Token {provider === 'google' ? '(Google API Key)' : '(Cesium Ion Token)'}
          </label>
          <InputLight
            id="tile3d-token"
            placeholder="Enter access token"
            value={accessToken}
            onChange={onAccessTokenChange}
          />
        </div>
      )}
      <div>
        <TilesetInputDescription>Supported 3D tile providers:</TilesetInputDescription>
        <ExampleUrlsContainer>
          <div className="example-url">• Google Photorealistic 3D Tiles (requires API key)</div>
          <div className="example-url">• Cesium Ion (requires access token)</div>
          <div className="example-url">• Any OGC 3D Tiles 1.0/1.1 tileset</div>
        </ExampleUrlsContainer>
      </div>
    </TilesetInputContainer>
  );
};

export default TilesetTile3DForm;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

import {validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, TILE3D_PROVIDERS, Tile3DDatasetMetadata} from '@kepler.gl/constants';
import {getApplicationConfig} from '@kepler.gl/utils';

import {MetaResponse, DatasetCreationAttributes} from './common';
import {InputLight} from '../../common';
import {Help} from '../../common/icons';

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
`;

const ExampleTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
  margin-bottom: 6px;
`;

const ExampleTab = styled.div<{active: boolean}>`
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
  background: ${props => (props.active ? props.theme.AZURE400 : 'transparent')};
  color: ${props => (props.active ? props.theme.WHITE : props.theme.AZURE200)};
  border: 1px solid ${props => (props.active ? props.theme.AZURE400 : props.theme.AZURE400)};

  &:hover {
    background: ${props => (props.active ? props.theme.AZURE400 : props.theme.AZURE500)};
  }
`;

const ExampleUrl = styled.div`
  word-break: break-all;
  cursor: pointer;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;

  &:hover {
    color: ${props => props.theme.AZURE100};
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
`;

const InfoIconLink = styled.a`
  margin-left: 4px;
  color: ${props => props.theme.labelColor};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  line-height: 0;
  vertical-align: middle;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }

  svg {
    display: block;
  }
`;

const TILE3D_DOCUMENTATION_URL =
  'https://docs.kepler.gl/docs/user-guides/c-types-of-layers/p-3d-tile-layer';

const TILE3D_EXAMPLES = [
  {
    label: 'ArcGIS I3S',
    name: 'San Francisco Buildings',
    url: 'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0'
  },
  {
    label: 'OGC 3D Tiles',
    name: 'Royal Exhibition Building',
    url: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/3d-tiles/RoyalExhibitionBuilding/tileset.json'
  },
  {
    label: 'Google 3D Tiles',
    name: 'Google 3D Tiles',
    url: 'https://tile.googleapis.com/v1/3dtiles/root.json'
  },
  {
    label: 'Cesium Ion',
    name: 'Washington DC mesh',
    url: 'https://assets.ion.cesium.com/57588/tileset.json'
  }
];

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

type FetchResult = {ok: true; data: Record<string, unknown>} | {ok: false; error: string};

async function fetchTilesetMetadata(
  url: string,
  provider?: string,
  accessToken?: string
): Promise<FetchResult> {
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
        if (!endpointRes.ok) {
          if (endpointRes.status === 401 || endpointRes.status === 403) {
            return {ok: false, error: 'Invalid or expired Cesium Ion access token.'};
          }
          if (endpointRes.status === 404) {
            return {ok: false, error: 'Cesium Ion asset not found. Check the asset ID.'};
          }
          return {ok: false, error: `Cesium Ion API error (${endpointRes.status}).`};
        }
        const endpoint = await endpointRes.json();
        fetchUrl = endpoint.url;
        if (endpoint.accessToken) {
          headers['Authorization'] = `Bearer ${endpoint.accessToken}`;
        }
      }
    }

    const response = await fetch(fetchUrl, {headers});
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          ok: false,
          error: `Access denied (HTTP ${response.status}). Check your access token.`
        };
      }
      if (response.status === 404) {
        return {ok: false, error: 'Tileset not found (HTTP 404). Check the URL.'};
      }
      return {ok: false, error: `Failed to load tileset (HTTP ${response.status}).`};
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('json') && !url.endsWith('.json')) {
      return {ok: false, error: 'Response is not a valid tileset (unexpected content type).'};
    }

    const data = await response.json();
    return {ok: true, data};
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {ok: false, error: `Network error: ${message}`};
  }
}

const TilesetTile3DForm: React.FC<Tile3DFormProps> = ({setResponse}) => {
  const [layerName, setLayerName] = useState<string>('');
  const [tileUrl, setTileUrl] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [tilesetMeta, setTilesetMeta] = useState<Record<string, unknown> | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [exampleTab, setExampleTab] = useState(0);
  const fetchIdRef = useRef(0);

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

  const onExampleClick = useCallback(
    (url: string, name: string) => {
      setTileUrl(url);
      setLayerName(name);
    },
    [setTileUrl, setLayerName]
  );

  // Fetch tileset metadata when URL and (if needed) token are available
  useEffect(() => {
    if (!tileUrl || !validateUrl(tileUrl)) {
      setTilesetMeta(null);
      setFetchError(null);
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    setMetaLoading(true);
    setFetchError(null);

    fetchTilesetMetadata(tileUrl, detectProvider(tileUrl), accessToken || undefined).then(
      result => {
        if (currentFetchId === fetchIdRef.current) {
          if (result.ok) {
            setTilesetMeta(result.data);
            setFetchError(null);
          } else {
            setTilesetMeta(null);
            setFetchError(result.error);
          }
          setMetaLoading(false);
        }
      }
    );
  }, [tileUrl, accessToken]);

  // Update response whenever form state or metadata changes
  useEffect(() => {
    if (fetchError) {
      setResponse({
        metadata: null,
        dataset: null,
        loading: false,
        error: new Error(fetchError)
      });
      return;
    }

    if (layerName && tileUrl && validateUrl(tileUrl)) {
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
  }, [setResponse, layerName, tileUrl, accessToken, tilesetMeta, metaLoading, fetchError]);

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
        <LabelRow>
          <label htmlFor="tile3d-url">Tileset URL</label>
          <InfoIconLink
            href={TILE3D_DOCUMENTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open 3D Tile Layer documentation"
          >
            <Help height="16px" />
          </InfoIconLink>
        </LabelRow>
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
      <div>
        <label htmlFor="tile3d-token">Access Token (if needed)</label>
        <InputLight
          id="tile3d-token"
          placeholder="Enter access token"
          value={accessToken}
          onChange={onAccessTokenChange}
        />
      </div>
      {getApplicationConfig().showInlineTilesetExamples && (
        <div>
          <TilesetInputDescription>For example, try a public 3D tileset:</TilesetInputDescription>
          <ExampleUrlsContainer>
            <ExampleTabs>
              {TILE3D_EXAMPLES.map((ex, i) => (
                <ExampleTab
                  key={ex.label}
                  active={exampleTab === i}
                  onClick={() => {
                    setExampleTab(i);
                    onExampleClick(ex.url, ex.name);
                  }}
                >
                  {ex.label}
                </ExampleTab>
              ))}
            </ExampleTabs>
            <ExampleUrl
              onClick={() =>
                onExampleClick(TILE3D_EXAMPLES[exampleTab].url, TILE3D_EXAMPLES[exampleTab].name)
              }
            >
              {TILE3D_EXAMPLES[exampleTab].url}
            </ExampleUrl>
          </ExampleUrlsContainer>
        </div>
      )}
    </TilesetInputContainer>
  );
};

export default TilesetTile3DForm;

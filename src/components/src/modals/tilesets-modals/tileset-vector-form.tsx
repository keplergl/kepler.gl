// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState, useMemo} from 'react';
import styled from 'styled-components';

import {isPMTilesUrl} from '@kepler.gl/common-utils';
import {
  DatasetType,
  PMTilesType,
  RemoteTileFormat,
  VectorTileDatasetMetadata,
  REMOTE_TILE
} from '@kepler.gl/constants';
import {TileJSON} from '@loaders.gl/mvt';
import {PMTilesMetadata} from '@loaders.gl/pmtiles';
import {getMetaUrl, parseVectorMetadata, VectorTileMetadata} from '@kepler.gl/table';
import {Merge} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

import {default as useFetchVectorTileMetadata} from '../../hooks/use-fetch-vector-tile-metadata';
import {DatasetCreationAttributes, MetaResponse} from './common';
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
`;

const ExampleTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

const ExampleTab = styled.div<{active: boolean}>`
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
  background: ${props => (props.active ? props.theme.AZURE400 : 'transparent')};
  color: ${props => (props.active ? props.theme.WHITE : props.theme.AZURE200)};
  border: 1px solid ${props => props.theme.AZURE400};
  &:hover {
    background: ${props => (props.active ? props.theme.AZURE400 : props.theme.AZURE500)};
  }
`;

const ExampleUrl = styled.div`
  word-break: break-all;
  cursor: pointer;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;
`;

const VECTOR_TILE_EXAMPLES = [
  {
    label: 'MVT',
    name: 'USA Population',
    url: 'https://4sq-studio-public.s3.us-west-2.amazonaws.com/vector-tile/cb_v2/{z}/{x}/{y}.pbf'
  },
  {
    label: 'PMTiles',
    name: 'FSQ Places',
    url: 'https://fsq-os-places-us-east-1.s3.us-east-1.amazonaws.com/release/vector-tiles/latest/fsq-os-places.pmtiles'
  },
  {
    label: 'PMTiles',
    name: 'Railways',
    url: 'https://4sq-studio-public.s3.us-west-2.amazonaws.com/pmtiles-test/161727fe-7952-4e57-aa05-850b3086b0b2.pmtiles'
  }
];

export type VectorTilesetFormData = {
  name: string;
  dataUrl: string;
  metadataUrl?: string;
};

export type VectorTileDatasetCreationAttributes = Merge<
  DatasetCreationAttributes,
  {
    metadata: VectorTileDatasetMetadata;
  }
>;

export function getDatasetAttributesFromVectorTile({
  name,
  dataUrl,
  metadataUrl
}: VectorTilesetFormData): VectorTileDatasetCreationAttributes {
  return {
    name,
    type: DatasetType.VECTOR_TILE,
    metadata: {
      type: REMOTE_TILE,
      remoteTileFormat: isPMTilesUrl(dataUrl) ? RemoteTileFormat.PMTILES : RemoteTileFormat.MVT,
      tilesetDataUrl: dataUrl,
      tilesetMetadataUrl: metadataUrl
    }
  };
}

type TilesetVectorFormProps = {
  setResponse: (response: MetaResponse) => void;
};

const TilesetVectorForm: React.FC<TilesetVectorFormProps> = ({setResponse}) => {
  const [tileName, setTileName] = useState<string>('');
  const [tileUrl, setTileUrl] = useState<string>('');
  const [metadataUrl, setMetadataUrl] = useState<string | null>('');
  const [initialFetchError, setInitialFetchError] = useState<Error | null>(null);
  const [exampleTab, setExampleTab] = useState(0);

  const onTileNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setTileName(event.target.value);
    },
    [setTileName]
  );

  const onTileMetaUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setMetadataUrl(event.target.value);
    },
    [setMetadataUrl]
  );

  const onTileUrlChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const newTileUrl = event.target.value;
      setTileUrl(newTileUrl);

      const usePMTiles = isPMTilesUrl(newTileUrl);
      const potentialMetadataUrl = usePMTiles ? newTileUrl : getMetaUrl(newTileUrl);
      if (!metadataUrl && potentialMetadataUrl) {
        // check if URL exists before setting it as the metadata URL
        // Note: The {method: HEAD} request often fails, likely due to individual storage settings.
        const resp = usePMTiles ? ({ok: true} as Response) : await fetch(potentialMetadataUrl);
        if (resp.ok) {
          setInitialFetchError(null);
          setMetadataUrl(potentialMetadataUrl);
        } else {
          setInitialFetchError(
            new Error(`Metadata loading failed: ${resp.status} ${resp.statusText}`)
          );
        }
      } else {
        setInitialFetchError(null);
      }
      if (!tileName) {
        setTileName(newTileUrl.split('/').pop() || newTileUrl);
      }
    },
    [setTileUrl, tileName, setMetadataUrl, metadataUrl]
  );

  const onExampleClick = useCallback((url: string, name: string) => {
    const usePMTiles = isPMTilesUrl(url);
    setTileUrl(url);
    setTileName(name);
    setInitialFetchError(null);
    setMetadataUrl(usePMTiles ? url : getMetaUrl(url));
  }, []);

  const process = useMemo(() => {
    return (value: PMTilesMetadata | TileJSON) =>
      parseVectorMetadata(value, {tileUrl: metadataUrl});
  }, [metadataUrl]);

  const {
    data: metadata,
    loading,
    error: metaError
  } = useFetchVectorTileMetadata({
    metadataUrl,
    tilesetUrl: tileUrl,
    remoteTileFormat: isPMTilesUrl(metadataUrl) ? RemoteTileFormat.PMTILES : RemoteTileFormat.MVT,
    process
  });

  // reset initial fetch error if the metadata is available
  if (metadata && initialFetchError) {
    setInitialFetchError(null);
  }

  useEffect(() => {
    if (tileName && tileUrl) {
      if (metadata?.pmtilesType === PMTilesType.RASTER) {
        return setResponse({
          metadata,
          dataset: null,
          loading,
          error: new Error('For .pmtiles in raster format, please use the Raster Tile form.')
        });
      }

      const dataset = getDatasetAttributesFromVectorTile({
        name: tileName,
        dataUrl: tileUrl,
        metadataUrl: metadataUrl ?? undefined
      });
      setResponse({
        metadata,
        dataset,
        loading,
        error: metaError || initialFetchError
      });
    } else {
      setResponse({
        metadata,
        dataset: null,
        loading,
        error: metaError || initialFetchError
      });
    }
  }, [
    setResponse,
    metadata,
    loading,
    metaError,
    initialFetchError,
    tileUrl,
    tileName,
    metadataUrl
  ]);

  useEffect(() => {
    if (metadata) {
      const name = (metadata as VectorTileMetadata).name;
      if (name) {
        setTileName(name);
      }
    }
  }, [metadata]);

  return (
    <TilesetInputContainer>
      <div>
        <label htmlFor="tileset-name">Name</label>
        <InputLight
          id="tileset-name"
          placeholder="Name your tileset"
          value={tileName}
          onChange={onTileNameChange}
        />
      </div>
      <div>
        <label htmlFor="tile-url">Tileset URL</label>
        <InputLight
          id="tile-url"
          placeholder="Tileset URL"
          value={tileUrl}
          onChange={onTileUrlChange}
        />
        <TilesetInputDescription>
          Requires &#123;x&#125;, &#123;y&#125;, &#123;z&#125; placeholders in URL or .pmtile
          extension.
        </TilesetInputDescription>
      </div>
      <div>
        <label htmlFor="tile-metadata">Tileset metadata URL</label>
        <InputLight
          id="tile-metadata"
          placeholder="Tileset metadata"
          value={metadataUrl ?? undefined}
          onChange={onTileMetaUrlChange}
        />
        <TilesetInputDescription>
          Optional, but recommended. Supports json, txt
        </TilesetInputDescription>
      </div>
      {getApplicationConfig().showInlineTilesetExamples && (
        <div>
          <TilesetInputDescription>
            For example, try a public vector tileset:
          </TilesetInputDescription>
          <ExampleUrlsContainer>
            <ExampleTabs>
              {VECTOR_TILE_EXAMPLES.map((ex, i) => (
                <ExampleTab
                  key={`${ex.label}-${ex.name}`}
                  active={exampleTab === i}
                  onClick={() => {
                    setExampleTab(i);
                    onExampleClick(ex.url, ex.name);
                  }}
                >
                  {ex.name}
                </ExampleTab>
              ))}
            </ExampleTabs>
            <ExampleUrl
              onClick={() =>
                onExampleClick(
                  VECTOR_TILE_EXAMPLES[exampleTab].url,
                  VECTOR_TILE_EXAMPLES[exampleTab].name
                )
              }
            >
              {VECTOR_TILE_EXAMPLES[exampleTab].url}
            </ExampleUrl>
          </ExampleUrlsContainer>
        </div>
      )}
    </TilesetInputContainer>
  );
};

export default TilesetVectorForm;

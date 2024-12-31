// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState, useMemo} from 'react';
import styled from 'styled-components';

import {
  getMetaUrl,
  parseVectorMetadata,
  VectorTileMetadata,
  DatasetType,
  VectorTileType
} from '@kepler.gl/layers';
import {TileJSON} from '@loaders.gl/mvt';
import {PMTilesMetadata} from '@loaders.gl/pmtiles';

import {default as useFetchVectorTileMetadata} from '../../hooks/use-fetch-vector-tile-metadata';
import {DatasetCreationAttributes, MetaResponse} from './common';
import {InputLight} from '../../common';

const TilesetInputContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 18px;
  font-size: 12px;
`;

const TilesetInputDescription = styled.div`
  text-align: center;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;
`;

export type VectorTilesetFormData = {
  name: string;
  dataUrl: string;
  metadataUrl?: string;
};

const isPMTilesUrl = (url?: string | null) => url?.includes('.pmtiles');

export function getDatasetAttributesFromVectorTile({
  name,
  dataUrl,
  metadataUrl
}: VectorTilesetFormData): DatasetCreationAttributes {
  return {
    name,
    type: DatasetType.VECTOR_TILE,
    metadata: {
      type: isPMTilesUrl(dataUrl) ? VectorTileType.PMTILES : VectorTileType.MVT,
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
      const potentialMetadataUrl = isPMTilesUrl(newTileUrl) ? newTileUrl : getMetaUrl(newTileUrl);
      if (!metadataUrl && potentialMetadataUrl) {
        // check if URL exists before setting it as the metadata URL
        const resp = await fetch(potentialMetadataUrl);
        if (resp.ok) setMetadataUrl(potentialMetadataUrl);
      }
      if (!tileName) {
        setTileName(newTileUrl.split('/').pop() || newTileUrl);
      }
    },
    [setTileUrl, tileName, setMetadataUrl, metadataUrl]
  );
  const process = useMemo(() => {
    return (value: PMTilesMetadata | TileJSON) =>
      parseVectorMetadata(value, {tileUrl: metadataUrl});
  }, [metadataUrl]);

  const {
    data: metadata,
    loading,
    error: metaError
  } = useFetchVectorTileMetadata({
    url: metadataUrl,
    type: isPMTilesUrl(metadataUrl) ? VectorTileType.PMTILES : VectorTileType.MVT,
    process
  });

  useEffect(() => {
    if (tileName && tileUrl) {
      const dataset = getDatasetAttributesFromVectorTile({
        name: tileName,
        dataUrl: tileUrl,
        metadataUrl: metadataUrl ?? undefined
      });
      setResponse({
        metadata,
        dataset,
        loading,
        error: metaError
      });
    } else {
      setResponse({
        metadata,
        dataset: null,
        loading,
        error: metaError
      });
    }
  }, [setResponse, metadata, loading, metaError, tileUrl, tileName, metadataUrl]);

  useEffect(() => {
    if (metadata) {
      setTileName((metadata as VectorTileMetadata).name || '');
    }
  }, [metadata]);

  return (
    <TilesetInputContainer>
      <div>
        <label htmlFor="tileset-name">Name</label>
        <InputLight
          id="tile-name"
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
    </TilesetInputContainer>
  );
};

export default TilesetVectorForm;

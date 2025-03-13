// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';

import {DatasetType, RasterTileDatasetMetadata} from '@kepler.gl/constants';
import {JsonObjectOrArray, Merge} from '@kepler.gl/types';
import {parseRasterMetadata} from '@kepler.gl/table';

import {default as useFetchJson} from '../../hooks/use-fetch-json';
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

export type RasterTilesetFormData = {
  name: string;
  metadataUrl?: string;
};

export type RasterTileDatasetCreationAttributes = Merge<
  DatasetCreationAttributes,
  {
    metadata: RasterTileDatasetMetadata;
  }
>;

export function getDatasetAttributesFromVectorTile({
  name,
  metadataUrl
}): RasterTileDatasetCreationAttributes {
  return {
    name,
    type: DatasetType.RASTER_TILE,
    metadata: {
      metadataUrl: metadataUrl
    }
  };
}

export type RasterTilesetMeta = {
  name: string;
  metadataUrl: string;
};

export function getDatasetAttributesFromRasterTile({
  name,
  metadataUrl
}: RasterTilesetMeta): DatasetCreationAttributes {
  return {
    name,
    type: DatasetType.RASTER_TILE,
    metadata: {
      metadataUrl
    }
  };
}

type RasterTileFormProps = {
  setResponse: (response: MetaResponse) => void;
};

const parseMetadataDisallowCollections = (metadata: JsonObjectOrArray) =>
  parseRasterMetadata(metadata, {allowCollections: false});

const RasterTileForm: React.FC<RasterTileFormProps> = ({setResponse}) => {
  const [tileName, setTileName] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [metadataUrl, setMetadataUrl] = useState<string>('');

  const onTileNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setTileName(event.target.value);
    },
    [setTileName]
  );

  const onMetadataUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const {value} = event.target;
    setMetadataUrl(value);
    setTileName(value.split('/').pop() || '');
    setCurrentUrl(value);
  }, []);

  // Note(Kyle): So the metadata is actually being fetched twice? Once here to display in the modal,
  // and another time in DOWNLOAD_RASTER_METADATA_TASK?
  // Note(Kyle): As of Sep 2022, we've added support for rendering STAC Collections through the Map
  // SDK, but rendering a STAC Collection requires a STAC search server that has the collection's
  // Item data indexed. So we don't want to permit collections to be added through our UI at this
  // point.
  const {
    data: metadata,
    loading,
    error: metaError
  } = useFetchJson({
    url: currentUrl,
    process: parseMetadataDisallowCollections
  });

  useEffect(() => {
    if (tileName && metadataUrl) {
      const dataset = getDatasetAttributesFromRasterTile({name: tileName, metadataUrl});
      setResponse({
        metadata: metadata as any,
        dataset,
        loading,
        error: metaError
      });
    } else {
      setResponse({
        metadata: metadata as any,
        dataset: null,
        loading,
        error: metaError
      });
    }
  }, [metadata, loading, metaError, currentUrl, tileName, metadataUrl, setResponse]);

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
        <label htmlFor="tile-metadata">Tileset metadata URL</label>
        <InputLight
          id="tile-metadata"
          placeholder="Tileset metadata"
          value={metadataUrl ?? undefined}
          onChange={onMetadataUrlChange}
        />
        <TilesetInputDescription>Supports STAC JSON</TilesetInputDescription>
      </div>
    </TilesetInputContainer>
  );
};

export default RasterTileForm;

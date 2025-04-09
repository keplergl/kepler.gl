// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';

import {validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, RasterTileType, PMTilesType} from '@kepler.gl/constants';
import {JsonObjectOrArray} from '@kepler.gl/types';
import {parseRasterMetadata, parseVectorMetadata} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

import {default as useFetchJson} from '../../hooks/use-fetch-raster-tile-metadata';
import {isPMTilesUrl, DatasetCreationAttributes, MetaResponse} from './common';
import {InputLight} from '../../common';

const TilesetInputContainer = styled.div`
  display: grid;
  /* grid-template-rows: repeat(3, 1fr); */
  row-gap: 18px;
  font-size: 12px;
`;

const TilesetInputDescription = styled.div`
  text-align: center;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;
`;

export type RasterTilesetMeta = {
  name: string;
  metadataUrl: string;
  rasterTileServerUrls?: string[];
};

export function getDatasetAttributesFromRasterTile({
  name,
  metadataUrl,
  rasterTileServerUrls
}: RasterTilesetMeta): DatasetCreationAttributes {
  return {
    name,
    type: DatasetType.RASTER_TILE,
    metadata: {
      metadataUrl,
      ...(rasterTileServerUrls ? {rasterTileServerUrls} : {})
    }
  };
}

type RasterTileFormProps = {
  setResponse: (response: MetaResponse) => void;
};

const parseMetadataAllowCollections = (
  metadata: JsonObjectOrArray,
  {metadataUrl, rasterTileType}: {metadataUrl: string; rasterTileType: RasterTileType}
) => {
  return rasterTileType === RasterTileType.PMTILES
    ? parseVectorMetadata(metadata, {tileUrl: metadataUrl})
    : parseRasterMetadata(metadata, {allowCollections: true});
};

const RasterTileForm: React.FC<RasterTileFormProps> = ({setResponse}) => {
  const [tileName, setTileName] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [metadataUrl, setMetadataUrl] = useState<string>('');
  const [rasterTileServerUrls, setRasterTileServerUrls] = useState<string>(
    (getApplicationConfig().rasterServerUrls || []).join(',')
  );

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

  const onRasterTileServerUrlsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setRasterTileServerUrls(event.target.value);
    },
    [setRasterTileServerUrls]
  );

  // Note: There is support for rendering STAC Collections,
  // but rendering a STAC Collection requires a STAC search server that has the collection's
  // Item data indexed. So we don't want to permit collections to be added through this UI at this point.
  const {
    data: metadata,
    loading,
    error: metaError
  } = useFetchJson({
    url: currentUrl,
    rasterTileType: isPMTilesUrl(currentUrl) ? RasterTileType.PMTILES : RasterTileType.STAC,
    process: parseMetadataAllowCollections
  });

  useEffect(() => {
    if (tileName && metadataUrl) {
      if (metadata?.pmtilesType === PMTilesType.MVT) {
        return setResponse({
          metadata,
          dataset: null,
          loading,
          error: new Error('For .pmtiles in mvt format, please use the Vector Tile form.')
        });
      }
      let error = metaError;

      // check for raster tile servers for STAC items and collections
      let rasterTileServers;
      if (!error && !metadata?.pmtilesType) {
        rasterTileServers = rasterTileServerUrls
          .split(',')
          .map(server => server.trim())
          .filter(s => s);
        if (
          rasterTileServers.length < 1 ||
          !rasterTileServers.every(server => validateUrl(server))
        ) {
          error = new Error(
            'Provide valid raster tile server urls for STAC items and collections.'
          );
        }
      }

      const dataset = getDatasetAttributesFromRasterTile({
        name: tileName,
        metadataUrl,
        rasterTileServerUrls: rasterTileServers
      });

      setResponse({
        metadata: metadata as any,
        dataset,
        loading,
        error
      });
    } else {
      setResponse({
        metadata: metadata as any,
        dataset: null,
        loading,
        error: metaError
      });
    }
  }, [
    metadata,
    loading,
    metaError,
    currentUrl,
    tileName,
    metadataUrl,
    rasterTileServerUrls,
    setResponse
  ]);

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
        <TilesetInputDescription>
          Supports raster .pmtiles. Limited support for STAC Items and Collections (EO and Raster
          extensions required).
        </TilesetInputDescription>
      </div>
      <div>
        <label htmlFor="tileset-raster-servers">Raster tile servers</label>
        <InputLight
          id="tileset-raster-servers"
          placeholder="Raster tile servers (separated by commas)"
          value={rasterTileServerUrls}
          onChange={onRasterTileServerUrlsChange}
        />
        <TilesetInputDescription>
          A list of raster tile servers for Cloud Optimized GeoTIFF tilesets.
        </TilesetInputDescription>
      </div>
    </TilesetInputContainer>
  );
};

export default RasterTileForm;

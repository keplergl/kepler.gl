// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';

import {PMTilesMetadata} from '@loaders.gl/pmtiles';

import {isPMTilesUrl, validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, RasterTileType, PMTilesType} from '@kepler.gl/constants';
import {JsonObjectOrArray} from '@kepler.gl/types';
import {parseRasterMetadata, parseVectorMetadata} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

import {default as useFetchJson} from '../../hooks/use-fetch-raster-tile-metadata';
import {DatasetCreationAttributes, MetaResponse} from './common';
import {InputLight} from '../../common';
import {Help} from '../../common/icons';

const TilesetInputContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 0px;
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

  &:hover {
    color: ${props => props.theme.AZURE100};
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
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
  const appConfig = getApplicationConfig();
  return {
    name,
    type: DatasetType.RASTER_TILE,
    metadata: {
      metadataUrl,
      ...(rasterTileServerUrls ? {rasterTileServerUrls} : {}),
      // Persist raster server-related application config with the layer
      rasterServerUseLatestTitiler: appConfig.rasterServerUseLatestTitiler,
      rasterServerSupportsElevation: appConfig.rasterServerSupportsElevation,
      rasterServerMaxRetries: appConfig.rasterServerMaxRetries,
      rasterServerRetryDelay: appConfig.rasterServerRetryDelay,
      rasterServerServerErrorsToRetry: appConfig.rasterServerServerErrorsToRetry,
      rasterServerMaxPerServerRequests: appConfig.rasterServerMaxPerServerRequests
    }
  };
}

type RasterTileFormProps = {
  setResponse: (response: MetaResponse) => void;
};

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

const RASTER_TILE_DOCUMENTATION_URL =
  'https://docs.kepler.gl/docs/user-guides/c-types-of-layers/n-raster-tile-layer';

const TITILER_BASE_URL = 'https://titiler.xyz';

function isCOGUrl(url: string): boolean {
  if (!url) return false;
  try {
    const pathname = new URL(url).pathname.toLowerCase().replace(/\/+$/, '');
    return pathname.endsWith('.tif') || pathname.endsWith('.tiff');
  } catch {
    const cleaned = url.trim().toLowerCase().split(/[?#]/)[0].replace(/\/+$/, '');
    return cleaned.endsWith('.tif') || cleaned.endsWith('.tiff');
  }
}

function getCOGMetadataUrl(cogUrl: string): string {
  return `${TITILER_BASE_URL}/cog/stac?url=${encodeURIComponent(cogUrl)}`;
}

const RASTER_TILE_EXAMPLES = [
  {
    label: 'COG',
    name: 'Africa Farms',
    url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif'
  },
  {
    label: 'PMTiles',
    name: 'Mt Whitney',
    url: 'https://pmtiles.io/usgs-mt-whitney-8-15-webp-512.pmtiles'
  },
  {
    label: 'PMTiles',
    name: 'Swiss Historical',
    url: 'https://public-bucket-for-tests.s3.us-east-1.amazonaws.com/historic-swis-18xx.pmtiles'
  },
  {
    label: 'STAC Collection',
    name: 'Sentinel-2 L1C',
    url: 'https://earth-search.aws.element84.com/v1/collections/sentinel-2-l1c'
  }
];

const parseMetadataAllowCollections = (
  metadata: JsonObjectOrArray | PMTilesMetadata,
  {metadataUrl, rasterTileType}: {metadataUrl: string; rasterTileType: RasterTileType}
) => {
  return rasterTileType === RasterTileType.PMTILES
    ? parseVectorMetadata(metadata as PMTilesMetadata, {
        tileUrl: metadataUrl
      })
    : parseRasterMetadata(metadata as JsonObjectOrArray, {allowCollections: true});
};

const RasterTileForm: React.FC<RasterTileFormProps> = ({setResponse}) => {
  const [tileName, setTileName] = useState<string>('');
  const [tileNameWasModified, setTileNameWasModified] = useState<boolean>(false);
  const [metadataUrl, setMetadataUrl] = useState<string>('');
  const [rasterTileServerUrls, setRasterTileServerUrls] = useState<string>(
    (getApplicationConfig().rasterServerUrls || []).join(',')
  );
  const [exampleTab, setExampleTab] = useState(0);

  // Remove trailing slash to prevent issues with raster tile servers
  const clearedMetadataUrl = metadataUrl.endsWith('/') ? metadataUrl.slice(0, -1) : metadataUrl;

  const isCOG = isCOGUrl(clearedMetadataUrl);
  const effectiveMetadataUrl = isCOG ? getCOGMetadataUrl(clearedMetadataUrl) : clearedMetadataUrl;
  const effectiveRasterTileServerUrls = isCOG ? TITILER_BASE_URL : rasterTileServerUrls;

  const defaultServerUrls = (getApplicationConfig().rasterServerUrls || []).join(',');

  const onExampleClick = useCallback(
    (url: string, name: string) => {
      setMetadataUrl(url);
      setTileName(name);
      setTileNameWasModified(false);

      if (isCOGUrl(url)) {
        setRasterTileServerUrls(TITILER_BASE_URL);
      } else {
        setRasterTileServerUrls(defaultServerUrls);
      }
    },
    [defaultServerUrls]
  );

  const onTileNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setTileNameWasModified(true);
      setTileName(event.target.value);
    },
    [setTileName]
  );

  const onMetadataUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const {value} = event.target;
      setMetadataUrl(value);

      if (isCOGUrl(value) && !rasterTileServerUrls.trim()) {
        setRasterTileServerUrls(TITILER_BASE_URL);
      }

      if (!tileNameWasModified) {
        setTileName(value.split('/').filter(Boolean).pop() || '');
      }
    },
    [tileNameWasModified, rasterTileServerUrls]
  );

  const onRasterTileServerUrlsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setRasterTileServerUrls(event.target.value);
    },
    [setRasterTileServerUrls]
  );

  const {
    data: metadata,
    loading,
    error: metaError
  } = useFetchJson({
    url: effectiveMetadataUrl,
    rasterTileType: isPMTilesUrl(clearedMetadataUrl) ? RasterTileType.PMTILES : RasterTileType.STAC,
    process: parseMetadataAllowCollections
  });

  useEffect(() => {
    if (tileName && clearedMetadataUrl) {
      const pmtilesType = metadata?.pmtilesType;

      if (pmtilesType === PMTilesType.MVT) {
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
      if (
        !error
        // We still need raster tile servers for PMTiles when we plan to use elevation
      ) {
        rasterTileServers = effectiveRasterTileServerUrls
          .split(',')
          .map(server => server.trim())
          .filter(server => server);
        if (
          rasterTileServers.length < 1 ||
          !rasterTileServers.every(server => validateUrl(server))
        ) {
          if (pmtilesType) {
            // For raster tiles elevation support is optional
            // TODO display a warning, but not a blocking error
            rasterTileServers = [];
          } else {
            error = new Error(
              'Provide valid raster tile server urls to support STAC and elevations.'
            );
          }
        }
      }

      const dataset = getDatasetAttributesFromRasterTile({
        name: tileName,
        metadataUrl: effectiveMetadataUrl,
        rasterTileServerUrls: rasterTileServers
      });

      setResponse({
        metadata,
        dataset,
        loading,
        error
      });
    } else {
      setResponse({
        metadata,
        dataset: null,
        loading,
        error: metaError
      });
    }
  }, [
    metadata,
    loading,
    metaError,
    tileName,
    clearedMetadataUrl,
    effectiveMetadataUrl,
    effectiveRasterTileServerUrls,
    setResponse
  ]);

  const showServerInput = getApplicationConfig().rasterServerShowServerInput;

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
        <LabelRow>
          <label htmlFor="tile-metadata">Tileset metadata URL</label>
          <InfoIconLink
            href={RASTER_TILE_DOCUMENTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Raster Tile Layer documentation"
          >
            <Help height="16px" />
          </InfoIconLink>
        </LabelRow>
        <InputLight
          id="tile-metadata"
          placeholder="Tileset metadata URL"
          value={metadataUrl ?? undefined}
          onChange={onMetadataUrlChange}
        />
        <TilesetInputDescription>
          Supports raster .pmtiles, COG (.tif) URLs, STAC Items and Collections.
        </TilesetInputDescription>
      </div>
      {showServerInput && (
        <div>
          <LabelRow>
            <label htmlFor="tileset-raster-servers">Raster tile servers</label>
            <InfoIconLink
              href={RASTER_TILE_DOCUMENTATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Raster Tile Layer documentation"
            >
              <Help height="16px" />
            </InfoIconLink>
          </LabelRow>
          <InputLight
            id="tileset-raster-servers"
            placeholder="Raster tile servers (separated by commas)"
            value={rasterTileServerUrls}
            onChange={onRasterTileServerUrlsChange}
          />
          <TilesetInputDescription>
            Raster tile server URLs for Cloud Optimized GeoTIFF tilesets and elevation.
          </TilesetInputDescription>
        </div>
      )}
      <div>
        <TilesetInputDescription>For example, try a public raster tileset:</TilesetInputDescription>
        <ExampleUrlsContainer>
          <ExampleTabs>
            {RASTER_TILE_EXAMPLES.map((ex, i) => (
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
                RASTER_TILE_EXAMPLES[exampleTab].url,
                RASTER_TILE_EXAMPLES[exampleTab].name
              )
            }
          >
            {RASTER_TILE_EXAMPLES[exampleTab].url}
          </ExampleUrl>
        </ExampleUrlsContainer>
      </div>
    </TilesetInputContainer>
  );
};

export default RasterTileForm;

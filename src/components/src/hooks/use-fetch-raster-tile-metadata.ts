// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {fetch} from 'global';
import {useEffect, useState} from 'react';

import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';

import {JsonObjectOrArray} from '@kepler.gl/types';
import {RasterTileType} from '@kepler.gl/constants';

export type FetchJsonProps = {
  url: string | null;
  rasterTileType: RasterTileType;
  options?: JsonObjectOrArray;
  process?: (
    json: JsonObjectOrArray,
    options: {metadataUrl: string; rasterTileType: RasterTileType}
  ) => JsonObjectOrArray | Error | null;
};

const DEFAULT_PROCESS_FUNCTION = (json: JsonObjectOrArray): JsonObjectOrArray => json;

export type UseFetchJsonReturn = {
  data: JsonObjectOrArray | null;
  loading: boolean;
  error: Error | null;
};

export default function useFetchJson({
  url,
  rasterTileType,
  options,
  process = DEFAULT_PROCESS_FUNCTION
}: FetchJsonProps): UseFetchJsonReturn {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<JsonObjectOrArray | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAndProcessMetadata = async () => {
      setError(null);
      setData(null);
      if (url) {
        setLoading(true);

        try {
          let rawMetadata: PMTilesMetadata | null = null;
          if (rasterTileType === RasterTileType.PMTILES) {
            const tileSource = PMTilesSource.createDataSource(url, {});
            rawMetadata = await tileSource.metadata;
          } else {
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(`Failed Fetch ${url}`);
            }
            rawMetadata = await response.json();
          }

          if (!rawMetadata) {
            throw new Error('Failed to fetch metadata');
          }

          const processedMetadata = process(rawMetadata as any, {rasterTileType, metadataUrl: url});
          if (processedMetadata instanceof Error) {
            setError(processedMetadata);
          } else {
            setError(null);
            setData(processedMetadata);
          }
        } catch (metadataError) {
          setError(metadataError as any);
        }
        setLoading(false);
      }
    };

    getAndProcessMetadata();
  }, [url, rasterTileType, options, process]);

  return {data, loading, error};
}

// Copyright 2022 Foursquare Labs, Inc. All Rights Reserved.

import {useCallback, useEffect, useState} from 'react';

import {MVTSource, TileJSON} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';

import {JsonObject} from '@kepler.gl/types';
import {VectorTileType} from '@kepler.gl/layers';

type FetchVectorTileMetadataProps = {
  url: string | null;
  type: VectorTileType;
  process?: (json: JsonObject) => JsonObject | Error | null;
};

const DEFAULT_PROCESS_FUNCTION = (json: JsonObject): JsonObject => json;

type FetchVectorTileMetadataReturn = {
  data: JsonObject | null;
  loading: boolean;
  error: Error | null;
};

/** Hook to fetch and return mvt or pmtiles metadata. */
export default function useFetchVectorTileMetadata({
  type,
  url,
  process = DEFAULT_PROCESS_FUNCTION
}: FetchVectorTileMetadataProps): FetchVectorTileMetadataReturn {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<JsonObject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setProcessedData = useCallback(
    (value: PMTilesMetadata | TileJSON | null) => {
      if (!value) {
        return setError(value);
      }
      const processedData = process(value as any);
      if (processedData instanceof Error) {
        setError(processedData);
      } else {
        setData(processedData);
      }
    },
    [setError, setData, process]
  );

  useEffect(() => {
    const getAndProcessMetadata = async () => {
      setError(null);
      setData(null);
      if (url) {
        setLoading(true);

        try {
          const tileSource =
            type === VectorTileType.REMOTE
              ? MVTSource.createDataSource('', {
                  mvt: {
                    metadataUrl: decodeURIComponent(url)
                  }
                })
              : PMTilesSource.createDataSource(decodeURIComponent(url), {});

          const metadata = await tileSource.metadata;
          setProcessedData(metadata);
        } catch (metadataError) {
          setError(metadataError as any);
        }
        setLoading(false);
      }
    };

    getAndProcessMetadata();
  }, [url, type, setProcessedData]);

  return {data, loading, error};
}

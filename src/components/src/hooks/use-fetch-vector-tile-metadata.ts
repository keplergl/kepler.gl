// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useEffect, useState} from 'react';

import {/* MVTSource,*/ TileJSON} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';

import {VectorTileType} from '@kepler.gl/constants';
import {getMVTMetadata, VectorTileMetadata} from '@kepler.gl/table';

type FetchVectorTileMetadataProps = {
  url: string | null;
  type: VectorTileType;
  process?: (json: PMTilesMetadata | TileJSON) => VectorTileMetadata | Error | null;
};

const DEFAULT_PROCESS_FUNCTION = (json: PMTilesMetadata | TileJSON): VectorTileMetadata => {
  return {
    metaJson: null,
    bounds: null,
    center: null,
    maxZoom: null,
    minZoom: null,
    fields: [],
    ...json
  };
};

type FetchVectorTileMetadataReturn = {
  data: VectorTileMetadata | null;
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
  const [data, setData] = useState<VectorTileMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setProcessedData = useCallback(
    (value: PMTilesMetadata | TileJSON | null) => {
      if (!value) {
        return setError(value);
      }
      const processedData = process(value);
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
          let metadata: PMTilesMetadata | TileJSON | null = null;
          if (type === VectorTileType.MVT) {
            metadata = await getMVTMetadata(url);

            // MVTSource returns messy partial metadata
            // MVTSource.createDataSource('', {
            //   mvt: {
            //     metadataUrl: decodeURIComponent(url)
            //   }
            // })
          } else {
            const tileSource = PMTilesSource.createDataSource(url, {});
            metadata = await tileSource.metadata;
          }

          // Since we switched to Source.createDataSource detailed response errors aren't available here...
          if (!metadata) {
            throw new Error('Failed to fetch metadata');
          }
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

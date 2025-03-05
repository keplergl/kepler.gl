// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect, useState} from 'react';

import {TileJSON} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';

import {RemoteTileFormat} from '@kepler.gl/constants';
import {getMVTMetadata, VectorTileMetadata, getFieldsFromTile} from '@kepler.gl/table';

type FetchVectorTileMetadataProps = {
  metadataUrl: string | null;
  tilesetUrl: string | null;
  remoteTileFormat: RemoteTileFormat;
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
  remoteTileFormat,
  tilesetUrl,
  metadataUrl,
  process = DEFAULT_PROCESS_FUNCTION
}: FetchVectorTileMetadataProps): FetchVectorTileMetadataReturn {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<VectorTileMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAndProcessMetadata = async () => {
      setError(null);
      setData(null);
      if (metadataUrl) {
        setLoading(true);

        try {
          let metadata: PMTilesMetadata | TileJSON | null = null;
          if (remoteTileFormat === RemoteTileFormat.MVT) {
            metadata = await getMVTMetadata(metadataUrl);

            // MVTSource returns messy partial metadata
            // MVTSource.createDataSource('', {
            //   mvt: {
            //     metadataUrl: decodeURIComponent(url)
            //   }
            // })
          } else {
            const tileSource = PMTilesSource.createDataSource(metadataUrl, {});
            metadata = await tileSource.metadata;
          }

          // Since we switched to Source.createDataSource detailed response errors aren't available here...
          if (!metadata) {
            throw new Error('Failed to fetch metadata');
          }

          const processedMetadata = process(metadata);
          if (processedMetadata instanceof Error) {
            setError(processedMetadata);
          } else {
            setError(null);

            await getFieldsFromTile({
              remoteTileFormat,
              tilesetUrl,
              metadataUrl,
              metadata: processedMetadata
            });

            setData(processedMetadata);
          }
        } catch (metadataError) {
          setError(metadataError as any);
        }
        setLoading(false);
      }
    };

    getAndProcessMetadata();
  }, [metadataUrl, tilesetUrl, remoteTileFormat, setError, setData, process]);

  return {data, loading, error};
}

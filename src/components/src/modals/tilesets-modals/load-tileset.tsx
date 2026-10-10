// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {IntlShape} from 'react-intl';
import JSONPretty from 'react-json-pretty';
import {AutoSizer} from 'react-virtualized';
import styled from 'styled-components';

import {
  VectorTileIcon,
  RasterTileIcon,
  WMSLayerIcon,
  Tile3DLayerIcon,
  BitmapLayerIcon,
  ZarrLayerIcon
} from '@kepler.gl/layers';
import {getError, getApplicationConfig} from '@kepler.gl/utils';

import LoadingSpinner from '../../common/loading-spinner';
import {MetaResponse} from './common';
import LoadDataFooter from './load-data-footer';
import TilesetIcon from './tileset-icon';
import TilesetVectorForm from './tileset-vector-form';
import TilesetRasterForm from './tileset-raster-form';

import TilesetWMSForm from './tileset-wms-form';
import TilesetTile3DForm from './tileset-tile3d-form';
import TilesetBitmapForm from './tileset-bitmap-form';
import TilesetZarrForm from './tileset-zarr-form';

const WIDTH_ICON = '70px';

const LoadTilesetTabContainer = styled.div`
  color: ${props => props.theme.AZURE};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 20px;
  background-color: ${props => props.theme.WHITE};
`;

const TilesetTypeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, ${WIDTH_ICON});
  column-gap: 10px;
  margin-bottom: 20px;
`;

const MetaContainer = styled.div`
  display: flex;
  max-height: 400px;
  background-color: ${({theme}) => theme.editorBackground};
`;

const MetaLoading = styled.div.attrs({
  role: 'status'
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  min-height: 160px;
`;

const BitmapPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px;

  img {
    max-width: 100%;
    max-height: 360px;
    border-radius: 4px;
    object-fit: contain;
  }
`;

export interface MetaInnerContainerProps {
  width: number;
  height: number;
}

const MetaInnerContainer = styled.div<MetaInnerContainerProps>`
  position: relative;
  border: 1px solid ${props => props.theme.selectBorderColorLT};
  background-color: white;
  border-radius: 2px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;
  padding: 0.5em 3.5em 0.5em 1em;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  color: ${props => props.theme.textColorLT};
  font-size: 11px;
  font-family: ${props => props.theme.fontFamily};
  max-width: 600px;
`;

type LoadTilesetTabProps = {
  meta: {[key: string]: any};
  isAddingDatasets: boolean;
  onTilesetAdded: (tilesetInfo: any, metadata?: any) => void;
  intl: IntlShape;
  /** The parent modal owns Cancel / Add Data, so this tab only reports readiness. */
  confirmInParent?: boolean;
  onTilesetDraftChange?: (draft: {
    canAdd: boolean;
    loading?: boolean;
    error?: string | null;
    dataset?: any;
    metadata?: any;
  }) => void;
};

const TILE_TYPES = [
  {
    id: 'vectorTile',
    label: 'Vector Tile',
    Icon: VectorTileIcon,
    Component: TilesetVectorForm
  },
  {
    id: 'rasterTile',
    label: 'Raster Tile',
    Icon: RasterTileIcon,
    Component: TilesetRasterForm
  },
  {
    id: 'wms',
    label: 'WMS',
    Icon: WMSLayerIcon,
    Component: TilesetWMSForm
  },
  {
    id: 'tile3d',
    label: '3D Tile',
    Icon: Tile3DLayerIcon,
    Component: TilesetTile3DForm
  },
  {
    id: 'bitmap',
    label: 'Bitmap',
    Icon: BitmapLayerIcon,
    Component: TilesetBitmapForm
  },
  {
    id: 'zarr',
    label: 'Zarr',
    Icon: ZarrLayerIcon,
    Component: TilesetZarrForm
  }
];

function isReady(response) {
  return response.dataset && !response.loading && !response.error;
}

function LoadTilesetTabFactory() {
  const LoadTilesetTab: React.FC<LoadTilesetTabProps> = ({
    onTilesetAdded,
    isAddingDatasets,
    confirmInParent = false,
    onTilesetDraftChange
  }) => {
    const [typeIndex, setTypeIndex] = useState<number>(0);
    const [response, setResponse] = useState<MetaResponse>({});

    const error = response.error;
    const loading = response.loading;
    const data = response.metadata;
    const jsonDataText = useMemo(() => JSON.stringify(data, null, 2), [data]);

    const createTileDataset = useCallback(() => {
      const {dataset, metadata} = response;
      if (dataset) {
        onTilesetAdded(dataset, metadata);
      }
    }, [onTilesetAdded, response]);

    useEffect(() => {
      onTilesetDraftChange?.({
        canAdd: isReady(response),
        loading: Boolean(response.loading),
        error: error ? getError(error) : null,
        dataset: response.dataset,
        metadata: response.metadata
      });
    }, [error, onTilesetDraftChange, response]);

    // temp patch to hide raster tile layer while in development
    const enableRasterTileLayer = getApplicationConfig().enableRasterTileLayer;
    const enableWMSLayer = getApplicationConfig().enableWMSLayer;
    const enableBitmapLayer = getApplicationConfig().enableBitmapLayer;
    const enableZarrLayer = getApplicationConfig().enableZarrLayer;

    // Filter tile types based on application config
    const tileTypes = useMemo(() => {
      const types = TILE_TYPES.filter(tileType => {
        if (tileType.id === 'rasterTile') {
          return enableRasterTileLayer;
        }
        if (tileType.id === 'wms') {
          return enableWMSLayer;
        }
        if (tileType.id === 'bitmap') {
          return enableBitmapLayer;
        }
        if (tileType.id === 'zarr') {
          return enableZarrLayer;
        }
        return true; // Include all other types by default
      });
      return types;
    }, [enableRasterTileLayer, enableWMSLayer, enableBitmapLayer, enableZarrLayer]);

    const CurrentForm = tileTypes[typeIndex].Component;

    return (
      <LoadTilesetTabContainer>
        <Container>
          <div>
            <TilesetTypeContainer className="tileset-type">
              {tileTypes.map((tileType, index) => (
                <TilesetIcon
                  key={tileType.label}
                  name={tileType.label}
                  Icon={<tileType.Icon height={WIDTH_ICON} />}
                  onClick={() => setTypeIndex(index)}
                  selected={typeIndex === index}
                />
              ))}
            </TilesetTypeContainer>
            <div>
              <CurrentForm setResponse={setResponse} />
            </div>
          </div>
          <MetaContainer>
            {loading ? (
              <MetaLoading>
                <LoadingSpinner />
              </MetaLoading>
            ) : data && 'imagePreviewUrl' in data ? (
              <BitmapPreviewContainer>
                <img src={(data as any).imagePreviewUrl} alt="Bitmap preview" />
              </BitmapPreviewContainer>
            ) : data ? (
              <AutoSizer>
                {({height, width}) => (
                  <MetaInnerContainer height={height} width={width}>
                    <JSONPretty id="json-pretty" json={jsonDataText} />
                  </MetaInnerContainer>
                )}
              </AutoSizer>
            ) : null}
          </MetaContainer>
        </Container>
        {confirmInParent ? null : (
          <LoadDataFooter
            disabled={Boolean(error) || !isReady(response)}
            isLoading={loading || isAddingDatasets}
            onConfirm={createTileDataset}
            confirmText="tilesetSetup.addTilesetText"
            errorText={error && getError(error)}
          />
        )}
      </LoadTilesetTabContainer>
    );
  };

  return LoadTilesetTab;
}

export default LoadTilesetTabFactory;

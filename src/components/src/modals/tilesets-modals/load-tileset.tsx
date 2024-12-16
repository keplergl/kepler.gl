// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import {AutoSizer} from 'react-virtualized';
import styled from 'styled-components';

import {getError} from '@kepler.gl/utils';

import {MetaResponse} from './common';
import TilesetIcon from './tileset-icon';
import TilesetVectorForm from './tileset-vector-form';

import {VectorTileIcon} from '@kepler.gl/layers';

import LoadDataFooter from './load-data-footer';

const WIDTH_ICON = '62px';

const LoadTilesetTabContainer = styled.div`
  color: ${props => props.theme.AZURE};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: ${props => props.theme.spacing32};
  background-color: ${props => props.theme.WHITE};
  padding: ${props => props.theme.spacing32};
`;

const TilesetTypeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, ${WIDTH_ICON});
  column-gap: ${props => props.theme.spacing16};
  margin-bottom: ${props => props.theme.spacing24};
`;

const MetaContainer = styled.div`
  display: flex;
  max-height: 400px;
  background-color: ${({theme}) => theme.editorBackground};
`;

type LoadTilesetTabProps = {
  meta: {[key: string]: any};
  isAddingDatasets: boolean;
  onTilesetAdded: (tilesetInfo: any, metadata?: any) => void;
};

const TILE_TYPES = [
  {
    id: 'vectorTile',
    label: 'Vector Tile',
    Icon: VectorTileIcon,
    Component: TilesetVectorForm
  }
];

function isReady(response) {
  return response.dataset && !response.loading && !response.error;
}

function LoadTilesetTabFactory() {
  const LoadTilesetTab: React.FC<LoadTilesetTabProps> = ({onTilesetAdded, isAddingDatasets}) => {
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

    const CurrentForm = TILE_TYPES[typeIndex].Component;

    return (
      <LoadTilesetTabContainer>
        <Container>
          <div>
            <div>
              <label htmlFor="tileset-type">Tileset Type</label>
            </div>
            <TilesetTypeContainer className="tileset-type">
              {TILE_TYPES.map((tileType, index) => (
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
              {error && <div>{getError(error)}</div>}
            </div>
          </div>
          <MetaContainer>
            {data && (
              <AutoSizer>
                {({height, width}) => (
                  <div
                    style={{
                      width,
                      height,
                      overflow: 'auto',
                      background: '#eee',
                      marginLeft: '10px'
                    }}
                  >
                    <pre>{jsonDataText}</pre>
                  </div>
                )}
              </AutoSizer>
            )}
          </MetaContainer>
        </Container>
        <LoadDataFooter
          disabled={Boolean(error) || !isReady(response)}
          isLoading={loading || isAddingDatasets}
          onConfirm={createTileDataset}
          confirmText="Add Tileset"
        />
      </LoadTilesetTabContainer>
    );
  };

  return LoadTilesetTab;
}

export default LoadTilesetTabFactory;

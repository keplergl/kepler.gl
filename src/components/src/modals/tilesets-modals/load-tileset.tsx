// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import {IntlShape} from 'react-intl';
import JSONPretty from 'react-json-pretty';
import {AutoSizer} from 'react-virtualized';
import styled from 'styled-components';

import {VectorTileIcon} from '@kepler.gl/layers';
import {getError} from '@kepler.gl/utils';

import {MetaResponse} from './common';
import LoadDataFooter from './load-data-footer';
// import TilesetIcon from './tileset-icon';
import TilesetVectorForm from './tileset-vector-form';

// const WIDTH_ICON = '62px';

const LoadTilesetTabContainer = styled.div`
  color: ${props => props.theme.AZURE};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  background-color: ${props => props.theme.WHITE};
`;

/*
const TilesetTypeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, ${WIDTH_ICON});
`;
*/

const MetaContainer = styled.div`
  display: flex;
  max-height: 400px;
  background-color: ${({theme}) => theme.editorBackground};
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
  margin-left: 10px;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  max-width: 600px;
`;

const StyledHeaderMessage = styled.div`
  color: ${props => props.theme.textColorLT};
  font-size: 14px;
  margin-bottom: 12px;
`;

type LoadTilesetTabProps = {
  meta: {[key: string]: any};
  isAddingDatasets: boolean;
  onTilesetAdded: (tilesetInfo: any, metadata?: any) => void;
  intl: IntlShape;
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
  const LoadTilesetTab: React.FC<LoadTilesetTabProps> = ({
    onTilesetAdded,
    isAddingDatasets,
    intl
  }) => {
    const [typeIndex /* , setTypeIndex*/] = useState<number>(0);
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

    const tilesetHeaderMessage = `${intl.formatMessage({
      id: 'tilesetSetup.header'
    })}`;

    return (
      <LoadTilesetTabContainer>
        <Container>
          <div>
            <StyledHeaderMessage>{tilesetHeaderMessage}</StyledHeaderMessage>
            {/** 
            <div>
              <label htmlFor="tileset-type">Tileset Type</label>
            </div>
             * Enable once we support different vector layers
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
            */}
            <div>
              <CurrentForm setResponse={setResponse} />
              {/** 
              {error && <div>{getError(error)}</div>}
              */}
            </div>
          </div>
          <MetaContainer>
            {data && (
              <AutoSizer>
                {({height, width}) => (
                  <MetaInnerContainer height={height} width={width}>
                    <JSONPretty id="json-pretty" json={jsonDataText} />
                  </MetaInnerContainer>
                )}
              </AutoSizer>
            )}
          </MetaContainer>
        </Container>
        <LoadDataFooter
          disabled={Boolean(error) || !isReady(response)}
          isLoading={loading || isAddingDatasets}
          onConfirm={createTileDataset}
          confirmText="tilesetSetup.addTilesetText"
          errorText={error && getError(error)}
        />
      </LoadTilesetTabContainer>
    );
  };

  return LoadTilesetTab;
}

export default LoadTilesetTabFactory;

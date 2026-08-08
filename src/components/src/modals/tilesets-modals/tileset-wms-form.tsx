// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {WMSCapabilities} from '@loaders.gl/wms';

import {validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, REMOTE_TILE, RemoteTileFormat, WMSDatasetMetadata} from '@kepler.gl/constants';
import {getWMSCapabilities, wmsCapabilitiesToDatasetMetadata} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

import {MetaResponse} from './common';
import {InputLight} from '../../common';

const TilesetInputContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, auto);
  row-gap: 18px;
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
`;

const ExampleTab = styled.div<{active: boolean}>`
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
  background: ${props => (props.active ? props.theme.AZURE400 : 'transparent')};
  color: ${props => (props.active ? props.theme.WHITE : props.theme.AZURE200)};
  border: 1px solid ${props => (props.active ? props.theme.AZURE400 : props.theme.AZURE400)};

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

const WMS_EXAMPLES = [
  {
    label: 'OSM',
    name: 'OpenStreetMap WMS',
    url: 'https://ows.terrestris.de/osm/service'
  },
  {
    label: 'NOAA Radar',
    name: 'NOAA CONUS Radar',
    url: 'https://opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_qcd/ows'
  },
  {
    label: 'NASA GIBS',
    name: 'NASA GIBS',
    url: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi'
  }
];

type WMSTileFormProps = {
  setResponse: (response: MetaResponse) => void;
};

type WMSData = {
  metadata: WMSCapabilities | null;
  layers: WMSDatasetMetadata['layers'];
  version: string;
};

const TilesetWMSForm: React.FC<WMSTileFormProps> = ({setResponse}) => {
  const [layerName, setLayerName] = useState<string>('');
  const [wmsUrl, setWmsUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [wmsData, setWMSData] = useState<WMSData | null>(null);
  const [exampleTab, setExampleTab] = useState(0);

  const onLayerNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setLayerName(event.target.value);
    },
    [setLayerName]
  );

  const onExampleClick = useCallback(
    (url: string, name: string) => {
      setWmsUrl(url);
      setLayerName(name);
    },
    [setWmsUrl, setLayerName]
  );

  const onWmsUrlChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const newWmsUrl = event.target.value;
      setWmsUrl(newWmsUrl);

      if (!validateUrl(newWmsUrl)) {
        setWMSData(null);
        return;
      }

      // Fetch WMS GetCapabilities
      try {
        setLoading(true);
        setError(null);

        const data = await getWMSCapabilities(newWmsUrl);

        const datasetMetadata = wmsCapabilitiesToDatasetMetadata(data);

        // Extract name or title from GetCapabilities response
        const serviceTitle = data?.title || data?.name;
        if (serviceTitle && !layerName) {
          setLayerName(serviceTitle);
        }

        setWMSData({
          metadata: data,
          layers: datasetMetadata.layers,
          version: datasetMetadata.version
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setWMSData(null);
      } finally {
        setLoading(false);
      }
    },
    [layerName]
  );

  useEffect(() => {
    if (layerName && wmsUrl) {
      const dataset = {
        name: layerName,
        type: DatasetType.WMS_TILE,
        metadata: {
          type: REMOTE_TILE,
          remoteTileFormat: RemoteTileFormat.WMS,
          tilesetDataUrl: wmsUrl,
          tilesetMetadataUrl: `${wmsUrl}?service=WMS&request=GetCapabilities`,
          layers: wmsData?.layers || [],
          version: wmsData?.version || '1.3.0'
        }
      };
      setResponse({
        metadata: wmsData?.metadata ?? null,
        dataset,
        loading,
        error
      });
    } else {
      setResponse({
        metadata: null,
        dataset: null,
        loading,
        error
      });
    }
  }, [setResponse, layerName, wmsUrl, wmsData, loading, error]);

  return (
    <TilesetInputContainer>
      <div>
        <label htmlFor="layer-name">Name</label>
        <InputLight
          id="layer-name"
          placeholder="Name your WMS layer"
          value={layerName}
          onChange={onLayerNameChange}
        />
      </div>
      <div>
        <label htmlFor="wms-url">WMS URL</label>
        <InputLight
          id="wms-url"
          placeholder="Enter WMS URL"
          value={wmsUrl}
          onChange={onWmsUrlChange}
        />
        <TilesetInputDescription>Provide a valid WMS service URL.</TilesetInputDescription>
      </div>
      {getApplicationConfig().showInlineTilesetExamples && (
        <div>
          <TilesetInputDescription>For example, try a public WMS URL:</TilesetInputDescription>
          <ExampleUrlsContainer>
            <ExampleTabs>
              {WMS_EXAMPLES.map((ex, i) => (
                <ExampleTab
                  key={ex.label}
                  active={exampleTab === i}
                  onClick={() => {
                    setExampleTab(i);
                    onExampleClick(ex.url, ex.name);
                  }}
                >
                  {ex.label}
                </ExampleTab>
              ))}
            </ExampleTabs>
            <ExampleUrl
              onClick={() =>
                onExampleClick(WMS_EXAMPLES[exampleTab].url, WMS_EXAMPLES[exampleTab].name)
              }
            >
              {WMS_EXAMPLES[exampleTab].url}
            </ExampleUrl>
          </ExampleUrlsContainer>
        </div>
      )}
    </TilesetInputContainer>
  );
};

export default TilesetWMSForm;

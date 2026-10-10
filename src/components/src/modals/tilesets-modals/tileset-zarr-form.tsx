// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';

import {validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, ZarrDatasetMetadata} from '@kepler.gl/constants';
import {getZarrMetadata, selectZarrVariable} from '@kepler.gl/table';
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

const Tabs = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

const Tab = styled.div<{active: boolean}>`
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

/** Avoid firing a store read on every keystroke of a long object-storage URL. */
const URL_DEBOUNCE_MS = 500;

/**
 * Public Zarr stores on Source Cooperative. Note the `data.` host: `source.coop`
 * serves the web UI, not the objects.
 */
const ZARR_EXAMPLES = [
  {
    name: 'CMIP6 Water Resources',
    url: 'https://data.source.coop/earthblox/cciwr/data/cciwr.zarr'
  },
  {
    name: 'ECMWF IFS Ensemble',
    url: 'https://data.source.coop/dynamical/ecmwf-ifs-ens-forecast-15-day-0-25-degree/v0.1.0.zarr'
  },
  {
    name: 'NOAA HRRR Forecast',
    url: 'https://data.source.coop/dynamical/noaa-hrrr-forecast-48-hour/v0.1.0.zarr'
  }
];

type ZarrFormProps = {
  setResponse: (response: MetaResponse) => void;
};

const TilesetZarrForm: React.FC<ZarrFormProps> = ({setResponse}) => {
  const [datasetName, setDatasetName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [debouncedUrl, setDebouncedUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<ZarrDatasetMetadata | null>(null);
  const [variable, setVariable] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [exampleTab, setExampleTab] = useState<number>(0);

  const onExampleClick = useCallback((index: number) => {
    setExampleTab(index);
    setUrl(ZARR_EXAMPLES[index].url);
    setDatasetName(ZARR_EXAMPLES[index].name);
  }, []);

  const onDatasetNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDatasetName(event.target.value);
  }, []);

  const onUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUrl(event.target.value);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedUrl(url.trim()), URL_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [url]);

  useEffect(() => {
    if (!validateUrl(debouncedUrl)) {
      setMetadata(null);
      setVariable(undefined);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getZarrMetadata(debouncedUrl)
      .then(zarrMetadata => {
        if (cancelled) {
          return;
        }
        setMetadata(zarrMetadata);
        setVariable(zarrMetadata.variable);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setMetadata(null);
        setVariable(undefined);
        setError(err instanceof Error ? err : new Error('Failed to read Zarr store'));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedUrl]);

  const selectedMetadata = useMemo(() => {
    if (!metadata) {
      return null;
    }
    return variable ? selectZarrVariable(metadata, variable) : metadata;
  }, [metadata, variable]);

  useEffect(() => {
    if (!selectedMetadata || !datasetName) {
      setResponse({metadata: null, dataset: null, loading, error});
      return;
    }
    setResponse({
      metadata: selectedMetadata,
      dataset: {
        name: datasetName,
        type: DatasetType.ZARR,
        metadata: selectedMetadata
      },
      loading,
      error
    });
  }, [setResponse, datasetName, selectedMetadata, loading, error]);

  // Default the dataset name to the selected variable so the Add button is
  // reachable without extra typing.
  useEffect(() => {
    if (!datasetName && selectedMetadata?.variable) {
      setDatasetName(selectedMetadata.variable);
    }
    // Only react to the variable, not to the user editing the name.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetadata?.variable]);

  const variables = metadata?.variables ?? [];

  return (
    <TilesetInputContainer>
      <div>
        <label htmlFor="zarr-dataset-name">Name</label>
        <InputLight
          id="zarr-dataset-name"
          placeholder="Name your Zarr layer"
          value={datasetName}
          onChange={onDatasetNameChange}
        />
      </div>
      <div>
        <label htmlFor="zarr-url">Zarr store URL</label>
        <InputLight
          id="zarr-url"
          placeholder="Enter Zarr store URL"
          value={url}
          onChange={onUrlChange}
        />
        <TilesetInputDescription>
          Provide a Zarr store with a GeoZarr or CF-conventions spatial grid.
        </TilesetInputDescription>
      </div>
      {getApplicationConfig().showInlineTilesetExamples && (
        <div>
          <TilesetInputDescription>For example, try a public Zarr store:</TilesetInputDescription>
          <ExampleUrlsContainer>
            <Tabs>
              {ZARR_EXAMPLES.map((example, index) => (
                <Tab
                  key={example.name}
                  active={exampleTab === index}
                  onClick={() => onExampleClick(index)}
                >
                  {example.name}
                </Tab>
              ))}
            </Tabs>
            <ExampleUrl onClick={() => onExampleClick(exampleTab)}>
              {ZARR_EXAMPLES[exampleTab].url}
            </ExampleUrl>
          </ExampleUrlsContainer>
        </div>
      )}
      {variables.length > 1 && (
        <div>
          <label htmlFor="zarr-variable">Variable</label>
          <Tabs id="zarr-variable">
            {variables.map(zarrVariable => (
              <Tab
                key={zarrVariable.path}
                active={zarrVariable.path === variable}
                onClick={() => setVariable(zarrVariable.path)}
              >
                {zarrVariable.displayName}
              </Tab>
            ))}
          </Tabs>
        </div>
      )}
      {selectedMetadata && (
        <ExampleUrlsContainer>
          {selectedMetadata.levels.length} resolution level
          {selectedMetadata.levels.length === 1 ? '' : 's'}
          {selectedMetadata.crs?.code ? ` · ${selectedMetadata.crs.code}` : ''}
          {selectedMetadata.timeDimension
            ? ` · ${selectedMetadata.timeDimension.size} time steps`
            : ''}
        </ExampleUrlsContainer>
      )}
    </TilesetInputContainer>
  );
};

export default TilesetZarrForm;

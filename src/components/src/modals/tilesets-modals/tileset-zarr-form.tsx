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
import {Help} from '../../common/icons';
import TippyTooltip from '../../common/tippy-tooltip';

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

const Tab = styled.div<{$active: boolean}>`
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
  background: ${props => (props.$active ? props.theme.AZURE400 : 'transparent')};
  color: ${props => (props.$active ? props.theme.WHITE : props.theme.AZURE200)};
  border: 1px solid ${props => props.theme.AZURE400};

  &:hover {
    background: ${props => (props.$active ? props.theme.AZURE400 : props.theme.AZURE500)};
  }
`;

const ExamplesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 6px 0;
`;

const ExampleItem = styled(Tab)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px 0 0;
  cursor: default;
`;

const ExampleName = styled.button`
  padding: 3px 8px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
`;

const ExampleInfoButton = styled.button`
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: help;

  &:hover {
    color: ${props => props.theme.AZURE100};
  }
`;

const ExampleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 280px;
  white-space: normal;
  overflow-wrap: anywhere;
`;

/** Avoid firing a store read on every keystroke of a long object-storage URL. */
const URL_DEBOUNCE_MS = 500;
const METADATA_TIMEOUT_MS = 30_000;

/**
 * Public Zarr stores on Source Cooperative. Note the `data.` host: `source.coop`
 * serves the web UI, not the objects.
 */
const ZARR_EXAMPLES = [
  {
    // https://source.coop/earthblox/cciwr/README.md
    label: 'CMIP6',
    name: 'CMIP6 Water Resources',
    description:
      'Global runoff, groundwater recharge, and evapotranspiration: historical baselines, future projections, and relative changes.',
    timeline:
      'Choose season, gcm (climate model), or ghm (hydrological model). FUTUR and RC also offer ssp (emissions scenario) and horizon (30-year periods centered on 2030, 2055, and 2085). Only the selected dimension changes during playback.',
    url: 'https://data.source.coop/earthblox/cciwr/data/cciwr.zarr'
  },
  {
    // https://dynamical.org/catalog/ecmwf-ifs-ens-forecast-15-day-0-25-degree/
    label: 'ECMWF IFS',
    name: 'ECMWF IFS Ensemble',
    description:
      'Global weather forecasts up to 15 days ahead, including temperature, precipitation, wind, and pressure, across 51 ensemble members.',
    timeline:
      'Choose Valid time (init_time + lead_time) to play one forecast run with a fixed ensemble member. You can also select init_time (run date), lead_time (forecast step), or ensemble_member individually.',
    url: 'https://data.source.coop/dynamical/ecmwf-ifs-ens-forecast-15-day-0-25-degree/v0.1.0.zarr'
  },
  {
    // https://dynamical.org/catalog/noaa-hrrr-forecast-48-hour/
    label: 'NOAA HRRR',
    name: 'NOAA HRRR Forecast',
    description:
      'Hourly weather forecasts up to 48 hours ahead for the continental US at 3 km resolution, including temperature, rain, snow, wind, and radar reflectivity.',
    timeline:
      'Choose Valid time (init_time + lead_time) to play through one forecast run. You can also select init_time (run date) or lead_time (forecast step) individually.',
    url: 'https://data.source.coop/dynamical/noaa-hrrr-forecast-48-hour/v0.1.0.zarr'
  }
];

type ZarrFormProps = {
  setResponse: (response: MetaResponse) => void;
};

const TilesetZarrForm: React.FC<ZarrFormProps> = ({setResponse}) => {
  const [datasetName, setDatasetName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<ZarrDatasetMetadata | null>(null);
  const [variable, setVariable] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const onExampleClick = useCallback(
    (index: number) => {
      const example = ZARR_EXAMPLES[index];
      if (url === example.url && error) {
        setRetryCount(count => count + 1);
      }
      setUrl(example.url);
      setDatasetName(example.name);
    },
    [url, error]
  );

  const onDatasetNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDatasetName(event.target.value);
  }, []);

  const onUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUrl(event.target.value);
  }, []);

  useEffect(() => {
    setMetadata(null);
    setVariable(undefined);
    setError(null);
    setLoading(false);
    if (!validateUrl(url.trim())) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const debounce = setTimeout(() => {
      setLoading(true);
      deadline = setTimeout(() => {
        const timeoutError = new Error(
          'Zarr metadata loading timed out after 30 seconds. Check the URL or try again.'
        );
        cancelled = true;
        controller.abort(timeoutError);
        setError(timeoutError);
        setLoading(false);
      }, METADATA_TIMEOUT_MS);

      getZarrMetadata(url.trim(), {signal: controller.signal})
        .then(zarrMetadata => {
          if (cancelled) {
            return;
          }
          setMetadata(zarrMetadata);
          setVariable(zarrMetadata.variable);
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(err instanceof Error ? err : new Error('Failed to read Zarr store'));
          }
        })
        .finally(() => {
          clearTimeout(deadline);
          if (!cancelled) {
            setLoading(false);
          }
        });
    }, URL_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      clearTimeout(deadline);
      controller.abort();
    };
  }, [url, retryCount]);

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
          <ExamplesRow>
            {ZARR_EXAMPLES.map((example, index) => (
              <ExampleItem key={example.name} $active={url === example.url}>
                <ExampleName
                  type="button"
                  aria-label={`Use ${example.name}`}
                  aria-pressed={url === example.url}
                  onClick={() => onExampleClick(index)}
                >
                  {example.label}
                </ExampleName>
                <TippyTooltip
                  placement="top"
                  isLightTheme
                  render={() => (
                    <ExampleDetails role="tooltip">
                      <strong>{example.name}</strong>
                      <div>{example.description}</div>
                      <div>
                        <strong>Timeline:</strong> {example.timeline}
                      </div>
                    </ExampleDetails>
                  )}
                >
                  <ExampleInfoButton type="button" aria-label={`About ${example.name}`}>
                    <Help height="14px" />
                  </ExampleInfoButton>
                </TippyTooltip>
              </ExampleItem>
            ))}
          </ExamplesRow>
        </div>
      )}
      {variables.length > 1 && (
        <div>
          <label htmlFor="zarr-variable">Variable</label>
          <Tabs id="zarr-variable">
            {variables.map(zarrVariable => (
              <Tab
                key={zarrVariable.path}
                $active={zarrVariable.path === variable}
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

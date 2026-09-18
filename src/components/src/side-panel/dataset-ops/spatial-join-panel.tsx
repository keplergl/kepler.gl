// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  DATASET_OPS_AGGREGATION_OPTIONS,
  DatasetOpAggregation,
  JoinOp,
  SpatialGeoSource,
  defaultAggregationsForFields,
  isTabularDatasetForOps,
  suggestSpatialGeo
} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {Field} from '@kepler.gl/types';

import SourceDataSelectorFactory from '../common/source-data-selector';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import DatasetOpPanel, {ResultNameInput} from './dataset-op-panel';

const AggRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const FieldName = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
`;

type GeoOption = {id: string; label: string; geo: SpatialGeoSource};

function geoOptionsForFields(fields: Field[]): GeoOption[] {
  const options: GeoOption[] = [];
  fields.forEach(field => {
    if (field.type === ALL_FIELD_TYPES.geojson || field.type === ALL_FIELD_TYPES.point) {
      options.push({
        id: `geojson:${field.name}`,
        label: `${field.displayName || field.name} (${field.type})`,
        geo: {kind: 'geojson', fieldName: field.name}
      });
    }
    if (field.type === ALL_FIELD_TYPES.h3) {
      options.push({
        id: `h3:${field.name}`,
        label: `${field.displayName || field.name} (h3)`,
        geo: {kind: 'h3', fieldName: field.name}
      });
    }
  });
  const suggested = suggestSpatialGeo(fields);
  if (suggested?.kind === 'latlng') {
    options.push({
      id: `latlng:${suggested.latField}:${suggested.lngField}`,
      label: `${suggested.latField}, ${suggested.lngField}`,
      geo: suggested
    });
  }
  return options;
}

function optionIdForGeo(geo?: SpatialGeoSource | null): string | null {
  if (!geo) {
    return null;
  }
  if (geo.kind === 'latlng') {
    return `latlng:${geo.latField}:${geo.lngField}`;
  }
  return `${geo.kind}:${geo.fieldName}`;
}

SpatialJoinPanelFactory.deps = [SourceDataSelectorFactory];

function SpatialJoinPanelFactory(SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>) {
  const SpatialJoinPanel: React.FC<{
    op: JoinOp;
    datasets: Datasets;
    setSpatialJoinConfig: ActionHandler<typeof VisStateActions.setSpatialJoinConfig>;
    runSpatialJoin: ActionHandler<typeof VisStateActions.runSpatialJoin>;
    removeDatasetOp: ActionHandler<typeof VisStateActions.removeDatasetOp>;
  }> = ({op, datasets, setSpatialJoinConfig, runSpatialJoin, removeDatasetOp}) => {
    const left = datasets[op.leftDataId];
    const right = op.rightDataId ? datasets[op.rightDataId] : undefined;
    const rightDatasets = Object.fromEntries(
      Object.entries(datasets).filter(
        ([id, dataset]) => id !== op.leftDataId && isTabularDatasetForOps(dataset)
      )
    );
    if (!left) {
      return null;
    }

    const leftOptions = geoOptionsForFields(left.fields);
    const rightOptions = right ? geoOptionsForFields(right.fields) : [];

    return (
      <DatasetOpPanel
        titleId="datasetOps.spatialJoin"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runSpatialJoin(op.id)}
        canRun={Boolean(op.rightDataId && op.leftGeo && op.rightGeo)}
      >
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="datasetOps.predicate" />
          </PanelLabel>
          <div>
            <FormattedMessage id="datasetOps.contains" />
          </div>
        </SidePanelSection>
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="datasetOps.leftGeometry" />
          </PanelLabel>
          <ItemSelector
            options={leftOptions}
            selectedItems={
              leftOptions.find(option => option.id === optionIdForGeo(op.leftGeo)) || null
            }
            displayOption={option => option.label}
            getOptionValue={option => option.id}
            onChange={value => {
              const option = leftOptions.find(item => item.id === value);
              setSpatialJoinConfig(op.id, {leftGeo: option?.geo || null});
            }}
            searchable={false}
          />
        </SidePanelSection>
        <SourceDataSelector
          datasets={rightDatasets}
          dataId={op.rightDataId || undefined}
          onSelect={value => {
            const dataId = typeof value === 'string' ? value : null;
            if (!dataId) {
              return;
            }
            const nextRight = datasets[dataId];
            setSpatialJoinConfig(op.id, {
              rightDataId: dataId,
              rightGeo: nextRight ? suggestSpatialGeo(nextRight.fields) : null,
              aggregations: nextRight ? defaultAggregationsForFields(nextRight.fields) : {},
              resultLabel: `${left.label} spatial join ${nextRight?.label || dataId}`
            });
          }}
          defaultValue="Select a dataset"
        />
        {right ? (
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.rightGeometry" />
            </PanelLabel>
            <ItemSelector
              options={rightOptions}
              selectedItems={
                rightOptions.find(option => option.id === optionIdForGeo(op.rightGeo)) || null
              }
              displayOption={option => option.label}
              getOptionValue={option => option.id}
              onChange={value => {
                const option = rightOptions.find(item => item.id === value);
                setSpatialJoinConfig(op.id, {rightGeo: option?.geo || null});
              }}
              searchable={false}
            />
          </SidePanelSection>
        ) : null}
        {right ? (
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.aggregations" />
            </PanelLabel>
            {right.fields.map(field => {
              const selected = op.aggregations[field.name];
              return (
                <AggRow key={field.name}>
                  <input
                    type="checkbox"
                    checked={Boolean(selected)}
                    onChange={e => {
                      const aggregations = {...op.aggregations};
                      if (e.target.checked) {
                        aggregations[field.name] =
                          selected || DATASET_OPS_AGGREGATION_OPTIONS[0].id;
                      } else {
                        delete aggregations[field.name];
                      }
                      setSpatialJoinConfig(op.id, {aggregations});
                    }}
                  />
                  <FieldName>{field.displayName || field.name}</FieldName>
                  <ItemSelector
                    options={DATASET_OPS_AGGREGATION_OPTIONS}
                    selectedItems={
                      DATASET_OPS_AGGREGATION_OPTIONS.find(option => option.id === selected) || null
                    }
                    displayOption={option => option.id}
                    getOptionValue={option => option.id}
                    onChange={value =>
                      setSpatialJoinConfig(op.id, {
                        aggregations: {
                          ...op.aggregations,
                          [field.name]: String(value) as DatasetOpAggregation
                        }
                      })
                    }
                    disabled={!selected}
                    searchable={false}
                  />
                </AggRow>
              );
            })}
          </SidePanelSection>
        ) : null}
        <ResultNameInput
          value={op.resultLabel}
          onChange={resultLabel => setSpatialJoinConfig(op.id, {resultLabel})}
        />
      </DatasetOpPanel>
    );
  };

  return SpatialJoinPanel;
}

export default SpatialJoinPanelFactory;

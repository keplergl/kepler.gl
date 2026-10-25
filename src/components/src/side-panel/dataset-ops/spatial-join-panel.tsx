// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  DatasetOpAggregation,
  JoinOp,
  SPATIAL_JOIN_PREDICATE_OPTIONS,
  SpatialGeoSource,
  SpatialJoinPredicate,
  aggregationOptionsForField,
  defaultAggregationForField,
  defaultAggregationsForFields,
  fieldNamesForGeoSource,
  isDatasetOpsAggregationField,
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
import LayerTypeDropdownListFactory from '../layer-panel/layer-type-dropdown-list';
import LayerTypeListItemFactory, {
  LayerTypeListItemProps
} from '../layer-panel/layer-type-list-item';
import {SpatialJoin} from '../../common/icons';
import DatasetOpPanel, {
  AggregationSelector,
  CollapsibleSection,
  DATASET_OPS_ACCENT,
  DatasetOpHelp,
  DatasetOpsAggRow,
  DatasetOpsFieldName,
  DatasetOpsSection,
  DatasetOpsSectionTitle,
  ResultNameInput,
  ScrollableColumnList
} from './dataset-op-panel';
import {SPATIAL_JOIN_PREDICATE_ICONS} from './spatial-join-predicate-icons';

const GeometryHeader = styled.div`
  margin-bottom: 4px;
`;

const PredicateValue = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  > :first-child {
    flex: 1;
    min-width: 0;
  }
  .item-selector .item-selector__dropdown {
    padding: 4px 10px;
  }
  .item-selector__dropdown__value .layer-type-selector__item__label {
    max-width: none;
    text-align: left;
  }
`;

const PredicateListItemWrap = styled.div`
  .layer-type-selector__item__icon {
    width: 56px;
    height: 56px;
    align-items: center;
    justify-content: center;
  }
`;

const JOIN_OPERATION_COLOR = DATASET_OPS_ACCENT;

type GeoOption = {id: string; label: string; geo: SpatialGeoSource};

function geoOptionsForFields(fields: Field[]): GeoOption[] {
  const options: GeoOption[] = [];
  fields.forEach(field => {
    if (field.type === ALL_FIELD_TYPES.geojson || field.type === ALL_FIELD_TYPES.point) {
      options.push({
        id: `geojson:${field.name}`,
        label: field.displayName || field.name,
        geo: {kind: 'geojson', fieldName: field.name}
      });
    }
    if (field.type === ALL_FIELD_TYPES.h3) {
      options.push({
        id: `h3:${field.name}`,
        label: field.displayName || field.name,
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

function includeableFields(fields: Field[], geo?: SpatialGeoSource | null): Field[] {
  const skip = new Set(geo ? fieldNamesForGeoSource(geo) : []);
  return fields.filter(field => !skip.has(field.name));
}

SpatialJoinPanelFactory.deps = [
  SourceDataSelectorFactory,
  LayerTypeListItemFactory,
  LayerTypeDropdownListFactory
];

function SpatialJoinPanelFactory(
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  LayerTypeListItem: ReturnType<typeof LayerTypeListItemFactory>,
  LayerTypeDropdownList: ReturnType<typeof LayerTypeDropdownListFactory>
) {
  const PredicateListItem = (props: LayerTypeListItemProps) => (
    <PredicateListItemWrap>
      <LayerTypeListItem {...props} />
    </PredicateListItemWrap>
  );
  const SpatialJoinPanel: React.FC<{
    op: JoinOp;
    datasets: Datasets;
    setSpatialJoinConfig: ActionHandler<typeof VisStateActions.setSpatialJoinConfig>;
    runSpatialJoin: ActionHandler<typeof VisStateActions.runSpatialJoin>;
    removeDatasetOp: ActionHandler<typeof VisStateActions.removeDatasetOp>;
  }> = ({op, datasets, setSpatialJoinConfig, runSpatialJoin, removeDatasetOp}) => {
    const intl = useIntl();
    const left = datasets[op.leftDataId];
    const right = op.rightDataId ? datasets[op.rightDataId] : undefined;
    const tabularDatasets = Object.fromEntries(
      Object.entries(datasets).filter(([, dataset]) => isTabularDatasetForOps(dataset))
    );
    const targetDatasets = Object.fromEntries(
      Object.entries(tabularDatasets).filter(([id]) => id !== op.rightDataId)
    );
    const joinDatasets = Object.fromEntries(
      Object.entries(tabularDatasets).filter(([id]) => id !== op.leftDataId)
    );
    const predicate = op.predicate || 'intersects';
    const predicateOptions = useMemo(
      () =>
        SPATIAL_JOIN_PREDICATE_OPTIONS.map(option => ({
          id: option.id,
          label: intl.formatMessage({id: option.labelId}),
          icon: SPATIAL_JOIN_PREDICATE_ICONS[option.id]
        })),
      [intl]
    );
    if (!left) {
      return null;
    }

    const leftOptions = geoOptionsForFields(left.fields);
    const rightOptions = right ? geoOptionsForFields(right.fields) : [];
    const selectedPredicate =
      predicateOptions.find(option => option.id === predicate) || predicateOptions[0];
    const leftIncludeFields = includeableFields(left.fields, op.leftGeo);
    const selectedLeftColumns = new Set(
      op.leftColumns ?? leftIncludeFields.map(field => field.name)
    );
    const allLeftSelected = leftIncludeFields.every(field => selectedLeftColumns.has(field.name));
    const aggregationFields = right ? right.fields.filter(isDatasetOpsAggregationField) : [];
    const allAggregationsSelected = Boolean(
      aggregationFields.length && aggregationFields.every(field => op.aggregations[field.name])
    );

    const onSelectTargetDataset = (value: unknown) => {
      const dataId = typeof value === 'string' ? value : null;
      if (!dataId || dataId === op.leftDataId) {
        return;
      }
      const nextLeft = datasets[dataId];
      if (!nextLeft) {
        return;
      }
      setSpatialJoinConfig(op.id, {
        leftDataId: dataId,
        leftGeo: suggestSpatialGeo(nextLeft.fields),
        leftColumns: undefined
      });
    };

    return (
      <DatasetOpPanel
        titleId="datasetOps.spatialJoin"
        titleIcon={<SpatialJoin height="20px" />}
        descriptionId="datasetOps.spatialJoinHelp"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runSpatialJoin(op.id)}
        canRun={Boolean(op.rightDataId && op.leftGeo && op.rightGeo)}
      >
        <DatasetOpsSection sectionColor={left.color}>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.targetDataset" />
            <DatasetOpHelp helpId="datasetOps.targetDatasetHelp" />
          </DatasetOpsSectionTitle>
          <SourceDataSelector
            datasets={targetDatasets}
            dataId={op.leftDataId}
            onSelect={onSelectTargetDataset}
            defaultValue="Select a dataset"
          />
          <SidePanelSection>
            <GeometryHeader>
              <PanelLabel>
                <FormattedMessage id="datasetOps.geometryColumn" />
              </PanelLabel>
            </GeometryHeader>
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
              multiSelect={false}
            />
          </SidePanelSection>
          <CollapsibleSection
            titleId="datasetOps.columnsToInclude"
            helpId="datasetOps.columnsToIncludeHelp"
            selectAll={allLeftSelected}
            onToggleSelectAll={() =>
              setSpatialJoinConfig(op.id, {
                leftColumns: allLeftSelected ? [] : leftIncludeFields.map(field => field.name)
              })
            }
          >
            <ScrollableColumnList>
              {leftIncludeFields.map(field => {
                const checked = selectedLeftColumns.has(field.name);
                return (
                  <DatasetOpsAggRow key={field.name}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = leftIncludeFields
                          .map(item => item.name)
                          .filter(name =>
                            name === field.name ? !checked : selectedLeftColumns.has(name)
                          );
                        setSpatialJoinConfig(op.id, {leftColumns: next});
                      }}
                    />
                    <DatasetOpsFieldName>{field.displayName || field.name}</DatasetOpsFieldName>
                  </DatasetOpsAggRow>
                );
              })}
            </ScrollableColumnList>
          </CollapsibleSection>
        </DatasetOpsSection>

        <DatasetOpsSection sectionColor={JOIN_OPERATION_COLOR}>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.joinOperation" />
            <DatasetOpHelp helpId="datasetOps.joinOperationHelp" />
          </DatasetOpsSectionTitle>
          <PredicateValue>
            <ItemSelector
              options={predicateOptions}
              selectedItems={selectedPredicate}
              multiSelect={false}
              displayOption={option => option.label}
              getOptionValue={option => option.id}
              filterOption="label"
              onChange={value =>
                setSpatialJoinConfig(op.id, {predicate: String(value) as SpatialJoinPredicate})
              }
              searchable={false}
              DropDownLineItemRenderComponent={PredicateListItem}
              DropDownRenderComponent={LayerTypeDropdownList}
            />
          </PredicateValue>
        </DatasetOpsSection>

        <DatasetOpsSection sectionColor={right?.color}>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.joinDataset" />
            <DatasetOpHelp helpId="datasetOps.joinDatasetHelp" />
          </DatasetOpsSectionTitle>
          <SourceDataSelector
            datasets={joinDatasets}
            dataId={op.rightDataId}
            onSelect={value => {
              const dataId = typeof value === 'string' ? value : null;
              if (!dataId) {
                return;
              }
              const nextRight = datasets[dataId];
              setSpatialJoinConfig(op.id, {
                rightDataId: dataId,
                rightGeo: nextRight ? suggestSpatialGeo(nextRight.fields) : null,
                aggregations: nextRight ? defaultAggregationsForFields(nextRight.fields) : {}
              });
            }}
            defaultValue="Select a dataset"
          />
          {right ? (
            <SidePanelSection>
              <GeometryHeader>
                <PanelLabel>
                  <FormattedMessage id="datasetOps.geometryColumn" />
                </PanelLabel>
              </GeometryHeader>
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
                multiSelect={false}
              />
            </SidePanelSection>
          ) : null}
          {right ? (
            <CollapsibleSection
              titleId="datasetOps.aggregationRules"
              helpId="datasetOps.columnsToIncludeHelp"
              selectAll={allAggregationsSelected}
              onToggleSelectAll={() =>
                setSpatialJoinConfig(op.id, {
                  aggregations: allAggregationsSelected
                    ? {}
                    : defaultAggregationsForFields(right.fields)
                })
              }
            >
              <ScrollableColumnList>
                {aggregationFields.map(field => {
                  const options = aggregationOptionsForField(field);
                  const selected = op.aggregations[field.name];
                  const selectedOption =
                    options.find(option => option.id === selected) ||
                    options.find(option => option.id === defaultAggregationForField(field)) ||
                    options[0] ||
                    null;
                  return (
                    <DatasetOpsAggRow key={field.name}>
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={e => {
                          const aggregations = {...op.aggregations};
                          if (e.target.checked) {
                            aggregations[field.name] =
                              selected || defaultAggregationForField(field);
                          } else {
                            delete aggregations[field.name];
                          }
                          setSpatialJoinConfig(op.id, {aggregations});
                        }}
                      />
                      <DatasetOpsFieldName>{field.displayName || field.name}</DatasetOpsFieldName>
                      <AggregationSelector>
                        <ItemSelector
                          options={options}
                          selectedItems={selectedOption}
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
                          multiSelect={false}
                          size="small"
                        />
                      </AggregationSelector>
                    </DatasetOpsAggRow>
                  );
                })}
              </ScrollableColumnList>
            </CollapsibleSection>
          ) : null}
        </DatasetOpsSection>

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

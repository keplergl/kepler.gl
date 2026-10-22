// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  DATA_STANDARDIZATION_OPTIONS,
  DataStandardization,
  DEFAULT_SUITABILITY_WEIGHT,
  SUITABILITY_WEIGHT_RANGE,
  SuitabilityOp,
  WEIGHT_STANDARDIZATION_OPTIONS,
  WeightStandardization,
  defaultSuitabilityWeights,
  isSuitabilityWeightField
} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

import RangeSliderFactory from '../../common/range-slider';
import ItemSelector from '../../common/item-selector/item-selector';
import {Input, PanelLabel, SidePanelSection} from '../../common/styled-components';
import {Suitability} from '../../common/icons';
import DatasetOpPanel, {
  CollapsibleSection,
  DatasetOpHelp,
  DatasetOpsAggRow,
  DatasetOpsFieldName,
  DatasetOpsSection,
  DatasetOpsSectionTitle,
  ResultNameInput,
  ScrollableColumnList
} from './dataset-op-panel';

const WEIGHT_STEP = 0.05;

const WeightRow = styled.div`
  margin-bottom: 6px;

  ${DatasetOpsAggRow} {
    margin-bottom: 0;
  }
`;

const WeightValue = styled.div`
  flex: 0 0 auto;
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  font-variant-numeric: tabular-nums;
`;

/**
 * The slider bar is 4px tall and its handle overflows by 4px either side, so the row only
 * needs enough height to keep the handle from clipping.
 */
const WeightSlider = styled.div<{$disabled?: boolean}>`
  padding: 4px 0 4px 22px;
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};
`;

const SelectAllWeights = styled.span.attrs({
  className: 'dataset-ops-suitability__select-all'
})`
  margin-left: auto;
  color: ${props => props.theme.activeColor};
  font-size: 11px;
  cursor: pointer;
`;

SuitabilityPanelFactory.deps = [RangeSliderFactory];

function SuitabilityPanelFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  const SuitabilityPanel: React.FC<{
    op: SuitabilityOp;
    datasets: Datasets;
    setSuitabilityConfig: ActionHandler<typeof VisStateActions.setSuitabilityConfig>;
    runSuitability: ActionHandler<typeof VisStateActions.runSuitability>;
    removeDatasetOp: ActionHandler<typeof VisStateActions.removeDatasetOp>;
  }> = ({op, datasets, setSuitabilityConfig, runSuitability, removeDatasetOp}) => {
    const intl = useIntl();
    const dataset = datasets[op.dataId];

    const weightOptions = useMemo(
      () =>
        WEIGHT_STANDARDIZATION_OPTIONS.map(option => ({
          id: option.id,
          label: intl.formatMessage({id: option.labelId})
        })),
      [intl]
    );
    const dataOptions = useMemo(
      () =>
        DATA_STANDARDIZATION_OPTIONS.map(option => ({
          id: option.id,
          label: intl.formatMessage({id: option.labelId})
        })),
      [intl]
    );

    if (!dataset) {
      return null;
    }

    const weightFields = dataset.fields.filter(isSuitabilityWeightField);
    const allWeightsSelected = Boolean(
      weightFields.length && weightFields.every(field => field.name in op.weights)
    );
    const selectedColumns = new Set(op.columns ?? dataset.fields.map(field => field.name));
    const allColumnsSelected = dataset.fields.every(field => selectedColumns.has(field.name));

    const onToggleWeight = (fieldName: string, enabled: boolean) => {
      const weights = {...op.weights};
      if (enabled) {
        weights[fieldName] = weights[fieldName] ?? DEFAULT_SUITABILITY_WEIGHT;
      } else {
        delete weights[fieldName];
      }
      setSuitabilityConfig(op.id, {weights});
    };

    return (
      <DatasetOpPanel
        titleId="datasetOps.suitability"
        titleIcon={<Suitability height="20px" />}
        descriptionId="datasetOps.suitabilityHelp"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runSuitability(op.id)}
        canRun={Object.keys(op.weights).length > 0}
      >
        <DatasetOpsSection sectionColor={dataset.color}>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.suitabilityWeights" />
            <DatasetOpHelp helpId="datasetOps.suitabilityWeightsHelp" />
            {weightFields.length ? (
              <SelectAllWeights
                onClick={() =>
                  setSuitabilityConfig(op.id, {
                    weights: allWeightsSelected ? {} : defaultSuitabilityWeights(dataset.fields)
                  })
                }
              >
                <FormattedMessage
                  id={allWeightsSelected ? 'datasetOps.unselectAll' : 'datasetOps.selectAll'}
                />
              </SelectAllWeights>
            ) : null}
          </DatasetOpsSectionTitle>
          <ScrollableColumnList>
            {weightFields.map(field => {
              const weight = op.weights[field.name];
              const enabled = field.name in op.weights;
              return (
                <WeightRow key={field.name}>
                  <DatasetOpsAggRow>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={e => onToggleWeight(field.name, e.target.checked)}
                    />
                    <DatasetOpsFieldName>{field.displayName || field.name}</DatasetOpsFieldName>
                    {enabled ? <WeightValue>{weight.toFixed(2)}</WeightValue> : null}
                  </DatasetOpsAggRow>
                  <WeightSlider $disabled={!enabled}>
                    <RangeSlider
                      range={SUITABILITY_WEIGHT_RANGE}
                      value0={SUITABILITY_WEIGHT_RANGE[0]}
                      value1={enabled ? weight : DEFAULT_SUITABILITY_WEIGHT}
                      step={WEIGHT_STEP}
                      isRanged={false}
                      showInput={false}
                      onChange={value =>
                        setSuitabilityConfig(op.id, {
                          weights: {...op.weights, [field.name]: value[1]}
                        })
                      }
                    />
                  </WeightSlider>
                </WeightRow>
              );
            })}
          </ScrollableColumnList>
        </DatasetOpsSection>

        <DatasetOpsSection>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.suitabilityStandardization" />
            <DatasetOpHelp helpId="datasetOps.suitabilityStandardizationHelp" />
          </DatasetOpsSectionTitle>
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.weightStandardization" />
            </PanelLabel>
            <ItemSelector
              options={weightOptions}
              selectedItems={
                weightOptions.find(option => option.id === op.weightStandardization) || null
              }
              displayOption={option => option.label}
              getOptionValue={option => option.id}
              onChange={value =>
                setSuitabilityConfig(op.id, {
                  weightStandardization: String(value) as WeightStandardization
                })
              }
              searchable={false}
              multiSelect={false}
            />
          </SidePanelSection>
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.dataStandardization" />
            </PanelLabel>
            <ItemSelector
              options={dataOptions}
              selectedItems={
                dataOptions.find(option => option.id === op.dataStandardization) || null
              }
              displayOption={option => option.label}
              getOptionValue={option => option.id}
              onChange={value =>
                setSuitabilityConfig(op.id, {
                  dataStandardization: String(value) as DataStandardization
                })
              }
              searchable={false}
              multiSelect={false}
            />
          </SidePanelSection>
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.scoreColumn" />
            </PanelLabel>
            <Input
              type="text"
              value={op.outputFieldName}
              onChange={e => setSuitabilityConfig(op.id, {outputFieldName: e.target.value})}
            />
          </SidePanelSection>
          <CollapsibleSection
            titleId="datasetOps.columnsToInclude"
            helpId="datasetOps.columnsToIncludeHelp"
            selectAll={allColumnsSelected}
            onToggleSelectAll={() =>
              setSuitabilityConfig(op.id, {
                columns: allColumnsSelected ? [] : dataset.fields.map(field => field.name)
              })
            }
          >
            <ScrollableColumnList>
              {dataset.fields.map(field => {
                const checked = selectedColumns.has(field.name);
                return (
                  <DatasetOpsAggRow key={field.name}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = dataset.fields
                          .map(item => item.name)
                          .filter(name =>
                            name === field.name ? !checked : selectedColumns.has(name)
                          );
                        setSuitabilityConfig(op.id, {columns: next});
                      }}
                    />
                    <DatasetOpsFieldName>{field.displayName || field.name}</DatasetOpsFieldName>
                  </DatasetOpsAggRow>
                );
              })}
            </ScrollableColumnList>
          </CollapsibleSection>
        </DatasetOpsSection>

        <ResultNameInput
          value={op.resultLabel}
          onChange={resultLabel => setSuitabilityConfig(op.id, {resultLabel})}
        />
      </DatasetOpPanel>
    );
  };

  return SuitabilityPanel;
}

export default SuitabilityPanelFactory;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';

import {
  SidePanelSection,
  SBFlexboxNoMargin,
  Button,
  PanelLabel
} from '../../common/styled-components';
import DatasetTagFactory from '../common/dataset-tag';
import TooltipChickletFactory from './tooltip-config/tooltip-chicklet';
import Switch from '../../common/switch';
import ItemSelector from '../../common/item-selector/item-selector';
import {COMPARE_TYPES, GEOCODER_DATASET_NAME} from '@kepler.gl/constants';
import FieldSelectorFactory from '../../common/field-selector';
import KeplerTable, {Datasets} from '@kepler.gl/table';

const TooltipConfigWrapper = styled.div`
  .item-selector > div > div {
    overflow: visible;
  }
`;

const ButtonWrapper = styled.div`
  display: inherit;
  padding: 0;

  .button.clear-all {
    background: transparent;
    color: ${props => props.theme.subtextColor};
    margin: 0 0 0 8px;
    padding: 0;

    &:hover {
      color: ${props => props.theme.textColor};
    }
  }
`;

const CompareSwitchWrapper = styled.div`
  color: ${props => props.theme.labelColor};
  display: flex;
  font-size: ${props => props.theme.inputFontSize};
  justify-content: space-between;
  line-height: 11px;
  margin-bottom: 8px;
`;

type TooltipConfigProps = {
  config: {
    fieldsToShow: {
      [key: string]: {name: string; format: string | null}[];
    };
    compareMode: boolean;
    compareType: string | null;
  };
  onChange: (config: {
    fieldsToShow: {
      [key: string]: {name: string; format: string | null}[];
    };
    compareMode: boolean;
    compareType: string | null;
  }) => void;
  datasets: Datasets;
  intl: IntlShape;
  onDisplayFormatChange: (dataId, column, displayFormat) => void;
};

type DatasetTooltipConfigProps = {
  config: {
    fieldsToShow: {
      [key: string]: {name: string; format: string | null}[];
    };
    compareMode: boolean;
    compareType: string | null;
  };
  onChange: (config: {
    fieldsToShow: {
      [key: string]: {name: string; format: string | null}[];
    };
    compareMode: boolean;
    compareType: string | null;
  }) => void;
  dataset: KeplerTable;
  onDisplayFormatChange: (dataId, column, displayFormat) => void;
};

TooltipConfigFactory.deps = [DatasetTagFactory, FieldSelectorFactory];
function TooltipConfigFactory(
  DatasetTag: ReturnType<typeof DatasetTagFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>
) {
  const DatasetTooltipConfig = ({
    config,
    onChange,
    dataset,
    onDisplayFormatChange
  }: DatasetTooltipConfigProps) => {
    const dataId = dataset.id;

    const handleClick = useCallback(
      () =>
        onChange({
          ...config,
          fieldsToShow: {
            ...config.fieldsToShow,
            [dataId]: []
          }
        }),
      [config, dataId, onChange]
    );

    const findSelectedHelper = useCallback((selected, tooltipFields) => {
      return selected.map(
        f =>
          tooltipFields.find(tooltipField => tooltipField.name === f.name) || {
            name: f.name,
            // default initial tooltip is null
            format: null
          }
      );
    }, []);

    const handleSelect = useCallback(
      selected => {
        const newConfig: DatasetTooltipConfigProps['config'] = {
          ...config,
          fieldsToShow: {
            ...config.fieldsToShow,
            [dataId]: findSelectedHelper(selected, config.fieldsToShow[dataId])
          }
        };
        onChange(newConfig);
      },
      [config, dataId, onChange, findSelectedHelper]
    );

    const handleReorderItems = useCallback(
      newOrder =>
        onChange({
          ...config,
          fieldsToShow: {
            ...config.fieldsToShow,
            [dataId]: newOrder
          }
        }),
      [config, dataId, onChange]
    );
    return (
      <SidePanelSection key={dataId}>
        <SBFlexboxNoMargin>
          <DatasetTag dataset={dataset} />
          {Boolean(config.fieldsToShow[dataId].length) && (
            <ButtonWrapper>
              <Button className="clear-all" onClick={handleClick} width="54px" secondary>
                <FormattedMessage id="fieldSelector.clearAll" />
              </Button>
            </ButtonWrapper>
          )}
        </SBFlexboxNoMargin>
        <FieldSelector
          fields={dataset.fields}
          value={config.fieldsToShow[dataId]}
          onSelect={handleSelect}
          reorderItems={handleReorderItems}
          closeOnSelect={false}
          multiSelect
          inputTheme="secondary"
          CustomChickletComponent={TooltipChickletFactory(
            dataId,
            config,
            onChange,
            dataset.fields,
            onDisplayFormatChange
          )}
        />
      </SidePanelSection>
    );
  };

  const TooltipConfig = ({
    config,
    datasets,
    onChange,
    onDisplayFormatChange,
    intl
  }: TooltipConfigProps) => {
    const handleChange = useCallback(
      (option: string | number | boolean | object | null) =>
        onChange({
          ...config,
          compareType: option as string | null
        }),
      [config, onChange]
    );

    return (
      <TooltipConfigWrapper>
        {Object.keys(config.fieldsToShow).map(dataId =>
          dataId === GEOCODER_DATASET_NAME ? null : (
            <DatasetTooltipConfig
              key={dataId}
              config={config}
              onChange={onChange}
              dataset={datasets[dataId]}
              onDisplayFormatChange={onDisplayFormatChange}
            />
          )
        )}
        <CompareSwitchWrapper>
          <FormattedMessage id="compare.modeLabel" />
          <Switch
            checked={config.compareMode}
            id="compare-mode-toggle"
            onChange={() => {
              const newConfig = {
                ...config,
                compareMode: !config.compareMode
              };
              onChange(newConfig);
            }}
            secondary
          />
        </CompareSwitchWrapper>
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="compare.typeLabel" />
          </PanelLabel>
          <ItemSelector
            disabled={!config.compareMode}
            displayOption={d =>
              intl.formatMessage({
                id: `compare.types.${d}`
              })
            }
            selectedItems={config.compareType}
            options={Object.values(COMPARE_TYPES)}
            multiSelect={false}
            searchable={false}
            inputTheme={'secondary'}
            getOptionValue={d => d}
            onChange={handleChange}
          />
        </SidePanelSection>
      </TooltipConfigWrapper>
    );
  };

  return injectIntl(TooltipConfig);
}

export default TooltipConfigFactory;

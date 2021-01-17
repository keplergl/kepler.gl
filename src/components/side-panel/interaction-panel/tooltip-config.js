// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';

import {
  SidePanelSection,
  SBFlexboxNoMargin,
  Button,
  PanelLabel
} from 'components/common/styled-components';
import DatasetTagFactory from 'components/side-panel/common/dataset-tag';
import TooltipChickletFactory from './tooltip-config/tooltip-chicklet';
import Switch from 'components/common/switch';
import ItemSelector from 'components/common/item-selector/item-selector';
import {COMPARE_TYPES} from 'constants/tooltip';
import FieldSelectorFactory from '../../common/field-selector';

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

TooltipConfigFactory.deps = [DatasetTagFactory, FieldSelectorFactory];
function TooltipConfigFactory(DatasetTag, FieldSelector) {
  const DatasetTooltipConfig = ({config, onChange, dataset}) => {
    const dataId = dataset.id;
    return (
      <SidePanelSection key={dataId}>
        <SBFlexboxNoMargin>
          <DatasetTag dataset={dataset} />
          {Boolean(config.fieldsToShow[dataId].length) && (
            <ButtonWrapper>
              <Button
                className="clear-all"
                onClick={() => {
                  const newConfig = {
                    ...config,
                    fieldsToShow: {
                      ...config.fieldsToShow,
                      [dataId]: []
                    }
                  };
                  onChange(newConfig);
                }}
                width="54px"
                secondary
              >
                <FormattedMessage id="fieldSelector.clearAll" />
              </Button>
            </ButtonWrapper>
          )}
        </SBFlexboxNoMargin>
        <FieldSelector
          fields={dataset.fields}
          value={config.fieldsToShow[dataId]}
          onSelect={selected => {
            const newConfig = {
              ...config,
              fieldsToShow: {
                ...config.fieldsToShow,
                [dataId]: selected.map(
                  f =>
                    config.fieldsToShow[dataId].find(
                      tooltipField => tooltipField.name === f.name
                    ) || {
                      name: f.name,
                      // default initial tooltip is null
                      format: null
                    }
                )
              }
            };
            onChange(newConfig);
          }}
          closeOnSelect={false}
          multiSelect
          inputTheme="secondary"
          CustomChickletComponent={TooltipChickletFactory(dataId, config, onChange, dataset.fields)}
        />
      </SidePanelSection>
    );
  };

  const TooltipConfig = ({config, datasets, onChange, intl}) => {
    return (
      <TooltipConfigWrapper>
        {Object.keys(config.fieldsToShow).map(dataId => (
          <DatasetTooltipConfig
            key={dataId}
            config={config}
            onChange={onChange}
            dataset={datasets[dataId]}
          />
        ))}
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
            onChange={option => {
              const newConfig = {
                ...config,
                compareType: option
              };
              onChange(newConfig);
            }}
          />
        </SidePanelSection>
      </TooltipConfigWrapper>
    );
  };

  return injectIntl(TooltipConfig);
}

export default TooltipConfigFactory;

// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';
import {
  SidePanelSection,
  SBFlexboxNoMargin,
  Button,
  Tooltip
} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';
import DatasetTagFactory from 'components/side-panel/common/dataset-tag';
import {Circle} from 'components/common/icons';
import DropdownList from 'components/common/item-selector/dropdown-list';

TooltipConfigFactory.deps = [DatasetTagFactory];

export const TOOLTIP_FORMAT_TYPES = {
  DATE: 'date',
  DECIMAL: 'decimal',
  PERCENTAGE: 'percentage'
};

export const TOOLTIP_FORMATS = {
  NONE: {
    label: 'None'
  },
  DECIMAL_SHORT: {
    label: '10k',
    format: '.1s',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_SHORT_COMMA: {
    label: '12.3k',
    format: '.3s',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PERCENT_FULL: {
    label: '.1 → 10%',
    format: '.1%',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PRECENT_REGULAR: {
    label: '10 → 10%',
    format: '.1%',
    type: TOOLTIP_FORMAT_TYPES.PERCENTAGE
  },
  DECIMAL_INT: {
    label: '12350',
    format: '.4r',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_THREE: {
    label: '12,345.432',
    format: ',.3f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_DELTA: {
    label: '+12,345.432',
    format: '+,',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_CURRENCY: {
    label: '$12,345.43',
    format: '$,.2f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DATE_DDMMYYYY: {
    label: '14/01/2019',
    format: '%d/%m/%Y',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_DAY_MMDDYYYY: {
    label: '01/14/2019',
    format: '%m/%d/%Y',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_DAY_YYYYMMDD: {
    label: '2019-01-14',
    format: '%Y-%m-%d',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_FULL: {
    label: '2019-01-14 01:32:10',
    format: '%Y-%m-%d %H:%M:%S',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_FULL_ALT: {
    label: '14-01-2019 01:32:10',
    format: '%d-%m-%Y %H:%M:%S',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_TIME: {
    label: '01:32:10',
    format: '%H:%M:%S',
    type: TOOLTIP_FORMAT_TYPES.DATE
  }
};

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

const ChickletAddonWrapper = styled.div`
  position: relative;
`;

const ChickletAddon = styled.div`
  margin-right: 4px;
`;

const StyledPopover = styled.div`
  margin-left: -64px;
  position: absolute;
  top: 20px;
  width: 140px;
  z-index: 101;

  /* &::after {
    position: relative;
    top: -5px;
    left: 64px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid black;
  } */
`;

const circleStyles = {
  SHOW: {
    stroke: '#fff',
    fill: 'rgba(0,0,0,0)'
  },
  IDLE: {
    stroke: '#A0A7B4',
    fill: 'rgba(0,0,0,0)'
  },
  ACTIVE: {
    stroke: '#1fbad6',
    fill: '#1fbad6'
  }
};

function getFormatLabels() {
  return Object.values(TOOLTIP_FORMATS).map(v => v.label);
}

function getItemName(item) {
  return item.name || item;
}

function TooltipConfigFactory(DatasetTag) {
  class TooltipConfig extends Component {
    getChickletAddon = dataId => {
      return item => {
        const {config, onChange} = this.props;
        const [show, setShow] = React.useState(false);
        const [selectionIndex, setSelectionIndex] = React.useState(0);
        let circleStyle = selectionIndex ? circleStyles.ACTIVE : circleStyles.IDLE;
        if (show) {
          circleStyle = circleStyles.SHOW;
        }
        return (
          <ChickletAddonWrapper>
            <ChickletAddon data-tip data-for={`addon-${getItemName(item)}`}>
              <Circle
                height="8px"
                onClick={e => {
                  e.stopPropagation();
                  setShow(Boolean(!show));
                }}
                {...circleStyle}
              />
              <Tooltip id={`addon-${getItemName(item)}`} effect="solid">
                <span>
                  {(selectionIndex && getFormatLabels()[selectionIndex]) || (
                    <FormattedMessage id={'fieldSelector.formatting'} />
                  )}
                </span>
              </Tooltip>
            </ChickletAddon>
            {show && (
              <StyledPopover>
                <DropdownList
                  options={getFormatLabels()}
                  selectionIndex={selectionIndex}
                  onOptionSelected={(result, e) => {
                    e.stopPropagation();
                    setShow(false);
                    setSelectionIndex(getFormatLabels().indexOf(result));
                    const oldFieldsToShow = config.fieldsToShow[dataId];
                    const fieldsToShow = oldFieldsToShow.map(field => {
                      const name = field.name || field;
                      return name === getItemName(item)
                        ? {
                            name,
                            format: result
                          }
                        : field;
                    });
                    const newConfig = {
                      ...config,
                      fieldsToShow: {
                        ...config.fieldsToShow,
                        [dataId]: fieldsToShow
                      }
                    };
                    onChange(newConfig);
                  }}
                />
              </StyledPopover>
            )}
          </ChickletAddonWrapper>
        );
      };
    };

    render() {
      const {config, datasets, onChange} = this.props;
      return (
        <TooltipConfigWrapper>
          {Object.keys(config.fieldsToShow).map(dataId => (
            <SidePanelSection key={dataId}>
              <SBFlexboxNoMargin>
                <DatasetTag dataset={datasets[dataId]} />
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
                      width="48px"
                      secondary
                    >
                      <FormattedMessage id="fieldSelector.clearAll" />
                    </Button>
                  </ButtonWrapper>
                )}
              </SBFlexboxNoMargin>
              <FieldSelector
                fields={datasets[dataId].fields}
                value={config.fieldsToShow[dataId]}
                onSelect={fieldsToShow => {
                  const oldFieldsToShow = config.fieldsToShow[dataId];
                  const newFieldsToShow = fieldsToShow.map(field => {
                    const name = field.name;
                    const foundField = oldFieldsToShow.find(oldField => oldField.name === name);
                    return foundField || name;
                  });
                  const newConfig = {
                    ...config,
                    fieldsToShow: {
                      ...config.fieldsToShow,
                      [dataId]: newFieldsToShow
                    }
                  };
                  onChange(newConfig);
                }}
                closeOnSelect={false}
                multiSelect
                inputTheme="secondary"
                addon={this.getChickletAddon(dataId)}
              />
            </SidePanelSection>
          ))}
        </TooltipConfigWrapper>
      );
    }
  }

  return TooltipConfig;
}

export default TooltipConfigFactory;

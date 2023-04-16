// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import {ChickletButton, ChickletTag} from '../../../common/item-selector/chickleted-input';
import {Hash, Delete} from '../../../common/icons';
import DropdownList from '../../../common/item-selector/dropdown-list';
import {FormattedMessage} from '@kepler.gl/localization';
import {TimeLabelFormat, TooltipFields} from '@kepler.gl/types';
import {getFormatValue, getFormatLabels} from '@kepler.gl/utils';
import onClickOutside from 'react-onclickoutside';
import TippyTooltip from '../../../common/tippy-tooltip';

interface TooltipChickletProps {
  disabled: boolean;
  item: {name: string};
  displayOption: Function;
  remove: any;
}

type TooltipConfig = {
  fieldsToShow: {
    [key: string]: {name: string; format: string | null}[];
  };
  compareMode: boolean;
  compareType: string | null;
};

type IconDivProps = {
  status: string | null;
};

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
`;

const hashStyles = {
  SHOW: 'SHOW',
  ACTIVE: 'ACTIVE'
};

const IconDiv = styled.div.attrs({
  className: 'tooltip-chicklet__icon'
})<IconDivProps>`
  color: ${props =>
    props.status === hashStyles.SHOW
      ? props.theme.subtextColorActive
      : props.status === hashStyles.ACTIVE
      ? props.theme.activeColor
      : props.theme.textColor};
`;

function getFormatTooltip(formatLabels: TimeLabelFormat[], format: string | null) {
  if (!format) {
    return null;
  }
  const formatLabel = formatLabels.find(fl => getFormatValue(fl) === format);
  if (formatLabel) {
    return formatLabel.label;
  }
  return typeof format === 'object' ? JSON.stringify(format, null, 2) : String(format);
}

function TooltipChickletFactory(
  dataId: string,
  config: TooltipConfig,
  onChange: (cfg: TooltipConfig) => void,
  fields: TooltipFields[],
  onDisplayFormatChange
): ComponentType<TooltipChickletProps> {
  class TooltipChicklet extends Component<TooltipChickletProps> {
    state = {
      show: false
    };
    private node!: HTMLDivElement;

    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside, false);
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside, false);
    }

    handleClickOutside = (e: any) => {
      if (this.node.contains(e.target)) {
        return;
      }
    };

    render() {
      const {disabled, item, displayOption, remove} = this.props;
      const {show} = this.state;
      const tooltipField = config.fieldsToShow[dataId].find(
        fieldToShow => fieldToShow.name === item.name
      );
      if (!tooltipField) {
        return null;
      }
      const field = fields.find(f => f.name === tooltipField.name);
      if (!field) {
        return null;
      }
      const formatLabels = getFormatLabels(fields, tooltipField.name);
      const hasFormat = Boolean(field.displayFormat);
      const selectionIndex = formatLabels.findIndex(
        fl => getFormatValue(fl) === field.displayFormat
      );
      const hashStyle = show ? hashStyles.SHOW : hasFormat ? hashStyles.ACTIVE : null;

      return (
        <ChickletButton ref={(node: HTMLDivElement) => (this.node = node)}>
          <ChickletTag>{displayOption(item)}</ChickletTag>
          {formatLabels.length > 1 && (
            <ChickletAddonWrapper>
              <TippyTooltip
                placement="top"
                render={() => (
                  <span>
                    {hasFormat ? (
                      getFormatTooltip(formatLabels, field.displayName)
                    ) : (
                      <FormattedMessage id={'fieldSelector.formatting'} />
                    )}
                  </span>
                )}
              >
                <ChickletAddon>
                  <IconDiv status={hashStyle}>
                    <Hash
                      height="8px"
                      onClick={e => {
                        e.stopPropagation();
                        this.setState({show: Boolean(!show)});
                      }}
                    />
                  </IconDiv>
                </ChickletAddon>
              </TippyTooltip>
              {show && (
                <StyledPopover>
                  <DropdownList
                    options={formatLabels}
                    selectionIndex={selectionIndex}
                    displayOption={({label}) => label}
                    onOptionSelected={(result, e) => {
                      e.stopPropagation();
                      this.setState({
                        show: false
                      });

                      const displayFormat = getFormatValue(result);
                      const oldFieldsToShow = config.fieldsToShow[dataId];
                      const fieldsToShow = oldFieldsToShow.map(fieldToShow => {
                        return fieldToShow.name === tooltipField.name
                          ? {
                              name: tooltipField.name,
                              format: displayFormat
                            }
                          : fieldToShow;
                      });
                      const newConfig = {
                        ...config,
                        fieldsToShow: {
                          ...config.fieldsToShow,
                          [dataId]: fieldsToShow
                        }
                      };
                      onChange(newConfig);
                      onDisplayFormatChange(dataId, field.name, displayFormat);
                    }}
                  />
                </StyledPopover>
              )}
            </ChickletAddonWrapper>
          )}
          <Delete onClick={disabled ? null : remove} />
        </ChickletButton>
      );
    }
  }
  return onClickOutside(TooltipChicklet);
}

export default TooltipChickletFactory;

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
import {ChickletButton, ChickletTag} from 'components/common/item-selector/chickleted-input';
import {Hash, Delete} from 'components/common/icons';
import DropdownList from 'components/common/item-selector/dropdown-list';
import {Tooltip} from 'components/common/styled-components';
import {FormattedMessage} from 'react-intl';
import onClickOutside from 'react-onclickoutside';
import {FIELD_OPTS} from 'constants/default-settings';
import {TOOLTIP_FORMATS} from 'constants/tooltip';

function getFormatLabels(fields, fieldName) {
  const fieldType = fields.find(f => f.name === fieldName).type;
  const formatLabels = (FIELD_OPTS[fieldType].format.tooltip || []).map(v => v.label);
  formatLabels.unshift(TOOLTIP_FORMATS.NONE.label);
  return formatLabels;
}

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

const hashStyles = {
  SHOW: {
    fill: '#fff'
  },
  IDLE: {
    fill: '#A0A7B4'
  },
  ACTIVE: {
    fill: '#1fbad6'
  }
};
function TooltipChickletFactory(dataId, config, onChange, fields) {
  class TooltipChicklet extends Component {
    state = {
      show: false
    };

    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside, false);
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside, false);
    }

    handleClickOutside = e => {
      if (this.node.contains(e.target)) {
        return;
      }
      this.setState({show: false});
    };

    render() {
      const {disabled, name, remove} = this.props;
      const {show} = this.state;
      const field = config.fieldsToShow[dataId].find(fieldToShow => fieldToShow.name === name);
      const formatLabels = getFormatLabels(fields, field.name);
      let selectionIndex = formatLabels.indexOf(field.format);
      if (selectionIndex < 0) selectionIndex = 0;
      let hashStyle = selectionIndex ? hashStyles.ACTIVE : hashStyles.IDLE;
      if (show) {
        hashStyle = hashStyles.SHOW;
      }

      return (
        <ChickletButton ref={node => (this.node = node)}>
          <ChickletTag>{name}</ChickletTag>
          {formatLabels.length > 1 && (
            <ChickletAddonWrapper>
              <ChickletAddon data-tip data-for={`addon-${name}`}>
                <Hash
                  height="8px"
                  onClick={e => {
                    e.stopPropagation();
                    this.setState({show: Boolean(!show)});
                  }}
                  {...hashStyle}
                />
                <Tooltip id={`addon-${name}`} effect="solid">
                  <span>
                    {(selectionIndex && formatLabels[selectionIndex]) || (
                      <FormattedMessage id={'fieldSelector.formatting'} />
                    )}
                  </span>
                </Tooltip>
              </ChickletAddon>
              {show && (
                <StyledPopover>
                  <DropdownList
                    options={formatLabels}
                    selectionIndex={selectionIndex}
                    onOptionSelected={(result, e) => {
                      e.stopPropagation();
                      this.setState({
                        show: false
                      });

                      const oldFieldsToShow = config.fieldsToShow[dataId];
                      const fieldsToShow = oldFieldsToShow.map(fieldToShow => {
                        return fieldToShow.name === name
                          ? {
                              name,
                              format: result
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

// Copyright (c) 2020 7ParkData.
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
import {Circle, Delete} from 'components/common/icons';
import {TOOLTIP_FORMATS} from 'constants/tooltip';
import DropdownList from 'components/common/item-selector/dropdown-list';
import {Tooltip} from 'components/common/styled-components';
import {FormattedMessage} from 'react-intl';
import onClickOutside from 'react-onclickoutside';

function getFormatLabels() {
  return Object.values(TOOLTIP_FORMATS).map(v => v.label);
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
function TooltipChickletFactory(dataId, config, onChange) {
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
      let selectionIndex = getFormatLabels().indexOf(field.format);
      if (selectionIndex < 0) selectionIndex = 0;
      let circleStyle = selectionIndex ? circleStyles.ACTIVE : circleStyles.IDLE;
      if (show) {
        circleStyle = circleStyles.SHOW;
      }

      return (
        <ChickletButton ref={node => (this.node = node)}>
          <ChickletTag>{name}</ChickletTag>
          <ChickletAddonWrapper>
            <ChickletAddon data-tip data-for={`addon-${name}`}>
              <Circle
                height="8px"
                onClick={e => {
                  e.stopPropagation();
                  this.setState({show: Boolean(!show)});
                }}
                {...circleStyle}
              />
              <Tooltip id={`addon-${name}`} effect="solid">
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
          <Delete onClick={disabled ? null : remove} />
        </ChickletButton>
      );
    }
  }
  return onClickOutside(TooltipChicklet);
}

export default TooltipChickletFactory;

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
import {SidePanelSection, SBFlexboxNoMargin, Button} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';
import DatasetTagFactory from 'components/side-panel/common/dataset-tag';
import TooltipChickletFactory from './tooltip-config/tooltip-chicklet';

TooltipConfigFactory.deps = [DatasetTagFactory];

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

function TooltipConfigFactory(DatasetTag) {
  class TooltipConfig extends Component {
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
                  const newConfig = {
                    ...config,
                    fieldsToShow: {
                      ...config.fieldsToShow,
                      [dataId]: fieldsToShow
                    }
                  };
                  onChange(newConfig);
                }}
                closeOnSelect={false}
                multiSelect
                inputTheme="secondary"
                CustomChickletComponent={TooltipChickletFactory(
                  dataId,
                  config,
                  onChange,
                  datasets[dataId].fields
                )}
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

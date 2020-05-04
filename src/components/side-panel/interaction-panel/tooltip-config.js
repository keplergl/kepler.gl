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

import React from 'react';
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

TooltipConfigFactory.deps = [DatasetTagFactory];

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

const ChickletAddon = styled.div`
  margin-right: 4px;
`;

function chickletAddon(name) {
  const isActive = false;
  return (
    <ChickletAddon data-tip data-for={`addon-${name}`}>
      <Circle
        height="8px"
        stroke={isActive ? '#1fbad6' : '#A0A7B4'}
        fill={isActive ? '#1fbad6' : 'rgba(0,0,0,0)'}
        onClick={e => {
          e.stopPropagation();
        }}
      />
      <Tooltip id={`addon-${name}`} effect="solid">
        <span>
          <FormattedMessage id={'fieldSelector.formatting'} />
        </span>
      </Tooltip>
    </ChickletAddon>
  );
}

function TooltipConfigFactory(DatasetTag) {
  const TooltipConfig = ({config, datasets, onChange}) => (
    <div>
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
                  [dataId]: fieldsToShow.map(d => d.name)
                }
              };
              onChange(newConfig);
            }}
            closeOnSelect={false}
            multiSelect
            inputTheme="secondary"
            addon={chickletAddon}
          />
        </SidePanelSection>
      ))}
    </div>
  );

  return TooltipConfig;
}

export default TooltipConfigFactory;

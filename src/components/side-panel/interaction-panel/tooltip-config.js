// Copyright (c) 2019 Uber Technologies, Inc.
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
import {DatasetTag} from '../source-data-catalog';

import {SidePanelSection} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';

function TooltipConfigFactory() {
  const TooltipConfig = ({config, datasets, onChange}) => (
    <div>
      {Object.keys(config.fieldsToShow).map(dataId => (
        <SidePanelSection key={dataId}>
          <DatasetTag dataset={datasets[dataId]} />
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
          />
        </SidePanelSection>
      ))}
    </div>
  );

  return TooltipConfig;
}

export default TooltipConfigFactory;

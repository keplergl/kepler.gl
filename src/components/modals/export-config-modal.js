// Copyright (c) 2018 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'components/common/switch';
import JSONPretty from 'react-json-pretty';

import {StyledModalContent} from 'components/common/styled-components';

const propTypes = {
  config: PropTypes.object.required
};

const StyledExportConfigSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 35px 0;
  width: 100%;
  justify-content: space-between;

  .description {
    width: 185px;

    .title {
      font-weight: 500;
      color: ${props => props.theme.textColorLT};
      font-size: 12px;
    }
    .subtitle {
      color: ${props => props.theme.textColor};
      font-size: 11px;
    }

    .note {
      color: ${props => props.theme.errorColor};
      font-size: 11px;
    }
  }

  .selection {
    padding-left: 50px;
    flex-grow: 1;

    .viewer {
      border: 1px solid ${props => props.theme.selectBorderColorLT};
      background-color: white;
      border-radius: 2px;
      display: inline-block;
      font: inherit;
      line-height: 1.5em;
      padding: 0.5em 3.5em 0.5em 1em;
      margin: 0;
      box-sizing: border-box;
      appearance: none;
      height: 300px;
      width: 100%;
      overflow-y: scroll;
    }
  }
`;

const StyledModalContentInner = styled.div`
  width: 100%;
`;

const ExportConfigModal = ({
  data,
  config,
  // actions
  onChangeExportData
}) => (
  <div className="export-config-modal">
    <StyledModalContent>
      <StyledModalContentInner className="export-config-modal__inner">
        <StyledExportConfigSection>
          <div className="description">
            <div className="title">
              Current Config
            </div>
            <div className="subtitle">
              You can copy or export the current Kepler.gl configuration.
            </div>
            <div className="note">
              * kepler.gl map config is coupled with loaded datasets.
              dataId key is used to bind layers and filters to a specific dataset.
              If you try to upload a configuration with a specific dataId you also need to make sure
              you existing dataset id match the dataId/s in the config.
            </div>
          </div>
          <div className="selection">
            <div className="viewer">
                <JSONPretty id="json-pretty" json={config}/>
            </div>
          </div>
        </StyledExportConfigSection>
        <StyledExportConfigSection>
          <div className="description">
            <div className="title">
              Export Current Map
            </div>
            <div className="subtitle">
              Export current map, including data and config. You can later load the same map by loading this file to kepler.gl.
            </div>
          </div>
          <div className="selection">
            <Switch type="checkbox"
                    id="export-map-config"
                    checked={data}
                    onChange={onChangeExportData}/>
          </div>
        </StyledExportConfigSection>
      </StyledModalContentInner>
    </StyledModalContent>
  </div>
);

ExportConfigModal.propTypes = propTypes;

const ExportConfigModalFactory = () => ExportConfigModal;
export default ExportConfigModalFactory;

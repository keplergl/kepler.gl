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
import PropTypes from 'prop-types';

import {FileType} from 'components/common/icons';
import {
  StyledModalContent,
  StyledType
} from 'components/common/styled-components';
import {
  EXPORT_MAP_FORMATS,
  EXPORT_MAP_FORMAT_OPTIONS
} from 'constants/default-settings';
import {
  StyledExportMapSection
} from './components';
import ExportHtmlMapFactory from './export-html-map';
import ExportJsonMapFactory from './export-json-map';

const propTypes = {
  options: PropTypes.object,
  onEditUserMapboxAccessToken: PropTypes.func.isRequired,
  onChangeExportData: PropTypes.func,
  onChangeExportMapType: PropTypes.func,
  mapFormat: PropTypes.string
};

const style = {width: '100%'};

const NO_OP = () => {};

ExportMapModalFactory.deps = [
  ExportHtmlMapFactory,
  ExportJsonMapFactory
];

function ExportMapModalFactory(
  ExportHtmlMap,
  ExportJsonMap
) {
  const ExportMapModal = React.memo(({
    config = {},
    onChangeExportData = NO_OP,
    onChangeExportMapFormat = NO_OP,
    onChangeExportMapHTMLMode = NO_OP,
    onEditUserMapboxAccessToken = NO_OP,
    options = {}
  }) => (
    <StyledModalContent className="export-map-modal">
      <div style={style}>
        <StyledExportMapSection>
          <div className="description">
            <div className="title">
              Map format
            </div>
            <div className="subtitle">
              Choose the format to export your map to
            </div>
          </div>
          <div className="selection">
            {EXPORT_MAP_FORMAT_OPTIONS.map(op =>
              <StyledType
                key={op.id}
                selected={options.format === op.id}
                available={op.available}
                onClick={() => op.available && onChangeExportMapFormat(op.id)}
              >
                <FileType ext={op.label} height="80px" fontSize="11px" />
              </StyledType>
            )}
          </div>
        </StyledExportMapSection>
        {{
          [EXPORT_MAP_FORMATS.HTML]:  (
            <ExportHtmlMap
              onChangeExportMapHTMLMode={onChangeExportMapHTMLMode}
              onEditUserMapboxAccessToken={onEditUserMapboxAccessToken}
              options={options[options.format]}
            />
          ),
          [EXPORT_MAP_FORMATS.JSON]: (
            <ExportJsonMap
              config={config}
              onChangeExportData={onChangeExportData}
              options={options[options.format]}
            />
          )
        }[options.format]}
      </div>
    </StyledModalContent>
  ));

  ExportMapModal.propTypes = propTypes;

  ExportMapModal.displayName = 'ExportMapModal';

  return ExportMapModal;
}

export default ExportMapModalFactory;

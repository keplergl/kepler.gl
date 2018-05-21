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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {calculateExportImageSize} from 'utils/export-image-utils';
import {
  RATIO_OPTIONS,
  RATIOS,
  RESOLUTION_OPTIONS
} from 'constants/default-settings';
import LoadingSpinner from 'components/common/loading-spinner';
import {StyledModalContent} from 'components/common/styled-components';
import Switch from 'components/common/switch';

const ImageOptionList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 250px;

  .image-option-section {
    .image-option-section-title {
      font-weight: 500;
      font-size: 14px;
    }
  }

  .button-list {
    display: flex;
    flex-direction: row;
    padding: 8px 0px;
  }

  input {
    margin-right: 8px;
  }
`;

const PreviewImageSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  padding: 30px;

  .dimension, .instruction {
    padding: 8px 0px;
  }

  .preview-image {
    background: #e2e2e2;
    border-radius: 4px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.18);
    width: 100%;
    padding-bottom: ${props => props.ratio === RATIOS.SCREEN ?
      `${100 * props.height/props.width}%`:
      (props.ratio === RATIOS.SIXTEEN_BY_NINE ? '56.25%' : '75%')
    };
    position: relative;
  }

  .preview-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .preview-image-spinner {
    position: absolute;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
  }
`;

const Button = styled.div`
  border-radius: 2px;
  border: 1px solid ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  color: ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  cursor: pointer;
  font-weight: 500;
  margin-right: 6px;
  padding: 6px 10px;

  :hover {
    color: ${props => props.available && props.theme.primaryBtnBgd};
    border: 1px solid ${props => props.available && props.theme.primaryBtnBgd};
  }
`;

class ExportImageModal extends Component {

  static propTypes = {
    height: PropTypes.number.isRequired,
    ratio: PropTypes.string.isRequired,
    resolution: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    exporting: PropTypes.bool.isRequired,
    imageDataUri: PropTypes.string,
    // callbacks
    onChangeRatio: PropTypes.func.isRequired,
    onChangeResolution: PropTypes.func.isRequired,
    onToggleLegend: PropTypes.func.isRequired
  };

  render() {
    const {
      height,
      legend,
      ratio,
      resolution,
      width,
      exporting,
      imageDataUri,
      // callbacks:
      onChangeRatio,
      onChangeResolution,
      onToggleLegend
    } = this.props;

    const exportImageSize = calculateExportImageSize({
      width, height, ratio, resolution
    });

    return (
      <div className="export-image-modal">
        <StyledModalContent>
          <ImageOptionList>
            <div className="image-option-section">
              <div className="image-option-section-title">Ratio</div>
              Choose the ratio for various usages.
              <div className="button-list">
                {RATIO_OPTIONS.map(op => 
                  <Button
                    key={op.id}
                    selected={ratio === op.id}
                    onClick={() => onChangeRatio({ratio: op.id})}
                  >
                    {op.label}
                  </Button>
                )}
              </div>
            </div>
            <div className="image-option-section">
              <div className="image-option-section-title">Resolution</div>
              High resolution is better for prints.
              <div className="button-list">
                {RESOLUTION_OPTIONS.map(op => 
                  <Button
                    key={op.id}
                    selected={resolution === op.id}
                    onClick={() => op.available && onChangeResolution({resolution: op.id})}
                  >
                    {op.label}
                  </Button>
                )}
              </div>
            </div>
            <div className="image-option-section">
              <div className="image-option-section-title">Map Legend</div>
              <Switch type="checkbox"
                      id="add-map-legend"
                      checked={legend}
                      label="Add legend on map"
                      onChange={onToggleLegend}/>
            </div>
          </ImageOptionList>
          <PreviewImageSection ratio={ratio} width={width} height={height}>
            <div className="dimension">{`${exportImageSize.width} x ${exportImageSize.height}`}</div>
            <div className="preview-image">
              {exporting ?
                <div className="preview-image-spinner"><LoadingSpinner /></div> :
                <img className="preview-image-placeholder" src={imageDataUri} />
              }
            </div>
          </PreviewImageSection>
        </StyledModalContent>
      </div>
    );
  }  
}

const ExportImageModalFactory = () => ExportImageModal;
export default ExportImageModalFactory;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import ImagePreview from '../common/image-preview';
import {SetExportImageSettingUpdaterAction} from '@kepler.gl/actions';

import {EXPORT_IMG_RATIO_OPTIONS, EXPORT_IMG_RESOLUTION_OPTIONS} from '@kepler.gl/constants';
import {ExportImage} from '@kepler.gl/types';
import {StyledModalContent, SelectionButton, CheckMark} from '../common/styled-components';
import Switch from '../common/switch';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';

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
    flex-wrap: wrap;
    gap: 4px;
  }

  .resolution-dropdown {
    padding: 8px 0px;
    
    select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d3d3d3;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      background-color: white;
      font-family: inherit;
      appearance: none;
      
      &:hover {
        border-color: #999;
        background-color: #f9f9f9;
      }
      
      &:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }
      
      &:disabled {
        background-color: #f5f5f5;
        color: #999;
        cursor: not-allowed;
      }
    }
  }

  input {
    margin-right: 8px;
  }
`;

export interface ExportImageModalProps {
  exportImage: ExportImage;
  mapW: number;
  mapH: number;
  onUpdateImageSetting: (payload: SetExportImageSettingUpdaterAction['payload']) => void;
  cleanupExportImage: () => void;
  intl: IntlShape;
}

const ExportImageModalFactory = () => {
  const ExportImageModal: React.FC<ExportImageModalProps> = ({
    mapW,
    mapH,
    exportImage,
    onUpdateImageSetting,
    cleanupExportImage,
    intl
  }) => {
    const {legend, ratio, resolution} = exportImage;

    // Filter resolutions based on selected ratio
    const filteredResolutions = useMemo(() => {
      if (ratio === 'SCREEN') {
        // Show scale options (1x, 2x) for original screen
        return EXPORT_IMG_RESOLUTION_OPTIONS.filter(op => 
          ['ONE_X', 'TWO_X'].includes(String(op.id))
        );
      } else if (ratio === 'FOUR_BY_THREE') {
        // Show only 4:3 resolutions
        return EXPORT_IMG_RESOLUTION_OPTIONS.filter(op => 
          ['1024x768', '1280x960', '1600x1200', '1920x1440'].includes(String(op.id))
        );
      } else if (ratio === 'SIXTEEN_BY_NINE') {
        // Show only 16:9 resolutions
        return EXPORT_IMG_RESOLUTION_OPTIONS.filter(op => 
          ['1280x720', '1600x900', '1920x1080', '2560x1440'].includes(String(op.id))
        );
      }
      // For CUSTOM, don't show resolution options
      return [];
    }, [ratio]);

    useEffect(() => {
      onUpdateImageSetting({
        exporting: true
      });
      return cleanupExportImage;
    }, [onUpdateImageSetting, cleanupExportImage]);

    useEffect(() => {
      if (mapH !== exportImage.mapH || mapW !== exportImage.mapW) {
        onUpdateImageSetting({
          mapH,
          mapW
        });
      }
    }, [mapH, mapW, exportImage, onUpdateImageSetting]);

    return (
      <StyledModalContent className="export-image-modal">
        <ImageOptionList>
          <div className="image-option-section">
            <div className="image-option-section-title">
              <FormattedMessage id={'modal.exportImage.ratioTitle'} />
            </div>
            <FormattedMessage id={'modal.exportImage.ratioDescription'} />
            <div className="button-list" id="export-image-modal__option_ratio">
              {EXPORT_IMG_RATIO_OPTIONS.filter(op => !op.hidden).map(op => (
                <SelectionButton
                  key={op.id}
                  selected={ratio === op.id}
                  onClick={() => onUpdateImageSetting({ratio: op.id})}
                >
                  <FormattedMessage id={op.label} />
                  {ratio === op.id && <CheckMark />}
                </SelectionButton>
              ))}
            </div>
          </div>
          {ratio !== 'CUSTOM' && (
            <div className="image-option-section">
              <div className="image-option-section-title">
                <FormattedMessage id={'modal.exportImage.resolutionTitle'} />
              </div>
              <FormattedMessage id={'modal.exportImage.resolutionDescription'} />
              {ratio === 'SCREEN' ? (
                <div className="button-list" id="export-image-modal__option_resolution">
                  {filteredResolutions.map(op => (
                    <SelectionButton
                      key={op.id}
                      selected={resolution === op.id}
                      onClick={() => op.available && onUpdateImageSetting({resolution: op.id})}
                    >
                      {op.label}
                      {resolution === op.id && <CheckMark />}
                    </SelectionButton>
                  ))}
                </div>
              ) : (
                <div className="resolution-dropdown" id="export-image-modal__option_resolution">
                  <select 
                    value={resolution || ''} 
                    onChange={(e) => onUpdateImageSetting({resolution: e.target.value as any})}
                  >
                    <option value="">Select a resolution...</option>
                    {filteredResolutions.map(op => (
                      <option key={op.id} value={op.id}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          <div className="image-option-section">
            <div className="image-option-section-title">
              <FormattedMessage id={'modal.exportImage.mapLegendTitle'} />
            </div>
            <Switch
              type="checkbox"
              id="add-map-legend"
              checked={legend}
              label={intl.formatMessage({id: 'modal.exportImage.mapLegendAdd'})}
              onChange={() => onUpdateImageSetting({legend: !legend})}
            />
          </div>
        </ImageOptionList>
        <ImagePreview exportImage={exportImage} />
      </StyledModalContent>
    );
  };

  return injectIntl(ExportImageModal);
};

export default ExportImageModalFactory;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import ImagePreview from '../common/image-preview';
import {SetExportImageSettingUpdaterAction} from '@kepler.gl/actions';

import {
  EXPORT_IMG_RATIO_OPTIONS,
  EXPORT_IMG_RATIOS,
  OneXResolutionOption,
  TwoXResolutionOption,
  Resolution1024x768Option,
  Resolution1280x960Option,
  Resolution1600x1200Option,
  Resolution1920x1440Option,
  Resolution1280x720Option,
  Resolution1600x900Option,
  Resolution1920x1080Option,
  Resolution2560x1440Option
} from '@kepler.gl/constants';
import type {ExportResolutionOption} from '@kepler.gl/constants';
import type {ExportImage} from '@kepler.gl/types';
import {StyledModalContent, SelectionButton, CheckMark} from '../common/styled-components';
import Switch from '../common/switch';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';

const ImageOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
    padding: 0px;
    margin-top: 8px;
    margin-bottom: 8px;

    select {
      width: 100%;
      padding: 6px 12px;
      border: 1px solid #d3d3d3;
      border-radius: 2px;
      font-size: 14px;
      cursor: pointer;
      background-color: white;
      font-family: inherit;
      appearance: none;
      height: 32px;

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

// Define resolution options for each ratio as constants
const SCREEN_RESOLUTION_OPTIONS = [OneXResolutionOption, TwoXResolutionOption];

const FOUR_BY_THREE_RESOLUTION_OPTIONS = [
  Resolution1024x768Option,
  Resolution1280x960Option,
  Resolution1600x1200Option,
  Resolution1920x1440Option
];

const SIXTEEN_BY_NINE_RESOLUTION_OPTIONS = [
  Resolution1280x720Option,
  Resolution1600x900Option,
  Resolution1920x1080Option,
  Resolution2560x1440Option
];

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
      if (ratio === EXPORT_IMG_RATIOS.SCREEN) {
        return SCREEN_RESOLUTION_OPTIONS;
      } else if (ratio === EXPORT_IMG_RATIOS.FOUR_BY_THREE) {
        return FOUR_BY_THREE_RESOLUTION_OPTIONS;
      } else if (ratio === EXPORT_IMG_RATIOS.SIXTEEN_BY_NINE) {
        return SIXTEEN_BY_NINE_RESOLUTION_OPTIONS;
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

    useEffect(() => {
      // Keep resolution in sync with the selected ratio and available options.
      // If the current resolution is not available for this ratio, reset it to the first option.
      if (!filteredResolutions || !filteredResolutions.length) {
        return;
      }

      const isValidResolution =
        Boolean(resolution) && filteredResolutions.some(op => op.id === resolution);

      if (!isValidResolution) {
        onUpdateImageSetting({resolution: filteredResolutions[0].id});
      }
    }, [ratio, filteredResolutions, resolution, onUpdateImageSetting]);

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
          {ratio !== EXPORT_IMG_RATIOS.CUSTOM && (
            <div className="image-option-section">
               <div
                 className="image-option-section-title"
                 id="export-image-modal__resolution-title"
               >
                <FormattedMessage id={'modal.exportImage.resolutionTitle'} />
              </div>
              <FormattedMessage id={'modal.exportImage.resolutionDescription'} />
              {ratio === EXPORT_IMG_RATIOS.SCREEN ? (
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
                    aria-labelledby="export-image-modal__resolution-title"
                    onChange={e => {
                      const value = e.target.value;
                      // Only update if a valid resolution is selected
                      if (value && filteredResolutions.some(op => op.id === value)) {
                        // Type-safe: we've verified the value exists in filteredResolutions
                        onUpdateImageSetting({resolution: value as ExportResolutionOption});
                      }
                      // If empty string selected, optionally reset to first available resolution
                      else if (!value && filteredResolutions.length > 0) {
                        onUpdateImageSetting({resolution: filteredResolutions[0].id});
                      }
                    }}
                  >
                    <option value="">
                      {intl.formatMessage({id: 'modal.exportImage.resolutionPlaceholder'})}
                    </option>
                    {filteredResolutions.map(op => (
                      <option key={op.id} value={op.id} disabled={!op.available}>
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
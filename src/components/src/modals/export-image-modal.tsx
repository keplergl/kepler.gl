// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useId, useMemo, useState} from 'react';
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
import {
  StyledModalContent,
  SelectionButton,
  CheckMark,
  InputLight,
  Button
} from '../common/styled-components';
import Switch from '../common/switch';
import TippyTooltip from '../common/tippy-tooltip';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  getApplicationConfig,
  isValidCustomPngSize,
  MAX_CUSTOM_PNG_EDGE,
  MAX_CUSTOM_PNG_PIXELS
} from '@kepler.gl/utils';

const ImageOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 250px;
  flex-shrink: 0;

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

  #export-image-modal__option_ratio {
    flex-wrap: nowrap;

    button {
      margin-right: 0;
      padding: 6px 8px;
      font: inherit;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  #export-image-modal__option_ratio button,
  .custom-dimensions input,
  .custom-dimensions button,
  .custom-dimensions-help {
    height: 28px;
    box-sizing: border-box;
  }

  .option-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;

    .kg-checkbox__label {
      margin-bottom: 0;
    }
  }

  .transparent-background-option {
    display: flex;
    align-items: center;
  }

  .transparent-background-help,
  .custom-dimensions-help {
    margin-left: 4px;
    color: ${props => props.theme.subtextColorLT};
    cursor: help;

    &:hover {
      color: ${props => props.theme.textColorLT};
    }
  }

  .file-name-input {
    margin-top: 8px;

    input {
      width: 100%;
      padding: 6px 12px;
      border: 1px solid #d3d3d3;
      border-radius: 2px;
      font-size: ${props => props.theme.inputFontSize};
      font-family: inherit;
      height: 32px;
      box-sizing: border-box;

      &:hover {
        border-color: #999;
      }

      &:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }
    }
  }

  .custom-dimensions {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 8px 0;

    label {
      min-width: 0;
      flex: 1;
    }

    input {
      width: 100%;
      margin: 0;
    }

    button,
    .custom-dimensions-help {
      flex-shrink: 0;
    }

    button {
      white-space: nowrap;
    }

    .custom-dimensions-help {
      display: flex;
      align-items: center;
      margin-left: 0;
    }
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

function CustomDimensions({
  initialWidth,
  initialHeight,
  limitsHelp,
  onApply
}: {
  initialWidth: number;
  initialHeight: number;
  limitsHelp: string;
  onApply: (width: number, height: number) => void;
}) {
  const helpId = useId();
  const [width, setWidth] = useState(String(initialWidth));
  const [height, setHeight] = useState(String(initialHeight));
  const valid = isValidCustomPngSize(Number(width), Number(height));
  return (
    <>
      <div className="custom-dimensions">
        <label>
          <FormattedMessage id="modal.exportImage.customWidth" />
          <InputLight
            type="number"
            min={1}
            max={MAX_CUSTOM_PNG_EDGE}
            step={1}
            value={width}
            aria-describedby={helpId}
            aria-invalid={!valid}
            onChange={event => setWidth(event.target.value)}
          />
        </label>
        <label>
          <FormattedMessage id="modal.exportImage.customHeight" />
          <InputLight
            type="number"
            min={1}
            max={MAX_CUSTOM_PNG_EDGE}
            step={1}
            value={height}
            aria-describedby={helpId}
            aria-invalid={!valid}
            onChange={event => setHeight(event.target.value)}
          />
        </label>
        <Button
          type="button"
          secondary
          small
          disabled={!valid}
          onClick={() => {
            if (valid) onApply(Number(width), Number(height));
          }}
        >
          <FormattedMessage id="modal.exportImage.applyDimensions" />
        </Button>
        <TippyTooltip placement="top" isLightTheme render={() => <div>{limitsHelp}</div>}>
          <span className="custom-dimensions-help" tabIndex={0} aria-label={limitsHelp}>
            (?)
          </span>
        </TippyTooltip>
      </div>
      <span id={helpId} hidden>
        {limitsHelp}
      </span>
    </>
  );
}

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
    const {legend, charts, transparentBackground, ratio, resolution, fileName} = exportImage;
    const {imageW, imageH} = exportImage.imageSize;
    const initialDimensions = isValidCustomPngSize(imageW, imageH)
      ? {width: imageW, height: imageH}
      : {width: 1920, height: 1080};
    const chartsEnabled = Boolean(getApplicationConfig().enableChartsPanel);
    const transparentBackgroundHelp = intl.formatMessage({
      id: 'modal.exportImage.transparentBackgroundHelp'
    });

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
      const restoreCustomDimensions =
        exportImage.ratio === EXPORT_IMG_RATIOS.CUSTOM && !exportImage.customDimensions;
      if (mapH !== exportImage.mapH || mapW !== exportImage.mapW || restoreCustomDimensions) {
        onUpdateImageSetting({
          mapH,
          mapW,
          ...(restoreCustomDimensions ? {customDimensions: initialDimensions} : {})
        });
      }
    }, [
      mapH,
      mapW,
      exportImage,
      initialDimensions.width,
      initialDimensions.height,
      onUpdateImageSetting
    ]);

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
              <FormattedMessage id={'modal.exportFileName.title'} />
            </div>
            <FormattedMessage id={'modal.exportFileName.subtitle'} />
            <div className="file-name-input">
              <input
                id="export-image-file-name"
                type="text"
                value={fileName || ''}
                placeholder={intl.formatMessage({id: 'modal.exportFileName.placeholder'})}
                aria-label={intl.formatMessage({id: 'modal.exportFileName.title'})}
                onChange={event => onUpdateImageSetting({fileName: event.target.value})}
                onMouseDown={event => event.stopPropagation()}
              />
            </div>
          </div>
          <div className="image-option-section">
            <div className="image-option-section-title">
              <FormattedMessage id={'modal.exportImage.ratioTitle'} />
            </div>
            <FormattedMessage id={'modal.exportImage.ratioDescription'} />
            <div className="button-list" id="export-image-modal__option_ratio">
              {EXPORT_IMG_RATIO_OPTIONS.filter(op => !op.hidden).map(op => (
                <SelectionButton
                  key={op.id}
                  as="button"
                  type="button"
                  aria-pressed={ratio === op.id}
                  selected={ratio === op.id}
                  onClick={() => {
                    if (op.id === ratio && op.id === EXPORT_IMG_RATIOS.CUSTOM) return;

                    onUpdateImageSetting(
                      op.id === EXPORT_IMG_RATIOS.CUSTOM
                        ? {
                            ratio: op.id,
                            customDimensions: exportImage.customDimensions ?? initialDimensions
                          }
                        : {ratio: op.id}
                    );
                  }}
                >
                  <FormattedMessage id={op.label} />
                  {ratio === op.id && <CheckMark />}
                </SelectionButton>
              ))}
            </div>
            {ratio === EXPORT_IMG_RATIOS.CUSTOM ? (
              <CustomDimensions
                initialWidth={exportImage.customDimensions?.width ?? initialDimensions.width}
                initialHeight={exportImage.customDimensions?.height ?? initialDimensions.height}
                limitsHelp={intl.formatMessage(
                  {id: 'modal.exportImage.customResolutionLimits'},
                  {edge: MAX_CUSTOM_PNG_EDGE, pixels: MAX_CUSTOM_PNG_PIXELS}
                )}
                onApply={(width, height) =>
                  onUpdateImageSetting({customDimensions: {width, height}})
                }
              />
            ) : (
              <>
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
                      aria-label={intl.formatMessage({id: 'modal.exportImage.resolutionTitle'})}
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
              </>
            )}
          </div>
          <div className="image-option-section">
            <div className="image-option-section-title">
              <FormattedMessage id={'modal.exportImage.optionsTitle'} />
            </div>
            <div className="option-list">
              <div className="transparent-background-option">
                <Switch
                  type="checkbox"
                  id="export-transparent-background"
                  checked={Boolean(transparentBackground)}
                  label={intl.formatMessage({id: 'modal.exportImage.transparentBackground'})}
                  onChange={() =>
                    onUpdateImageSetting({transparentBackground: !transparentBackground})
                  }
                />
                <TippyTooltip
                  placement="top"
                  isLightTheme
                  render={() => <div>{transparentBackgroundHelp}</div>}
                >
                  <span
                    className="transparent-background-help"
                    tabIndex={0}
                    aria-label={transparentBackgroundHelp}
                  >
                    (?)
                  </span>
                </TippyTooltip>
              </div>
              <Switch
                type="checkbox"
                id="add-map-legend"
                checked={legend}
                label={intl.formatMessage({id: 'modal.exportImage.mapLegendAdd'})}
                onChange={() => onUpdateImageSetting({legend: !legend})}
              />
              {chartsEnabled ? (
                <Switch
                  type="checkbox"
                  id="add-map-charts"
                  checked={Boolean(charts)}
                  label={intl.formatMessage({id: 'modal.exportImage.chartsAdd'})}
                  onChange={() => onUpdateImageSetting({charts: !charts})}
                />
              ) : null}
            </div>
          </div>
        </ImageOptionList>
        <ImagePreview
          exportImage={exportImage}
          showDimension={ratio === EXPORT_IMG_RATIOS.CUSTOM}
        />
      </StyledModalContent>
    );
  };

  return injectIntl(ExportImageModal);
};

export default ExportImageModalFactory;

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled, {css} from 'styled-components';

import {MapState, RGBColor} from '@kepler.gl/types';
import {GlobeConfig} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';

import {EyeSeen, EyeUnseen} from '../../common/icons';
import {
  PanelLabel,
  PanelContent,
  PanelLabelBold,
  PanelLabelWrapper
} from '../../common/styled-components';
import PanelHeaderActionFactory from '../panel-header-action';
import RangeSliderFactory from '../../common/range-slider';
import LayerGroupColorPickerFactory from './map-layer-group-color-picker';

const StyledGlobeConfigPanel = styled.div`
  padding-bottom: 6px;
`;

const StyledConfigRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }

  .layer-group__visibility-toggle {
    margin-right: 12px;
  }
`;

const disableSlider = css`
  opacity: 0.5;
  pointer-events: none;
`;

const SliderWrapper = styled.div<{$enabled?: boolean}>`
  flex-grow: 1;
  margin-left: 4px;
  ${props => (props.$enabled ? '' : disableSlider)}
`;

// Slider rows (Day/Night, Sun Azimuth) put the label and the slider side by side.
// Give the label only the width its (short) text needs so the slider gets the
// rest of the row, matching studio-monorepo's usable slider width. The child
// indent is kept small (~half an eye-icon width) so the sub-row eye icon lines
// up close to the parent (atmosphere) row like it does in studio, rather than
// being pushed ~1.5 icon widths to the right.
const SliderRow = styled(StyledConfigRow)`
  align-items: center;

  .side-panel-panel__label-wrapper {
    flex: 0 0 auto;
    padding-left: 8px;
    white-space: nowrap;
  }
`;

const LayerLabel = styled(PanelLabelBold)<{$active: boolean}>`
  color: ${props => (props.$active ? props.theme.textColor : props.theme.labelColor)};
`;

const ChildRow = styled(StyledConfigRow)`
  .side-panel-panel__label-wrapper {
    padding-left: 8px;
  }
`;

export type GlobeConfigPanelProps = {
  mapState: MapState;
  onGlobeConfigChange: (config: Partial<GlobeConfig>) => void;
};

GlobeConfigPanelFactory.deps = [
  PanelHeaderActionFactory,
  RangeSliderFactory,
  LayerGroupColorPickerFactory
];

function GlobeConfigPanelFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  LayerGroupColorPicker: ReturnType<typeof LayerGroupColorPickerFactory>
) {
  const GlobeConfigPanel: React.FC<GlobeConfigPanelProps> = ({mapState, onGlobeConfigChange}) => {
    const globeConfig = mapState.globe?.config;

    const onToggle = useCallback(
      (
        key: keyof GlobeConfig,
        childKeys?: (keyof GlobeConfig)[],
        parentKey?: keyof GlobeConfig
      ) => {
        if (!globeConfig) return;
        const newValue = !globeConfig[key];
        const update: Partial<GlobeConfig> = {[key]: newValue};
        if (childKeys) {
          childKeys.forEach(childKey => {
            update[childKey] = newValue as any;
          });
        }
        if (parentKey && newValue === true) {
          update[parentKey] = true as any;
        }
        onGlobeConfigChange(update);
      },
      [globeConfig, onGlobeConfigChange]
    );

    const onSliderChange = useCallback(
      (key: keyof GlobeConfig, value: number[]) => {
        onGlobeConfigChange({[key]: value[1]} as Partial<GlobeConfig>);
      },
      [onGlobeConfigChange]
    );

    const onColorChange = useCallback(
      (key: keyof GlobeConfig, color: RGBColor) => {
        onGlobeConfigChange({[key]: color} as Partial<GlobeConfig>);
      },
      [onGlobeConfigChange]
    );

    if (!mapState.globe?.enabled || !globeConfig) {
      return null;
    }

    return (
      <StyledGlobeConfigPanel>
        <PanelLabel>
          <FormattedMessage id="mapManager.globeLayers" />
        </PanelLabel>
        <PanelContent>
          {/* Atmosphere */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-atmosphere-toggle"
                tooltip={globeConfig.atmosphere ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('atmosphere', ['terminator', 'azimuth'])}
                IconComponent={globeConfig.atmosphere ? EyeSeen : EyeUnseen}
                active={globeConfig.atmosphere}
                flush
              />
              <LayerLabel $active={globeConfig.atmosphere}>
                <FormattedMessage id="mapLayers.atmosphere" />
              </LayerLabel>
            </PanelLabelWrapper>
          </StyledConfigRow>

          {/* Terminator (child of atmosphere) */}
          <SliderRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-terminator-toggle"
                tooltip={globeConfig.terminator ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('terminator', undefined, 'atmosphere')}
                IconComponent={globeConfig.terminator ? EyeSeen : EyeUnseen}
                active={globeConfig.terminator && globeConfig.atmosphere}
                flush
              />
              <LayerLabel $active={globeConfig.terminator && globeConfig.atmosphere}>
                <FormattedMessage id="mapLayers.terminator" />
              </LayerLabel>
            </PanelLabelWrapper>
            <SliderWrapper $enabled={globeConfig.terminator && globeConfig.atmosphere}>
              <RangeSlider
                range={[0, 1]}
                value0={0}
                value1={globeConfig.terminatorOpacity}
                step={0.01}
                isRanged={false}
                onChange={val => onSliderChange('terminatorOpacity', val)}
                inputTheme="secondary"
                showInput
              />
            </SliderWrapper>
          </SliderRow>

          {/* Sun Azimuth (child of atmosphere) */}
          <SliderRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-azimuth-toggle"
                tooltip={globeConfig.azimuth ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('azimuth', undefined, 'atmosphere')}
                IconComponent={globeConfig.azimuth ? EyeSeen : EyeUnseen}
                active={globeConfig.azimuth && globeConfig.atmosphere}
                flush
              />
              <LayerLabel $active={globeConfig.azimuth && globeConfig.atmosphere}>
                <FormattedMessage id="mapLayers.sunAzimuth" />
              </LayerLabel>
            </PanelLabelWrapper>
            <SliderWrapper $enabled={globeConfig.azimuth && globeConfig.atmosphere}>
              <RangeSlider
                range={[0, 360]}
                value0={0}
                value1={globeConfig.azimuthAngle}
                step={1}
                isRanged={false}
                onChange={val => onSliderChange('azimuthAngle', val)}
                inputTheme="secondary"
                showInput
              />
            </SliderWrapper>
          </SliderRow>

          {/* Basemap */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-basemap-toggle"
                tooltip={globeConfig.basemap ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('basemap', ['labels', 'adminLines', 'water'])}
                IconComponent={globeConfig.basemap ? EyeSeen : EyeUnseen}
                active={globeConfig.basemap}
                flush
              />
              <LayerLabel $active={globeConfig.basemap}>
                <FormattedMessage id="mapLayers.basemap" />
              </LayerLabel>
            </PanelLabelWrapper>
          </StyledConfigRow>

          {/* Labels (child of basemap) */}
          <ChildRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-labels-toggle"
                tooltip={globeConfig.labels ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('labels', undefined, 'basemap')}
                IconComponent={globeConfig.labels ? EyeSeen : EyeUnseen}
                active={globeConfig.labels && globeConfig.basemap}
                flush
              />
              <LayerLabel $active={globeConfig.labels && globeConfig.basemap}>
                <FormattedMessage id="mapLayers.label" />
              </LayerLabel>
            </PanelLabelWrapper>
            <LayerGroupColorPicker
              slug="globe-labels"
              color={globeConfig.labelsColor}
              onColorChange={(color: RGBColor) => onColorChange('labelsColor', color)}
              extraMarginRight={false}
              disabled={!(globeConfig.labels && globeConfig.basemap)}
            />
          </ChildRow>

          {/* Admin Lines (child of basemap) */}
          <ChildRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-admin-toggle"
                tooltip={globeConfig.adminLines ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('adminLines', undefined, 'basemap')}
                IconComponent={globeConfig.adminLines ? EyeSeen : EyeUnseen}
                active={globeConfig.adminLines && globeConfig.basemap}
                flush
              />
              <LayerLabel $active={globeConfig.adminLines && globeConfig.basemap}>
                <FormattedMessage id="mapLayers.adminBorders" />
              </LayerLabel>
            </PanelLabelWrapper>
            <LayerGroupColorPicker
              slug="globe-admin"
              color={globeConfig.adminLinesColor}
              onColorChange={(color: RGBColor) => onColorChange('adminLinesColor', color)}
              extraMarginRight={false}
              disabled={!(globeConfig.adminLines && globeConfig.basemap)}
            />
          </ChildRow>

          {/* Water (child of basemap) */}
          <ChildRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-water-toggle"
                tooltip={globeConfig.water ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('water', undefined, 'basemap')}
                IconComponent={globeConfig.water ? EyeSeen : EyeUnseen}
                active={globeConfig.water && globeConfig.basemap}
                flush
              />
              <LayerLabel $active={globeConfig.water && globeConfig.basemap}>
                <FormattedMessage id="mapLayers.water" />
              </LayerLabel>
            </PanelLabelWrapper>
            <LayerGroupColorPicker
              slug="globe-water"
              color={globeConfig.waterColor}
              onColorChange={(color: RGBColor) => onColorChange('waterColor', color)}
              extraMarginRight={false}
              disabled={!(globeConfig.water && globeConfig.basemap)}
            />
          </ChildRow>

          {/* Globe Surface (always visible, only has color) */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <LayerLabel $active={true} style={{marginLeft: '28px'}}>
                <FormattedMessage id="mapLayers.surface" />
              </LayerLabel>
            </PanelLabelWrapper>
            <LayerGroupColorPicker
              slug="globe-surface"
              color={globeConfig.surfaceColor}
              onColorChange={(color: RGBColor) => onColorChange('surfaceColor', color)}
              extraMarginRight={false}
              disabled={false}
            />
          </StyledConfigRow>

          {/* Background (empty space around the globe, always visible) */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <LayerLabel $active={true} style={{marginLeft: '28px'}}>
                <FormattedMessage id="mapLayers.background" />
              </LayerLabel>
            </PanelLabelWrapper>
            <LayerGroupColorPicker
              slug="globe-background"
              color={globeConfig.backgroundColor}
              onColorChange={(color: RGBColor) => onColorChange('backgroundColor', color)}
              extraMarginRight={false}
              disabled={false}
            />
          </StyledConfigRow>
        </PanelContent>
      </StyledGlobeConfigPanel>
    );
  };

  GlobeConfigPanel.displayName = 'GlobeConfigPanel';
  return GlobeConfigPanel;
}

export default GlobeConfigPanelFactory;

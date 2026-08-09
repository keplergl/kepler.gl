// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled, {css} from 'styled-components';

import {MapState, RGBColor} from '@kepler.gl/types';
import {GlobeConfig, DEFAULT_GLOBE_CONFIG} from '@kepler.gl/constants';
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

  /* Give slider/color controls more horizontal room. */
  .side-panel-panel__content {
    padding-right: 2px;
  }
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

// Atmosphere slider rows: shrink the numeric inputs by 5px so the track can use
// the extra space (default theme.sliderInputWidth is 56).
const AtmosphereSliderWrapper = styled(SliderWrapper)`
  input {
    width: ${props => props.theme.sliderInputWidth - 5}px;
  }
`;

// Keep color swatches slightly inset from the panel edge (sliders already get
// inset from their numeric inputs; swatches need an explicit margin).
const ColorPickerSlot = styled.div`
  margin-right: 10px;
`;

// Slider rows (Day/Night, Sun Azimuth) put the label and the slider side by side.
// Give the label only the width its (short) text needs so the slider gets the
// rest of the row. The child indent is kept small (~half an eye-icon width) so the
// sub-row eye icon lines up close to the parent (atmosphere) row, rather than
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

          {/* Huge Halo (child of atmosphere) — additive soft glow on top of realistic halo */}
          <ChildRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-huge-halo-toggle"
                tooltip={globeConfig.hugeHalo ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('hugeHalo', undefined, 'atmosphere')}
                IconComponent={globeConfig.hugeHalo ? EyeSeen : EyeUnseen}
                active={Boolean(globeConfig.hugeHalo && globeConfig.atmosphere)}
                flush
              />
              <LayerLabel $active={Boolean(globeConfig.hugeHalo && globeConfig.atmosphere)}>
                <FormattedMessage id="mapLayers.hugeHalo" />
              </LayerLabel>
            </PanelLabelWrapper>
          </ChildRow>

          {/* Huge Halo radius multiplier */}
          <SliderRow>
            <PanelLabelWrapper>
              <LayerLabel
                $active={Boolean(globeConfig.hugeHalo && globeConfig.atmosphere)}
                style={{paddingLeft: 28}}
              >
                <FormattedMessage id="mapLayers.hugeHaloRadius" />
              </LayerLabel>
            </PanelLabelWrapper>
            <AtmosphereSliderWrapper $enabled={Boolean(globeConfig.hugeHalo && globeConfig.atmosphere)}>
              <RangeSlider
                range={[0.5, 3.5]}
                value0={0}
                value1={globeConfig.hugeHaloRadius ?? DEFAULT_GLOBE_CONFIG.hugeHaloRadius}
                step={0.05}
                isRanged={false}
                onChange={val => onSliderChange('hugeHaloRadius', val)}
                inputTheme="secondary"
                showInput
              />
            </AtmosphereSliderWrapper>
          </SliderRow>

          {/* Huge Halo opacity */}
          <SliderRow>
            <PanelLabelWrapper>
              <LayerLabel
                $active={Boolean(globeConfig.hugeHalo && globeConfig.atmosphere)}
                style={{paddingLeft: 28}}
              >
                <FormattedMessage id="mapLayers.hugeHaloOpacity" />
              </LayerLabel>
            </PanelLabelWrapper>
            <AtmosphereSliderWrapper $enabled={Boolean(globeConfig.hugeHalo && globeConfig.atmosphere)}>
              <RangeSlider
                range={[0, 1]}
                value0={0}
                value1={globeConfig.hugeHaloOpacity ?? DEFAULT_GLOBE_CONFIG.hugeHaloOpacity}
                step={0.01}
                isRanged={false}
                onChange={val => onSliderChange('hugeHaloOpacity', val)}
                inputTheme="secondary"
                showInput
              />
            </AtmosphereSliderWrapper>
          </SliderRow>

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
            <AtmosphereSliderWrapper $enabled={globeConfig.terminator && globeConfig.atmosphere}>
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
            </AtmosphereSliderWrapper>
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
            <AtmosphereSliderWrapper $enabled={globeConfig.azimuth && globeConfig.atmosphere}>
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
            </AtmosphereSliderWrapper>
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
            <ColorPickerSlot>
              <LayerGroupColorPicker
                slug="globe-labels"
                color={globeConfig.labelsColor}
                onColorChange={(color: RGBColor) => onColorChange('labelsColor', color)}
                extraMarginRight={true}
                disabled={!(globeConfig.labels && globeConfig.basemap)}
              />
            </ColorPickerSlot>
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
            <ColorPickerSlot>
              <LayerGroupColorPicker
                slug="globe-admin"
                color={globeConfig.adminLinesColor}
                onColorChange={(color: RGBColor) => onColorChange('adminLinesColor', color)}
                extraMarginRight={true}
                disabled={!(globeConfig.adminLines && globeConfig.basemap)}
              />
            </ColorPickerSlot>
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
            <ColorPickerSlot>
              <LayerGroupColorPicker
                slug="globe-water"
                color={globeConfig.waterColor}
                onColorChange={(color: RGBColor) => onColorChange('waterColor', color)}
                extraMarginRight={true}
                disabled={!(globeConfig.water && globeConfig.basemap)}
              />
            </ColorPickerSlot>
          </ChildRow>

          {/* Globe Surface (always visible, only has color) */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <LayerLabel $active={true} style={{marginLeft: '28px'}}>
                <FormattedMessage id="mapLayers.surface" />
              </LayerLabel>
            </PanelLabelWrapper>
            <ColorPickerSlot>
              <LayerGroupColorPicker
                slug="globe-surface"
                color={globeConfig.surfaceColor}
                onColorChange={(color: RGBColor) => onColorChange('surfaceColor', color)}
                extraMarginRight={true}
                disabled={false}
              />
            </ColorPickerSlot>
          </StyledConfigRow>

          {/* Background (empty space around the globe, always visible) */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <LayerLabel $active={true} style={{marginLeft: '28px'}}>
                <FormattedMessage id="mapLayers.background" />
              </LayerLabel>
            </PanelLabelWrapper>
            <ColorPickerSlot>
              <LayerGroupColorPicker
                slug="globe-background"
                color={globeConfig.backgroundColor}
                onColorChange={(color: RGBColor) => onColorChange('backgroundColor', color)}
                extraMarginRight={true}
                disabled={false}
              />
            </ColorPickerSlot>
          </StyledConfigRow>

          {/* Stars (rendered behind the globe in 3D space) */}
          <StyledConfigRow>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id="globe-stars-toggle"
                tooltip={globeConfig.stars ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() => onToggle('stars')}
                IconComponent={globeConfig.stars ? EyeSeen : EyeUnseen}
                active={globeConfig.stars}
                flush
              />
              <LayerLabel $active={globeConfig.stars}>
                <FormattedMessage id="mapLayers.stars" />
              </LayerLabel>
            </PanelLabelWrapper>
          </StyledConfigRow>
        </PanelContent>
      </StyledGlobeConfigPanel>
    );
  };

  GlobeConfigPanel.displayName = 'GlobeConfigPanel';
  return GlobeConfigPanel;
}

export default GlobeConfigPanelFactory;

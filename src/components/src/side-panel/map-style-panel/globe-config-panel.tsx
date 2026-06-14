// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';

import {MapState} from '@kepler.gl/types';
import {GlobeConfig} from '@kepler.gl/constants';

const StyledGlobeConfigPanel = styled.div`
  padding: 12px;
`;

const StyledConfigRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StyledLabel = styled.label`
  color: ${props => props.theme.textColor};
  font-size: 11px;
  font-weight: 500;
`;

const StyledToggle = styled.input`
  cursor: pointer;
`;

const StyledSlider = styled.input`
  width: 100%;
  margin-top: 4px;
`;

const StyledSection = styled.div`
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.sidePanelBorderColor};
`;

const StyledSectionTitle = styled.div`
  color: ${props => props.theme.textColorHl};
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export type GlobeConfigPanelProps = {
  mapState: MapState;
  onGlobeConfigChange: (config: Partial<GlobeConfig>) => void;
};

GlobeConfigPanelFactory.deps = [];

function GlobeConfigPanelFactory() {
  const GlobeConfigPanel: React.FC<GlobeConfigPanelProps> = ({
    mapState,
    onGlobeConfigChange
  }) => {
    const globeConfig = mapState.globe?.config;

    const onToggle = useCallback(
      (key: keyof GlobeConfig) => {
        if (globeConfig) {
          onGlobeConfigChange({[key]: !globeConfig[key]});
        }
      },
      [globeConfig, onGlobeConfigChange]
    );

    const onSliderChange = useCallback(
      (key: keyof GlobeConfig, value: number) => {
        onGlobeConfigChange({[key]: value});
      },
      [onGlobeConfigChange]
    );

    if (!mapState.globe?.enabled || !globeConfig) {
      return null;
    }

    return (
      <StyledGlobeConfigPanel>
        <StyledSection>
          <StyledSectionTitle>Atmosphere</StyledSectionTitle>
          <StyledConfigRow>
            <StyledLabel>Show Atmosphere</StyledLabel>
            <StyledToggle
              type="checkbox"
              checked={globeConfig.atmosphere}
              onChange={() => onToggle('atmosphere')}
            />
          </StyledConfigRow>
          {globeConfig.atmosphere && (
            <>
              <StyledConfigRow>
                <StyledLabel>Terminator (Day/Night)</StyledLabel>
                <StyledToggle
                  type="checkbox"
                  checked={globeConfig.terminator}
                  onChange={() => onToggle('terminator')}
                />
              </StyledConfigRow>
              {globeConfig.terminator && (
                <StyledConfigRow>
                  <StyledLabel>
                    Terminator Opacity: {globeConfig.terminatorOpacity.toFixed(2)}
                  </StyledLabel>
                  <StyledSlider
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={globeConfig.terminatorOpacity}
                    onChange={e => onSliderChange('terminatorOpacity', parseFloat(e.target.value))}
                  />
                </StyledConfigRow>
              )}
              <StyledConfigRow>
                <StyledLabel>Custom Sun Azimuth</StyledLabel>
                <StyledToggle
                  type="checkbox"
                  checked={globeConfig.azimuth}
                  onChange={() => onToggle('azimuth')}
                />
              </StyledConfigRow>
              {globeConfig.azimuth && (
                <StyledConfigRow>
                  <StyledLabel>Sun Angle: {globeConfig.azimuthAngle}°</StyledLabel>
                  <StyledSlider
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={globeConfig.azimuthAngle}
                    onChange={e => onSliderChange('azimuthAngle', parseInt(e.target.value, 10))}
                  />
                </StyledConfigRow>
              )}
            </>
          )}
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>Basemap</StyledSectionTitle>
          <StyledConfigRow>
            <StyledLabel>Show Basemap</StyledLabel>
            <StyledToggle
              type="checkbox"
              checked={globeConfig.basemap}
              onChange={() => onToggle('basemap')}
            />
          </StyledConfigRow>
          {globeConfig.basemap && (
            <>
              <StyledConfigRow>
                <StyledLabel>Admin Lines</StyledLabel>
                <StyledToggle
                  type="checkbox"
                  checked={globeConfig.adminLines}
                  onChange={() => onToggle('adminLines')}
                />
              </StyledConfigRow>
              <StyledConfigRow>
                <StyledLabel>Water</StyledLabel>
                <StyledToggle
                  type="checkbox"
                  checked={globeConfig.water}
                  onChange={() => onToggle('water')}
                />
              </StyledConfigRow>
              <StyledConfigRow>
                <StyledLabel>Labels</StyledLabel>
                <StyledToggle
                  type="checkbox"
                  checked={globeConfig.labels}
                  onChange={() => onToggle('labels')}
                />
              </StyledConfigRow>
            </>
          )}
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>Surface</StyledSectionTitle>
          <StyledConfigRow>
            <StyledLabel>Show Surface</StyledLabel>
            <StyledToggle
              type="checkbox"
              checked={globeConfig.surface}
              onChange={() => onToggle('surface')}
            />
          </StyledConfigRow>
        </StyledSection>
      </StyledGlobeConfigPanel>
    );
  };

  GlobeConfigPanel.displayName = 'GlobeConfigPanel';
  return GlobeConfigPanel;
}

export default GlobeConfigPanelFactory;

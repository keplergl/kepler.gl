// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';

export const ELEVATION_SECTION_TYPE = 'elevation-section';

import {Effect, EffectParameterDescription, EffectUpdateProps} from '@kepler.gl/types';

import {VertThreeDots} from '../common/icons';
import {Tooltip} from '../common/styled-components';
import RangeSliderFactory from '../common/range-slider';

const StyledCollapsibleSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 4px;
  &:hover {
    .effect-section__title {
      color: ${props => props.theme.textColorHl};
    }
    .effect-section__dots {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const StyledElevationSectionTitle = styled.div`
  border-left: ${props => props.theme.layerConfigGroupLabelBorderLeft} solid
    ${props => props.theme.labelColor};
  line-height: 12px;
  padding-left: ${props => props.theme.layerConfigGroupLabelPadding};
  font-size: ${props => props.theme.layerConfigGroupLabelLabelFontSize};
  color: ${props => props.theme.textColor};
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: capitalize;
`;

const StyledDotsWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textColor};
`;

const StyledCollapsibleContent = styled.div<{$collapsed: boolean}>`
  overflow: hidden;
  max-height: ${props => (props.$collapsed ? '0' : '200px')};
  transition: max-height 0.3s ease-out;
  padding-left: ${props =>
    `calc(${props.theme.layerConfigGroupLabelBorderLeft} + ${props.theme.layerConfigGroupLabelPadding})`};
`;

const StyledDisabledSlider = styled.div<{$disabled: boolean}>`
  ${props =>
    props.$disabled
      ? `
    opacity: 0.3;
    pointer-events: none;
  `
      : ''}
`;

const RegularOuterWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section'
})`
  margin-bottom: 8px;
`;

const RegularSectionTitleWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section-title'
})`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  text-transform: capitalize;
  margin-bottom: -3px;
`;

const RegularSliderWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section-control'
})`
  height: 32px;
  .kg-range-slider__input {
    height: 32px;
    text-align: center;
    padding: 3px 6px;
  }
  .kg-slider {
    padding-left: 6px;
  }
  .kg-range-slider {
    padding: 0px !important;
  }
`;

const StyledCheckboxWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section-checkbox'
})`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  margin-right: 6px;
  cursor: pointer;
  accent-color: ${props => props.theme.activeColor};
`;

const StyledCheckboxLabel = styled.label`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  cursor: pointer;
  white-space: nowrap;
`;

const StyledHintTooltip = styled(Tooltip)`
  &.__react_component_tooltip {
    max-width: 220px;
    white-space: normal;
    line-height: 1.4;
    text-align: left;
  }
`;

const StyledHintIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 6px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  color: ${props => props.theme.labelColor};
  border: 1px solid ${props => props.theme.labelColor};
  cursor: help;
  &:hover {
    color: ${props => props.theme.textColorHl};
    border-color: ${props => props.theme.textColorHl};
  }
`;

const COMMON_SLIDER_PROPS = {
  showInput: true,
  isRanged: false,
  step: 0.001,
  label: 'value'
};

export type SurfaceFogElevationSectionProps = {
  effect: Effect;
  updateEffectConfig: (
    e: Event | null | undefined,
    id: string,
    config: Partial<EffectUpdateProps>
  ) => void;
  RangeSlider: ReturnType<typeof RangeSliderFactory>;
};

SurfaceFogElevationSectionFactory.deps = [RangeSliderFactory];

export default function SurfaceFogElevationSectionFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>
): React.FC<Omit<SurfaceFogElevationSectionProps, 'RangeSlider'>> {
  const SurfaceFogElevationSection: React.FC<
    Omit<SurfaceFogElevationSectionProps, 'RangeSlider'>
  > = ({effect, updateEffectConfig}) => {
    const {parameters, id} = effect;
    const parameterDescriptions = effect.getParameterDescriptions();

    const heightDesc = parameterDescriptions.find(
      (d: EffectParameterDescription) => d.name === 'height'
    );
    const heightEndDesc = parameterDescriptions.find(
      (d: EffectParameterDescription) => d.name === 'heightEnd'
    );
    const animateHeightDesc = parameterDescriptions.find(
      (d: EffectParameterDescription) => d.name === 'animateHeight'
    );
    const linearEasingDesc = parameterDescriptions.find(
      (d: EffectParameterDescription) => d.name === 'linearEasing'
    );

    const [elevationExpanded, setElevationExpanded] = useState(false);
    const onToggleElevationExpanded = useCallback(() => {
      setElevationExpanded(prev => !prev);
    }, []);

    const elevationControl = useMemo(() => {
      if (!heightDesc || !heightEndDesc) return null;

      const rangeMin = heightDesc.min ?? -200;
      const rangeMax = heightDesc.max ?? 6000;
      const rangeSpan = rangeMax - rangeMin;
      const step = rangeSpan > 10 ? 1 : 0.001;

      const endMin = heightEndDesc.min ?? rangeMin;
      const endMax = heightEndDesc.max ?? rangeMax;
      const endSpan = endMax - endMin;
      const endStep = endSpan > 10 ? 1 : 0.001;

      const isAnimateHeight = Boolean(parameters.animateHeight);

      return {
        label: heightDesc.label || heightDesc.name,
        value1: parameters.height ?? heightDesc.defaultValue ?? 0,
        value0: rangeMin,
        range: [rangeMin, rangeMax] as [number, number],
        step,
        onChange: (newValue: number[], event?: Event | null) => {
          updateEffectConfig(event, id, {parameters: {height: newValue[1]}});
        },
        animateChecked: isAnimateHeight,
        onAnimateChange: () => {
          const enabling = !parameters.animateHeight;
          const currentEnd = parameters.heightEnd ?? heightEndDesc.max ?? rangeMax;
          const currentHeight = parameters.height ?? heightDesc.defaultValue ?? 0;
          const updatedParams: Record<string, any> = {animateHeight: enabling};
          if (enabling && Math.abs(currentEnd - currentHeight) < 10) {
            updatedParams.heightEnd = rangeMax;
          }
          updateEffectConfig(null, id, {parameters: updatedParams});
        },
        endValue1: parameters.heightEnd ?? heightEndDesc.defaultValue ?? endMax,
        endValue0: endMin,
        endRange: [endMin, endMax] as [number, number],
        endStep,
        onEndChange: (newValue: number[], event?: Event | null) => {
          updateEffectConfig(event, id, {parameters: {heightEnd: newValue[1]}});
        },
        linearEasingChecked: Boolean(parameters.linearEasing),
        hasLinearEasing: Boolean(linearEasingDesc),
        onLinearEasingChange: () => {
          updateEffectConfig(null, id, {parameters: {linearEasing: !parameters.linearEasing}});
        },
        animateTooltip: animateHeightDesc?.tooltip,
        linearEasingTooltip: linearEasingDesc?.tooltip
      };
    }, [
      heightDesc,
      heightEndDesc,
      animateHeightDesc,
      linearEasingDesc,
      id,
      parameters,
      updateEffectConfig
    ]);

    if (!elevationControl) return null;

    const tooltipId = `effect-elevation-hint-${effect.id}`;
    const control = elevationControl;

    return (
      <RegularOuterWrapper>
        <StyledCollapsibleSectionHeader onClick={onToggleElevationExpanded}>
          <StyledElevationSectionTitle className="effect-section__title">
            Elevation
          </StyledElevationSectionTitle>
          <StyledDotsWrapper className="effect-section__dots">
            <VertThreeDots height="18px" />
          </StyledDotsWrapper>
        </StyledCollapsibleSectionHeader>
        <RegularSliderWrapper>
          <RangeSlider
            {...COMMON_SLIDER_PROPS}
            value1={control.value1 as number}
            value0={control.value0 as number}
            range={control.range}
            step={control.step}
            onChange={control.onChange}
          />
        </RegularSliderWrapper>
        <StyledCollapsibleContent $collapsed={!elevationExpanded}>
          <RegularOuterWrapper style={{marginTop: 8}}>
            <StyledCheckboxWrapper onClick={control.onAnimateChange}>
              <StyledCheckbox
                type="checkbox"
                checked={control.animateChecked}
                onChange={control.onAnimateChange}
                onClick={e => e.stopPropagation()}
              />
              <StyledCheckboxLabel>Animate elevation</StyledCheckboxLabel>
              {control.animateTooltip ? (
                <>
                  <StyledHintIcon data-tip data-for={tooltipId} onClick={e => e.stopPropagation()}>
                    ?
                  </StyledHintIcon>
                  <StyledHintTooltip id={tooltipId} effect="solid" delayShow={200}>
                    {control.animateTooltip}
                  </StyledHintTooltip>
                </>
              ) : null}
            </StyledCheckboxWrapper>
          </RegularOuterWrapper>
          <StyledDisabledSlider $disabled={!control.animateChecked}>
            <RegularSectionTitleWrapper>End elevation</RegularSectionTitleWrapper>
            <RegularSliderWrapper>
              <RangeSlider
                {...COMMON_SLIDER_PROPS}
                value1={control.endValue1 as number}
                value0={control.endValue0 as number}
                range={control.endRange}
                step={control.endStep}
                onChange={control.onEndChange}
              />
            </RegularSliderWrapper>
          </StyledDisabledSlider>
          {control.hasLinearEasing ? (
            <StyledDisabledSlider $disabled={!control.animateChecked}>
              <RegularOuterWrapper style={{marginTop: 4}}>
                <StyledCheckboxWrapper onClick={control.onLinearEasingChange}>
                  <StyledCheckbox
                    type="checkbox"
                    checked={control.linearEasingChecked}
                    onChange={control.onLinearEasingChange}
                    onClick={e => e.stopPropagation()}
                  />
                  <StyledCheckboxLabel>Linear easing</StyledCheckboxLabel>
                  {control.linearEasingTooltip ? (
                    <>
                      <StyledHintIcon
                        data-tip
                        data-for={`effect-linear-hint-${effect.id}`}
                        onClick={e => e.stopPropagation()}
                      >
                        ?
                      </StyledHintIcon>
                      <StyledHintTooltip
                        id={`effect-linear-hint-${effect.id}`}
                        effect="solid"
                        delayShow={200}
                      >
                        {control.linearEasingTooltip}
                      </StyledHintTooltip>
                    </>
                  ) : null}
                </StyledCheckboxWrapper>
              </RegularOuterWrapper>
            </StyledDisabledSlider>
          ) : null}
        </StyledCollapsibleContent>
      </RegularOuterWrapper>
    );
  };

  return SurfaceFogElevationSection;
}

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';

import RangeSliderFactory from '../common/range-slider';
import {Sun, Moon, Sunset, Sunrise} from '../common/icons';

export type EffectTimeSliderConfig = {
  dawn: number;
  sunrise: number;
  sunset: number;
  dusk: number;
  sunriseTime: string;
  sunsetTime: string;
};

export type UIBlock = {
  type: string;
  width: number;
  center: number;
  start: number;
  end: number;
  text?: string;
  TopRowIcon?: React.ElementType<any>;
  BottomRowIcon?: React.ElementType<any>;
};

export type EffectTimeSliderProps = {
  value: number;
  onChange: (number) => void;
  config: EffectTimeSliderConfig;
};

const TimeSliderWrapper = styled.div`
  width: 100%;
  height: 48px;
`;

const TopRowWrapper = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  position: relative;
  align-items: center;

  .day {
    background-color: ${props => props.theme.effectPanelElementColorHovered};
  }
  .night {
    background-color: ${props => props.theme.effectPanelElementColor};
  }
  .sunrise,
  .sunset {
    background-color: ${props => props.theme.effectPanelElementColorActive};
  }
  .inline_icon__day {
    color: ${props => props.theme.effectPanelElementColorSun};
  }
  .inline_icon__night {
    color: ${props => props.theme.effectPanelTextSecondary2};
  }
`;

const BottomRowWrapper = styled.div`
  position: relative;
  height: 16px;
  .bottom_icon__sunrise,
  .bottom_icon__sunset {
    color: ${props => props.theme.effectPanelTextSecondary2};
  }
`;

type BackgroundBlockProps = {width: string};
const BackgroundBlock = styled.div<BackgroundBlockProps>`
  margin: 0px;
  padding: 0px;
  width: ${props => props.width};
  height: 24px;
  pointer-events: none;
`;

type StyledIconProps = {left: number};
const StyledIcon = styled.div<StyledIconProps>`
  position: absolute;
  top: 0px;
  left: calc(${props => props.left}% - 8px);
  height: 32px;
  pointer-events: none;
`;

type StyledBottomIconProps = {left: number};
const StyledBottomIcon = styled.div<StyledBottomIconProps>`
  position: absolute;
  top: 0px;
  left: calc(${props => props.left}% - 27px);
  height: 12px;
  pointer-events: none;
  margin-top: 1px;
  display: flex;
  align-items: flex-end;
`;

const RangeSliderWrapper = styled.div`
  position: absolute;
  width: 100%;
  .kg-slider {
    padding-left: 6px;
  }
  .kg-range-slider {
    padding: 0px !important;
    background-color: transparent;
  }
  .kg-range-slider__bar {
    background-color: transparent;
  }
  .kg-range-slider__handle {
    height: 32px;
    width: 8px;
    margin-top: -14px;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .kg-range-slider__handle::after {
    margin-left: 1px;
  }
  .kg-range-slider__input {
    height: 32px;
    text-align: center;
    padding: 3px 6px;
  }
`;

const Text = styled.div`
  margin-left: 3px;
  font-size: 10px;
  line-height: 11px;
  white-space: nowrap;
`;

const MODES = {
  sunrise: 'sunrise',
  day: 'day',
  sunset: 'sunset',
  night: 'night'
};

/**
 * Generate rendering blocks for each part of the day.
 */
export function getUIBlocks(config: EffectTimeSliderConfig): UIBlock[] {
  const {dawn} = config;
  let {sunrise, sunset, dusk} = config;
  if (dawn > sunrise) sunrise += 1;
  if (dawn > sunset) sunset += 1;
  if (dawn > dusk) dusk += 1;

  const blocks = [
    {
      start: dawn,
      end: sunrise,
      type: MODES.sunrise,
      width: 0,
      center: 0
    },
    {
      start: sunrise,
      end: sunset,
      type: MODES.day,
      width: 0,
      center: 0
    },
    {
      start: sunset,
      end: dusk,
      type: MODES.sunset,
      width: 0,
      center: 0
    },
    {
      start: dusk,
      end: dawn,
      type: MODES.night,
      width: 0,
      center: 0
    }
  ];
  const updatedBlocks: UIBlock[] = [];

  // sort and split ui blocks
  blocks.forEach(block => {
    if (block.start > block.end) {
      block.end += 1;
    }
    if (block.start > 1 && block.end > 1) {
      updatedBlocks.push({...block, start: block.start - 1, end: block.end - 1});
    } else if (block.end > 1) {
      updatedBlocks.push({
        ...block,
        end: 1
      });

      updatedBlocks.push({...block, start: 0, end: block.end - 1});
    } else {
      updatedBlocks.push(block);
    }
  });
  updatedBlocks.sort((a, b) => a.start - b.start);

  const existingBottomBlocks = {};
  // eslint-disable-next-line complexity
  updatedBlocks.forEach(block => {
    block.width = (block.end - block.start) * 100;
    block.center = block.start * 100 + block.width / 2;

    // Don't display inline icons when day or night is too short.
    if ((block.type === MODES.day || block.type === MODES.night) && block.width > 5) {
      block.TopRowIcon = block.type === MODES.day ? Sun : Moon;
    }

    // bottom row icons below the slider
    if ((block.type === MODES.sunrise || block.type === MODES.sunset) && block.width > 0.1) {
      // prevent duplicates for bottom row
      const existingBlock = existingBottomBlocks[block.type];
      if (existingBlock) {
        if (existingBlock.width < block.width) existingBlock.BottomRowIcon = null;
        else if (existingBlock.width > block.width) return;
      }
      existingBottomBlocks[block.type] = block;

      // prevent bottom icon and labels
      block.BottomRowIcon = block.type === MODES.sunrise ? Sunrise : Sunset;
      if (block.center > 90) {
        block.center = 90;
      } else if (block.center < 10) {
        block.center = 10;
      }
      block.text = block.type === MODES.sunrise ? config.sunriseTime : config.sunsetTime;
    }
  });
  return updatedBlocks;
}

EffectTimeSliderFactory.deps = [RangeSliderFactory];

export default function EffectTimeSliderFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>
) {
  const EffectTimeSlider: React.FC<EffectTimeSliderProps> = ({
    value: rangeSliderValue,
    onChange,
    config
  }: EffectTimeSliderProps) => {
    const uiBlocks = useMemo(() => {
      return getUIBlocks(config);
    }, [config]);

    const rangeSliderProps = useMemo(() => {
      return {
        label: 'value',
        value1: rangeSliderValue,
        step: 0.001,
        range: [0, 1],
        value0: 0,
        onChange,
        showInput: false,
        isRanged: false
      };
    }, [rangeSliderValue, onChange]);

    return (
      <TimeSliderWrapper>
        <TopRowWrapper>
          {uiBlocks.map((block, index) => {
            return <BackgroundBlock key={index} width={`${block.width}%`} className={block.type} />;
          })}

          {uiBlocks.map((block, index) => {
            return block.TopRowIcon ? (
              <StyledIcon key={index} left={block.center} className={`inline_icon__${block.type}`}>
                <block.TopRowIcon width="16px" height="32px" />
              </StyledIcon>
            ) : null;
          })}

          <RangeSliderWrapper>
            <RangeSlider {...rangeSliderProps} />
          </RangeSliderWrapper>
        </TopRowWrapper>
        <BottomRowWrapper>
          {uiBlocks.map((block, index) => {
            return block.BottomRowIcon ? (
              <StyledBottomIcon
                key={index}
                left={block.center}
                className={`bottom_icon__${block.type}`}
              >
                <block.BottomRowIcon width="12px" height="12px" />
                <Text>{block.text}</Text>
              </StyledBottomIcon>
            ) : null;
          })}
        </BottomRowWrapper>
      </TimeSliderWrapper>
    );
  };

  return EffectTimeSlider;
}

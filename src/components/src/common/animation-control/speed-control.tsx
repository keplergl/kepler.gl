// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Tooltip} from '../styled-components';
import IconButton from '../icon-button';
import {media} from '@kepler.gl/styles';
import {preciseRound} from '@kepler.gl/utils';

const StyledSpeedControl = styled.div`
  display: flex;
  align-items: center;

  .animation-control__speed-slider {
    left: 0;
    ${media.palm`
      left: 60px;
    `}
  }
`;

const DELAY_SHOW = 500;
const PRECISE_SPEED_ROUND = 1;

function SpeedControlFactory(AnimationSpeedSlider) {
  const SpeedControl = ({
    showAnimationWindowControl,
    updateAnimationSpeed,
    btnStyle,
    hideAndShowSpeedControl,
    buttonHeight,
    playbackIcons,
    speed,
    isSpeedControlVisible
  }) => {
    return showAnimationWindowControl || !updateAnimationSpeed ? null : (
      <StyledSpeedControl>
        <IconButton
          data-tip
          data-for="animate-speed"
          className="playback-control-button"
          {...btnStyle}
          onClick={hideAndShowSpeedControl}
        >
          <playbackIcons.speed height={buttonHeight} />
          <Tooltip id="animate-speed" place="top" delayShow={DELAY_SHOW} effect="solid">
            <span>{preciseRound(speed, PRECISE_SPEED_ROUND)}x</span>
          </Tooltip>
        </IconButton>
        {isSpeedControlVisible ? (
          <AnimationSpeedSlider
            onHide={hideAndShowSpeedControl}
            updateAnimationSpeed={updateAnimationSpeed}
            speed={speed}
          />
        ) : null}
      </StyledSpeedControl>
    );
  };

  return SpeedControl;
}

export default SpeedControlFactory;

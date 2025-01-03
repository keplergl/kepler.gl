// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import IconButton from '../icon-button';
import {media} from '@kepler.gl/styles';
import {preciseRound} from '@kepler.gl/utils';
import TippyTooltip from '../tippy-tooltip';

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
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => <span>{preciseRound(speed, PRECISE_SPEED_ROUND)}x</span>}
        >
          <IconButton
            className="playback-control-button"
            {...btnStyle}
            onClick={hideAndShowSpeedControl}
          >
            <playbackIcons.speed height={buttonHeight} />
          </IconButton>
        </TippyTooltip>
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

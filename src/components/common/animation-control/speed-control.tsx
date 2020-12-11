// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import styled from 'styled-components';
import {Tooltip} from 'components/common/styled-components';
import IconButton from '../icon-button';
import {media} from '@kepler.gl/styles';
import {preciseRound} from 'utils/data-utils';

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

// Copyright (c) 2020 Uber Technologies, Inc.
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
import classnames from 'classnames';

import {ButtonGroup, Button} from 'components/common/styled-components';
import {Play, Reset, Pause} from 'components/common/icons';

const StyledAnimationControls = styled.div`
  display: flex;
  margin-right: 12px;

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

const IconButton = styled(Button)`
  padding: 6px 4px;
  svg {
    margin: 0 6px;
  }
`;

function nop() {}
const DEFAULT_BUTTON_HEIGHT = '18px';
const DEFAULT_ICONS = {
  reset: Reset,
  play: Play,
  pause: Pause
};

function AnimationPlaybacksFactory() {
  const AnimationPlaybacks = ({
    isAnimatable,
    isAnimating,
    buttonStyle,
    width,
    pauseAnimation = nop,
    updateAnimationTime = nop,
    startAnimation = nop,
    buttonHeight = DEFAULT_BUTTON_HEIGHT,
    playbackIcons = DEFAULT_ICONS
  }) => {
    const btnStyle = buttonStyle ? {[buttonStyle]: true} : {};
    return (
      <StyledAnimationControls
        className={classnames('time-range-slider__control', {
          disabled: !isAnimatable
        })}
        style={{width: `${width}px`}}
      >
        <ButtonGroup>
          <IconButton
            className="playback-control-button"
            {...btnStyle}
            onClick={updateAnimationTime}
          >
            <playbackIcons.reset height={buttonHeight} />
          </IconButton>
          <IconButton
            {...btnStyle}
            className={classnames('playback-control-button', {active: isAnimating})}
            onClick={isAnimating ? pauseAnimation : startAnimation}
          >
            {isAnimating ? (
              <playbackIcons.pause height={buttonHeight} />
            ) : (
              <playbackIcons.play height={buttonHeight} />
            )}
          </IconButton>
        </ButtonGroup>
      </StyledAnimationControls>
    );
  };
  return AnimationPlaybacks;
}

export default AnimationPlaybacksFactory;

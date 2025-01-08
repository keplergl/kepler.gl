// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import classnames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
import IconButton from '../icon-button';
import TippyTooltip from '../tippy-tooltip';

function PlayControlFactory() {
  const PlayControl = ({
    showAnimationWindowControl,
    isAnimating,
    pauseAnimation,
    startAnimation,
    isSpeedControlVisible,
    btnStyle,
    playbackIcons,
    buttonHeight
  }) => {
    return showAnimationWindowControl ? null : (
      <TippyTooltip
        placement="top"
        delay={[500, 0]}
        render={() => <FormattedMessage id={isAnimating ? 'tooltip.pause' : 'tooltip.play'} />}
      >
        <IconButton
          className={classnames('playback-control-button', {active: isAnimating})}
          onClick={isAnimating ? pauseAnimation : startAnimation}
          hide={isSpeedControlVisible}
          {...btnStyle}
        >
          {isAnimating ? (
            <playbackIcons.pause height={buttonHeight} />
          ) : (
            <playbackIcons.play height={buttonHeight} />
          )}
        </IconButton>
      </TippyTooltip>
    );
  };

  return PlayControl;
}

export default PlayControlFactory;

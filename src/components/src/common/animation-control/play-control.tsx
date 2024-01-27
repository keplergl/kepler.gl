// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import classnames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from '../styled-components';
import IconButton from '../icon-button';

const DELAY_SHOW = 500;

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
      <IconButton
        data-tip
        data-for="animate-play-pause"
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
        <Tooltip id="animate-play-pause" place="top" delayShow={DELAY_SHOW} effect="solid">
          <FormattedMessage id={isAnimating ? 'tooltip.pause' : 'tooltip.play'} />
        </Tooltip>
      </IconButton>
    );
  };

  return PlayControl;
}

export default PlayControlFactory;

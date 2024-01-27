// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from '../styled-components';
import IconButton from '../icon-button';

const DELAY_SHOW = 500;

function ResetControlFactory() {
  const ResetControl = ({
    showAnimationWindowControl,
    resetAnimation,
    btnStyle,
    playbackIcons,
    buttonHeight
  }) => {
    return showAnimationWindowControl ? null : (
      <IconButton
        data-tip
        data-for="animate-reset"
        className="playback-control-button"
        onClick={resetAnimation}
        {...btnStyle}
      >
        <playbackIcons.reset height={buttonHeight} />
        <Tooltip id="animate-reset" place="top" delayShow={DELAY_SHOW} effect="solid">
          <FormattedMessage id="tooltip.reset" />
        </Tooltip>
      </IconButton>
    );
  };

  return ResetControl;
}

export default ResetControlFactory;

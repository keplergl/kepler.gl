// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import IconButton from '../icon-button';
import TippyTooltip from '../tippy-tooltip';

function ResetControlFactory() {
  const ResetControl = ({
    showAnimationWindowControl,
    resetAnimation,
    btnStyle,
    playbackIcons,
    buttonHeight
  }) => {
    return showAnimationWindowControl ? null : (
      <TippyTooltip
        placement="top"
        delay={[500, 0]}
        render={() => <FormattedMessage id="tooltip.reset" />}
      >
        <IconButton className="playback-control-button" onClick={resetAnimation} {...btnStyle}>
          <playbackIcons.reset height={buttonHeight} />
        </IconButton>
      </TippyTooltip>
    );
  };

  return ResetControl;
}

export default ResetControlFactory;

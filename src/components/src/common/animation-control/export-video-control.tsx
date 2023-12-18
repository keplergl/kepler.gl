import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Tooltip} from '../styled-components';
import IconButton from '../icon-button';

const DELAY_SHOW = 500;

function ExportVideoControlFactory() {
  const ExportVideoControl = ({
    showAnimationWindowControl,
    btnStyle,
    buttonHeight,
    playbackIcons,
    exportAnimation
  }) => {
    return showAnimationWindowControl || !exportAnimation ? null : (
      <IconButton
        data-tip
        data-for="animate-export"
        className="playback-control-button"
        onClick={exportAnimation}
        {...btnStyle}
      >
        <playbackIcons.export height={buttonHeight} />
        <Tooltip id="animate-export" place="top" delayShow={DELAY_SHOW} effect="solid">
          <FormattedMessage id="tooltip.export" />
        </Tooltip>
      </IconButton>
    );
  };

  return ExportVideoControl;
}

export default ExportVideoControlFactory;

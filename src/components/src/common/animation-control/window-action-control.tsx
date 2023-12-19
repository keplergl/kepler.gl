// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import classnames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from '../styled-components';
import IconButton from '../icon-button';

const DELAY_SHOW = 500;
function WindowActionControlFactory() {
  const WindowActionComponent = ({
    toggleAnimationWindowControl,
    showAnimationWindowControl,
    btnStyle,
    animationItems,
    animationWindow,
    buttonHeight,
    setFilterAnimationWindow
  }) => {
    const icon = useMemo(() => {
      if (animationItems[animationWindow]) {
        const WindowIcon = animationItems[animationWindow].icon;
        return <WindowIcon height={buttonHeight} />;
      }
      return null;
    }, [animationItems, animationWindow, buttonHeight]);

    return setFilterAnimationWindow ? (
      <IconButton
        data-tip
        data-for="animate-window"
        className={classnames('playback-control-button', {active: showAnimationWindowControl})}
        onClick={toggleAnimationWindowControl}
        {...btnStyle}
      >
        {icon}
        {animationItems[animationWindow] && animationItems[animationWindow].tooltip ? (
          <Tooltip id="animate-window" place="top" delayShow={DELAY_SHOW} effect="solid">
            <FormattedMessage id={animationItems[animationWindow].tooltip} />
          </Tooltip>
        ) : null}
      </IconButton>
    ) : null;
  };

  return WindowActionComponent;
}

export default WindowActionControlFactory;

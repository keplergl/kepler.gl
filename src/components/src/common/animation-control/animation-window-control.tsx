// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import {ReactComponentLike} from 'prop-types';
import IconButton from '../icon-button';
import {Tooltip} from '../styled-components';

export interface AnimationItem {
  id: string;
  icon: ReactComponentLike;
  tooltip: string;
}
interface AnimationWindowControlProps {
  animationWindow?: string;
  setFilterAnimationWindow: (id: string) => void;
  toggleAnimationWindowControl: () => void;
  height?: string;
  animationItems: {[key: string]: AnimationItem};
  btnStyle;
  showAnimationWindowControl: boolean;
}

function AnimationWindowControlFactory(): React.FC<AnimationWindowControlProps> {
  const AnimationWindowControl = ({
    animationWindow,
    setFilterAnimationWindow,
    toggleAnimationWindowControl,
    height,
    animationItems,
    btnStyle = {},
    showAnimationWindowControl
  }: AnimationWindowControlProps) => {
    const onSelectAnimationControl = useCallback(
      item => {
        setFilterAnimationWindow(item.id);
        toggleAnimationWindowControl();
      },
      [setFilterAnimationWindow, toggleAnimationWindowControl]
    );

    return showAnimationWindowControl ? (
      <div className="animation-window-control">
        {Object.values(animationItems)
          .filter(item => item.id !== animationWindow)
          .map(item => (
            <IconButton
              key={item.id}
              data-tip
              data-for={`${item.id}-tooltip`}
              className="playback-control-button"
              onClick={() => onSelectAnimationControl(item)}
              {...btnStyle}
            >
              <item.icon height={height} />
              {item.tooltip ? (
                <Tooltip id={`${item.id}-tooltip`} effect="solid" place="top">
                  <FormattedMessage id={item.tooltip} />
                </Tooltip>
              ) : null}
            </IconButton>
          ))}
      </div>
    ) : null;
  };

  return AnimationWindowControl;
}

export default AnimationWindowControlFactory;

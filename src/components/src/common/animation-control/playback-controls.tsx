// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {Reset, Play, Pause, Save, Rocket, AnchorWindow, FreeWindow} from '../icons';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import AnimationSpeedSliderFactory from './animation-speed-slider';
import WindowActionControlFactory from './window-action-control';
import AnimationWindowControlFactory, {AnimationItem} from './animation-window-control';
import ResetControlFactory from './reset-control';
import PlayControlFactory from './play-control';
import SpeedControlFactory from './speed-control';

const DEFAULT_BUTTON_HEIGHT = '20px';

interface StyledAnimationControlsProps {
  width?: number;
}

const StyledAnimationControls = styled.div<StyledAnimationControlsProps>`
  display: flex;
  position: relative;
  width: ${props => props.width}px;
  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

const DEFAULT_ICONS = {
  /* eslint-disable react/display-name */
  reset: () => <Reset height="18px" />,
  play: () => <Play height="18px" />,
  pause: () => <Pause height="18px" />,
  export: () => <Save height="18px" />,
  /* eslint-enable react/display-name */
  speed: Rocket,
  animationFree: FreeWindow,
  animationIncremental: AnchorWindow
};

function nop() {
  return;
}

const DEFAULT_ANIMATE_ITEMS = {
  [ANIMATION_WINDOW.free]: {
    id: ANIMATION_WINDOW.free,
    icon: DEFAULT_ICONS.animationFree,
    tooltip: 'tooltip.animationByWindow'
  },
  [ANIMATION_WINDOW.incremental]: {
    id: ANIMATION_WINDOW.incremental,
    icon: DEFAULT_ICONS.animationIncremental,
    tooltip: 'tooltip.animationByIncremental'
  }
};
export interface PlaybackControlsProps {
  isAnimatable?: boolean;
  isAnimating?: boolean;
  width?: number;
  speed: number;
  animationWindow?: string;
  setFilterAnimationWindow?: (id: string) => void;
  updateAnimationSpeed?: (val: number) => void;
  pauseAnimation?: () => void;
  resetAnimation?: () => void;
  startAnimation: () => void;
  playbackIcons?: typeof DEFAULT_ICONS;
  animationItems?: {[key: string]: AnimationItem};
  buttonStyle?: string;
  buttonHeight?: string;
  playbackActionItems?: any[];
  className?: string;
}

PlaybackControlsFactory.deps = [
  // keeping this for backwards compatibility but we can decide to drop it later
  AnimationSpeedSliderFactory,
  WindowActionControlFactory,
  AnimationWindowControlFactory,
  ResetControlFactory,
  PlayControlFactory
];

function PlaybackControlsFactory(
  AnimationSpeedSlider: ReturnType<typeof AnimationSpeedSliderFactory>,
  WindowActionControl,
  AnimationWindowControl,
  ResetControl,
  PlayControl
) {
  const PLAYBACK_CONTROLS_DEFAULT_ACTION_COMPONENTS = [
    PlayControl,
    SpeedControlFactory(AnimationSpeedSlider),
    ResetControl,
    WindowActionControl,
    AnimationWindowControl
  ];

  // eslint-disable-next-line complexity
  const PlaybackControls: React.FC<PlaybackControlsProps> = ({
    isAnimatable,
    isAnimating = true,
    width,
    speed,
    animationWindow = ANIMATION_WINDOW.free,
    setFilterAnimationWindow,
    updateAnimationSpeed,
    pauseAnimation = nop,
    resetAnimation = nop,
    startAnimation = nop,
    playbackIcons = DEFAULT_ICONS,
    animationItems = DEFAULT_ANIMATE_ITEMS,
    buttonStyle = 'secondary',
    buttonHeight = DEFAULT_BUTTON_HEIGHT,
    playbackActionItems = PLAYBACK_CONTROLS_DEFAULT_ACTION_COMPONENTS
  }) => {
    const [isSpeedControlVisible, toggleSpeedControl] = useState(false);
    const [showAnimationWindowControl, setShowAnimationWindowControl] = useState(false);

    const toggleAnimationWindowControl = useCallback(() => {
      setShowAnimationWindowControl(!showAnimationWindowControl);
    }, [showAnimationWindowControl, setShowAnimationWindowControl]);
    const btnStyle = buttonStyle ? {[buttonStyle]: true} : {};

    const hideAndShowSpeedControl = useCallback(() => {
      if (!isSpeedControlVisible) {
        toggleSpeedControl(true);
      } else {
        // TODO: A HACK to allow input onblur get triggered before the input is unmounted
        // A better solution should be invested, see https://github.com/facebook/react/issues/12363
        window.setTimeout(() => toggleSpeedControl(false), 200);
      }
    }, [isSpeedControlVisible, toggleSpeedControl]);

    return (
      <StyledAnimationControls
        className={classnames('playback-controls', {
          disabled: !isAnimatable
        })}
        width={width}
      >
        {/** Window */}
        {playbackActionItems.map((ActionComponent, index) => (
          <ActionComponent
            key={index}
            toggleAnimationWindowControl={toggleAnimationWindowControl}
            showAnimationWindowControl={showAnimationWindowControl}
            btnStyle={btnStyle}
            hideAndShowSpeedControl={hideAndShowSpeedControl}
            animationItems={animationItems}
            animationWindow={animationWindow}
            buttonHeight={buttonHeight}
            setFilterAnimationWindow={setFilterAnimationWindow}
            updateAnimationSpeed={updateAnimationSpeed}
            isAnimating={isAnimating}
            pauseAnimation={pauseAnimation}
            resetAnimation={resetAnimation}
            startAnimation={startAnimation}
            playbackIcons={playbackIcons}
            isSpeedControlVisible={isSpeedControlVisible}
            speed={speed}
          />
        ))}
      </StyledAnimationControls>
    );
  };

  return PlaybackControls;
}

export default PlaybackControlsFactory;

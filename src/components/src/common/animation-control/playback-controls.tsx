// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback} from 'react';
import styled, {IStyledComponent} from 'styled-components';
import classnames from 'classnames';
import {Reset, Play, Pause, Save, Speed, AnchorWindow, FreeWindow} from '../icons';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {Filter, TimeRangeFilter} from '@kepler.gl/types';
import AnimationSpeedSliderFactory from './animation-speed-slider';
import WindowActionControlFactory from './window-action-control';
import AnimationWindowControlFactory, {AnimationItem} from './animation-window-control';
import ResetControlFactory from './reset-control';
import PlayControlFactory from './play-control';
import SpeedControlFactory from './speed-control';
import {BaseComponentProps} from '../../types';

const DEFAULT_BUTTON_HEIGHT = '20px';

export type StyledAnimationControlsProps = BaseComponentProps & {
  width?: number;
};

const StyledAnimationControls: IStyledComponent<
  'web',
  StyledAnimationControlsProps
> = styled.div<StyledAnimationControlsProps>`
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
  reset: () => <Reset height="16px" />,
  play: () => <Play height="16px" />,
  pause: () => <Pause height="16px" />,
  export: () => <Save height="16px" />,
  /* eslint-enable react/display-name */
  speed: () => <Speed height="16px" />,
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
  filter?: Filter;
  isAnimatable?: boolean;
  isAnimating?: boolean;
  width?: number;
  speed: number;
  animationWindow?: null | TimeRangeFilter['animationWindow'];
  setFilterAnimationWindow?: (id: string) => void;
  updateAnimationSpeed?: (idx: number, speed: number) => void;
  pauseAnimation?: () => void;
  resetAnimation?: () => void;
  startAnimation: () => void;
  playbackIcons?: Record<string, React.FC<{height: number}>>;
  animationItems?: {[key: string]: AnimationItem};
  buttonStyle?: string;
  buttonHeight?: string;
  playbackActionItems?: React.FC[];
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
    filter,
    isAnimatable = true,
    isAnimating,
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
            filter={filter}
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

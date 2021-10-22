// Copyright (c) 2022 Uber Technologies, Inc.
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

const StyledAnimationControls = styled.div`
  display: flex;
  position: relative;

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

const DEFAULT_ICONS = {
  /* eslint-disable react/display-name */
  reset: _ => <Reset height="18px" />,
  play: _ => <Play height="18px" />,
  pause: _ => <Pause height="18px" />,
  export: _ => <Save height="18px" />,
  /* eslint-enable react/display-name */
  speed: Rocket,
  animationFree: FreeWindow,
  animationIncremental: AnchorWindow
};

function nop() {}

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
interface PlaybackControlsProps {
  isAnimatable?: boolean;
  isAnimating?: boolean;
  width?: number | string;
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
    isAnimating,
    width,
    speed,
    animationWindow,
    setFilterAnimationWindow,
    updateAnimationSpeed,
    pauseAnimation,
    resetAnimation,
    startAnimation,
    playbackIcons,
    animationItems,
    buttonStyle,
    buttonHeight,
    playbackActionItems = []
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
        style={{width: `${width}px`}}
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

  PlaybackControls.defaultProps = {
    playbackIcons: DEFAULT_ICONS,
    animationItems: DEFAULT_ANIMATE_ITEMS,
    buttonStyle: 'secondary',
    buttonHeight: DEFAULT_BUTTON_HEIGHT,
    playbackActionItems: PLAYBACK_CONTROLS_DEFAULT_ACTION_COMPONENTS,
    animationWindow: ANIMATION_WINDOW.free,
    isAnimatable: true,
    pauseAnimation: nop,
    resetAnimation: nop,
    startAnimation: nop
  };

  return PlaybackControls;
}

export default PlaybackControlsFactory;

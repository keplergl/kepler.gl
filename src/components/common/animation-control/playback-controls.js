// Copyright (c) 2021 Uber Technologies, Inc.
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
import {FormattedMessage} from 'localization';
import {Button, Tooltip} from 'components/common/styled-components';
import AnimationSpeedSliderFactory from './animation-speed-slider';
import {Reset, Play, Pause, Rocket, AnchorWindow, FreeWindow} from 'components/common/icons';
import {ANIMATION_WINDOW} from 'constants/default-settings';
import {preciseRound} from 'utils/data-utils';

const DELAY_SHOW = 500;
const DEFAULT_BUTTON_HEIGHT = '20px';

const StyledAnimationControls = styled.div`
  display: flex;
  position: relative;

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

const StyledSpeedControl = styled.div`
  display: flex;
  align-items: center;

  .animation-control__speed-slider {
    left: 0;
  }
`;

export const IconButton = styled(Button)`
  width: ${props => (props.collapsed ? 0 : 32)}px;
  height: 32px;
  color: ${props => props.theme.playbackButtonColor};
  background-color: ${props => props.theme.playbackButtonBgColor};
  border-radius: 4px;
  margin-left: 7px;
  border: 0;
  padding: 0;

  .__react_component_tooltip {
    font-family: ${props => props.theme.fontFamily};
  }
  svg {
    margin: 0;
  }
  &.active {
    background-color: ${props => props.theme.playbackButtonActBgColor};
  }
`;

function nop() {}
const DEFAULT_ICONS = {
  /* eslint-disable react/display-name */
  reset: _ => <Reset height="18px" />,
  play: _ => <Play height="18px" />,
  pause: _ => <Pause height="18px" />,
  /* eslint-enable react/display-name */
  speed: Rocket,
  animationFree: FreeWindow,
  animationIncremental: AnchorWindow
};

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

export const AnimationWindowControl = ({
  onClick,
  selected,
  onHide,
  height,
  animationItems,
  btnStyle = {}
}) => (
  <div>
    {Object.values(animationItems)
      .filter(item => item.id !== selected)
      .map(item => (
        <IconButton
          key={item.id}
          data-tip
          data-for={`${item.id}-tooltip`}
          className="playback-control-button"
          onClick={() => {
            onClick(item.id);
            onHide();
          }}
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
);

PlaybackControlsFactory.deps = [AnimationSpeedSliderFactory];
function PlaybackControlsFactory(AnimationSpeedSlider) {
  // eslint-disable-next-line complexity
  const PlaybackControls = ({
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
    buttonHeight = DEFAULT_BUTTON_HEIGHT
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
        {setFilterAnimationWindow ? (
          <IconButton
            data-tip
            data-for="animate-window"
            className={classnames('playback-control-button', {active: showAnimationWindowControl})}
            onClick={toggleAnimationWindowControl}
            {...btnStyle}
          >
            {(() => {
              if (animationItems[animationWindow]) {
                const WindowIcon = animationItems[animationWindow].icon;
                return <WindowIcon height={buttonHeight} />;
              }
              return null;
            })()}
            {animationItems[animationWindow] && animationItems[animationWindow].tooltip ? (
              <Tooltip id="animate-window" place="top" delayShow={500} effect="solid">
                <FormattedMessage id={animationItems[animationWindow].tooltip} />
              </Tooltip>
            ) : null}
          </IconButton>
        ) : null}

        {showAnimationWindowControl ? (
          <AnimationWindowControl
            onClick={setFilterAnimationWindow}
            selected={animationWindow}
            onHide={toggleAnimationWindowControl}
            height={buttonHeight}
            btnStyle={btnStyle}
            animationItems={animationItems}
          />
        ) : null}

        {/** Speed */}
        {showAnimationWindowControl || !updateAnimationSpeed ? null : (
          <StyledSpeedControl>
            <IconButton
              data-tip
              data-for="animate-speed"
              className="playback-control-button"
              {...btnStyle}
              onClick={hideAndShowSpeedControl}
            >
              <playbackIcons.speed height={buttonHeight} />
              <Tooltip id="animate-speed" place="top" delayShow={DELAY_SHOW} effect="solid">
                <span>{preciseRound(speed, 1)}x</span>
              </Tooltip>
            </IconButton>
            {isSpeedControlVisible ? (
              <AnimationSpeedSlider
                onHide={hideAndShowSpeedControl}
                updateAnimationSpeed={updateAnimationSpeed}
                speed={speed}
              />
            ) : null}
          </StyledSpeedControl>
        )}

        {/** Reset */}
        {showAnimationWindowControl ? null : (
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
        )}

        {/** Play and pause */}
        {showAnimationWindowControl ? null : (
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
        )}
      </StyledAnimationControls>
    );
  };
  return PlaybackControls;
}

export default PlaybackControlsFactory;

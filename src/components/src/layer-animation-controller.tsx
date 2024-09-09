// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {AnimationConfig, Timeline} from '@kepler.gl/types';
import {snapToMarks, getTimelineFromAnimationConfig, toArray} from '@kepler.gl/utils';
import AnimationControllerFactory from './common/animation-control/animation-controller';

interface LayerAnimationControllerProps {
  animationConfig: AnimationConfig;
  setLayerAnimationTime: (x: number) => void;
  children?: (
    isAnimating: boolean | undefined,
    startAnimation: () => void,
    pauseAnimation: () => void,
    resetAnimation: () => void,
    timeline: Timeline | undefined,
    setTimelineValue: (x: number | number[]) => void
  ) => React.ReactElement | null;
}

LayerAnimationControllerFactory.deps = [AnimationControllerFactory];

function LayerAnimationControllerFactory(
  AnimationController: ReturnType<typeof AnimationControllerFactory>
) {
  const LayerAnimationController: React.FC<LayerAnimationControllerProps> = ({
    animationConfig,
    setLayerAnimationTime,
    children
  }) => {
    const {timeSteps, domain} = animationConfig;

    const setTimelineValue = useCallback(
      (value: number | number[]) => {
        const timelineValue = toArray(value)[0];
        if (Array.isArray(timeSteps)) {
          setLayerAnimationTime(snapToMarks(timelineValue, timeSteps));

          // TODO: merge slider in to avoid this step
        } else if (domain && timelineValue >= domain[0] && timelineValue <= domain[1]) {
          setLayerAnimationTime(timelineValue);
        }
      },
      [domain, setLayerAnimationTime, timeSteps]
    );

    const timeline = getTimelineFromAnimationConfig(animationConfig);

    return (
      <AnimationController
        key="layer-control"
        value={Number(animationConfig.currentTime)}
        domain={animationConfig.domain}
        speed={animationConfig.speed}
        isAnimating={animationConfig.isAnimating}
        steps={animationConfig.timeSteps}
        animationWindow={
          animationConfig.timeSteps ? ANIMATION_WINDOW.interval : ANIMATION_WINDOW.point
        }
        setTimelineValue={setTimelineValue}
        timeline={timeline}
        children={children}
      />
    );
  };
  return LayerAnimationController;
}

export default LayerAnimationControllerFactory;

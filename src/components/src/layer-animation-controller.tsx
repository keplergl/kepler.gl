// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {AnimationConfig, Timeline} from '@kepler.gl/types';
import {snapToMarks, getTimelineFromAnimationConfig, toArray} from '@kepler.gl/utils';
import AnimationControllerFactory from './common/animation-control/animation-controller';

type AnimationValue = number;

interface LayerAnimationControllerProps {
  animationConfig: AnimationConfig;
  setLayerAnimationTime: (x: number) => void;
  children?: (
    isAnimating: boolean | undefined,
    startAnimation: () => void,
    pauseAnimation: () => void,
    resetAnimation: () => void,
    timeline: Timeline | undefined,
    setTimelineValue: (x: any) => void
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
      (value: AnimationValue | AnimationValue[]) => {
        const value0 = toArray(value)[0];

        if (Array.isArray(timeSteps)) {
          setLayerAnimationTime(snapToMarks(value0, timeSteps));

          // TODO: merge slider in to avoid this step
        } else if (domain && value0 >= domain[0] && value0 <= domain[1]) {
          setLayerAnimationTime(value0);
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

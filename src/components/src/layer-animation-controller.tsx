import React, {useCallback} from 'react';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {AnimationConfig} from '@kepler.gl/types';
import {snapToMarks, getTimelineFromAnimationConfig} from '@kepler.gl/utils';
import AnimationControllerFactory from './common/animation-control/animation-controller';

interface LayerAnimationControllerProps {
  animationConfig: AnimationConfig & {timeSteps?: number[] | null};
  setLayerAnimationTime: (x: number) => void;
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
      (value: number) => {
        if (Array.isArray(timeSteps)) {
          setLayerAnimationTime(snapToMarks(value, timeSteps));

          // TODO: merge slider in to avoid this step
        } else if (domain && value >= domain[0] && value <= domain[1]) {
          setLayerAnimationTime(value);
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

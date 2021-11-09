import React from 'react';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {AnimationConfig} from '@kepler.gl/types';
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
  }) => (
    <AnimationController<number>
      key="layer-control"
      value={Number(animationConfig.currentTime)}
      domain={animationConfig.domain}
      speed={animationConfig.speed}
      isAnimating={animationConfig.isAnimating}
      updateAnimation={setLayerAnimationTime}
      steps={animationConfig.timeSteps}
      animationWindow={
        animationConfig.timeSteps ? ANIMATION_WINDOW.interval : ANIMATION_WINDOW.point
      }
      children={children}
    />
  );
  return LayerAnimationController;
}

export default LayerAnimationControllerFactory;

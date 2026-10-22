// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import type {ZarrAxisConfig, ZarrVariableInfo} from '@kepler.gl/constants';
import {getZarrAxis} from '@kepler.gl/table';
import LayerAnimationControllerFactory from './layer-animation-controller';
import AnimationControlFactory from './common/animation-control/animation-control';

const Container = styled.section`
  position: relative;
  margin-top: 52px;
  background: ${props => props.theme.sidePanelBg};
`;

export type ZarrAxisAnimationProps = {
  variable: ZarrVariableInfo;
  config: ZarrAxisConfig;
  pins: Record<string, number>;
  frameIndex: number;
  label: string;
  onFrameChange: (index: number) => void;
};

ZarrAxisAnimationFactory.deps = [LayerAnimationControllerFactory, AnimationControlFactory];

export default function ZarrAxisAnimationFactory(
  LayerAnimationController: ReturnType<typeof LayerAnimationControllerFactory>,
  AnimationControl: ReturnType<typeof AnimationControlFactory>
) {
  return function ZarrAxisAnimation({
    variable,
    config,
    pins,
    frameIndex,
    label,
    onFrameChange
  }: ZarrAxisAnimationProps) {
    const axis = useMemo(() => getZarrAxis(variable, config, pins), [variable, config, pins]);
    const [isAnimating, setAnimating] = useState(false);
    const [speed, setSpeed] = useState(1);
    useEffect(() => setAnimating(false), [axis]);
    const index = Math.max(
      0,
      Math.min(axis.frames.length - 1, Number.isFinite(frameIndex) ? Math.round(frameIndex) : 0)
    );
    const steps = useMemo(() => axis.frames.map(f => f.value), [axis]);
    const labels = useMemo(() => new Map(axis.frames.map(f => [f.value, f.label])), [axis]);
    if (!axis.frames.length) return null;
    const animationConfig = {
      domain: [steps[0], steps[steps.length - 1]] as [number, number],
      currentTime: steps[index],
      timeSteps: steps,
      defaultTimeFormat: null,
      isAnimating,
      speed
    };
    return (
      <Container aria-label={`${label}: ${axis.label}`}>
        <LayerAnimationController
          animationConfig={animationConfig}
          setLayerAnimationTime={value => {
            const next = steps.indexOf(value);
            if (next >= 0) onFrameChange(next);
          }}
        >
          {(_playing, _start, _pause, resetAnimation, timeline, setTimelineValue) => (
            <AnimationControl
              timeline={timeline ? {...timeline, marks: steps} : undefined}
              setTimelineValue={setTimelineValue}
              isAnimating={isAnimating}
              isAnimatable={steps.length > 1}
              showTimeline={steps.length > 1}
              showControls={steps.length > 1}
              resetAnimation={resetAnimation}
              toggleAnimation={() => setAnimating(playing => !playing)}
              updateAnimationSpeed={setSpeed}
              formatTimelineValue={value => labels.get(value) ?? ''}
              displayLabel={`${label}: ${axis.label}`}
            />
          )}
        </LayerAnimationController>
      </Container>
    );
  };
}

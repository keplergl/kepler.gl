// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {bisectLeft} from 'd3-array';
import {requestAnimationFrame, cancelAnimationFrame} from 'global/window';
import Console from 'global/console';
import {BASE_SPEED, FPS, ANIMATION_WINDOW} from '@kepler.gl/constants';
import {Timeline} from '@kepler.gl/types';

interface AnimationControllerProps<T extends number | number[]> {
  isAnimating?: boolean;
  speed?: number;
  updateAnimation?: (x: T) => void;
  setTimelineValue: (x: T) => void;
  timeline?: Timeline;
  animationWindow?: string;
  steps?: number[] | null;
  domain: number[] | null;
  value: T;
  baseSpeed?: number;
  children?: (
    isAnimating: boolean | undefined,
    startAnimation: () => void,
    pauseAnimation: () => void,
    resetAnimation: () => void,
    timeline: Timeline | undefined,
    setTimelineValue: (x: T) => void
  ) => React.ReactElement | null;
}

class AnimationControllerType<T extends number | number[]> extends Component<
  AnimationControllerProps<T>
> {}

function AnimationControllerFactory(): typeof AnimationControllerType {
  /**
   * 4 Animation Window Types
   * 1. free
   *  |->  |->
   * Current time is a fixed range, animate a moving window that calls next animation frames continuously
   * The increment id based on domain / BASE_SPEED * SPEED
   *
   * 2. incremental
   * |    |->
   * Same as free, current time is a growing range, only the max value of range increment during animation.
   * The increment is also based on domain / BASE_SPEED * SPEED
   *
   * 3. point
   * o -> o
   * Current time is a point, animate a moving point calls next animation frame continuously
   * The increment is based on domain / BASE_SPEED * SPEED
   *
   * 4. interval
   * o ~> o
   * Current time is a point. An array of sorted time steps are provided,
   * animate a moving point jumps to the next step
   */
  class AnimationController<T extends number | number[]> extends Component<
    AnimationControllerProps<T>
  > {
    static defaultProps = {
      baseSpeed: BASE_SPEED,
      speed: 1,
      steps: null,
      animationWindow: ANIMATION_WINDOW.free
    };

    state = {
      isAnimating: false
    };

    componentDidMount() {
      this._startOrPauseAnimation();
    }

    componentDidUpdate() {
      this._startOrPauseAnimation();
    }

    componentWillUnmount() {
      if (this._timer) {
        cancelAnimationFrame(this._timer);
      }
    }

    _timer = null;
    _startTime = 0;

    _startOrPauseAnimation() {
      const {isAnimating, speed = 1} = this.props;
      if (!this._timer && isAnimating && speed > 0) {
        this._startAnimation();
      } else if (this._timer && !isAnimating) {
        this._pauseAnimation();
      }
    }

    _animate = delay => {
      this._startTime = new Date().getTime();

      const loop = () => {
        const current = new Date().getTime();
        const delta = current - this._startTime;

        if (delta >= delay) {
          this._nextFrame();
          this._startTime = new Date().getTime();
        } else {
          this._timer = requestAnimationFrame(loop);
        }
      };

      this._timer = requestAnimationFrame(loop);
    };

    _resetAnimationByDomain = () => {
      const {domain, value, animationWindow, updateAnimation} = this.props;
      if (!domain) {
        return;
      }
      const setTimelineValue = updateAnimation || this.props.setTimelineValue;

      if (Array.isArray(value)) {
        const windowSize = value[1] - value[0];
        if (animationWindow === ANIMATION_WINDOW.incremental) {
          setTimelineValue([value[0], value[0] + 1] as T);
        } else {
          const startValue = domain[0] - windowSize;
          setTimelineValue([startValue, startValue + windowSize] as T);
        }
      } else {
        setTimelineValue(domain[0] as T);
      }
    };

    _resetAnimationByTimeStep = () => {
      const {steps = null, updateAnimation} = this.props;
      if (!steps) return;
      // interim solution while we fully migrate filter and layer controllers
      const setTimelineValue = updateAnimation || this.props.setTimelineValue;

      // go to the first steps
      setTimelineValue([steps[0], 0] as T);
    };

    _resetAnimation = () => {
      if (this.props.animationWindow === ANIMATION_WINDOW.interval) {
        this._resetAnimationByTimeStep();
      } else {
        this._resetAnimationByDomain();
      }
    };

    _startAnimation = () => {
      const {speed = 1} = this.props;
      this._clearTimer();
      if (speed > 0) {
        if (this.props.animationWindow === ANIMATION_WINDOW.interval) {
          // animate by interval
          // 30*600
          const {steps} = this.props;
          if (!Array.isArray(steps) || !steps.length) {
            Console.warn('animation steps should be an array');
            return;
          }
          // when speed = 1, animation should loop through 600 frames at 60 FPS
          // calculate delay based on # steps
          const delay = (BASE_SPEED * (1000 / FPS)) / steps.length / (speed || 1);
          this._animate(delay);
        } else {
          this._timer = requestAnimationFrame(this._nextFrame);
        }
      }
      this.setState({isAnimating: true});
    };

    _clearTimer = () => {
      if (this._timer) {
        cancelAnimationFrame(this._timer);
        this._timer = null;
      }
    };

    _pauseAnimation = () => {
      this._clearTimer();
      this.setState({isAnimating: false});
    };

    _nextFrame = () => {
      this._timer = null;
      const nextValue =
        this.props.animationWindow === ANIMATION_WINDOW.interval
          ? this._nextFrameByTimeStep()
          : this._nextFrameByDomain();

      // interim solution while we fully migrate filter and layer controllers
      const setTimelineValue = this.props.updateAnimation || this.props.setTimelineValue;
      setTimelineValue(nextValue as T);
    };

    _nextFrameByDomain() {
      const {domain, value, speed = 1, baseSpeed = 600, animationWindow, steps} = this.props;
      if (!domain) {
        return;
      }
      const delta = ((domain[1] - domain[0]) / baseSpeed) * speed;

      // loop when reaches the end
      // current time is a range
      if (Array.isArray(value)) {
        let value0: number;
        let value1: number;
        const windowSize = value[1] - value[0];
        if (animationWindow === ANIMATION_WINDOW.incremental) {
          // grow the window to the end of the last bin, not just domain[1]: the
          // domain ends on the last timestamp, so a window ending there would
          // select the last scene for a single frame. steps are the bin
          // thresholds with the last one popped, so the last bin ends one bin
          // width past the last step.
          let endOfSweep = domain[1];
          if (Array.isArray(steps) && steps.length > 1) {
            const endOfLastBin =
              steps[steps.length - 1] + (steps[steps.length - 1] - steps[steps.length - 2]);
            if (Number.isFinite(endOfLastBin) && endOfLastBin > endOfSweep) {
              endOfSweep = endOfLastBin;
            }
          }
          value0 = value[0];
          // clamp the last step instead of discarding it, and loop back to the
          // anchor only after the final frame was emitted
          value1 = value[1] >= endOfSweep ? value[0] + 1 : Math.min(value[1] + delta, endOfSweep);
        } else {
          const lastFrame = value[0] + delta > domain[1];
          const startValue = domain[0] - windowSize;
          value0 = lastFrame ? startValue : value[0] + delta;
          value1 = value0 + windowSize;
        }
        return [value0, value1];
      }

      // current time is a point
      return Number(value) + delta > domain[1] ? domain[0] : Number(value) + delta;
    }

    _nextFrameByTimeStep() {
      const {steps = null, value} = this.props;
      if (!steps) return;
      const val = Array.isArray(value) ? value[0] : Number(value);
      const index = bisectLeft(steps, val);
      const nextIdx = index >= steps.length - 1 ? 0 : index + 1;

      // why do we need to pass an array of two objects? are we reading nextIdx at some point?
      // _nextFrameByDomain only returns one value
      return [steps[nextIdx], nextIdx];
    }

    render() {
      const {isAnimating} = this.state;
      const {children} = this.props;

      return typeof children === 'function'
        ? children(
            isAnimating,
            this._startAnimation,
            this._pauseAnimation,
            this._resetAnimation,
            this.props.timeline,
            this.props.setTimelineValue
          )
        : null;
    }
  }

  return AnimationController;
}

export default AnimationControllerFactory;

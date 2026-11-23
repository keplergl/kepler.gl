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
  minimumIncrement?: number;
  loop?: boolean;
  onAnimationEnd?: () => void;
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

    componentDidUpdate(previousProps: AnimationControllerProps<T>) {
      this._startOrPauseAnimation(previousProps);
    }

    componentWillUnmount() {
      if (this._timer) {
        cancelAnimationFrame(this._timer);
      }
    }

    _timer = null;
    _startTime = 0;
    _completed = false;

    _startOrPauseAnimation(previousProps?: AnimationControllerProps<T>) {
      const {isAnimating, speed = 1} = this.props;
      const starting = Boolean(isAnimating && !previousProps?.isAnimating);
      if (starting) {
        this._completed = false;
      }
      if (!this._timer && isAnimating && speed > 0 && !this._completed) {
        this._startAnimation(starting);
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
      const {domain, value, animationWindow, updateAnimation, minimumIncrement} = this.props;
      if (!domain) {
        return;
      }
      const setTimelineValue = updateAnimation || this.props.setTimelineValue;

      if (Array.isArray(value)) {
        const windowSize = value[1] - value[0];
        if (animationWindow === ANIMATION_WINDOW.incremental) {
          const resetEnd =
            minimumIncrement === undefined
              ? value[0] + 1
              : Math.min(domain[1], value[0] + minimumIncrement);
          setTimelineValue([value[0], resetEnd] as T);
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

    _startAnimation = (restartAtEnd = true) => {
      const {speed = 1} = this.props;
      this._clearTimer();
      this._completed = false;
      if (restartAtEnd && this.props.loop === false && this._isAtEnd(this.props.value)) {
        this._resetAnimation();
      }
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
      if (this._completed) {
        return;
      }
      const nextValue =
        this.props.animationWindow === ANIMATION_WINDOW.interval
          ? this._nextFrameByTimeStep()
          : this._nextFrameByDomain();

      const completed = this.props.loop === false && this._isAtEnd(nextValue);
      // Mark completion before publishing the final frame: its parent may render
      // synchronously while the playing flag is still true.
      this._completed = completed;

      // interim solution while we fully migrate filter and layer controllers
      const setTimelineValue = this.props.updateAnimation || this.props.setTimelineValue;
      setTimelineValue(nextValue as T);
      if (completed) {
        this._pauseAnimation();
        this.props.onAnimationEnd?.();
      }
    };

    _getEndOfSweep() {
      const {domain, steps, minimumIncrement} = this.props;
      if (!domain) {
        return undefined;
      }
      let end = domain[1];
      // Calendar bins can extend past the last observation. Numeric bins are
      // already closed on their domain and must not be extrapolated.
      if (minimumIncrement === undefined && Array.isArray(steps) && steps.length > 1) {
        const binEnd =
          steps[steps.length - 1] + (steps[steps.length - 1] - steps[steps.length - 2]);
        if (Number.isFinite(binEnd) && binEnd > end) {
          end = binEnd;
        }
      }
      return end;
    }

    _isAtEnd(value: number | number[] | undefined) {
      const {domain, animationWindow, steps} = this.props;
      if (!domain || value === undefined) {
        return false;
      }
      if (animationWindow === ANIMATION_WINDOW.interval) {
        return Boolean(
          steps?.length && (Array.isArray(value) ? value[0] : value) >= steps[steps.length - 1]
        );
      }
      if (Array.isArray(value)) {
        return (
          value[1] >=
          (animationWindow === ANIMATION_WINDOW.incremental ? this._getEndOfSweep()! : domain[1])
        );
      }
      return Number(value) >= domain[1];
    }

    _nextFrameByDomain() {
      const {
        domain,
        value,
        speed = 1,
        baseSpeed = 600,
        animationWindow,
        minimumIncrement
      } = this.props;
      if (!domain) {
        return;
      }
      const rawDelta = ((domain[1] - domain[0]) / baseSpeed) * speed;
      const delta =
        minimumIncrement === undefined ? rawDelta : Math.max(rawDelta, minimumIncrement);

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
          const endOfSweep = this._getEndOfSweep()!;
          value0 = value[0];
          // clamp the last step instead of discarding it, and loop back to the
          // anchor only after the final frame was emitted
          value1 =
            value[1] >= endOfSweep && this.props.loop !== false
              ? minimumIncrement === undefined
                ? value[0] + 1
                : Math.min(domain[1], value[0] + minimumIncrement)
              : Math.min(value[1] + delta, endOfSweep);
        } else {
          if (this.props.loop === false && value[1] + delta >= domain[1]) {
            return [Math.max(domain[0], domain[1] - windowSize), domain[1]];
          }
          const lastFrame = value[0] + delta > domain[1];
          const startValue = domain[0] - windowSize;
          value0 = lastFrame ? startValue : value[0] + delta;
          value1 = value0 + windowSize;
        }
        return [value0, value1];
      }

      // current time is a point
      return Number(value) + delta > domain[1]
        ? this.props.loop === false
          ? domain[1]
          : domain[0]
        : Number(value) + delta;
    }

    _nextFrameByTimeStep() {
      const {steps = null, value} = this.props;
      if (!steps) return;
      const val = Array.isArray(value) ? value[0] : Number(value);
      const index = bisectLeft(steps, val);
      const nextIdx =
        index >= steps.length - 1 ? (this.props.loop === false ? steps.length - 1 : 0) : index + 1;

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

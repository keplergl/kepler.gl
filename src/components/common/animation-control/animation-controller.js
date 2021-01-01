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

import {Component} from 'react';
import {bisectLeft} from 'd3-array';
import {requestAnimationFrame, cancelAnimationFrame} from 'global/window';
import Console from 'global/console';
import {BASE_SPEED, FPS, ANIMATION_WINDOW} from 'constants/default-settings';

function AnimationControllerFactory() {
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
  class AnimationController extends Component {
    // TODO: convert the entire component to use hooks in the next PR
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

    _startOrPauseAnimation() {
      const {isAnimating, speed} = this.props;
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
        // @ts-ignore
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
      const {domain, value, animationWindow} = this.props;
      if (Array.isArray(value)) {
        if (animationWindow === ANIMATION_WINDOW.incremental) {
          this.props.updateAnimation([value[0], value[0] + 1]);
        } else {
          this.props.updateAnimation([domain[0], domain[0] + value[1] - value[0]]);
        }
      } else {
        this.props.updateAnimation(domain[0]);
      }
    };

    _resetAnimtionByTimeStep = () => {
      // go to the first steps
      this.props.updateAnimation([this.props.steps[0], 0]);
    };

    _resetAnimation = () => {
      if (this.props.animationWindow === ANIMATION_WINDOW.interval) {
        this._resetAnimtionByTimeStep();
      } else {
        this._resetAnimationByDomain();
      }
    };

    _startAnimation = () => {
      const {speed} = this.props;
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

      this.props.updateAnimation(nextValue);
    };

    _nextFrameByDomain() {
      const {domain, value, speed, baseSpeed, animationWindow} = this.props;
      const delta = ((domain[1] - domain[0]) / baseSpeed) * speed;

      // loop when reaches the end
      // current time is a range
      if (Array.isArray(value)) {
        let value0;
        let value1;
        const readEnd = value[1] + delta > domain[1];
        if (animationWindow === ANIMATION_WINDOW.incremental) {
          value0 = value[0];
          value1 = readEnd ? value[0] + 1 : value[1] + delta;
        } else {
          value0 = readEnd ? domain[0] : value[0] + delta;
          value1 = value0 + value[1] - value[0];
        }
        return [value0, value1];
      }

      // current time is a point
      return value + delta > domain[1] ? domain[0] : value + delta;
    }

    _nextFrameByTimeStep() {
      const {steps, value} = this.props;
      const val = Array.isArray(value) ? value[0] : value;
      const index = bisectLeft(steps, val);
      const nextIdx = index >= steps.length - 1 ? 0 : index + 1;

      return [steps[nextIdx], nextIdx];
    }

    render() {
      const {isAnimating} = this.state;
      const {children} = this.props;

      return typeof children === 'function'
        ? children(isAnimating, this._startAnimation, this._pauseAnimation, this._resetAnimation)
        : null;
    }
  }

  return AnimationController;
}

export default AnimationControllerFactory;

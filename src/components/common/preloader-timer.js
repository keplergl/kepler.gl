/** @jsx createElement */
import createElement from 'react-stylematic';

import {Component} from 'react';
import moment from 'moment';
import {requestAnimationFrame, cancelAnimationFrame, setTimeout} from 'global/window';

import {padNumber} from '../../utils/utils';
import {preloaderTimer} from '../../../../styles/model-dialog';

export default class PreloaderTimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeElapsed: null,
      startTime: moment().valueOf()
    };

    this.timerId = null;
    this.animationDelay = 1000;

    this._updateTime = this._updateTime.bind(this);
  }

  componentDidMount() {
    this.setState({
      startTime: moment().valueOf()
    });
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.timerId = requestAnimationFrame(this._updateTime);
    }, this.animationDelay)
  }

  componentWillUnmount() {
    this._clearTimer();
  }

  _clearTimer() {
    cancelAnimationFrame(this.timerId);
    this.timerId = null;
  }

  _updateTime() {
    if (this.refs.root) {
      const diff = moment().valueOf() - this.state.startTime;
      const duration = moment.duration(diff, 'ms');

      this.setState({timeElapsed: duration});
    } else {
      this._clearTimer();
    }
  }

  render() {
    const {timeElapsed} = this.state;
    let timePassed = '';
    if (timeElapsed) {
      const min = padNumber(timeElapsed.minutes());
      const sec = padNumber(timeElapsed.seconds());

      timePassed = `${min} : ${sec}`;
    }

    return (
      <div style={preloaderTimer} ref="root">
        <div className="preloader--wrapper">
          <span className="preloader--large preloader" />
          <div className="preloader--time">
            <span>{timePassed}</span>
          </div>
        </div>
      </div>
    );
  }
}

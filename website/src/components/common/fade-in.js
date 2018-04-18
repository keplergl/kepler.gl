import React, {PureComponent} from 'react';
import Waypoint from 'react-waypoint';

export default class FadeIn extends PureComponent {
  state = {
    isVisible: null,
  }

  _onWaypointEnter = () => {
    this.setState({isVisible: true});
  }

  _onWaypointLeave = () => {
    this.setState({isVisible: false});
  }

  render() {
    const {isVisible} = this.state;
    const {transitionDelay = 0} = this.props;
    return (
      <Waypoint
        onEnter={this._onWaypointEnter}
        onLeave={this._onWaypointLeave}>
        <div style={{
          opacity: isVisible ? 1.0 : 0.0,
          transform: isVisible ? undefined: 'translate(0, 5px)',
          transition: `opacity 1s ${transitionDelay}ms, transform 1s ${transitionDelay}ms`,
        }}>
          {this.props.children}
        </div>
      </Waypoint>
    )
  }
}
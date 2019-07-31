import React, {Component} from 'react';
import styled from 'styled-components';
import AnimationSpeedToggle from 'components/filters/animation-speed-toggle';
import {Button, CenterFlexbox} from 'components/common/styled-components';
import {Rocket} from 'components/common/icons';

const StyledSpeedToggle = styled.div`
  width: 80px;
  display: flex;
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  position: relative;

  .bottom-widget__icon {
    margin-right: 6px;
  }
  .bottom-widget__icon.speed {
    margin-right: 0;
  }

`;

const StyledSpeedText = styled.div`
  display: inline-block,
  width: 27px
`;

class SpeedControl extends Component {
  state = {};
  render() {
    const {onClick, updateAnimationSpeed} = this.props;

    return (
      <StyledSpeedToggle>
        <Button link width="80px" onClick={onClick}>
          <CenterFlexbox className="bottom-widget__icon speed">
            <Rocket height="15px" />
          </CenterFlexbox>
          <StyledSpeedText
            style={{visibility: !this.props.showSpeedControl ? 'visible' : 'hidden'}}
          >
            {this.props.speed}x
          </StyledSpeedText>
        </Button>
        {this.props.showSpeedControl ? (
          <AnimationSpeedToggle
            className="bottom-widget__toggle"
            onHide={onClick}
            updateAnimationSpeed={updateAnimationSpeed}
            speed={this.props.speed}
          />
        ) : null}
      </StyledSpeedToggle>
    );
  }
}

export default SpeedControl;

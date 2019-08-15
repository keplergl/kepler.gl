import React from 'react';
import styled from 'styled-components';
import AnimationSpeedToggle from 'components/filters/animation-speed-toggle';
import {Button, CenterFlexbox} from 'components/common/styled-components';
import {Rocket} from 'components/common/icons';

const StyledSpeedToggle = styled.div`
  width: 70px;
  display: flex;
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  position: relative;
  margin-left: 8px;

  .bottom-widget__icon {
    margin-right: 6px;
  }
  .bottom-widget__icon.speed {
    margin-right: auto;
  }

`;

const StyledSpeedText = styled.div`
  display: inline-block,
  width: 27px
`;

const SpeedControl = ({onClick, updateAnimationSpeed, speed, showSpeedControl}) => (
  <StyledSpeedToggle>
    <Button link width="80px" onClick={onClick}>
      <CenterFlexbox className="bottom-widget__icon speed">
        <Rocket height="15px" />
      </CenterFlexbox>
      <StyledSpeedText
        style={{visibility: !showSpeedControl ? 'visible' : 'hidden'}}
      >
        {speed}x
      </StyledSpeedText>
    </Button>
    {showSpeedControl ? (
      <AnimationSpeedToggle
        className="bottom-widget__toggle"
        onHide={onClick}
        updateAnimationSpeed={updateAnimationSpeed}
        speed={speed}
      />
    ) : null}
  </StyledSpeedToggle>
);

export default SpeedControl;

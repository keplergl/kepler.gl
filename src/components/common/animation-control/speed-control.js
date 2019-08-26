// Copyright (c) 2019 Uber Technologies, Inc.
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
  margin-right: 8px;

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

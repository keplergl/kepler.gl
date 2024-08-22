// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

const StyledText = styled.div`
  font-size: 12px;
`;

const StyledLink = styled.a`
  text-decoration: underline !important;
  color: white !important;
  font-weight: 500;
  margin-left: 8px;

  :hover {
    cursor: pointer;
  }
`;

const DisableBanner = styled.div`
  display: inline-block;
  margin-left: 20px;
`;

// We are using the link to make sure users who have seen
// previous banners can see this one because we check localstorage key
export const FormLink = 'https://shan990829.typeform.com/to/RbCAXt';

const Announcement = ({onDisable}) => (
  <StyledText>
    <span>
      Kepler.gl turns two years old! Help our open source community by taking this 5-minute-survey
      and get a chance to win a <b>$100 Amazon gift card</b>. Make your answers count!
    </span>
    <StyledLink target="_blank" href={FormLink}>
      Take the survey
    </StyledLink>
    {onDisable ? (
      <DisableBanner>
        <StyledLink onClick={onDisable}>Already provided my feedback!</StyledLink>
      </DisableBanner>
    ) : null}
  </StyledText>
);

export default Announcement;

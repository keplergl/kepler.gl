import React from 'react';
import styled from 'styled-components';

const StyledText = styled.div`
  font-size: 12px;
`;

const StyledLink = styled.a`
  text-decoration: underline !important;
  color: white;
  font-weight: 500;
  
  :hover {
    cursor: pointer;
  }
`;

const DisableBanner = styled.div`
  display: inline-block;
  margin-left: 20px;
`;
const FormLink = 'https://docs.google.com/forms/d/1o2VbSIKiRfoTJLi6nGzxNHgDA1Yu-UnNOHglPJvPWpc/edit';

const Announcement = ({onDisable}) => (
  <StyledText>
    <span>Thanks for your interests in kepler.gl. Please help us make it better by taking </span>
    <StyledLink target="_blank" href={FormLink}>this survey</StyledLink>.
    <span> It only takes 5 minutes!</span>
    {onDisable ? <DisableBanner>
      <StyledLink onClick={onDisable}>Already took it</StyledLink>
    </DisableBanner> : null}
  </StyledText>
);

export default Announcement;

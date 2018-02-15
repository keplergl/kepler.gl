import React from 'react';
import styled from 'styled-components';

const LogoTitle = styled.div`
  display: inline-block;
  margin-left: 6px;
`;

const LogoName = styled.div`
  color: ${props => props.theme.activeColor};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1.17px;
`;
const LogoVersion = styled.div`
  font-size: 10px;
  color: ${props => props.theme.subtextColor};
  letter-spacing: 0.83px;
  line-height: 14px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const LogoSvgWrapper = styled.div`
  margin-top: 3px;
`;

const LogoSvg = () => (
  <svg
    className="side-panel-logo__logo"
    width="22px"
    height="15px"
    viewBox="0 0 22 15"
  >
    <g transform="translate(11, -3) rotate(45.000000)">
      <rect fill="#535C6C" x="0" y="5" width="10" height="10" />
      <rect fill="#1FBAD6" x="5" y="0" width="10" height="10" />
    </g>
  </svg>
);

const KeplerGlLogo = ({appName, version}) => (
  <LogoWrapper className="side-panel-logo">
    <LogoSvgWrapper>
      <LogoSvg />
    </LogoSvgWrapper>
    <LogoTitle className="logo__title">
      <LogoName className="logo__name">{appName}</LogoName>
      <LogoVersion className="logo__version">{version}</LogoVersion>
    </LogoTitle>
  </LogoWrapper>
);

KeplerGlLogo.defaultProps = {
  appName: 'Kepler.Gl',
  version: 'v1.0'
};

export default KeplerGlLogo;

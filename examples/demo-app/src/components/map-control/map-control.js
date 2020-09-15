// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {useState} from 'react';
import styled from 'styled-components';
import {Icons, IconRoundSmall, MapControlButton} from 'kepler.gl/components';

import ReactMarkdown from 'react-markdown';

const StyledFloatingPanel = styled.div`
  margin-right: 12px;
  margin-top: 20px;
`;

const StyledProjectPanel = styled.div`
  background: ${props => props.theme.panelBackground};
  padding: 16px 20px;
  width: 280px;
  box-shadow: ${props => props.theme.panelBoxShadow};

  .project-title {
    color: ${props => props.theme.titleTextColor};
    font-size: 13px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }

  .project-description {
    color: ${props => props.theme.textColor};
    font-size: 11px;
    margin-top: 12px;

    a {
      font-weight: 500;
      color: ${props => props.theme.titleTextColor};
    }
  }

  .project-links {
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
const StyledPanelAction = styled.div`
  border-radius: 2px;
  margin-left: 4px;
  padding: 5px;
  font-weight: 500;

  a {
    align-items: center;
    justify-content: flex-start;
    display: flex;
    height: 16px;
    padding-right: 10px;
    color: ${props => (props.active ? props.theme.textColorHl : props.theme.subtextColor)};

    svg {
      margin-right: 8px;
    }
  }

  :hover {
    cursor: pointer;
    a {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

export const LinkButton = props => (
  <StyledPanelAction className="project-link__action">
    <a target="_blank" rel="noopener noreferrer" href={props.href}>
      <props.iconComponent height={props.height || '16px'} />
      <p>{props.label}</p>
    </a>
  </StyledPanelAction>
);

const CloseButton = ({onClick}) => (
  <IconRoundSmall>
    <Icons.Close height="16px" onClick={onClick} />
  </IconRoundSmall>
);

const LinkRenderer = props => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

// convert https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/nyctrips/config.json
// to https://github.com/uber-web/kepler.gl-data/blob/master/movement_pittsburgh/config.json
function getURL(url) {
  return url
    ? url
        .replace('https://raw.githubusercontent.com', 'https://github.com')
        .replace('master', 'blob/master')
    : url;
}

export function SampleMapPanel(props) {
  const [isActive, setActive] = useState(true);

  return (
    <StyledFloatingPanel>
      {isActive ? (
        <StyledProjectPanel>
          <div className="project-title">
            <div>{props.currentSample.label}</div>
            <CloseButton onClick={() => setActive(false)} />
          </div>
          <div className="project-description">
            <ReactMarkdown
              source={props.currentSample.detail || props.currentSample.description}
              renderers={{link: LinkRenderer}}
            />
          </div>
          <div className="project-links">
            <LinkButton
              label="Data"
              href={getURL(props.currentSample.dataUrl)}
              iconComponent={Icons.Files}
              height="15px"
            />
            <LinkButton
              label="Config"
              href={getURL(props.currentSample.configUrl)}
              iconComponent={Icons.CodeAlt}
              height="17px"
            />
          </div>
        </StyledProjectPanel>
      ) : (
        <MapControlButton
          onClick={e => {
            e.preventDefault();
            setActive(true);
          }}
        >
          <Icons.Docs height="18px" />
        </MapControlButton>
      )}
    </StyledFloatingPanel>
  );
}

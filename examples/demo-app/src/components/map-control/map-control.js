// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {useState} from 'react';
import Markdown from 'markdown-to-jsx';
import styled from 'styled-components';
import {useLocalStorage} from 'usehooks-ts';

import {Icons, IconRoundSmall, LinkRenderer, MapControlButton} from '@kepler.gl/components';
import {getApplicationConfig} from '@kepler.gl/utils';

const StyledFloatingPanel = styled.div`
  margin-right: 12px;
  margin-top: 12px;
`;

const StyledProjectPanel = styled.div`
  background: ${props => props.theme.panelBackground};
  padding: 16px 16px 16px 20px;
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
    margin-top: 16px;
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

  &:hover {
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

// convert https://raw.githubusercontent.com/keplergl/kepler.gl-data/master/nyctrips/config.json
// to https://github.com/keplergl/kepler.gl-data/blob/master/movement_pittsburgh/config.json
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
            <Markdown
              options={{
                overrides: {
                  a: {
                    component: LinkRenderer
                  }
                }
              }}
            >
              {props.currentSample.detail || props.currentSample.description}
            </Markdown>
          </div>
          <div className="project-links">
            <LinkButton
              label="Data"
              href={getURL(
                props.currentSample.dataUrl || props.currentSample.remoteDatasetConfigUrl
              )}
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
          className={classnames('map-control-button', 'info-panel', {isActive})}
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

export function BannerMapPanel() {
  const [isActive, setActive] = useState(true);
  // Once the banner is closed, the user won't see the banner during next sessions.
  const [showBanner, setShowBanner] = useLocalStorage(
    'show-duckdb-preview-banner',
    getApplicationConfig().showReleaseBanner
  );
  const [wasVisible] = useState(showBanner);

  if (!showBanner && !wasVisible) {
    return null;
  }

  return (
    <StyledFloatingPanel>
      {isActive ? (
        <StyledProjectPanel>
          <div className="project-title">
            <div>{'Kepler.gl 3.1 + DuckDB is here!'}</div>

            <CloseButton
              onClick={() => {
                setShowBanner(false);
                setActive(false);
              }}
            />
          </div>
          <div className="project-description">
            <Markdown
              options={{
                overrides: {
                  a: {
                    component: LinkRenderer
                  }
                }
              }}
            >
              {
                '[Click here](https://kepler-preview.foursquare.com) to check out the preview of Kepler.gl 3.1 with DuckDB enabled!'
              }
            </Markdown>
          </div>
        </StyledProjectPanel>
      ) : (
        <MapControlButton
          className={classnames('map-control-button', 'info-panel', {isActive})}
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

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {useCallback, useContext} from 'react';
import Markdown from 'markdown-to-jsx';
import styled from 'styled-components';
import {IntlContext} from 'react-intl';

import {MapControls, MapInfo} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

import LinkRenderer from '../common/link-renderer';
import {ArrowDown, Docs} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory, {MapControlTooltipProps} from './map-control-tooltip';

const InfoFloatingPanel = styled.div`
  width: 280px;
  max-width: calc(100vw - 48px);
`;

const InfoPanel = styled.div`
  position: relative;
  background: ${props => props.theme.panelBackground};
  padding: 16px 28px 16px 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${props => props.theme.panelBoxShadow};

  .map-info-title {
    color: ${props => props.theme.titleTextColor};
    font-size: 13px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    word-break: break-word;
  }

  .map-info-description {
    color: ${props => props.theme.textColor};
    font-size: 11px;
    margin-top: 12px;
    word-break: break-word;

    &.map-info-description--only {
      margin-top: 0;
    }

    a {
      font-weight: 500;
      color: ${props => props.theme.titleTextColor};
    }

    p {
      margin: 0;
    }

    p + p {
      margin-top: 8px;
    }
  }
`;

const MinimizeButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.textColor};
  cursor: pointer;
  opacity: 0;

  ${InfoPanel}:hover & {
    opacity: 1;
  }

  &:focus-visible {
    opacity: 1;
  }

  &:hover {
    color: ${props => props.theme.textColorHl};
  }
`;

type MapInfoLinkProps = {
  href?: string;
  children?: React.ReactNode;
};

/** Only http(s) links from a saved description are clickable. */
const MapInfoLink: React.FC<MapInfoLinkProps> = ({href = '', children}) => {
  if (!/^https?:\/\//i.test(href)) {
    return <span>{children}</span>;
  }
  return <LinkRenderer href={href}>{children}</LinkRenderer>;
};

/**
 * Images are not rendered: a description loaded from an untrusted map file would
 * otherwise fetch an arbitrary url as soon as the card opens.
 */
const MapInfoImage: React.FC<{alt?: string}> = ({alt}) => (alt ? <span>{alt}</span> : null);

export type MapInfoPanelProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  mapInfo?: Partial<MapInfo>;
  className?: string;
};

MapInfoPanelFactory.deps = [MapControlTooltipFactory];

function MapInfoPanelFactory(MapControlTooltip: React.FC<MapControlTooltipProps>) {
  const MapInfoPanel: React.FC<MapInfoPanelProps> = ({
    mapControls,
    onToggleMapControl,
    mapInfo,
    className
  }) => {
    const intl = useContext(IntlContext);
    const title = mapInfo?.title ?? '';
    const description = mapInfo?.description ?? '';
    const hasTitle = Boolean(title.trim());
    const hasDescription = Boolean(description.trim());
    const hasContent = hasTitle || hasDescription;
    const active = Boolean(mapControls?.mapInfo?.active);
    // Match the other map controls: a missing entry stays hidden. The default
    // control list sets show: true.
    const show = Boolean(mapControls?.mapInfo?.show);
    const showCard = show && active && hasContent;

    const openPanel = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        if (!active) {
          onToggleMapControl('mapInfo');
        }
      },
      [active, onToggleMapControl]
    );

    const closePanel = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        if (active) {
          onToggleMapControl('mapInfo');
        }
      },
      [active, onToggleMapControl]
    );

    if (!getApplicationConfig().enableMapInfo || !show || !hasContent) {
      return null;
    }

    if (!showCard) {
      return (
        <MapControlTooltip id="show-map-info" message="tooltip.showMapInfo">
          <MapControlButton
            className={classnames('map-control-button', 'map-info', className)}
            onClick={openPanel}
            data-testid="map-info-button"
          >
            <Docs height="18px" />
          </MapControlButton>
        </MapControlTooltip>
      );
    }

    const closeLabel = intl
      ? intl.formatMessage({id: 'tooltip.hideMapInfo'})
      : 'tooltip.hideMapInfo';

    return (
      <InfoFloatingPanel
        className={classnames('map-info-panel', className)}
        data-testid="map-info-panel"
      >
        <InfoPanel>
          <MinimizeButton type="button" aria-label={closeLabel} onClick={closePanel}>
            <ArrowDown height="14px" />
          </MinimizeButton>
          {hasTitle ? (
            <div className="map-info-title">
              <div>{title}</div>
            </div>
          ) : null}
          {hasDescription ? (
            <div
              className={classnames('map-info-description', {
                'map-info-description--only': !hasTitle
              })}
            >
              <Markdown
                options={{
                  disableParsingRawHTML: true,
                  overrides: {
                    a: {
                      component: MapInfoLink
                    },
                    img: {
                      component: MapInfoImage
                    }
                  }
                }}
              >
                {description}
              </Markdown>
            </div>
          ) : null}
        </InfoPanel>
      </InfoFloatingPanel>
    );
  };

  MapInfoPanel.displayName = 'MapInfoPanel';

  return MapInfoPanel;
}

export default MapInfoPanelFactory;

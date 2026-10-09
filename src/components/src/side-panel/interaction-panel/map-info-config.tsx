// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {MAP_INFO_CHARACTER} from '@kepler.gl/constants';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {FormattedMessage} from '@kepler.gl/localization';
import {MapInfo} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

import {Info, Settings} from '../../common/icons';
import InfoHelperFactory from '../../common/info-helper';
import Switch from '../../common/switch';
import PanelHeaderActionFactory, {PanelHeaderActionIcon} from '../panel-header-action';
import {
  Input,
  PanelContent,
  PanelHeaderContent,
  PanelHeaderTitle,
  PanelLabel,
  PanelLabelWrapper,
  StyledPanelHeader
} from '../../common/styled-components';

const StyledMapInfoPanel = styled.div`
  padding-bottom: 6px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  /* Undo StyledPanelHeader's 10px right padding, then match vertical inset around the switch. */
  margin-right: -10px;
  padding-right: ${props => (props.theme.panelHeaderHeight - props.theme.switchHeight) / 2}px;

  /* Unlabeled switch reserves empty label padding on the right; pull the track flush. */
  .kg-checkbox {
    margin-left: 0;
    margin-right: -${props => props.theme.switchLabelMargin}px;
  }
`;

const MapInfoHint = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const Field = styled.div`
  margin-bottom: 12px;
`;

const DescriptionLabel = styled(PanelLabelWrapper)`
  align-items: center;
  margin-bottom: 4px;

  .side-panel-panel__label {
    margin-bottom: 0;
  }

  .info-helper {
    margin-left: 4px;
  }
`;

const MapInfoInput = styled(Input)`
  && {
    height: 28px;
  }
`;

const defaultActionIcons = {
  settings: Settings
};

export type MapInfoConfigProps = {
  mapInfo?: Partial<MapInfo>;
  /** When false, the on-map name and description stay hidden. Defaults to shown. */
  mapInfoShow?: boolean;
  /** Whether the on-map card is expanded. Used so turning the switch on opens the card. */
  mapInfoActive?: boolean;
  visStateActions: typeof VisStateActions;
  uiStateActions?: typeof UIStateActions;
  actionIcons?: {
    settings?: PanelHeaderActionIcon;
  };
};

MapInfoConfigFactory.deps = [PanelHeaderActionFactory, InfoHelperFactory];

function MapInfoConfigFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  InfoHelper: ReturnType<typeof InfoHelperFactory>
): ComponentType<MapInfoConfigProps> {
  const MapInfoConfig: React.FC<MapInfoConfigProps> = ({
    mapInfo,
    mapInfoShow = true,
    mapInfoActive = true,
    visStateActions,
    uiStateActions,
    actionIcons: customActionIcons
  }) => {
    const actionIcons = {...defaultActionIcons, ...customActionIcons};
    const [isConfigActive, setIsConfigActive] = useState(false);
    const title = mapInfo?.title ?? '';
    const description = mapInfo?.description ?? '';

    const togglePanelActive = useCallback(() => {
      setIsConfigActive(prev => !prev);
    }, []);

    const onToggleShow = useCallback(() => {
      const next = !mapInfoShow;
      uiStateActions?.setMapControlVisibility('mapInfo', next);
      if (next && !mapInfoActive) {
        uiStateActions?.toggleMapControl('mapInfo', 0);
      }
    }, [mapInfoActive, mapInfoShow, uiStateActions]);

    const onTitleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        visStateActions.setMapInfo({title: event.target.value});
      },
      [visStateActions]
    );

    const onDescriptionChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        visStateActions.setMapInfo({description: event.target.value});
      },
      [visStateActions]
    );

    if (!getApplicationConfig().enableMapInfo) {
      return null;
    }

    return (
      <StyledMapInfoPanel className="interaction-panel interaction-map-info">
        <StyledPanelHeader
          className={classnames('interaction-map-info__header', {'is-open': isConfigActive})}
          onClick={togglePanelActive}
        >
          <PanelHeaderContent className="interaction-map-info__header__content">
            <div className="interaction-map-info__header__icon icon">
              <Info height="16px" />
            </div>
            <div className="interaction-map-info__header__title">
              <PanelHeaderTitle>
                <FormattedMessage id="interactions.mapInfo" />
              </PanelHeaderTitle>
            </div>
          </PanelHeaderContent>
          <HeaderActions
            className="interaction-map-info__header__actions"
            onClick={event => event.stopPropagation()}
          >
            <PanelHeaderAction
              className={classnames('interaction-map-info__enable-config', {
                'is-open': isConfigActive
              })}
              id="map-info-config"
              tooltip="tooltip.interactionSettings"
              active={isConfigActive}
              flush
              onClick={togglePanelActive}
              IconComponent={actionIcons.settings}
            />
            <Switch checked={mapInfoShow} id="map-info-toggle" onChange={onToggleShow} secondary />
          </HeaderActions>
        </StyledPanelHeader>
        {isConfigActive ? (
          <PanelContent className="interaction-map-info__content">
            <MapInfoHint>
              <FormattedMessage id="interactions.mapInfoHint" />
            </MapInfoHint>
            <Field>
              <PanelLabel htmlFor="interaction-map-name">
                <FormattedMessage id="interactions.mapInfoName" />
              </PanelLabel>
              <MapInfoInput
                id="interaction-map-name"
                type="text"
                value={title}
                maxLength={MAP_INFO_CHARACTER.title}
                onChange={onTitleChange}
              />
            </Field>
            <Field>
              <DescriptionLabel>
                <PanelLabel htmlFor="interaction-map-description">
                  <FormattedMessage id="interactions.mapInfoDescription" />
                </PanelLabel>
                <InfoHelper
                  id="map-info-description-help"
                  description="interactions.mapInfoDescriptionHelp"
                  width={220}
                />
              </DescriptionLabel>
              <MapInfoInput
                id="interaction-map-description"
                type="text"
                value={description}
                maxLength={MAP_INFO_CHARACTER.description}
                onChange={onDescriptionChange}
              />
            </Field>
          </PanelContent>
        ) : null}
      </StyledMapInfoPanel>
    );
  };

  return MapInfoConfig;
}

export default MapInfoConfigFactory;

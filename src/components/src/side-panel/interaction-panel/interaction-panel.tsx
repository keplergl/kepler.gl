// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, ComponentType, ReactElement, useCallback} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import Switch from '../../common/switch';
import BrushConfigFactory from './brush-config';
import TooltipConfigFactory from './tooltip-config';
import GeocoderConfigFactory from './geocoder-config';
import {Datasets} from '@kepler.gl/table';
import {InteractionConfig, ValueOf} from '@kepler.gl/types';
import {
  setColumnDisplayFormat as setColumnDisplayFormatAction,
  ActionHandler
} from '@kepler.gl/actions';

import {
  StyledPanelHeader,
  PanelHeaderTitle,
  PanelHeaderContent,
  PanelContent
} from '../../common/styled-components';
import {Messages, Crosshairs, CursorClick, Pin, Settings} from '../../common/icons';
import PanelHeaderActionFactory from '../panel-header-action';

import {FormattedMessage} from '@kepler.gl/localization';

interface InteractionPanelProps {
  datasets: Datasets;
  config: ValueOf<InteractionConfig>;
  onConfigChange: any;
  interactionConfigIcons?: {
    [key: string]: React.ElementType;
  };
  actionIcons?: {
    settings?: React.ElementType;
  };
  setColumnDisplayFormat: ActionHandler<typeof setColumnDisplayFormatAction>;
}

const StyledInteractionPanel = styled.div`
  padding-bottom: 6px;
  contain: layout paint;
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

InteractionPanelFactory.deps = [
  TooltipConfigFactory,
  BrushConfigFactory,
  GeocoderConfigFactory,
  PanelHeaderActionFactory
];

const INTERACTION_CONFIG_ICONS: {[key: string]: React.ElementType} = {
  tooltip: Messages,
  geocoder: Pin,
  brush: Crosshairs,
  coordinate: CursorClick
};

const defaultActionIcons = {
  settings: Settings
};

function InteractionPanelFactory(
  TooltipConfig: ReturnType<typeof TooltipConfigFactory>,
  BrushConfig: ReturnType<typeof BrushConfigFactory>,
  GeocoderConfig: ReturnType<typeof GeocoderConfigFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
): ComponentType<InteractionPanelProps> {
  const InteractionPanel: React.FC<InteractionPanelProps> = ({
    config,
    onConfigChange,
    datasets,
    setColumnDisplayFormat,
    interactionConfigIcons = INTERACTION_CONFIG_ICONS,
    actionIcons: customActionIcons
  }) => {
    const actionIcons = {...defaultActionIcons, ...customActionIcons};
    const [isConfigActive, setIsConfigActive] = useState(false);

    const _updateConfig = useCallback(
      newProp => {
        onConfigChange({
          ...config,
          ...newProp
        });
      },
      [onConfigChange, config]
    );

    const onDisplayFormatChange = useCallback(
      (dataId, column, displayFormat) => {
        setColumnDisplayFormat(dataId, {[column]: displayFormat});
      },
      [setColumnDisplayFormat]
    );

    const togglePanelActive = useCallback(() => {
      setIsConfigActive(prev => !prev);
    }, []);

    const {enabled} = config;
    const toggleEnableConfig = useCallback(() => {
      _updateConfig({enabled: !enabled});
    }, [_updateConfig, enabled]);

    const onChange = useCallback(newConfig => _updateConfig({config: newConfig}), [_updateConfig]);

    const IconComponent = interactionConfigIcons[config.id];

    let template: ReactElement | null = null;

    switch (config.id) {
      case 'tooltip':
        template = (
          <TooltipConfig
            datasets={datasets}
            config={config.config}
            onChange={onChange}
            onDisplayFormatChange={onDisplayFormatChange}
          />
        );
        break;
      case 'brush':
        template = <BrushConfig config={config.config} onChange={onChange} />;
        break;
      case 'geocoder':
        template = <GeocoderConfig config={config.config} onChange={onChange} />;
        break;

      default:
        break;
    }

    const canExpand = Boolean(template);

    return (
      <StyledInteractionPanel className="interaction-panel">
        <StyledPanelHeader
          className={classnames('interaction-panel__header', {'is-open': isConfigActive})}
          onClick={canExpand ? togglePanelActive : undefined}
        >
          <PanelHeaderContent className="interaction-panel__header__content">
            <div className="interaction-panel__header__icon icon">
              {IconComponent ? <IconComponent height="16px" /> : null}
            </div>
            <div className="interaction-panel__header__title">
              <PanelHeaderTitle>
                <FormattedMessage id={config.label} />
              </PanelHeaderTitle>
            </div>
          </PanelHeaderContent>
          <HeaderActions
            className="interaction-panel__header__actions"
            onClick={e => e.stopPropagation()}
          >
            {canExpand ? (
              <PanelHeaderAction
                className={classnames('interaction-panel__enable-config', {
                  'is-open': isConfigActive
                })}
                id={`${config.id}-config`}
                tooltip="tooltip.interactionSettings"
                active={isConfigActive}
                flush
                onClick={togglePanelActive}
                IconComponent={actionIcons.settings}
              />
            ) : null}
            <Switch
              checked={config.enabled}
              id={`${config.id}-toggle`}
              onChange={toggleEnableConfig}
              secondary
            />
          </HeaderActions>
        </StyledPanelHeader>
        {isConfigActive && template ? (
          <PanelContent className="interaction-panel__content">{template}</PanelContent>
        ) : null}
      </StyledInteractionPanel>
    );
  };

  return InteractionPanel;
}

export default InteractionPanelFactory;

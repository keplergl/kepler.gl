// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, ComponentType, ReactElement, useCallback} from 'react';
import styled from 'styled-components';
import Switch from '../../common/switch';
import BrushConfigFactory from './brush-config';
import TooltipConfigFactory from './tooltip-config';
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
import {Messages, Crosshairs, CursorClick, Pin} from '../../common/icons';

import {FormattedMessage} from '@kepler.gl/localization';

interface InteractionPanelProps {
  datasets: Datasets;
  config: ValueOf<InteractionConfig>;
  onConfigChange: any;
  interactionConfigIcons?: {
    [key: string]: React.ElementType;
  };
  setColumnDisplayFormat: ActionHandler<typeof setColumnDisplayFormatAction>;
}

const StyledInteractionPanel = styled.div`
  padding-bottom: 6px;
`;

InteractionPanelFactory.deps = [TooltipConfigFactory, BrushConfigFactory];

const INTERACTION_CONFIG_ICONS: {[key: string]: React.ElementType} = {
  tooltip: Messages,
  geocoder: Pin,
  brush: Crosshairs,
  coordinate: CursorClick
};

function InteractionPanelFactory(
  TooltipConfig: ReturnType<typeof TooltipConfigFactory>,
  BrushConfig: ReturnType<typeof BrushConfigFactory>
): ComponentType<InteractionPanelProps> {
  const InteractionPanel: React.FC<InteractionPanelProps> = ({
    config,
    onConfigChange,
    datasets,
    setColumnDisplayFormat,
    interactionConfigIcons = INTERACTION_CONFIG_ICONS
  }) => {
    const [isConfigActive, setIsConfigAction] = useState(false);

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
      setIsConfigAction(!isConfigActive);
    }, [setIsConfigAction, isConfigActive]);

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

      default:
        break;
    }
    return (
      <StyledInteractionPanel className="interaction-panel">
        <StyledPanelHeader className="interaction-panel__header" onClick={togglePanelActive}>
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
          <div className="interaction-panel__header__actions">
            <Switch
              checked={config.enabled}
              id={`${config.id}-toggle`}
              onChange={toggleEnableConfig}
              secondary
            />
          </div>
        </StyledPanelHeader>
        {config.enabled && template && (
          <PanelContent className="interaction-panel__content">{template}</PanelContent>
        )}
      </StyledInteractionPanel>
    );
  };

  return InteractionPanel;
}

export default InteractionPanelFactory;

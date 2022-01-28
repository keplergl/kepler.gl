// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {useState, ComponentType, ReactElement, useCallback} from 'react';
import styled from 'styled-components';
import Switch from '../../common/switch';
import PanelTitleFactory from '../panel-title';
import BrushConfigFactory from './brush-config';
import TooltipConfigFactory from './tooltip-config';
import {Datasets} from '@kepler.gl/table';
import {InteractionConfig, ValueOf} from '@kepler.gl/types';

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
}

const StyledInteractionPanel = styled.div`
  padding-bottom: 6px;
`;

InteractionPanelFactory.deps = [TooltipConfigFactory, BrushConfigFactory, PanelTitleFactory];

const INTERACTION_CONFIG_ICONS: {[key: string]: React.ElementType} = {
  tooltip: Messages,
  geocoder: Pin,
  brush: Crosshairs,
  coordinate: CursorClick
};

function InteractionPanelFactory(
  TooltipConfig: ReturnType<typeof TooltipConfigFactory>,
  BrushConfig: ReturnType<typeof BrushConfigFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>
): ComponentType<InteractionPanelProps> {
  const InteractionPanel: React.FC<InteractionPanelProps> = ({
    config,
    onConfigChange,
    datasets,
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
        template = <TooltipConfig datasets={datasets} config={config.config} onChange={onChange} />;
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

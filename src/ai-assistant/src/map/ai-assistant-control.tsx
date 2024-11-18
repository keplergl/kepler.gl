// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, ComponentType} from 'react';
import {MapControls} from '@kepler.gl/types';
import AiStar from '../icons/ai-star';
import {MapControlButton, MapControlTooltipFactory} from '@kepler.gl/components';

type AiAssistantControlIcons = {
  aiAssistantIcon: ComponentType<{
    height?: string;
    width?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
};

/**
 * AiAssistantControlProps
 * @param mapControls MapControls from kepler.gl
 * @param onToggleMapControl (control: string) => void
 * @param actionIcons AiAssistantControlIcons
 * @returns
 */
export type AiAssistantControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  actionIcons: AiAssistantControlIcons;
};

AiAssistantControlFactory.deps = [MapControlTooltipFactory];

/**
 * AiAssistantControlFactory
 * @param MapControlTooltip
 * @returns
 */
export default function AiAssistantControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
): React.FC<AiAssistantControlProps> {
  const defaultActionIcons = {
    aiAssistantIcon: AiStar
  };

  const AiAssistantControl = ({
    mapControls,
    onToggleMapControl,
    actionIcons = defaultActionIcons
  }: AiAssistantControlProps) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('aiAssistant');
      },
      [onToggleMapControl]
    );

    const showControl = mapControls?.aiAssistant?.show;
    if (!showControl) {
      return null;
    }

    const active = mapControls?.aiAssistant?.active;
    return (
      <MapControlTooltip
        id="show-ai-assistant"
        message={active ? 'tooltip.hideAiAssistantPanel' : 'tooltip.showAiAssistantPanel'}
      >
        <MapControlButton
          className="map-control-button toggle-ai-assistant"
          onClick={onClick}
          active={active}
        >
          <actionIcons.aiAssistantIcon height="22px" />
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  AiAssistantControl.displayName = 'AiAssistantControl';
  return React.memo(AiAssistantControl);
}

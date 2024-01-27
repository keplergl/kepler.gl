// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, ComponentType} from 'react';

import {MapControls} from '@kepler.gl/types';

import {MagicWand} from '../../common/icons';
import {MapControlButton} from '../../common/styled-components';
import MapControlTooltipFactory from '../map-control-tooltip';

interface EffectControlIcons {
  effectsIcon: ComponentType<any>;
}

export type EffectControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  actionIcons: EffectControlIcons;
};

EffectControlFactory.deps = [MapControlTooltipFactory];

export default function EffectControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
): React.FC<EffectControlProps> {
  const defaultActionIcons = {
    effectsIcon: MagicWand
  };

  const EffectControl = ({
    mapControls,
    onToggleMapControl,
    actionIcons = defaultActionIcons
  }: EffectControlProps) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('effect');
      },
      [onToggleMapControl]
    );

    const showControl = mapControls?.effect?.show;
    if (!showControl) {
      return null;
    }

    const active = mapControls?.effect?.active;
    return (
      <MapControlTooltip
        id="show-effect"
        message={active ? 'tooltip.hideEffectPanel' : 'tooltip.showEffectPanel'}
      >
        <MapControlButton
          className="map-control-button toggle-effect"
          onClick={onClick}
          active={active}
        >
          <actionIcons.effectsIcon height="22px" />
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  EffectControl.displayName = 'EffectControl';
  return React.memo(EffectControl);
}

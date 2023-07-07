import React, {useCallback, ComponentType} from 'react';

import {MapControls} from '@kepler.gl/types';

import {EyeSeen} from '../../common/icons';
import {MapControlButton} from '../../common/styled-components';
import MapControlTooltipFactory from '../map-control-tooltip';

interface EffectControlIcons {
  eyeSeen: ComponentType<any>;
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
    eyeSeen: EyeSeen
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
          <actionIcons.eyeSeen height="22px" />
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  EffectControl.displayName = 'EffectControl';
  return React.memo(EffectControl);
}

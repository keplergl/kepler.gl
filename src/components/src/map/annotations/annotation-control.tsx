// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, ComponentType} from 'react';
import {MapControls} from '@kepler.gl/types';
import {Crosshairs} from '../../common/icons';
import {MapControlButton} from '../../common/styled-components';
import MapControlTooltipFactory from '../map-control-tooltip';

interface AnnotationControlIcons {
  annotationIcon: ComponentType<any>;
}

export type AnnotationControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  actionIcons?: AnnotationControlIcons;
};

AnnotationControlFactory.deps = [MapControlTooltipFactory];

export default function AnnotationControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
): React.FC<AnnotationControlProps> {
  const defaultActionIcons = {
    annotationIcon: Crosshairs
  };

  const AnnotationControl = ({
    mapControls,
    onToggleMapControl,
    actionIcons = defaultActionIcons
  }: AnnotationControlProps) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('annotation');
      },
      [onToggleMapControl]
    );

    const showControl = mapControls?.annotation?.show;
    if (!showControl) {
      return null;
    }

    const active = mapControls?.annotation?.active;
    return (
      <MapControlTooltip
        id="show-annotation"
        message={active ? 'tooltip.hideAnnotationPanel' : 'tooltip.showAnnotationPanel'}
      >
        <MapControlButton
          className="map-control-button toggle-annotation"
          onClick={onClick}
          active={active}
        >
          <actionIcons.annotationIcon height="22px" />
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  AnnotationControl.displayName = 'AnnotationControl';
  return React.memo(AnnotationControl);
}

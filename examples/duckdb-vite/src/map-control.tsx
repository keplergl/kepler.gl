// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {MapControlFactory} from '@kepler.gl/components';

import SqlPanelControlFactory from './sql-panel-control';

CustomMapControlFactory.deps = [SqlPanelControlFactory, ...MapControlFactory.deps];

function CustomMapControlFactory(SqlPanelControl: React.ComponentType<any>, ...deps: any[]) {
  const MapControl = MapControlFactory(...deps);
  const actionComponents = [...(MapControl.defaultActionComponents ?? []), SqlPanelControl];

  const CustomMapControl = (props: any) => (
    <MapControl {...props} actionComponents={actionComponents} />
  );

  return CustomMapControl;
}

export function replaceMapControl() {
  return [MapControlFactory, CustomMapControlFactory];
}

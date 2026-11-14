// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useSyncExternalStore} from 'react';
import styled from 'styled-components';
import {Effect} from '@kepler.gl/types';
import {Button, ButtonGroup} from '../common/styled-components';

const RAIN_PRESETS = [
  {label: 'Off', value: 0},
  {label: 'Low', value: 0.01},
  {label: 'Mid', value: 0.05},
  {label: 'High', value: 0.1}
];

const Controls = styled.div`
  margin-bottom: 12px;
  max-width: ${props => props.theme.effectPanelWidth}px;
  white-space: normal;
  overflow-wrap: anywhere;
  color: ${props => props.theme.effectPanelTextSecondary1};
  font-size: ${props => props.theme.inputFontSize};
  .water-simulation__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 8px 0;
  }
`;

export default function WaterSimulationControls({
  effect,
  onRainChange
}: {
  effect: Effect;
  onRainChange: (rain: number) => void;
}) {
  const simulation = effect.deckEffect;
  const status = useSyncExternalStore<{ready: boolean; running: boolean; message: string}>(
    simulation.subscribe,
    simulation.getSnapshot
  );
  return (
    <Controls>
      <div>
        Experimental · one flat map · 10× simulation speed. Captures loaded polygon and mesh
        surfaces, including roofs. Basemap imagery supplies no elevation. Enclosed missing surfaces
        block flow; edge drainage follows the captured surface perimeter. Peak smoothing lowers
        small obstacles while preserving lows. Wait for tiles to load before capturing. Recapture to
        change the area, resolution or smoothing; saved maps retain settings only.
      </div>
      <div className="water-simulation__buttons">
        <Button small secondary disabled={!effect.isEnabled} onClick={simulation.capture}>
          Capture current view
        </Button>
        <Button
          small
          disabled={!effect.isEnabled || !status.ready}
          onClick={simulation.toggleRunning}
        >
          {status.running ? 'Pause' : 'Start'}
        </Button>
        <Button
          small
          secondary
          disabled={!effect.isEnabled || !status.ready}
          onClick={simulation.reset}
        >
          Reset water
        </Button>
      </div>
      <div role="status">{status.message}</div>
      <div>Rainfall</div>
      <ButtonGroup className="water-simulation__buttons" role="group" aria-label="Rainfall">
        {RAIN_PRESETS.map(({label, value}) => (
          <Button
            key={label}
            small
            secondary={effect.parameters.rain !== value}
            aria-pressed={effect.parameters.rain === value}
            title={`${value} m/s`}
            onClick={() => onRainChange(value)}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </Controls>
  );
}

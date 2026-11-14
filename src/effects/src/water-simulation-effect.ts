// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EffectPropsPartial} from '@kepler.gl/types';
import {generateHashId} from '@kepler.gl/common-utils';
import {POSTPROCESSING_EFFECTS, WATER_SIMULATION_TYPE} from '@kepler.gl/constants';
import Effect from './effect';
import {WaterSimulation, WaterProps} from './water-simulation/simulation';

export default class WaterSimulationEffect extends Effect {
  getDefaultProps(props: EffectPropsPartial = {}) {
    return super.getDefaultProps({type: WATER_SIMULATION_TYPE, ...props});
  }
  _initializeEffect() {
    const defaults = Object.fromEntries(
      POSTPROCESSING_EFFECTS[WATER_SIMULATION_TYPE].parameters.map(param => [
        param.name,
        param.defaultValue
      ])
    );
    this.parameters = {...defaults, ...this.parameters};
    // A restored/cloned configuration owns a fresh session. A reused deck id
    // would retain the old GPU instance while controls point at the new one.
    this.deckEffect = new WaterSimulation(
      `${this.id}-water-${generateHashId(6)}`,
      this.parameters as WaterProps
    );
  }
  setProps(props: EffectPropsPartial) {
    super.setProps(props);
    this.deckEffect?.setProps(this.parameters);
  }
}

/** Keep the surface in deck's normal depth-tested layer pass. */
export function getWaterSimulationLayers(effects: {id: string}[]) {
  return effects
    .filter((effect): effect is WaterSimulation => effect instanceof WaterSimulation)
    .map(effect => effect.getLayer());
}

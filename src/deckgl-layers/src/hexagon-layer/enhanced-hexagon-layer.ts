// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexagonLayer} from '@deck.gl/aggregation-layers';
import CPUAggregator, {AggregationType, getAggregatedData} from '../layer-utils/cpu-aggregator';

export const hexagonAggregation: AggregationType = {
  key: 'position',
  updateSteps: [
    {
      key: 'aggregate',
      triggers: {
        cellSize: {
          prop: 'radius'
        },
        position: {
          prop: 'getPosition',
          updateTrigger: 'getPosition'
        },
        aggregator: {
          prop: 'hexagonAggregator'
        }
      },
      updater: getAggregatedData
    }
  ]
};

export default class ScaleEnhancedHexagonLayer extends HexagonLayer<any> {
  initializeState() {
    const cpuAggregator = new CPUAggregator({
      aggregation: hexagonAggregation
    });

    this.state = {
      cpuAggregator,
      aggregatorState: cpuAggregator.state
    };
    const attributeManager = this.getAttributeManager();
    attributeManager.add({
      positions: {size: 3, accessor: 'getPosition'}
    });
  }
}

ScaleEnhancedHexagonLayer.layerName = 'ScaleEnhancedHexagonLayer';

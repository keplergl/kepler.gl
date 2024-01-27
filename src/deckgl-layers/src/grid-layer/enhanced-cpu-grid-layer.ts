// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CPUGridLayer} from '@deck.gl/aggregation-layers';
import CPUAggregator, {AggregationType, getAggregatedData} from '../layer-utils/cpu-aggregator';

export const gridAggregation: AggregationType = {
  key: 'position',
  updateSteps: [
    {
      key: 'aggregate',
      triggers: {
        cellSize: {
          prop: 'cellSize'
        },
        position: {
          prop: 'getPosition',
          updateTrigger: 'getPosition'
        },
        aggregator: {
          prop: 'gridAggregator'
        }
      },
      updater: getAggregatedData
    }
  ]
};

export default class ScaleEnhancedGridLayer extends CPUGridLayer<any> {
  initializeState() {
    const cpuAggregator = new CPUAggregator({
      aggregation: gridAggregation
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

ScaleEnhancedGridLayer.layerName = 'ScaleEnhancedGridLayer';

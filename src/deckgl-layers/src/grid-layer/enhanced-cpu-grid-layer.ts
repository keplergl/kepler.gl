// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - This file needs significant refactoring for deck.gl 9.x aggregation APIs
// TODO: deck.gl 9.x has completely restructured the aggregation system

import {GridLayer} from '@deck.gl/aggregation-layers';
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

const defaultProps = {
  // Use CPU aggregation for compatibility with existing behavior
  gpuAggregation: false
};

export default class ScaleEnhancedGridLayer extends GridLayer<any> {
  static defaultProps = {
    ...GridLayer.defaultProps,
    ...defaultProps
  };

  initializeState() {
    const cpuAggregator = new CPUAggregator({
      aggregation: gridAggregation
    });

    this.state = {
      cpuAggregator,
      aggregatorState: cpuAggregator.state
    };
    const attributeManager = this.getAttributeManager();
    attributeManager?.add({
      positions: {size: 3, accessor: 'getPosition'}
    });
  }
}

ScaleEnhancedGridLayer.layerName = 'ScaleEnhancedGridLayer';

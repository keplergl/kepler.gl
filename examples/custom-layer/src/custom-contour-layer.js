// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Custom kepler.gl layer wrapping deck.gl's ContourLayer.
// ContourLayer renders isoband contours (like topographic lines) from point
// data aggregated on a grid. It is not part of kepler.gl's built-in layers.
//
// Design note: we extend kepler's base Layer directly (not AggregationLayer)
// because deck.gl's ContourLayer performs its own internal aggregation and
// expects raw position data — not kepler's pre-aggregated {index} format.

import React from 'react';
import {ContourLayer as DeckContourLayer} from '@deck.gl/aggregation-layers';
import {Layer} from '@kepler.gl/layers';

// ── Layer icon (simple SVG shown in the layer type selector) ─────────────────
// All kepler.gl icons use a 64×64 viewBox coordinate space.

const ContourLayerIcon = ({height = '16px', style = {fill: 'currentColor'}, ...props}) => (
  <svg viewBox="0 0 64 64" width={height} height={height} style={style} {...props}>
    {/* Three concentric ellipses centered at (32, 32) in 64×64 space */}
    <ellipse cx="32" cy="32" rx="28" ry="20" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="32" cy="32" rx="18" ry="12" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="32" cy="32" rx="8"  ry="5"  stroke="currentColor" strokeWidth="3" fill="none" />
  </svg>
);

// ── vis-config entries ────────────────────────────────────────────────────────

export const contourVisConfigs = {
  opacity: 'opacity',
  // Radius of each grid cell — smaller values give finer contours with more detail.
  cellRadius: {
    type: 'number',
    defaultValue: 5,
    label: 'Radius (km)',
    isRanged: false,
    range: [0.1, 10],
    step: 0.1,
    group: 'cell',
    property: 'cellRadius'
  },
  // Min point count per cell that draws the inner (low-density) contour band
  lowerThreshold: {
    type: 'number',
    defaultValue: 1,
    label: 'Lower threshold',
    isRanged: false,
    range: [1, 500],
    step: 1,
    group: 'display',
    property: 'lowerThreshold'
  },
  // Min point count per cell that draws the outer (high-density) contour band
  higherThreshold: {
    type: 'number',
    defaultValue: 5,
    label: 'Upper threshold',
    isRanged: false,
    range: [1, 500],
    step: 1,
    group: 'display',
    property: 'higherThreshold'
  }
};

// ── Required columns ─────────────────────────────────────────────────────────

export const contourRequiredColumns = ['lat', 'lng'];

// ── Custom layer class ────────────────────────────────────────────────────────

export default class ContourKeplerLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(contourVisConfigs);
  }

  get type() {
    return 'contour';
  }

  get name() {
    return 'Contour';
  }

  get layerIcon() {
    return ContourLayerIcon;
  }

  get requiredLayerColumns() {
    return contourRequiredColumns;
  }

  // Auto-detect lat/lng columns when a dataset is dropped onto the layer.
  // Uses kepler.gl's pre-computed fieldPairs (same approach as PointLayer).
  static findDefaultLayerProps(dataset) {
    const {fieldPairs = [], label} = dataset;
    const props = [];

    fieldPairs.forEach(pair => {
      props.push({
        label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || 'Contour',
        isVisible: props.length === 0,
        columns: {
          lat: pair.pair.lat,
          lng: pair.pair.lng
        }
      });
    });

    return {props};
  }

  // formatLayerData must return plain position arrays so that deck.gl's
  // ContourLayer can aggregate them internally with its own grid logic.
  formatLayerData(datasets) {
    if (this.config.dataId === null) {
      return {};
    }
    const {dataContainer, filteredIndex} = datasets[this.config.dataId];
    const {lat, lng} = this.config.columns;

    if (lat.fieldIdx < 0 || lng.fieldIdx < 0) {
      return {};
    }

    // Build a flat Float64Array of [lng, lat] pairs for efficiency.
    const data = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const idx = filteredIndex[i];
      const latVal = dataContainer.valueAt(idx, lat.fieldIdx);
      const lngVal = dataContainer.valueAt(idx, lng.fieldIdx);
      if (Number.isFinite(latVal) && Number.isFinite(lngVal)) {
        data.push({position: [lngVal, latVal]});
      }
    }

    return {data};
  }

  renderLayer(opts) {
    const {data, mapState} = opts;
    if (!data?.data?.length) {
      return [];
    }

    const {visConfig, isVisible} = this.config;

    // Ensure the two thresholds are ordered correctly.
    const lo = Math.max(1, visConfig.lowerThreshold);
    const hi = Math.max(lo + 1, visConfig.higherThreshold);

    const contours = [
      {threshold: lo, color: [255, 237, 160, 200], strokeWidth: 2},
      {threshold: hi, color: [240, 59, 32, 230], strokeWidth: 3}
    ];

    return [
      new DeckContourLayer({
        id: this.id,
        data: data.data,
        getPosition: d => d.position,
        cellSize: visConfig.cellRadius * 1000, // km → meters
        contours,
        aggregation: 'SUM',
        opacity: visConfig.opacity,
        visible: isVisible,
        pickable: true
      })
    ];
  }
}

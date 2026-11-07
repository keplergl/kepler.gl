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
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {PathLayer} from '@deck.gl/layers';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {Layer} from '@kepler.gl/layers';
import {
  buildContourPaths,
  buildSurfaceMesh,
  computeDensityGrid,
  DEFAULT_ELEVATION_SCALE,
  MAX_SMOOTHING_PASSES
} from './density-surface';

// ── Layer icon (simple SVG shown in the layer type selector) ─────────────────
// All kepler.gl icons use a 64×64 viewBox coordinate space.

const ContourLayerIcon = ({height = '16px', style = {fill: 'currentColor'}, ...props}) => (
  <svg viewBox="0 0 64 64" width={height} height={height} style={style} {...props}>
    {/* Three concentric ellipses centered at (32, 32) in 64×64 space */}
    <ellipse cx="32" cy="32" rx="28" ry="20" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="32" cy="32" rx="18" ry="12" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="32" cy="32" rx="8" ry="5" stroke="currentColor" strokeWidth="3" fill="none" />
  </svg>
);

// ── vis-config entries ────────────────────────────────────────────────────────

// Default DEM-like ramp: deep water/lowland -> teal -> green -> sand -> snow.
const DEFAULT_SURFACE_COLOR_RANGE = {
  name: 'DEM',
  type: 'sequential',
  category: 'Custom',
  colors: ['#183c6e', '#1e6e8c', '#3c9664', '#96b450', '#d2b46e', '#f5f5f0']
};

function getGpuFilterPredicate(gpuFilter, dataContainer) {
  if (!gpuFilter?.filterValueAccessor) {
    return null;
  }
  const hasFilter = Object.values(gpuFilter.filterValueUpdateTriggers || {}).some(
    trigger => trigger !== null
  );
  if (!hasFilter) {
    return null;
  }
  const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)();
  return index => {
    const values = getFilterValue({index});
    return values.every((value, i) => {
      const filterRange = gpuFilter.filterRange[i];
      return (
        typeof value === 'number' &&
        Boolean(filterRange) &&
        value >= filterRange[0] &&
        value <= filterRange[1]
      );
    });
  };
}

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
  },
  // 'contour' draws deck.gl isobands; 'surface' rebuilds the aggregate grid on
  // the CPU and renders it as a 3D terrain surface.
  renderMode: {
    type: 'select',
    defaultValue: 'contour',
    label: 'Render mode',
    options: ['contour', 'surface'],
    group: 'surface',
    property: 'renderMode'
  },
  elevationScale: {
    type: 'number',
    defaultValue: DEFAULT_ELEVATION_SCALE,
    label: 'Max surface height (m)',
    isRanged: false,
    range: [0, 10000],
    step: 100,
    group: 'surface',
    property: 'elevationScale'
  },
  // Optional numeric column used as the per-point weight. With a weight the
  // surface is the per-cell mean of that column instead of point density.
  weightColumn: {
    type: 'select',
    defaultValue: null,
    label: 'Weight column',
    options: [],
    group: 'surface',
    property: 'weightColumn'
  },
  smoothing: {
    type: 'number',
    defaultValue: 1,
    label: 'Smoothing',
    isRanged: false,
    range: [0, 20],
    step: 1,
    group: 'surface',
    property: 'smoothing'
  },
  colorRange: {
    ...LAYER_VIS_CONFIGS.colorRange,
    defaultValue: DEFAULT_SURFACE_COLOR_RANGE
  },
  showContours: {
    type: 'boolean',
    defaultValue: false,
    label: 'Show elevation contours',
    group: 'surface',
    property: 'showContours'
  },
  contourCount: {
    type: 'number',
    defaultValue: 8,
    label: 'Contour levels',
    isRanged: false,
    range: [2, 20],
    step: 1,
    group: 'surface',
    property: 'contourCount'
  },
  contourColor: {
    type: 'color',
    defaultValue: [255, 110, 30],
    label: 'Contour color',
    group: 'surface',
    property: 'contourColor'
  }
};

// ── Required columns ─────────────────────────────────────────────────────────

export const contourRequiredColumns = ['lat', 'lng'];

// ── Custom layer class ────────────────────────────────────────────────────────

export default class ContourKeplerLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(contourVisConfigs);
    // LayerColorSelector reads colorUI[property]; give the contour color its
    // own entry so it does not share state with the layer color.
    this.config.colorUI = {
      ...this.config.colorUI,
      contourColor: {...(this.config.colorUI?.color || {})}
    };
    // Cached CPU grid + encoded heightmap for the 3D surface mode.
    this._surfaceCache = null;
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

  // These visConfig changes only affect deck.gl props or the surface grid,
  // which renderLayer recomputes from the cached positions.
  get noneLayerDataAffectingProps() {
    return [
      ...super.noneLayerDataAffectingProps,
      'renderMode',
      'cellRadius',
      'elevationScale',
      'weightColumn',
      'smoothing',
      'colorRange',
      'showContours',
      'contourCount',
      'contourColor',
      'lowerThreshold',
      'higherThreshold'
    ];
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
    const dataset = datasets[this.config.dataId];
    const {dataContainer, filteredIndex, gpuFilter} = dataset;
    const {lat, lng} = this.config.columns;

    if (lat.fieldIdx < 0 || lng.fieldIdx < 0) {
      return {};
    }

    // filteredIndex only carries CPU filters; numeric/time filters are
    // evaluated on the GPU and must be applied here before CPU aggregation.
    const filterData = getGpuFilterPredicate(gpuFilter, dataContainer);

    // ContourLayer consumes {position} objects; the surface mode reuses the
    // raw [lng, lat] pairs for CPU grid aggregation. `indices` keeps the
    // filtered row indices so the optional weight column stays aligned.
    const data = [];
    const positions = [];
    const indices = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const idx = filteredIndex[i];
      if (filterData && !filterData(idx)) {
        continue;
      }
      const latVal = dataContainer.valueAt(idx, lat.fieldIdx);
      const lngVal = dataContainer.valueAt(idx, lng.fieldIdx);
      if (Number.isFinite(latVal) && Number.isFinite(lngVal)) {
        const position = [lngVal, latVal];
        data.push({position});
        positions.push(position);
        indices.push(idx);
      }
    }

    return {data, positions, indices, dataset};
  }

  _getSurfaceCache(data) {
    const {cellRadius, smoothing, weightColumn} = this.config.visConfig;
    const cellSizeMeters = cellRadius * 1000;
    const passes = Math.min(MAX_SMOOTHING_PASSES, Math.max(0, Math.round(smoothing ?? 0)));
    const normalizedWeightColumn = weightColumn || null;
    const cache = this._surfaceCache;

    if (
      cache &&
      cache.positions === data.positions &&
      cache.cellSizeMeters === cellSizeMeters &&
      cache.smoothing === passes &&
      cache.weightColumn === normalizedWeightColumn
    ) {
      return cache;
    }

    let weights = null;
    let aggregation = 'SUM';
    if (normalizedWeightColumn && data.dataset?.getColumnFieldIdx) {
      const weightIdx = data.dataset.getColumnFieldIdx(normalizedWeightColumn);
      if (weightIdx >= 0) {
        const {dataContainer} = data.dataset;
        weights = data.indices.map(idx => {
          const value = dataContainer.valueAt(idx, weightIdx);
          return Number.isFinite(value) ? value : null;
        });
        aggregation = 'MEAN';
      }
    }

    const gridInfo = computeDensityGrid(data.positions, {
      cellSizeMeters,
      smoothing: passes,
      weights,
      aggregation
    });
    const next = {
      positions: data.positions,
      cellSizeMeters,
      smoothing: passes,
      weightColumn: normalizedWeightColumn,
      gridInfo,
      mesh: null,
      elevationScale: null,
      paletteKey: null,
      contours: null,
      contourCount: null,
      contourScale: null
    };
    this._surfaceCache = next;
    return next;
  }

  _getSurfaceContours(cache) {
    const {showContours, contourCount, elevationScale: rawElevationScale} = this.config.visConfig;
    if (!showContours || !cache.gridInfo) {
      return null;
    }
    const elevationScale = rawElevationScale ?? DEFAULT_ELEVATION_SCALE;
    const count = Math.max(2, Math.min(20, Math.round(contourCount ?? 8)));
    if (cache.contours && cache.contourCount === count && cache.contourScale === elevationScale) {
      return cache.contours;
    }
    cache.contours = buildContourPaths(cache.gridInfo, elevationScale, count);
    cache.contourCount = count;
    cache.contourScale = elevationScale;
    return cache.contours;
  }

  _getSurfaceMesh(cache) {
    const {elevationScale: rawElevationScale, colorRange} = this.config.visConfig;
    const elevationScale = rawElevationScale ?? DEFAULT_ELEVATION_SCALE;
    const palette = colorRange?.colors;
    const paletteKey = Array.isArray(palette) ? palette.join('|') : '';
    if (!cache.gridInfo) {
      return null;
    }
    if (cache.mesh && cache.elevationScale === elevationScale && cache.paletteKey === paletteKey) {
      return cache.mesh;
    }
    const surface = buildSurfaceMesh(cache.gridInfo, elevationScale, palette);
    // SimpleMeshLayer expects geometry attributes as {value, size} and a
    // separate index buffer; raw typed arrays are not accepted at the top level.
    cache.mesh = {
      attributes: {
        positions: {value: surface.positions, size: 3},
        colors: {value: surface.colors, size: 3}
      },
      indices: surface.indices
    };
    cache.elevationScale = elevationScale;
    cache.paletteKey = paletteKey;
    return cache.mesh;
  }

  renderLayer(opts) {
    const {data, visible} = opts;
    if (!data?.data?.length) {
      return [];
    }

    const {visConfig, isVisible} = this.config;
    const layerVisible = visible !== false && isVisible;
    const renderMode = visConfig.renderMode || 'contour';

    if (renderMode === 'surface') {
      if (!data.positions?.length) {
        return [];
      }
      const cache = this._getSurfaceCache(data);
      const mesh = cache.gridInfo ? this._getSurfaceMesh(cache) : null;
      if (!mesh) {
        return [];
      }

      const layers = [
        new SimpleMeshLayer({
          // A distinct id avoids deck.gl updating the contour layer with
          // SimpleMeshLayer props (and vice versa) when the mode changes.
          id: `${this.id}-surface`,
          data: [1],
          mesh,
          _instanced: false,
          // Per-vertex colors carry the hypsometric ramp and baked hillshade;
          // the instance color stays white so it does not tint them.
          getColor: [255, 255, 255, 255],
          coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
          material: false,
          opacity: visConfig.opacity,
          visible: layerVisible,
          pickable: false
        })
      ];

      if (visConfig.showContours) {
        const contours = this._getSurfaceContours(cache);
        if (contours?.length) {
          const contourColor = visConfig.contourColor || [255, 110, 30];
          const contourColorWithAlpha =
            contourColor.length === 4 ? contourColor : [...contourColor, 230];
          layers.push(
            new PathLayer({
              id: `${this.id}-elevation-contours`,
              data: contours,
              getPath: path => path,
              getColor: contourColorWithAlpha,
              widthMinPixels: 1,
              coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
              opacity: visConfig.opacity,
              visible: layerVisible,
              pickable: false
            })
          );
        }
      }

      return layers;
    }

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
        visible: layerVisible,
        pickable: true
      })
    ];
  }
}

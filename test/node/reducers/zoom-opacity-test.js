// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';

import {VisStateActions} from '@kepler.gl/actions';
import {
  combineZoomOpacityControllers,
  getLayerZoomOpacityFactor,
  INITIAL_VIS_STATE,
  mergeInteractions,
  renderDeckGlLayer,
  visStateReducer,
  zoomOpacityFactor
} from '@kepler.gl/reducers';
import {StateWFilesFiltersLayerColor} from 'test/helpers/mock-state';

const stops = {appear: 2, full: 4, fade: 8, gone: 10};

test('interactionUtil -> zoomOpacityFactor', t => {
  t.equal(zoomOpacityFactor(0, stops), 0, 'below appear');
  t.equal(zoomOpacityFactor(2, stops), 0, 'at appear');
  t.equal(zoomOpacityFactor(3, stops), 0.5, 'halfway up');
  t.equal(zoomOpacityFactor(4, stops), 1, 'at full');
  t.equal(zoomOpacityFactor(6, stops), 1, 'plateau');
  t.equal(zoomOpacityFactor(8, stops), 1, 'at fade');
  t.equal(zoomOpacityFactor(9, stops), 0.5, 'halfway down');
  t.equal(zoomOpacityFactor(10, stops), 0, 'at gone');
  t.equal(zoomOpacityFactor(14, stops), 0, 'above gone');

  const stepIn = {appear: 5, full: 5, fade: 9, gone: 12};
  t.equal(zoomOpacityFactor(5, stepIn), 0, 'equal appear and full is off at that zoom');
  t.equal(zoomOpacityFactor(5.1, stepIn), 1, 'equal appear and full steps to full opacity');

  const stepOut = {appear: 1, full: 2, fade: 8, gone: 8};
  t.equal(zoomOpacityFactor(7.9, stepOut), 1, 'equal fade and gone stays full until the end');
  t.equal(zoomOpacityFactor(8, stepOut), 0, 'equal fade and gone steps off');

  t.equal(
    zoomOpacityFactor(3, {appear: 4, full: 2, fade: 8, gone: 10}),
    1,
    'unordered stops leave opacity unchanged'
  );
  t.end();
});

test('interactionUtil -> getLayerZoomOpacityFactor', t => {
  const interactionConfig = {
    zoomOpacity: {
      id: 'zoomOpacity',
      label: 'interactions.fadeOnZoom',
      enabled: true,
      config: {
        controllers: [{id: 'c1', layerIds: ['a'], stops: {appear: 0, full: 0, fade: 2, gone: 4}}]
      }
    }
  };

  t.equal(
    getLayerZoomOpacityFactor('a', 1, interactionConfig),
    1,
    'assigned layer uses the envelope'
  );
  t.equal(getLayerZoomOpacityFactor('b', 1, interactionConfig), 1, 'unassigned layer is unchanged');
  t.equal(
    getLayerZoomOpacityFactor('a', 1, {
      zoomOpacity: {...interactionConfig.zoomOpacity, enabled: false}
    }),
    1,
    'disabled fade leaves opacity unchanged'
  );
  t.equal(
    getLayerZoomOpacityFactor('a', undefined, interactionConfig),
    1,
    'missing zoom is unchanged'
  );
  t.end();
});

test('interactionUtil -> combineZoomOpacityControllers', t => {
  const combined = combineZoomOpacityControllers([
    {
      controllers: [{id: 'c1', layerIds: ['l1', 'l2'], stops}]
    },
    {
      controllers: [{id: 'c2', layerIds: ['l2', 'l3'], stops}]
    }
  ]);

  t.equal(combined.length, 2, 'keeps both controllers');
  t.deepEqual(combined[0].layerIds, ['l1', 'l2'], 'first assignment wins');
  t.deepEqual(combined[1].layerIds, ['l3'], 'drops a layer id already assigned');
  t.end();
});

test('mergeInteractions -> zoomOpacity controllers', t => {
  const controllers = [
    {id: 'c1', layerIds: ['layer-1'], stops: {appear: 2, full: 4, fade: 8, gone: 11}}
  ];
  const merged = mergeInteractions(INITIAL_VIS_STATE, {
    zoomOpacity: {enabled: true, controllers}
  });

  t.equal(merged.interactionConfig.zoomOpacity.enabled, true, 'loads the enabled flag');
  t.deepEqual(
    merged.interactionConfig.zoomOpacity.config.controllers,
    controllers,
    'loads controllers into config'
  );
  t.end();
});

test('renderDeckGlLayer -> zoom opacity', t => {
  function makeDeckLayer(opacity) {
    const deckLayer = {
      props: {opacity, visible: true},
      clone(next) {
        return {props: {...this.props, ...next}, clone: this.clone};
      }
    };
    return deckLayer;
  }

  const deckLayer = makeDeckLayer(0.8);
  const layer = {
    id: 'a',
    config: {dataId: 'missing'},
    renderLayer() {
      return [deckLayer];
    }
  };
  const interactionConfig = {
    zoomOpacity: {
      enabled: true,
      config: {
        controllers: [{id: 'c1', layerIds: ['a'], stops}]
      }
    }
  };

  const rising = renderDeckGlLayer(
    {
      datasets: {},
      layer,
      layerIndex: 0,
      data: {},
      mapState: {zoom: 3},
      interactionConfig
    },
    {}
  );
  t.equal(rising[0].props.opacity, 0.4, 'scales the layer opacity on the way up');
  t.equal(rising[0].props.visible, true, 'stays visible while fading');

  const stroked = {
    props: {
      opacity: 0.8,
      visible: true,
      _subLayerProps: {
        'polygons-stroke': {opacity: 0.6},
        linestrings: {opacity: 0.6},
        points: {lineOpacity: 0.4},
        'polygons-fill': {type: 'Fill'}
      }
    },
    clone(next) {
      return {props: {...this.props, ...next}, clone: this.clone};
    }
  };
  const strokedLayer = {
    id: 'a',
    config: {dataId: 'missing'},
    renderLayer() {
      return [stroked];
    }
  };
  const fadedStroke = renderDeckGlLayer(
    {
      datasets: {},
      layer: strokedLayer,
      layerIndex: 0,
      data: {},
      mapState: {zoom: 3},
      interactionConfig
    },
    {}
  );
  t.equal(
    fadedStroke[0].props._subLayerProps['polygons-stroke'].opacity,
    0.3,
    'scales polygon stroke opacity'
  );
  t.equal(
    fadedStroke[0].props._subLayerProps.linestrings.opacity,
    0.3,
    'scales line stroke opacity'
  );
  t.equal(
    fadedStroke[0].props._subLayerProps.points.lineOpacity,
    0.2,
    'scales point outline opacity'
  );
  t.equal(
    fadedStroke[0].props._subLayerProps['polygons-fill'].type,
    'Fill',
    'leaves non-opacity sublayer props'
  );
  t.equal(
    stroked.props._subLayerProps['polygons-stroke'].opacity,
    0.6,
    'does not mutate the original stroke opacity'
  );

  const hidden = renderDeckGlLayer(
    {
      datasets: {},
      layer,
      layerIndex: 0,
      data: {},
      mapState: {zoom: 1},
      interactionConfig
    },
    {}
  );
  t.equal(hidden[0].props.opacity, 0, 'opacity is 0 outside the envelope');
  t.equal(hidden[0].props.visible, false, 'fully faded layers are not pickable');

  const untouched = renderDeckGlLayer(
    {
      datasets: {},
      layer,
      layerIndex: 0,
      data: {},
      mapState: {zoom: 3},
      interactionConfig: {
        zoomOpacity: {...interactionConfig.zoomOpacity, enabled: false}
      }
    },
    {}
  );
  t.equal(untouched[0], deckLayer, 'disabled fade does not clone the deck layer');
  t.end();
});

test('visStateReducer -> REMOVE_LAYER drops zoom opacity layer id', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor.visState);
  const layerId = state.layers[0].id;
  const otherId = state.layers[1].id;
  state.interactionConfig.zoomOpacity.config.controllers = [
    {id: 'c1', layerIds: [layerId, otherId], stops}
  ];

  const next = visStateReducer(state, VisStateActions.removeLayer(layerId));

  t.deepEqual(
    next.interactionConfig.zoomOpacity.config.controllers[0].layerIds,
    [otherId],
    'removes the deleted layer from the controller'
  );
  t.ok(
    next.layers.every(layer => layer.id !== layerId),
    'still removes the layer'
  );
  t.end();
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash.clonedeep';
import SchemaManager from '@kepler.gl/schemas';
import {
  InitialState,
  StateWCustomMapStyleLocal,
  StateWCustomMapStyleManaged,
  StateWCustomMapStyleLegacy
} from 'test/helpers/mock-state';

test('#mapStyleSchema -> v1 -> save load mapStyle', t => {
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  t.deepEqual(
    Object.keys(msToSave),
    [
      'styleType',
      'topLayerGroups',
      'visibleLayerGroups',
      'threeDBuildingColor',
      'backgroundColor',
      'mapStyles'
    ],
    'mapStyle should have all 6 entries'
  );

  const expectedSaved = {
    styleType: 'dark-matter',
    topLayerGroups: {},
    visibleLayerGroups: {},
    mapStyles: {},
    threeDBuildingColor: [209, 206, 199],
    backgroundColor: [0, 0, 0]
  };

  const expectedLoaded = {
    styleType: 'dark-matter',
    topLayerGroups: {},
    visibleLayerGroups: {},
    threeDBuildingColor: [209, 206, 199],
    backgroundColor: [0, 0, 0]
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedLoaded, 'loaded mapStyle should be current');
  t.end();
});

test('#mapStyleSchema -> v1 -> save load mapStyle with custom local style', t => {
  const initialState = cloneDeep(StateWCustomMapStyleLocal);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  const expectedSaved = {
    styleType: 'smoothie_the_cat',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      road: true
    },
    threeDBuildingColor: [1, 2, 3],
    backgroundColor: [0, 0, 0],
    mapStyles: {
      smoothie_the_cat: {
        id: 'smoothie_the_cat',
        accessToken: 'secret_token',
        label: 'Smoothie the Cat',
        icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        custom: 'LOCAL',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      }
    }
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedSaved, 'loaded mapStyle should be current');
  t.end();
});

test('#mapStyleSchema -> v1 -> save load mapStyle with custom managed style', t => {
  const initialState = cloneDeep(StateWCustomMapStyleManaged);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  const expectedSaved = {
    styleType: 'smoothie_the_cat',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      road: true
    },
    threeDBuildingColor: [1, 2, 3],
    backgroundColor: [0, 0, 0],
    mapStyles: {
      smoothie_the_cat: {
        id: 'smoothie_the_cat',
        accessToken: 'secret_token',
        label: 'Smoothie the Cat',
        icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        custom: 'MANAGED',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      }
    }
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedSaved, 'loaded mapStyle should be current');
  t.end();
});

test('#mapStyleSchema -> v1 -> save load mapStyle with custom local style (custom: true (legacy backwards support))', t => {
  const initialState = cloneDeep(StateWCustomMapStyleLegacy);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  const expectedSaved = {
    styleType: 'smoothie_the_cat',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      road: true
    },
    threeDBuildingColor: [1, 2, 3],
    backgroundColor: [0, 0, 0],
    mapStyles: {
      smoothie_the_cat: {
        id: 'smoothie_the_cat',
        accessToken: 'secret_token',
        label: 'Smoothie the Cat',
        icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        custom: true,
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      }
    }
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedSaved, 'loaded mapStyle should be current');
  t.end();
});

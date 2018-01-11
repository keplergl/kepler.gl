import test from 'tape';

import SchemaManager from '../../../../schemas/app-schema';
import {InitialAppState} from '../../../../../test/util/mock-app-state';

test('#mapStyleSchema -> v1 -> save load mapStyle', t => {
  const initialState = InitialAppState.toJS();
  const savedState = SchemaManager.getAppConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  t.deepEqual(Object.keys(msToSave),
    ['styleType', 'topLayerGroups', 'visibleLayerGroups', 'buildingLayer'],
    'mapStyle should have all 6 entries');

  const expectedSaved = {
    styleType: 'dark',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      places: true,
      road: true,
      border: false,
      building: true,
      water: true,
      land: true
    },
    buildingLayer: {
      isVisible: false,
      color: [209, 206, 199],
      opacity: 0.7
    }
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedSaved, 'loaded mapStyle should be current');
  t.end();
});

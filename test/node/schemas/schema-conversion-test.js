// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import SchemaManager from '@kepler.gl/schemas';
import {cmpParsedAppConfigs} from 'test/helpers/comparison-utils';
import {logStep} from '../../../scripts/log';

import {
  savedConfigV0 as savedConfig0,
  parsedConfigV0 as parsedConfig0
} from 'test/fixtures/config_v0_arc_cluster_point';

import {
  savedConfigV0 as savedConfig1,
  parsedConfigV0 as parsedConfig1
} from 'test/fixtures/config_v0_geojson_poly_fill_ele';

import {
  savedConfigV0 as savedConfig2,
  parsedConfigV0 as parsedConfig2
} from 'test/fixtures/config_v0_geojson_point';

import {
  savedConfigV0 as savedConfig3,
  parsedConfigV0 as parsecConfig3
} from 'test/fixtures/config_v0_geojson_polygon';

const TEST_CASES = [
  {
    name: 'v0 -> v1',
    cases: [
      {
        name: 'load config with arc cluster point layer',
        saved: savedConfig0,
        parsed: parsedConfig0
      },
      {
        name: 'load config with geojson layer',
        saved: savedConfig1,
        parsed: parsedConfig1
      },
      {
        name: 'load config with geojson contains points',
        saved: savedConfig2,
        parsed: parsedConfig2
      },
      {
        name: 'load config with geojson contains 3d and stroked polygon',
        saved: savedConfig3,
        parsed: parsecConfig3
      }
    ]
  }
];

test('#appSchema -> Convert Saved Configs', t => {
  TEST_CASES.forEach(({name, cases}) => {
    logStep(`---> test: ${name}`);

    cases.forEach(cs => {
      logStep(`------> test: ${cs.name}`);

      const parsed = SchemaManager.parseSavedConfig(cs.saved);
      cmpParsedAppConfigs(t, cs.parsed, parsed, {name: cs.name});
    });
  });

  t.end();
});

import test from 'tape';

import SchemaManager from '../../../../schemas/app-schema';
import {cmpParsedAppConfigs} from '../../../../../test/util/comparison-utils';
import {console as Console} from 'global/window';

const TEST_CASES = [{
  name: 'v0 -> v1',
  cases: [{
    name: 'load config with arc cluster point layer',
    saved: require('../../../../../test/schemas/fixtures/v0_arc_cluster_point.json'),
    parsed: require('../../../../../test/schemas/fixtures/v0_arc_cluster_point_parsed.json')
  }, {
    name: 'load config with geojson layer',
    saved: require('../../../../../test/schemas/fixtures/v0_geojson_poly_fill_ele.json'),
    parsed: require('../../../../../test/schemas/fixtures/v0_geojson_poly_fill_ele_parsed.json')
  }, {
    name: 'load config with geojson contains points',
    saved: require('../../../../../test/schemas/fixtures/v0_geojson_point.json'),
    parsed: require('../../../../../test/schemas/fixtures/v0_geojson_point_parsed.json')
  }, {
    name: 'load config with geojson contains 3d and stroked polygon',
    saved: require('../../../../../test/schemas/fixtures/v0_geojson_polygon.json'),
    parsed: require('../../../../../test/schemas/fixtures/v0_geojson_polygon_parsed.json')
  }]
}];

test('#appSchema -> Convert Saved Configs', t => {

  TEST_CASES.forEach(({name, cases}) => {
    Console.log(`test: ${name}`);

    cases.forEach(cs => {
      Console.log(`test: ${cs.name}`);

      const parsed = SchemaManager.parseSavedConfig(cs.saved);
      cmpParsedAppConfigs(t, cs.parsed, parsed, {name: cs.name});
    });
  });

  t.end();
});


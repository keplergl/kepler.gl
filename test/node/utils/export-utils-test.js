import test from  'tape';
import {registerEntry} from 'actions/identity-actions';
import keplerGlReducer from 'reducers';
import {exportMapToJson} from 'utils/export-utils';

test('exportUtils -> ExportJson', t => {
  const state = keplerGlReducer(undefined, registerEntry({id: 'test'})).test;

  const body = exportMapToJson(state);

  t.equal(
    typeof body,
    'string',
    'Should validate the type of body to be a string'
  );

  t.doesNotThrow(() => {
    JSON.parse(body)
  }, 'Should not throw when trying to parse body');

  t.end();
});

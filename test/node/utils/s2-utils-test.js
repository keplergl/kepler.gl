import test from 'tape';
import {getS2Center} from 'layers/s2-geometry-layer/s2-utils';

test('Utils -> set', t => {
  const s2Toekn = '8085873c';
  t.deepEqual(getS2Center(s2Toekn), [-122.4637079795235, 37.78228912269449]);
  t.end();
});

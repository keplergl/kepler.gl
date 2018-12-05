import test from 'tape';
import { mergeDomain } from 'utils/domain-utils';
import { ALL_FIELD_TYPES } from 'index';

test('DomainUtils -> mergeDomain', t => {
  const numericFieldTypes = [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.timestamp];
  for (let i = 0; i < numericFieldTypes.length; i++) {
    t.deepEqual(
      mergeDomain([1, 20], [3, 5], numericFieldTypes[i]),
      [1, 20],
      `should return old domain if old domain includes new domain with field type ${numericFieldTypes[i]}`
    );

    t.deepEqual(
      mergeDomain([3, 5], [1, 20], numericFieldTypes[i]),
      [1, 20],
      `should return new domain if new domain includes old domain with field type ${numericFieldTypes[i]}`
    );

    t.deepEqual(
      mergeDomain([3, 30], [0, 20], numericFieldTypes[i]),
      [0, 30],
      `should return expand domain if new domain and old domain are overlapped with field type ${numericFieldTypes[i]}`
    );
  }
  
  const ordinalDomainTypes = [ALL_FIELD_TYPES.string, ALL_FIELD_TYPES.date];

  for (let i = 0; i < ordinalDomainTypes.length; i++) {
    t.deepEqual(
      mergeDomain(['a', 'b'], ['b'], ordinalDomainTypes[i]),
      ['a', 'b'],
      `should return old domain if old domain includes new domain with field type ${ordinalDomainTypes[i]}`
    );

    t.deepEqual(
      mergeDomain(['a'], ['a', 'b'], ordinalDomainTypes[i]),
      ['a', 'b'],
      `should return new domain if new domain includes old domain with field type ${ordinalDomainTypes[i]}`
    );

    t.deepEqual(
      mergeDomain(['a', 'b'], ['c', 'd'], ordinalDomainTypes[i]),
      ['a', 'b', 'c', 'd'],
      `should return expand domain if new domain and old domain are overlapped with field type ${ordinalDomainTypes[i]}`
    );
  }
  t.end();
});


import {Type} from 'apache-arrow';
import {
  arrowTableToObjects,
  isObjectColumn,
  restoreObjectColumns,
  stringifyObjectColumn
} from './utils';

describe('arrowTableToObjects', () => {
  it('resolves Decimal columns to numbers using the declared scale', () => {
    const table = {
      toArray: () => [
        {toJSON: () => ({amount: {0: 123, 1: 0, 2: 0, 3: 0}, name: 'a'})},
        {toJSON: () => ({amount: {0: 456, 1: 0, 2: 0, 3: 0}, name: 'b'})}
      ],
      schema: {
        fields: [
          {name: 'amount', type: {typeId: Type.Decimal, scale: 2}},
          {name: 'name', type: {typeId: Type.Utf8}}
        ]
      }
    };
    expect(arrowTableToObjects(table as any)).toEqual([
      {amount: 1.23, name: 'a'},
      {amount: 4.56, name: 'b'}
    ]);
  });

  it('handles negative Decimal values (two\'s-complement 128-bit words)', () => {
    const table = {
      toArray: () => [
        {
          toJSON: () => ({
            amount: {0: 0xffffff85, 1: 0xffffffff, 2: 0xffffffff, 3: 0xffffffff}
          })
        }
      ],
      schema: {fields: [{name: 'amount', type: {typeId: Type.Decimal, scale: 2}}]}
    };
    expect(arrowTableToObjects(table as any)).toEqual([{amount: -1.23}]);
  });

  it('normalizes Decimal BigNums that arrive as Uint32Array views', () => {
    const table = {
      toArray: () => [{toJSON: () => ({amount: new Uint32Array([123, 0, 0, 0])})}],
      schema: {fields: [{name: 'amount', type: {typeId: Type.Decimal, scale: 2}}]}
    };
    expect(arrowTableToObjects(table as any)).toEqual([{amount: 1.23}]);
  });
});

describe('object-column stringify/restore', () => {
  it('isObjectColumn detects object values but ignores null/undefined', () => {
    expect(isObjectColumn([1, 2, 3])).toBe(false);
    expect(isObjectColumn([{a: 1}])).toBe(true);
    expect(isObjectColumn([null, undefined])).toBe(false);
  });

  it('stringifyObjectColumn serializes objects and passes primitives through', () => {
    expect(stringifyObjectColumn([{a: 1}, null, 'x', 5])).toEqual(['{"a":1}', null, 'x', 5]);
    // no object values → returned unchanged (same reference)
    const primitives = [1, 2, 3];
    expect(stringifyObjectColumn(primitives)).toBe(primitives);
  });

  it('restoreObjectColumns parses JSON strings back to objects/arrays', () => {
    const rows = [
      {_geojson: '{"type":"Point","coordinates":[1,2]}', name: 'a'},
      {_geojson: '[1,2,3]', name: 'b'}
    ];
    restoreObjectColumns(rows, ['_geojson']);
    expect(rows[0]._geojson).toEqual({type: 'Point', coordinates: [1, 2]});
    expect(rows[1]._geojson).toEqual([1, 2, 3]);
  });

  it('restoreObjectColumns leaves non-JSON and primitive-parsing strings as-is', () => {
    const rows = [
      {_geojson: 'not json', name: 'a'},
      // JSON.parse('42') → number 42, but only object/array values are restored
      {_geojson: '42', name: 'b'}
    ];
    restoreObjectColumns(rows, ['_geojson']);
    expect(rows[0]._geojson).toBe('not json');
    expect(rows[1]._geojson).toBe('42');
  });
});

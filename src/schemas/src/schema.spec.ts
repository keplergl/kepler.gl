// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Schema from './schema';

describe.each(['save', 'load'] as const)('Schema.%s', operation => {
  test('selects declared properties without dropping explicit empty values', () => {
    const schema = new Schema({
      key: 'config',
      properties: {
        enabled: null,
        count: null,
        label: null,
        optional: null,
        unset: null,
        absent: null
      }
    });
    const node = Object.freeze({
      enabled: false,
      count: 0,
      label: '',
      optional: null,
      unset: undefined,
      transient: 'do not persist'
    });

    expect(schema[operation](node)).toStrictEqual({
      config: {enabled: false, count: 0, label: '', optional: null, unset: undefined}
    });
  });

  test('distinguishes an unrestricted schema from an explicitly empty selection', () => {
    const node = {id: 'layer', settings: {visible: true}};

    expect(new Schema({key: 'config'})[operation](node)).toEqual({config: node});
    expect(new Schema({key: 'config', properties: {}})[operation](node)).toEqual({config: {}});
  });

  test('applies nested selections under their output keys without modifying input', () => {
    const schema = new Schema({
      key: 'config',
      properties: {
        id: null,
        settings: new Schema({key: 'options', properties: {visible: null}})
      }
    });
    const node = Object.freeze({
      id: 'layer',
      settings: Object.freeze({visible: false, temporary: true}),
      temporary: 'ignored'
    });

    expect(schema[operation](node)).toEqual({
      config: {id: 'layer', options: {visible: false}}
    });
    expect(node.settings).toEqual({visible: false, temporary: true});
  });

  test('does not call a nested schema for an absent property', () => {
    const child = new Schema({key: 'options'});
    const transform = jest.spyOn(child, operation);
    const schema = new Schema({key: 'config', properties: {settings: child}});

    expect(schema[operation]({})).toEqual({config: {}});
    expect(transform).not.toHaveBeenCalled();
  });

  test('passes ancestor and sibling context to nested transformations', () => {
    // Migration schemas use ancestor nodes and earlier sibling output to merge
    // legacy properties into a shared config rather than preserve the old key.
    const child = new Schema({key: 'legacy'});
    const transform = jest
      .spyOn(child, operation)
      .mockImplementation((value, parents = [], accumulated = {}) => ({
        options: {...accumulated.options, migrated: value},
        owner: (parents?.[parents.length - 2] as {id: string}).id
      }));
    const schema = new Schema({
      key: 'map',
      properties: {
        settings: new Schema({
          key: 'config',
          properties: {options: null, legacy: child, later: null}
        })
      }
    });
    const ancestor = {version: 'v1'};
    const parents = [ancestor];
    const settings = Object.freeze({
      options: Object.freeze({visible: false}),
      legacy: 0,
      later: 'last'
    });
    const node = Object.freeze({id: 'layer', settings});

    expect(schema[operation](node, parents)).toEqual({
      map: {config: {options: {visible: false, migrated: 0}, owner: 'layer', later: 'last'}}
    });
    expect(transform).toHaveBeenCalledWith(0, [ancestor, node, settings], {
      options: {visible: false}
    });
    expect(parents).toEqual([ancestor]);
    expect(settings.options).toEqual({visible: false});
  });
});

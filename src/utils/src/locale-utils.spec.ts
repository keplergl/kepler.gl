// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Console from 'global/console';
import {flattenMessages, mergeMessages} from './locale-utils';

const defaults = Object.freeze({
  en: Object.freeze({'panel.title': 'Title', 'panel.close': 'Close'}),
  fi: Object.freeze({'panel.title': 'Otsikko', 'panel.close': 'Sulje'})
});

describe('custom locale messages', () => {
  test('flattens nested and already dotted IDs without changing message contents', () => {
    const nested = Object.freeze({
      panel: Object.freeze({title: 'Hello {name}', blank: ''}),
      'panel.close': 'Close',
      empty: Object.freeze({})
    });
    expect(flattenMessages(nested)).toEqual({
      'panel.title': 'Hello {name}',
      'panel.blank': '',
      'panel.close': 'Close'
    });
    expect(flattenMessages({title: 'Title'}, 'panel')).toEqual({'panel.title': 'Title'});
  });

  test('uses English custom messages as fallback and locale overrides as highest priority', () => {
    const custom = Object.freeze({
      en: Object.freeze({panel: Object.freeze({title: 'Custom title', settings: 'Settings'})}),
      fi: Object.freeze({'panel.title': 'Oma otsikko'})
    });
    const merged = mergeMessages(defaults, custom);
    expect(merged).toEqual({
      en: {'panel.title': 'Custom title', 'panel.close': 'Close', 'panel.settings': 'Settings'},
      fi: {'panel.title': 'Oma otsikko', 'panel.close': 'Sulje', 'panel.settings': 'Settings'}
    });
    expect(merged).not.toBe(defaults);
    expect(merged.en).not.toBe(defaults.en);
    expect(merged.fi).not.toBe(defaults.fi);
  });

  test('propagates English-only custom IDs without erasing other translated messages', () => {
    const merged = mergeMessages(defaults, {en: {'panel.settings': 'Settings'}});
    expect(merged.en).toEqual({...defaults.en, 'panel.settings': 'Settings'});
    expect(merged.fi).toEqual({...defaults.fi, 'panel.settings': 'Settings'});
  });

  test('preserves intentional empty-string overrides', () => {
    const merged = mergeMessages(defaults, {
      en: {'panel.title': ''},
      fi: {'panel.close': ''}
    });
    expect(merged.en['panel.title']).toBe('');
    expect(merged.fi['panel.title']).toBe('');
    expect(merged.fi['panel.close']).toBe('');
  });

  test.each([undefined, null, 'invalid', {}, {fi: {}}, {en: null}, {en: 'invalid'}])(
    'keeps defaults and reports invalid custom messages: %p',
    custom => {
      const error = jest.spyOn(Console, 'error').mockImplementation(() => undefined);
      try {
        expect(mergeMessages(defaults, custom)).toBe(defaults);
        expect(error).toHaveBeenCalledTimes(1);
      } finally {
        error.mockRestore();
      }
    }
  );
});

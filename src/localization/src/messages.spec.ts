// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {flattenMessages, messages} from './messages';
import {LOCALES} from './locales';
import en from './translations/en';
import fi from './translations/fi';
import pt from './translations/pt';
import es from './translations/es';
import ca from './translations/ca';
import cn from './translations/cn';
import ja from './translations/ja';
import ru from './translations/ru';

const translations = {fi, pt, es, ca, cn, ja, ru};

describe('bundled locale messages', () => {
  test('provides a message catalogue for every selectable locale', () => {
    expect(Object.keys(messages).sort()).toEqual(Object.keys(LOCALES).sort());
    expect(messages.en).toEqual(flattenMessages(en));
  });

  test.each(Object.keys(translations))(
    '%s keeps translations and falls back to English',
    locale => {
      const translated = flattenMessages(translations[locale]);
      const missingKeys = Object.keys(messages.en).filter(key => !(key in translated));

      for (const key of Object.keys(translated)) {
        expect(messages[locale][key]).toBe(translated[key]);
      }
      for (const key of missingKeys) {
        expect(messages[locale][key]).toBe(messages.en[key]);
      }
      expect(Object.keys(messages.en).every(key => key in messages[locale])).toBe(true);
    }
  );

  test('flattens nested message IDs while preserving ICU placeholders and empty strings', () => {
    expect(
      flattenMessages({panel: {label: '{count, plural, one {item} other {items}}', blank: ''}})
    ).toEqual({'panel.label': '{count, plural, one {item} other {items}}', 'panel.blank': ''});
  });
});

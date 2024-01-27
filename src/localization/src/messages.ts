// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import en from './translations/en';
import fi from './translations/fi';
import pt from './translations/pt';
import es from './translations/es';
import ca from './translations/ca';
import cn from './translations/cn';
import ja from './translations/ja';
import ru from './translations/ru';

// Flat messages since react-intl does not seem to support nested structures
// Adapted from https://medium.com/siren-apparel-press/internationalization-and-localization-of-sirenapparel-eu-sirenapparel-us-and-sirenapparel-asia-ddee266066a2
export const flattenMessages = (
  nestedMessages,
  prefix = ''
): {
  [key: string]: string;
} => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
};

const enFlat = flattenMessages(en);

export const messages: {
  [key: string]: {
    [key: string]: string;
  };
} = {};

messages.en = enFlat;
messages.fi = {...enFlat, ...flattenMessages(fi)};
messages.pt = {...enFlat, ...flattenMessages(pt)};
messages.es = {...enFlat, ...flattenMessages(es)};
messages.ca = {...enFlat, ...flattenMessages(ca)};
messages.cn = {...enFlat, ...flattenMessages(cn)};
messages.ja = {...enFlat, ...flattenMessages(ja)};
messages.ru = {...enFlat, ...flattenMessages(ru)};

export default messages;

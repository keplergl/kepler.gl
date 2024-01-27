// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {isObject} from './utils';
import Console from 'global/console';

// Flat messages since react-intl does not seem to support nested structures
// Adapted from https://medium.com/siren-apparel-press/internationalization-and-localization-of-sirenapparel-eu-sirenapparel-us-and-sirenapparel-asia-ddee266066a2
export const flattenMessages = (nestedMessages, prefix = '') => {
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

export const mergeMessages = (defaultMessages, userMessages) => {
  if (!isObject(userMessages) || !isObject(userMessages.en)) {
    Console.error(
      'message should be an object and contain at least the `en` translation. Read more at https://docs.kepler.gl/docs/api-reference/localization'
    );

    return defaultMessages;
  }

  const userEnFlat = flattenMessages(userMessages.en);
  return Object.keys(defaultMessages).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        key === 'en'
          ? {...defaultMessages.en, ...userEnFlat}
          : {...defaultMessages[key], ...userEnFlat, ...flattenMessages(userMessages[key] || {})}
    }),
    {}
  );
};

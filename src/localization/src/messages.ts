// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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

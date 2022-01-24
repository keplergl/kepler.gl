import en from './translations/en';
import {flattenMessages} from '../utils/locale-utils';
import {LOCALE_CODES} from './locales';

const enFlat = flattenMessages(en);

export const messages = Object.keys(LOCALE_CODES).reduce(
  (acc, key) => ({
    ...acc,
    [key]:
      key === 'en'
        ? enFlat
        : {...enFlat, ...flattenMessages(require(`./translations/${key}.js`).default)}
  }),
  {}
);

export default messages;

# Localization

Kepler.gl supports localization trough [react-intl]. Locale is determined by `uiState.locale` value.

## Changing default language

By default the first language is English `en`. The default language can be changed by giving locale value to uiState:

```js
import {combineReducers} from 'redux';
import keplerGlReducer from 'kepler.gl/reducers';
import {LOCALES} from 'kepler.gl/constants';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  uiState: {
    // use Finnish locale
    locale: LOCALES.fi
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerGlReducer,
  app: appReducer
});
```

## Adding new language

Let's say we want to add the Swedish language to kepler.gl. Easiest way to add translation of new language is to follow these steps:

- Find out the [language code][language-codes] for Swedish: `sv`
- Add new translation file `src/localization/sv.js` by copying `src/localization/en.js` and translating the strings
- Update `src/localization/index.js` to include new language:
  ```javascript
  import sv from './sv';
  ...
  export const messages = {
    en: en_flat,
    fi: {...en_flat, ...flattenMessages(fi)},
    sv: {...en_flat, ...flattenMessages(sv)}
  };
  ```
- Update _LOCALES_ in `src/constants/default-settings.js` to include new language:
  ```javascript
  export const LOCALES = keyMirror({
    en: null,
    fi: null,
    sv: null
  });
  ```

[react-intl]: https://github.com/formatjs/react-intl
[language-codes]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

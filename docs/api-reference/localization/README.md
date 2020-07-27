# Localization

Kepler.gl supports localization trough [react-intl]. Locale is determined by `uiState.locale` value.

## Changing default language

By default the first language is English `en`. The default language can be changed by giving locale value to uiState:

```js
import {combineReducers} from 'redux';
import keplerGlReducer from 'kepler.gl/reducers';
import {LOCALE_CODES} from 'kepler.gl/localization';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  uiState: {
    // use Finnish locale
    locale: LOCALE_CODES.fi
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

- Update _LOCALES_ in `src/localization/locales.js` to include new language translation:
  ```javascript
  export const LOCALES = {
    en : 'English',
    fi : 'Suomi',
    pt: 'Português',
    sv: 'Svenska'
  }
  ```

[react-intl]: https://github.com/formatjs/react-intl
[language-codes]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

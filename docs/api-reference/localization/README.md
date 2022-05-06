# Localization

Kepler.gl supports localization through [react-intl]. Locale is determined by `uiState.locale` value.
Current supported languages are: 

| locale code | Language   | Default? |
|-------------|------------|----------|
| en          | English    | default  |
| fi          | Finnish    |          |
| pt          | Portuguese |          |
| ca          | Catalan    |          |
| es          | Spanish    |          |
| ja          | Japanese   |          |
| cn          | Chinese    |          |
| ru          | Русский    |          |

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

Let's say we want to add the Swedish language to kepler.gl. Easiest way to add translation of new language is to follow these 3 steps:

- Find out the [language code][language-codes] for Swedish: `sv`
- Add new translation file `src/localization/translations/sv.js` by copying `src/localization/translations/en.js` and translating the strings

- Update _LOCALES_ in `src/localization/locales.js` to include new language translation:
  ```javascript
  export const LOCALES = {
    en : 'English',
    fi : 'Suomi',
    pt: 'Português',
    // add Swedish language
    sv: 'Svenska'
  }
  ```

## Modify default translation or add new translation
the `localeMessages` prop of `KeplerGl` takes additional translations and merge with default translation. 

#### Example 1. Update default translation
To update the english translation of `layerManager.addData`, pass `localeMessages` like this.

```javascript
const localeMessages = {
  en: {
    ['layerManager.addData']: 'Add Data to Layer'
  }
};

const App = () => (
    <KeplerGl 
      id="map"
      localeMessages={messages}
      mapboxApiAccessToken={Token}
    />
);
```
#### Example 2. Pass additional translation
Sometimes together with dependency injection, you might need to add additional translations to the customized component. For example, adding an additional `settings` panel in the side panel, you will need to provide a translation for the panel name assigned to `sidebar.panels.settings`

```javascript
const localeMessages = {
  en: {
    ['sidebar.panels.settings']: 'Settings'
  }
};

const App = () => (
    <KeplerGl 
      id="map"
      localeMessages={messages}
      mapboxApiAccessToken={Token}
    />
);
```

[react-intl]: https://github.com/formatjs/react-intl
[language-codes]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

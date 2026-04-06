# Translation Guide for kepler.gl

Thank you for helping translate kepler.gl! This guide explains how to add a new language or update existing translations.

## Current Languages

| Code | Language | File |
|------|----------|------|
| `en` | English | `src/translations/en.ts` |
| `fi` | Suomi (Finnish) | `src/translations/fi.ts` |
| `pt` | Português (Portuguese) | `src/translations/pt.ts` |
| `es` | Español (Spanish) | `src/translations/es.ts` |
| `ca` | Català (Catalan) | `src/translations/ca.ts` |
| `ja` | 日本語 (Japanese) | `src/translations/ja.ts` |
| `cn` | 简体中文 (Simplified Chinese) | `src/translations/cn.ts` |
| `ru` | Русский (Russian) | `src/translations/ru.ts` |

## Adding a New Language

### 1. Create the translation file

Copy `src/translations/en.ts` to `src/translations/<code>.ts` (use the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) two-letter code):

```bash
cp src/translations/en.ts src/translations/de.ts
```

### 2. Translate all strings

Edit your new file and translate every string value. Keep the keys unchanged:

```typescript
// src/translations/de.ts
import {LOCALES} from '../locales';

export default {
  property: {
    weight: 'Gewicht',
    label: 'Beschriftung',
    fillColor: 'Füllfarbe',
    // ... translate all entries
  },
  // ...
};
```

**Tips:**
- Use `src/translations/en.ts` as the reference for all keys
- Keep placeholders like `{mapboxToken}` and `{errorMessage}` unchanged
- Preserve HTML entities and formatting strings
- For keys you're unsure about, leave the English text and add a `// TODO: translate` comment

### 3. Register the language

**a.** Add the locale to `src/locales.ts`:

```typescript
export const LOCALES = {
  en: 'English',
  // ... existing locales
  de: 'Deutsch'  // <-- add your language
};
```

**b.** Import and add the translation in `src/messages.ts`:

```typescript
import de from './translations/de';  // <-- add import

export const messages = {
  // ... existing entries
  de: flattenMessages(de)  // <-- add entry
};
```

### 4. Test your translation

Set the locale in a kepler.gl instance:

```javascript
import {LOCALE_CODES} from '@kepler.gl/localization';

const customizedKeplerGlReducer = keplerGlReducer
  .initialState({
    uiState: {
      locale: LOCALE_CODES.de
    }
  });
```

Or switch languages at runtime using the locale panel in the map controls (globe icon).

## Updating Existing Translations

When new English strings are added, other translation files may fall behind. To find missing translations:

1. Compare your translation file against `en.ts` to identify missing keys
2. Search for `// TODO` comments in existing translation files
3. Check for keys that still have English values in non-English files

## Translation Structure

Translations use a nested object structure that gets flattened by `flattenMessages()`:

```typescript
{
  property: {
    weight: 'weight',     // becomes 'property.weight'
    label: 'label'        // becomes 'property.label'
  },
  toolbar: {
    exportImage: 'Export Image'  // becomes 'toolbar.exportImage'
  }
}
```

In components, strings are referenced via `<FormattedMessage id="property.weight" />` or the `intl.formatMessage()` API.

## Questions?

Open an issue on [GitHub](https://github.com/keplergl/kepler.gl/issues) with the `localization` label.

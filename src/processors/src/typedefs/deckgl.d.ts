// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Eslint does not seem to be able to understand the namespace re-export here
/* eslint-disable */

import * as DeckTypings from '@danmarshall/deckgl-typings';

declare module 'deck.gl' {
  export namespace DeckTypings {}
}

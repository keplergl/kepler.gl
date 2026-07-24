// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Force this file to be treated as a module (rather than a global script) so the
// `declare module 'styled-components'` block below *augments* the real package's
// types instead of replacing them wholesale.
export {};

// Augment the loosely-typed `global/window` module with the ad-hoc properties
// this app reads/writes on `window` (Google Analytics, Redux DevTools).
declare module 'global/window' {
  interface KeplerWindow extends Window {
    gtag?: (...args: any[]) => void;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (...args: any[]) => any;
  }
  const keplerWindow: KeplerWindow;
  export default keplerWindow;
}

// The published @kepler.gl/styles package doesn't ship its styled-components
// `DefaultTheme` augmentation (it only exists in the library's own src). Declare
// it locally so styled-components usages of `props.theme.*` type-check here.
declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: any;
  }
}

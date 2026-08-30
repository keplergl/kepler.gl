// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {shadowMapHoverFixModule} from './custom-deck-lighting-effect';

describe('shadowMapHoverFixModule', () => {
  test('re-encodes shadow map depth after picking highlight', () => {
    const inject = (
      shadowMapHoverFixModule as {
        inject: Record<string, {order: number; injection: string}>;
      }
    ).inject['fs:DECKGL_FILTER_COLOR'];

    // deck.gl picking blends highlightColor at order 99, which would overwrite
    // encoded shadow depth for the hovered object.
    expect(inject.order).toBeGreaterThan(99);
    expect(inject.injection).toContain('shadow.drawShadowMap');
    expect(inject.injection).toContain('shadow_filterShadowColor');
  });
});

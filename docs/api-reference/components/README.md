# Components

## Add a custom deck.gl layer

Pass deck.gl layer instances to `KeplerGl` through `deckGlProps`. Use `layers` to draw them
before Kepler's own deck.gl data layers, or `topLayers` to draw them after those layers.
These props apply to the primary deck.gl render pass, not to the basemap's layer order.

The example below assumes you've [set up the Kepler.gl reducer and Redux Provider](../get-started.md).
Install `@deck.gl/layers` at the same version used by your Kepler.gl installation. The sample point
is in San Francisco, near Kepler.gl's default starting view.

```tsx
import React, {useMemo, useState} from 'react';
import KeplerGl from '@kepler.gl/components';
import {ScatterplotLayer} from '@deck.gl/layers';

type Point = {position: [number, number]};

export function MapWithOverlay({
  width,
  height,
  mapboxApiAccessToken = ''
}: {
  width: number;
  height: number;
  mapboxApiAccessToken?: string;
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlay = useMemo(
    () =>
      new ScatterplotLayer<Point>({
        id: 'custom-san-francisco-point',
        data: [{position: [-122.4194, 37.7749]}],
        getPosition: point => point.position,
        getRadius: 12,
        radiusUnits: 'pixels',
        getFillColor: [220, 40, 50]
      }),
    []
  );

  return (
    <>
      <button
        type="button"
        aria-pressed={showOverlay}
        onClick={() => setShowOverlay(show => !show)}
      >
        Toggle custom point
      </button>
      <KeplerGl
        id="map"
        width={width}
        height={height}
        mapboxApiAccessToken={mapboxApiAccessToken}
        deckGlProps={{topLayers: showOverlay ? [overlay] : []}}
      />
    </>
  );
}
```

To draw the point before Kepler's deck.gl data layers, change the last prop to
`deckGlProps={{layers: showOverlay ? [overlay] : []}}`. The embedding app owns these
layers: they do not appear in Kepler's Layers panel and are not saved in its map config.
Store the visibility flag in your own React or Redux state rather than dispatching a
deck.gl layer instance to Kepler's layer reducer.

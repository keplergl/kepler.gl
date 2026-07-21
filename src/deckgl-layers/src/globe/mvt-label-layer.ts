// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CompositeLayer, Color, Layer, UpdateParameters, AccessorFunction} from '@deck.gl/core';
import {GeoJsonLayer, TextLayer} from '@deck.gl/layers';

import type {Globe} from '@kepler.gl/constants';
import type {Feature} from 'geojson';

import EnhancedMultiIconLayer from './enhanced-multi-icon-layer';

// Ported from studio-monorepo (modules/studio/src/components/globe/mvt-label-layer.ts).
//
// This composite is used as the `renderSubLayers` of the globe basemap MVTLayer.
// It renders two things per tile:
//   1. A GeoJsonLayer for admin lines / water fills (same visuals as before).
//   2. A TextLayer for place labels (country names), gated on `config.labels`.
//
// The TextLayer uses a custom `EnhancedMultiIconLayer` as its glyph (characters)
// sublayer, which culls labels on the far side of the globe so they aren't drawn
// through the planet (ported from studio-monorepo).

type MVTLabelLayerProps = {
  data: {features: Feature[]} | Feature[];
  config: Globe['config'];
  labelSizeUnits?: 'meters' | 'common' | 'pixels';
  labelBackground?: Color;
  billboard?: boolean;
};

export class MVTLabelLayer extends CompositeLayer<MVTLabelLayerProps> {
  static layerName = 'MVTLabelLayer';
  static defaultProps = {
    ...GeoJsonLayer.defaultProps,
    billboard: true,
    labelSizeUnits: 'pixels',
    labelBackground: {type: 'color', value: null, optional: true},
    fontFamily: 'Monaco, monospace'
  };

  getLabel(feature: Feature): string {
    const {properties} = feature;

    switch (properties?.layerName) {
      // Mapbox `mapbox-streets-v8` schema.
      case 'place_label':
        switch (properties.class) {
          case 'country':
            return properties.name_en || properties.name || '';
          default:
            return '';
        }
      // CARTO / OpenMapTiles schema.
      case 'place':
        switch (properties.class) {
          case 'country':
            return properties['name:en'] || properties.name_en || properties.name || '';
          default:
            return '';
        }
      default:
        return '';
    }
  }

  getLabelSize(): number {
    return 10;
  }

  getLabelAnchors(feature: Feature): number[][] {
    // @ts-expect-error geometry type is narrowed by the switch below
    const {type, coordinates} = feature.geometry || {};
    switch (type) {
      case 'Point':
        return [coordinates];
      case 'MultiPoint':
        return coordinates;
      default:
        return [];
    }
  }

  updateState({changeFlags}: UpdateParameters<this>): void {
    const {data} = this.props;
    if (changeFlags.dataChanged && data) {
      const features = (data as {features: Feature[]}).features || (data as Feature[]);
      const labelData = (features || []).flatMap((feature, index) => {
        const labelAnchors = this.getLabelAnchors(feature);
        return labelAnchors.map(p => this.getSubLayerRow({position: p}, feature, index));
      });

      this.setState({labelData});
    }
  }

  renderLayers(): Layer[] {
    const {config, labelSizeUnits, labelBackground, billboard} = this.props;
    const layers: Layer[] = [];

    // admin lines and water
    layers.push(
      new GeoJsonLayer(this.props as any, this.getSubLayerProps({id: 'geojson'}), {
        data: this.props.data as any,
        updateTriggers: {
          getFillColor: {
            water: config.water,
            waterColor: config.waterColor
          },
          getLineColor: {
            adminLines: config.adminLines,
            adminLinesColor: config.adminLinesColor
          }
        }
      })
    );

    // labels
    if (config.labels) {
      layers.push(
        new TextLayer(this.getSubLayerProps({id: 'text'}), {
          data: this.state.labelData as any,
          parameters: {
            // Globe mode sets a global `cull: true` (to backface-cull the sphere
            // surface). That also backface-culls the glyph quads, hiding all labels,
            // so explicitly disable culling here. depthTest off keeps labels on top of
            // the globe surface rather than clipping into it.
            cull: false,
            depthTest: false,
            depthMask: false
          },
          billboard,
          sizeUnits: labelSizeUnits,
          // Build the font atlas from the actual labels so accented / non-ASCII
          // characters (ü, ó, etc. in country names) aren't dropped as "missing".
          characterSet: 'auto',
          fontFamily: 'Monaco, monospace',
          background: Boolean(labelBackground),
          getBackgroundColor: () => (labelBackground || [0, 0, 0, 0]) as Color,
          getPosition: (d: any) => d.position,
          getText: this.getSubLayerAccessor(this.getLabel) as AccessorFunction<Feature, string>,
          getSize: this.getSubLayerAccessor(this.getLabelSize),
          getColor: () => config.labelsColor as Color,
          _subLayerProps: {
            characters: {
              type: EnhancedMultiIconLayer
            }
          } as any,
          updateTriggers: {
            getColor: config.labelsColor
          }
        })
      );
    }

    return layers;
  }
}

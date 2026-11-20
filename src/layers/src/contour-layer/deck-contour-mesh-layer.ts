// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  Accessor,
  Color,
  CompositeLayer,
  DefaultProps,
  GetPickingInfoParams,
  PickingInfo,
  UpdateParameters
} from '@deck.gl/core';
import {SolidPolygonLayer} from '@deck.gl/layers';
import {createSelector} from 'reselect';
import {ContourFeature} from './contour-utils';
import {buildContourMesh, ContourMeshData} from './contour-mesh';
import ContourSurfaceLayer, {SurfaceNormalAccessor} from './deck-contour-surface-layer';

type ContourMeshLayerProps = {
  data: ContourFeature[];
  getMesh: () => ContourMeshData;
  getFillColor: Accessor<ContourFeature, Color>;
  getSurfaceNormal?: SurfaceNormalAccessor;
};

function crossesWorldBounds(mesh: ContourMeshData): boolean {
  const positions = mesh.attributes.getPolygon.value;
  let west = Infinity;
  let east = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    const longitude = positions[i];
    if (Math.abs(longitude) > 180 || Math.abs(positions[i + 1]) > 86) return true;
    west = Math.min(west, longitude);
    east = Math.max(east, longitude);
  }
  return east - west > 180;
}

const createMeshSelector = () =>
  createSelector(
    (props: ContourMeshLayerProps & {wrapLongitude?: boolean}, _resolution?: number) => props.data,
    (props: ContourMeshLayerProps) => props.getMesh,
    (_props: ContourMeshLayerProps, resolution?: number) => resolution,
    (props: ContourMeshLayerProps & {wrapLongitude?: boolean}) => props.wrapLongitude,
    (data, getMesh, resolution, wrapLongitude) => {
      // Normalize globe geometry before projecting any polar contour vertices.
      if (resolution) return buildContourMesh(data, {resolution, wrapLongitude}).fill;
      const mesh = getMesh();
      return wrapLongitude && crossesWorldBounds(mesh)
        ? buildContourMesh(data, {resolution, wrapLongitude}).fill
        : mesh;
    }
  );

/** Render indexed contour fills without expanding every triangle into GeoJSON rows. */
export default class ContourMeshLayer extends CompositeLayer<ContourMeshLayerProps> {
  static layerName = 'ContourMeshLayer';
  static defaultProps: DefaultProps<ContourMeshLayerProps> = {
    getFillColor: {type: 'accessor', value: [0, 0, 0, 255]}
  };

  state!: {getMesh: ReturnType<typeof createMeshSelector>};

  initializeState(): void {
    // deck.gl transfers state to replacement layer instances on style updates.
    this.setState({getMesh: createMeshSelector()});
  }

  shouldUpdateState(params: UpdateParameters<this>): boolean {
    return super.shouldUpdateState(params) || Boolean(params.changeFlags.viewportChanged);
  }

  getPickingInfo({info}: GetPickingInfoParams): PickingInfo {
    info.object = info.index >= 0 ? this.props.data[info.index] : undefined;
    return info;
  }

  renderLayers() {
    const {data, getFillColor, getSurfaceNormal} = this.props;
    const mesh = this.state.getMesh(this.props, this.context.viewport.resolution);
    if (!mesh.length) return null;
    const FillLayer = getSurfaceNormal ? ContourSurfaceLayer : SolidPolygonLayer;
    return new FillLayer({
      ...this.getSubLayerProps({
        id: 'polygons-fill',
        updateTriggers: {getFillColor: this.props.updateTriggers?.getFillColor}
      }),
      data: mesh,
      _normalize: false,
      extruded: false,
      getFillColor:
        typeof getFillColor === 'function'
          ? (_, info) => getFillColor(data[info.index], {...info, data})
          : getFillColor,
      ...(getSurfaceNormal ? {getSurfaceNormal} : {})
    });
  }
}

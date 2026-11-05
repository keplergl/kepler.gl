// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent} from '@testing-library/react';
import {WebMercatorViewport} from '@deck.gl/core';

import {AnnotationKind} from '@kepler.gl/constants';
import {Annotation, MapState, RulerAnnotation} from '@kepler.gl/types';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {mockKeplerProps} from 'test/helpers/mock-state';

import AnnotationOverlay from './annotation-overlay';
import {MapViewport} from './annotation-utils';
import {MapViewStateContextProvider} from '../map-view-state-context';
import PlotContainerFactory from '../plot-container';
import {plotContainerSelector} from '../kepler-gl';

const ruler: RulerAnnotation = {
  id: 'ruler-1',
  kind: AnnotationKind.RULER,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0],
  endPoint: [0.01, 0],
  label: 'Short ruler',
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 100,
  textHeight: 30,
  showCustomText: true,
  showDistance: true
};

const viewport: MapViewport = {
  project: ([lng, lat]) => [500 + lng * 10, 300 - lat * 10],
  unproject: ([x, y]) => [(x - 500) / 10, (y - 300) / -10],
  longitude: 0,
  latitude: 0,
  width: 1000,
  height: 600,
  zoom: 10
};

// jsdom lacks PointerEvent; MouseEvent supplies the coordinates used by the sensor.
function dispatchPointer(target: Node, type: string, x: number, y: number) {
  const event = new MouseEvent(type, {bubbles: true, button: 0, clientX: x, clientY: y});
  Object.defineProperty(event, 'isPrimary', {value: true});
  fireEvent(target, event);
}

const makeLegacyAnnotation = (kind: AnnotationKind): Annotation =>
  ({...ruler, id: 'legacy-1', kind, armLength: 20, angle: 0, radiusInMeters: 1000} as Annotation);

function worldViewport(longitude: number): MapViewport {
  const projected = new WebMercatorViewport({
    width: 1000,
    height: 600,
    latitude: 0,
    longitude,
    zoom: 0
  });
  return {
    ...projected,
    project: point => projected.project([...point]),
    unproject: point => projected.unproject([...point])
  };
}

function setupWorldCopy(annotation: Annotation, longitude: number) {
  let setLongitude: (longitude: number) => void;
  let savedAnnotation = annotation;
  const updateAnnotation = jest.fn();
  function Harness() {
    const [currentAnnotation, setAnnotation] = React.useState(annotation);
    const [currentLongitude, pan] = React.useState(longitude);
    setLongitude = pan;
    savedAnnotation = currentAnnotation;
    const currentViewport = React.useMemo(
      () => worldViewport(currentLongitude),
      [currentLongitude]
    );
    return (
      <AnnotationOverlay
        annotations={[currentAnnotation]}
        selectedAnnotationId={annotation.id}
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={currentViewport}
        updateAnnotation={(id, changes) => {
          updateAnnotation(id, changes);
          setAnnotation(previous => ({...previous, ...changes} as Annotation));
        }}
        setSelectedAnnotation={jest.fn()}
      />
    );
  }
  const view = renderWithTheme(<Harness />);
  return {
    ...view,
    updateAnnotation,
    savedAnnotation: () => savedAnnotation,
    pan: (nextLongitude: number) => act(() => setLongitude(nextLongitude)),
    position: (part = 'shape') =>
      view.container
        .querySelector(`[data-annotation-part="${part}"]`)!
        .getAttribute('transform')!
        .slice('translate('.length, -1)
        .split(',')
        .map(Number)
  };
}

describe('AnnotationOverlay ruler interactions', () => {
  test.each([0, 1])('exports the retained copy for map %s after panning', mapIndex => {
    const annotation = {
      ...makeLegacyAnnotation(AnnotationKind.POINT),
      mapIndex,
      anchorPoint: [178, 0]
    } as Annotation;
    const overlayProps = {
      annotations: [annotation],
      selectedAnnotationId: null,
      isEditingAnnotationText: false,
      isAnnotationMode: false,
      mapIndex,
      updateAnnotation: jest.fn(),
      setSelectedAnnotation: jest.fn()
    };
    const ExportMap = ({
      mapState,
      index,
      isExport
    }: {
      mapState: MapState;
      index?: number;
      isExport?: boolean;
    }) => {
      const projected = new WebMercatorViewport(mapState);
      return (
        <AnnotationOverlay
          {...overlayProps}
          mapIndex={index ?? 0}
          isExport={isExport}
          viewport={{
            ...projected,
            project: point => projected.project([...point]),
            unproject: point => projected.unproject([...point])
          }}
        />
      );
    };
    const PlotContainer = PlotContainerFactory(
      ExportMap as unknown as Parameters<typeof PlotContainerFactory>[0],
      (({children}) => <>{children}</>) as Parameters<typeof PlotContainerFactory>[1]
    );
    const plotProps = plotContainerSelector(mockKeplerProps);
    const tree = (longitude: number, scale?: number, exportLongitude = longitude) => {
      const mapState = {
        ...plotProps.mapFields.mapState,
        longitude,
        latitude: 0,
        zoom: 0,
        pitch: 0,
        bearing: 0,
        width: 1000,
        height: 600
      };
      return (
        <MapViewStateContextProvider mapState={mapState}>
          <div data-testid="live">
            <AnnotationOverlay {...overlayProps} viewport={worldViewport(longitude)} />
          </div>
          {scale !== undefined ? (
            <PlotContainer
              {...plotProps}
              center={false}
              splitMaps={mapIndex === 1 ? [{layers: {}}, {layers: {}}] : []}
              imageSize={{
                scale,
                zoomOffset: Math.log2(scale),
                imageW: 1000 * scale * (mapIndex === 1 ? 2 : 1),
                imageH: 600 * scale
              }}
              mapFields={{
                ...plotProps.mapFields,
                mapState: {...mapState, longitude: exportLongitude}
              }}
            />
          ) : null}
        </MapViewStateContextProvider>
      );
    };
    let setScene: React.Dispatch<React.SetStateAction<React.ReactElement>>;
    function Harness() {
      const [scene, updateScene] = React.useState(() => tree(-176));
      setScene = updateScene;
      return scene;
    }
    const view = renderWithTheme(<Harness />);
    const renderScene = (longitude: number, scale?: number, exportLongitude = longitude) =>
      act(() => setScene(tree(longitude, scale, exportLongitude)));
    renderScene(-172);
    const livePosition = view
      .getByTestId('live')
      .querySelector('[data-annotation-part="shape"]')!
      .getAttribute('transform');
    const [x, y] = worldViewport(-172).project([-182, 0]);
    expect(livePosition).toBe(`translate(${x},${y})`);

    // Even an export crop where the live anchor is off screen must not change
    // the live selection or seed later exports with a different world copy.
    renderScene(-172, 1, 172);
    renderScene(-172);
    for (const scale of [1, 2]) {
      renderScene(-172, scale);
      const exportedPosition = view.container
        .querySelector('.export-map-instance [data-annotation-part="shape"]')!
        .getAttribute('transform')!
        .slice('translate('.length, -1)
        .split(',')
        .map(Number);
      expect(exportedPosition[0]).toBeCloseTo(x * scale);
      expect(exportedPosition[1]).toBeCloseTo(y * scale);
      expect(
        view
          .getByTestId('live')
          .querySelector('[data-annotation-part="shape"]')!
          .getAttribute('transform')
      ).toBe(livePosition);
    }
    expect(annotation.anchorPoint).toEqual([178, 0]);
    expect(overlayProps.updateAnnotation).not.toHaveBeenCalled();
  });

  test.each([AnnotationKind.POINT, AnnotationKind.RULER])(
    'keeps the rendered %s copy when a pan brings the saved anchor on screen',
    kind => {
      const annotation = {...makeLegacyAnnotation(kind), anchorPoint: [178, 0]} as Annotation;
      const view = setupWorldCopy(annotation, -176);
      expect(view.position()[0]).toBeCloseTo(worldViewport(-176).project([-182, 0])[0]);

      for (const longitude of [-172, -176, -172]) {
        view.pan(longitude);
        expect(view.position()[0]).toBeCloseTo(worldViewport(longitude).project([-182, 0])[0]);
        if (kind === AnnotationKind.RULER) {
          expect(view.position('handles')).toEqual(view.position());
        }
      }
      expect(view.savedAnnotation().anchorPoint).toEqual([178, 0]);
      expect(view.updateAnnotation).not.toHaveBeenCalled();
    }
  );

  test.each([
    {anchor: 178, center: 179, normalizedCenter: -179, wrappedAnchor: -182},
    {anchor: -178, center: -179, normalizedCenter: 179, wrappedAnchor: 182}
  ])('follows map-center normalization from $center to $normalizedCenter', scenario => {
    const annotation = {
      ...makeLegacyAnnotation(AnnotationKind.POINT),
      anchorPoint: [scenario.anchor, 0]
    } as Annotation;
    const view = setupWorldCopy(annotation, scenario.center);
    view.pan(scenario.normalizedCenter);
    expect(view.position()[0]).toBeCloseTo(
      worldViewport(scenario.normalizedCenter).project([scenario.wrappedAnchor, 0])[0]
    );
    view.pan(scenario.center);
    expect(view.position()[0]).toBeCloseTo(
      worldViewport(scenario.center).project([scenario.anchor, 0])[0]
    );
    expect(view.savedAnnotation().anchorPoint).toEqual([scenario.anchor, 0]);
    expect(view.updateAnnotation).not.toHaveBeenCalled();
  });

  test.each([AnnotationKind.POINT, AnnotationKind.RULER])(
    'drags %s from the retained copy after panning and keeps it after release',
    kind => {
      const annotation = {
        ...makeLegacyAnnotation(kind),
        anchorPoint: [178, 0],
        endPoint: [-160, 0]
      } as Annotation;
      const view = setupWorldCopy(annotation, -176);
      view.pan(-172);
      const [x, y] = worldViewport(-172).project([-182, 0]);
      const part = kind === AnnotationKind.RULER ? 'handles' : 'shape';
      const handle = view.container.querySelector(
        `[data-annotation-part="${part}"] [role="button"]`
      )!;
      dispatchPointer(handle, 'pointerdown', x, y);
      dispatchPointer(document, 'pointermove', x + 4, y);
      for (const deltaX of [20, 30]) {
        dispatchPointer(document, 'pointermove', x + deltaX, y);
        expect(view.position()[0]).toBeCloseTo(x + deltaX);
      }
      dispatchPointer(document, 'pointerup', x + 30, y);
      expect(view.position()[0]).toBeCloseTo(x + 30);
      const movedAnchor = view.savedAnnotation().anchorPoint;
      expect(movedAnchor[0]).toBeCloseTo(worldViewport(-172).unproject([x + 30, y])[0]);
      const lastUpdate =
        view.updateAnnotation.mock.calls[view.updateAnnotation.mock.calls.length - 1];
      expect(Object.keys(lastUpdate[1])).toEqual(['anchorPoint']);
      view.pan(-170);
      expect(view.position()[0]).toBeCloseTo(worldViewport(-170).project(movedAnchor)[0]);
    }
  );

  test.each([
    AnnotationKind.TEXT,
    AnnotationKind.POINT,
    AnnotationKind.ARROW,
    AnnotationKind.CIRCLE
  ])('preserves anchor and label dragging for %s annotations', kind => {
    const updateAnnotation = jest.fn();
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[makeLegacyAnnotation(kind)]}
        selectedAnnotationId="legacy-1"
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={updateAnnotation}
        setSelectedAnnotation={jest.fn()}
      />
    );
    const anchor = container.querySelector('[data-annotation-part="shape"] [role="button"]')!;
    const text = container.querySelector('[data-annotation-part="text"]')!;

    for (const handle of [anchor, text]) {
      updateAnnotation.mockClear();
      dispatchPointer(handle, 'pointerdown', 500, 300);
      dispatchPointer(document, 'pointermove', 504, 300);
      dispatchPointer(document, 'pointermove', 520, 290);
      dispatchPointer(document, 'pointerup', 520, 290);

      expect(updateAnnotation).toHaveBeenCalled();
      const [id, changes] = updateAnnotation.mock.calls[updateAnnotation.mock.calls.length - 1];
      expect(id).toBe('legacy-1');
      if (handle === anchor || kind === AnnotationKind.TEXT) {
        expect(changes).toEqual({anchorPoint: [2, 1]});
      } else {
        expect(changes).not.toHaveProperty('anchorPoint');
        expect(changes.angle).toBeLessThan(0);
        expect(changes.armLength).toBeGreaterThan(20);
        expect(changes.textSide).toBe('right');
        expect(changes.textVerticalPosition).toBe('above');
      }
    }
  });

  test('renders legacy annotations and rulers without editing controls in view mode', () => {
    const updateAnnotation = jest.fn();
    const setSelectedAnnotation = jest.fn();
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[makeLegacyAnnotation(AnnotationKind.POINT), ruler]}
        selectedAnnotationId={ruler.id}
        isEditingAnnotationText={true}
        isAnnotationMode={false}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={updateAnnotation}
        setSelectedAnnotation={setSelectedAnnotation}
      />
    );

    expect(container.querySelectorAll('[data-annotation-part="shape"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-annotation-part="text"]')).toHaveLength(2);
    expect(container.querySelector('[data-annotation-part="distance"]')).toHaveTextContent(
      'Length: 1.11 km'
    );
    expect(container.querySelector('[role="button"], [contenteditable="true"]')).toBeNull();
    for (const text of container.querySelectorAll('[data-annotation-part="text"]')) {
      fireEvent.click(text);
    }
    expect(updateAnnotation).not.toHaveBeenCalled();
    expect(setSelectedAnnotation).not.toHaveBeenCalled();
  });

  test('renders endpoint handles above midpoint text so short rulers remain draggable', () => {
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[ruler]}
        selectedAnnotationId={ruler.id}
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={jest.fn()}
        setSelectedAnnotation={jest.fn()}
      />
    );

    const text = container.querySelector('[data-annotation-part="text"]');
    const handles = container.querySelector('[data-annotation-part="handles"]');

    expect(text).toBeInTheDocument();
    expect(handles).toBeInTheDocument();
    expect(text?.compareDocumentPosition(handles as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  test.each<[string, [number, number]]>([
    ['short', [0.01, 0]],
    ['coincident', [0, 0]],
    ['vertical', [0, 0.01]],
    ['diagonal', [0.01, 0.01]]
  ])('independently drags both endpoints of a %s ruler', (_name, endPoint) => {
    const updateAnnotation = jest.fn();
    const setSelectedAnnotation = jest.fn();
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[{...ruler, endPoint}]}
        selectedAnnotationId={ruler.id}
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={updateAnnotation}
        setSelectedAnnotation={setSelectedAnnotation}
      />
    );
    const handles = Array.from<SVGCircleElement>(
      container.querySelectorAll('[data-annotation-part="handles"] [role="button"]')
    );
    expect(handles).toHaveLength(2);
    const centers = handles.map(handle => [
      Number(handle.getAttribute('cx')),
      Number(handle.getAttribute('cy'))
    ]);
    const radii = handles.map(handle => Number(handle.getAttribute('r')));
    // Unlike dispatching directly to overlapping nodes, this checks both pointer
    // targets are actually reachable without being covered by the other handle.
    expect(
      Math.hypot(centers[1][0] - centers[0][0], centers[1][1] - centers[0][1])
    ).toBeGreaterThan(radii[0] + radii[1]);

    handles.forEach((handle, index) => {
      updateAnnotation.mockClear();
      const [x, y] = [500 + centers[index][0], 300 + centers[index][1]];
      dispatchPointer(handle, 'pointerdown', x, y);
      dispatchPointer(document, 'pointermove', x + 4, y);
      dispatchPointer(document, 'pointermove', x + 20, y - 10);
      dispatchPointer(document, 'pointerup', x + 20, y - 10);

      expect(setSelectedAnnotation).toHaveBeenLastCalledWith(ruler.id, false);
      expect(updateAnnotation).toHaveBeenCalled();
      const [id, changes] = updateAnnotation.mock.calls[updateAnnotation.mock.calls.length - 1];
      const key = index === 0 ? 'anchorPoint' : 'endPoint';
      const original = index === 0 ? ruler.anchorPoint : endPoint;
      expect(id).toBe(ruler.id);
      expect(Object.keys(changes)).toEqual([key]);
      expect(changes[key][0]).toBeCloseTo(original[0] + 2);
      expect(changes[key][1]).toBeCloseTo(original[1] + 1);
    });
  });
});

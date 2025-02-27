// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WebMercatorViewport from 'viewport-mercator-project';

import {TRANSITION_DURATION} from '@kepler.gl/constants';
import {
  getMapLayersFromSplitMaps,
  onViewPortChange,
  getViewportFromMapState
} from '@kepler.gl/utils';

export const INITIAL_MAP_STATE = {
  pitch: 0,
  bearing: 0,
  latitude: 40,
  longitude: -100,
  zoom: 9,
  dragRotate: false,
  width: 800,
  height: 800,
  minZoom: undefined,
  maxZoom: undefined,
  maxBounds: undefined,
  isSplit: false,
  isViewportSynced: true,
  isZoomLocked: false,
  splitMapViewports: []
};

describe('mapUtils', () => {
  describe('onViewPortChange', () => {
    let mockOnUpdateMap;
    let mockOnViewStateChange;

    beforeEach(() => {
      mockOnUpdateMap = jest.fn();
      mockOnViewStateChange = jest.fn();
    });

    test('should use restViewState when width and height are 0', () => {
      const viewState = {...INITIAL_MAP_STATE, width: 0, height: 0};
      onViewPortChange(viewState, mockOnUpdateMap, mockOnViewStateChange);

      const {width: _width, height: _height, ...restViewState} = INITIAL_MAP_STATE;
      expect(mockOnUpdateMap).toHaveBeenCalledWith({...restViewState, transitionDuration: 0}, 0);
    });

    test('should use viewState when width and height are greater than 0', () => {
      const viewState = INITIAL_MAP_STATE;
      onViewPortChange(viewState, mockOnUpdateMap, mockOnViewStateChange);

      expect(mockOnUpdateMap).toHaveBeenCalledWith({...viewState, transitionDuration: 0}, 0);
    });

    test('should set transitionDuration based on primary flag', () => {
      const viewState = INITIAL_MAP_STATE;
      onViewPortChange(viewState, mockOnUpdateMap, mockOnViewStateChange, true);
      expect(mockOnUpdateMap).toHaveBeenCalledWith(
        {...viewState, transitionDuration: TRANSITION_DURATION},
        0
      );

      onViewPortChange(viewState, mockOnUpdateMap, mockOnViewStateChange, false);
      expect(mockOnUpdateMap).toHaveBeenCalledWith({...viewState, transitionDuration: 0}, 0);
    });

    test('should call onViewStateChange if it is a function', () => {
      const viewState = {width: 100, height: 100};
      onViewPortChange(viewState, mockOnUpdateMap, mockOnViewStateChange);
      expect(mockOnViewStateChange).toHaveBeenCalledWith({...viewState, transitionDuration: 0});
    });

    test('should call onUpdateMap with correct arguments', () => {
      const viewState = {width: 100, height: 100};
      const mapIndex = 1;
      onViewPortChange(viewState, mockOnUpdateMap, mockOnViewStateChange, false, mapIndex);
      expect(mockOnUpdateMap).toHaveBeenCalledWith({...viewState, transitionDuration: 0}, mapIndex);
    });
  });
  describe('getMapLayersFromSplitMaps', () => {
    test('returns layers for valid index', () => {
      const splitMaps = [{layers: ['Layer1', 'Layer2']}, {layers: ['Layer3', 'Layer4']}];
      const mapIndex = 1;

      expect(getMapLayersFromSplitMaps(splitMaps, mapIndex)).toEqual(['Layer3', 'Layer4']);
    });

    test('returns undefined for invalid index', () => {
      const splitMaps = [{layers: ['Layer1', 'Layer2']}];
      const mapIndex = 2;

      expect(getMapLayersFromSplitMaps(splitMaps, mapIndex)).toBeUndefined();
    });

    test('returns undefined for empty splitMaps array', () => {
      expect(getMapLayersFromSplitMaps([], 0)).toBeUndefined();
    });

    test('returns undefined if layers property does not exist', () => {
      const splitMaps = [{}, {layers: ['Layer3', 'Layer4']}];
      const mapIndex = 0;

      expect(getMapLayersFromSplitMaps(splitMaps, mapIndex)).toBeUndefined();
    });
  });

  describe('getViewportFromMapState', () => {
    test('returns WebMercatorViewport when globe property is undefined', () => {
      const mapState = {};
      const result = getViewportFromMapState(mapState);

      expect(result).toBeInstanceOf(WebMercatorViewport);
    });

    test('should not throw an exception if latitude is -90', () => {
      const mapState = {
        ...INITIAL_MAP_STATE,
        latitude: -90
      };
      expect(() => getViewportFromMapState(mapState)).not.toThrow();
    });

    test('should not throw an exception if latitude is 90', () => {
      const mapState = {
        ...INITIAL_MAP_STATE,
        latitude: 90
      };
      expect(() => getViewportFromMapState(mapState)).not.toThrow();
    });
  });
});

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import geocoderService from '@mapbox/mapbox-sdk/services/geocoding';
import {injectIntl, IntlShape} from 'react-intl';
import {WebMercatorViewport} from 'viewport-mercator-project';
import {KeyEvent} from '@kepler.gl/constants';
import {Input} from '../common/styled-components';
import {Search, Delete} from '../common/icons';
import {Viewport} from '@kepler.gl/types';

type StyledContainerProps = {
  width?: number;
};

// matches only valid coordinates
const COORDINATE_REGEX_STRING =
  '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)';
const COORDINATE_REGEX = RegExp(COORDINATE_REGEX_STRING);

const PLACEHOLDER = 'Enter an address or coordinates, ex 37.79,-122.40';

let debounceTimeout: NodeJS.Timeout | null = null;

export const testForCoordinates = (query: string): [true, number, number] | [false, string] => {
  const isValid = COORDINATE_REGEX.test(query.trim());

  if (!isValid) {
    return [isValid, query];
  }

  const tokens = query.trim().split(',');

  return [isValid, Number(tokens[0]), Number(tokens[1])];
};

const StyledContainer = styled.div<StyledContainerProps>`
  position: relative;
  color: ${props => props.theme.textColor};

  .geocoder-input {
    box-shadow: ${props => props.theme.boxShadow};

    .geocoder-input__search {
      position: absolute;
      height: ${props => props.theme.geocoderInputHeight}px;
      width: 30px;
      padding-left: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme.subtextColor};
    }

    input {
      padding: 4px 36px;
      height: ${props => props.theme.geocoderInputHeight}px;
      caret-color: unset;
    }
  }

  .geocoder-results {
    box-shadow: ${props => props.theme.boxShadow};
    background-color: ${props => props.theme.panelBackground};
    position: absolute;
    width: ${props => (Number.isFinite(props.width) ? props.width : props.theme.geocoderWidth)}px;
    margin-top: ${props => props.theme.dropdownWapperMargin}px;
  }

  .geocoder-item {
    ${props => props.theme.dropdownListItem};
    ${props => props.theme.textTruncate};

    &.active {
      background-color: ${props => props.theme.dropdownListHighlightBg};
    }
  }

  .remove-result {
    position: absolute;
    right: 16px;
    top: 0px;
    height: ${props => props.theme.geocoderInputHeight}px;
    display: flex;
    align-items: center;

    :hover {
      cursor: pointer;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

export interface Result {
  center: [number, number];
  place_name: string;
  bbox?: [number, number, number, number];
  text?: string;
}

export type Results = ReadonlyArray<Result>;

type GeocoderProps = {
  mapboxApiAccessToken: string;
  className?: string;
  limit?: number;
  timeout?: number;
  formatItem?: (item: Result) => string;
  viewport?: Viewport;
  onSelected: (viewport: Viewport | null, item: Result) => void;
  onDeleteMarker?: () => void;
  transitionDuration?: number;
  pointZoom?: number;
  width?: number;
};

type IntlProps = {
  intl: IntlShape;
};

/** @type {import('./geocoder').GeocoderComponent} */
const GeoCoder: React.FC<GeocoderProps & IntlProps> = ({
  mapboxApiAccessToken,
  className = '',
  limit = 5,
  timeout = 300,
  formatItem = item => item.place_name,
  viewport,
  onSelected,
  onDeleteMarker,
  transitionDuration,
  pointZoom,
  width,
  intl
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  /** @type {import('./geocoder').Results} */
  const initialResults: Result[] = [];
  const [results, setResults] = useState(initialResults);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const client = useMemo(
    () => geocoderService({accessToken: mapboxApiAccessToken}),
    [mapboxApiAccessToken]
  );

  const onChange = useCallback(
    event => {
      const queryString = event.target.value;
      setInputValue(queryString);
      const resultCoordinates = testForCoordinates(queryString);
      if (resultCoordinates[0]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, latitude, longitude] = resultCoordinates;
        setResults([{center: [latitude, longitude], place_name: queryString}]);
      } else {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(async () => {
          if (limit > 0 && Boolean(queryString)) {
            try {
              const response = await client
                .forwardGeocode({
                  query: queryString,
                  limit
                })
                .send();
              if (response.body.features) {
                setShowResults(true);
                setResults(response.body.features);
              }
            } catch (e) {
              // TODO: show geocode error
              // eslint-disable-next-line no-console
              console.log(e);
            }
          }
        }, timeout);
      }
    },
    [client, limit, timeout, setResults, setShowResults]
  );

  const onBlur = useCallback(() => {
    setTimeout(() => {
      setShowResults(false);
    }, timeout);
  }, [setShowResults, timeout]);

  const onFocus = useCallback(() => setShowResults(true), [setShowResults]);

  const onItemSelected = useCallback(
    item => {
      const newViewport = new WebMercatorViewport(viewport);
      const {bbox, center} = item;

      const gotoViewport = bbox
        ? newViewport.fitBounds([
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
          ])
        : {
            longitude: center[0],
            latitude: center[1],
            zoom: pointZoom
          };

      const {longitude, latitude, zoom} = gotoViewport;

      onSelected({...viewport, ...{longitude, latitude, zoom, transitionDuration}}, item);

      setShowResults(false);
      setInputValue(formatItem(item));
      setShowDelete(true);
    },
    [viewport, onSelected, transitionDuration, pointZoom, formatItem]
  );

  const onMarkDeleted = useCallback(() => {
    setShowDelete(false);
    setInputValue('');
    onDeleteMarker?.();
  }, [onDeleteMarker]);

  const onKeyDown = useCallback(
    e => {
      if (!results || results.length === 0) {
        return;
      }
      switch (e.keyCode) {
        case KeyEvent.DOM_VK_UP:
          setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex);
          break;
        case KeyEvent.DOM_VK_DOWN:
          setSelectedIndex(selectedIndex < results.length - 1 ? selectedIndex + 1 : selectedIndex);
          break;
        case KeyEvent.DOM_VK_ENTER:
        case KeyEvent.DOM_VK_RETURN:
          if (results[selectedIndex]) {
            onItemSelected(results[selectedIndex]);
          }
          break;
        default:
          break;
      }
    },
    [results, selectedIndex, setSelectedIndex, onItemSelected]
  );

  return (
    <StyledContainer className={className} width={width}>
      <div className="geocoder-input">
        <div className="geocoder-input__search">
          <Search height="20px" />
        </div>
        <Input
          type="text"
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          value={inputValue}
          placeholder={
            intl
              ? intl.formatMessage({id: 'geocoder.title', defaultMessage: PLACEHOLDER})
              : PLACEHOLDER
          }
        />
        {showDelete ? (
          <div className="remove-result">
            <Delete height="12px" onClick={onMarkDeleted} />
          </div>
        ) : null}
      </div>

      {showResults ? (
        <div className="geocoder-results">
          {results.map((item, index) => (
            <div
              key={index}
              className={classnames('geocoder-item', {active: selectedIndex === index})}
              onClick={() => onItemSelected(item)}
            >
              {formatItem(item)}
            </div>
          ))}
        </div>
      ) : null}
    </StyledContainer>
  );
};

export default injectIntl(GeoCoder);

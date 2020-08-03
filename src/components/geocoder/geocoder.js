import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import MapboxClient from 'mapbox';
import {injectIntl} from 'react-intl';
import {WebMercatorViewport} from 'viewport-mercator-project';
import KeyEvent from 'constants/keyevent';
import {Input} from 'components/common/styled-components';
import {Search, Delete} from 'components/common/icons';

let debounceTimeout = null;

const StyledContainer = styled.div`
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

const PLACEHOLDER = 'Enter an Address';

const GeoCoder = ({
  mapboxApiAccessToken,
  className = '',
  initialInputValue = '',
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
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [showResults, setShowResults] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const client = useMemo(() => new MapboxClient(mapboxApiAccessToken), [mapboxApiAccessToken]);

  const onChange = useCallback(
    event => {
      const queryString = event.target.value;
      setInputValue(queryString);
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        if (limit > 0 && !!queryString) {
          const response = await client.geocodeForward(queryString, {limit});
          setShowResults(true);
          setResults(response.entity.features);
        }
      }, timeout);
    },
    [client, results, setResults, setShowResults]
  );

  const onBlur = useCallback(() => {
    setTimeout(() => {
      setShowResults(false);
    }, timeout);
  }, [setShowResults]);

  const onFocus = useCallback(() => setShowResults(true), [setShowResults]);

  const onItemSelected = useCallback(
    item => {
      let newViewport = new WebMercatorViewport(viewport);
      const {bbox, center} = item;

      newViewport = bbox
        ? newViewport.fitBounds([
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
          ])
        : {
            longitude: center[0],
            latitude: center[1],
            zoom: pointZoom
          };

      const {longitude, latitude, zoom} = newViewport;

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
    onDeleteMarker();
  }, [onDeleteMarker]);

  const onKeyDown = useCallback(
    e => {
      switch (e.keyCode) {
        case KeyEvent.DOM_VK_UP:
          setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex);
          break;
        case KeyEvent.DOM_VK_DOWN:
          setSelectedIndex(selectedIndex < results.length - 1 ? selectedIndex + 1 : selectedIndex);
          break;
        case KeyEvent.DOM_VK_ENTER:
        case KeyEvent.DOM_VK_RETURN:
          onItemSelected(results[selectedIndex]);
          break;
        default:
          break;
      }
    },
    [results, selectedIndex, setSelectedIndex]
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

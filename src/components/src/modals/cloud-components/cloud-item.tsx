// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import moment from 'moment/moment';
import React from 'react';
import styled from 'styled-components';
import {Base} from '../../common/icons';

const MapIcon = props => {
  return (
    <div {...props}>
      {props.children}
      <Base height="32px" viewBox={'0 0 16 16'}>
        <path
          fill="#d3d8d6"
          d="m13.6 11.572-3.2 2.1336v-9.2776l3.2-2.1336zm-12-7.144 3.2-2.1336v9.2776l-3.2 2.1336zm13.244 8.2376c0.2224-0.148 0.356-0.3984 0.356-0.6656v-11.2c0-0.2952-0.1624-0.5664-0.4224-0.7048-0.26-0.14-0.576-0.1248-0.8216 0.0392l-4.3128 2.876-3.5432-2.8352c-0.1208-0.0936-0.2952-0.1624-0.472-0.1688-0.1648-0.0064-0.348 0.0464-0.472 0.128l-4.8 3.2c-0.2224 0.1488-0.356 0.3984-0.356 0.6656v11.2c0 0.2952 0.1624 0.5664 0.4224 0.7056 0.1184 0.0632 0.248 0.0944 0.3776 0.0944 0.1552 0 0.3096-0.0448 0.444-0.1344l4.3128-2.876 3.5432 2.8352c0.1448 0.116 0.3216 0.1752 0.5 0.1752 0.1184 0 0.236-0.0248 0.3464-0.0784z"
        />
      </Base>
    </div>
  );
};

const PrivacyBadge = ({privateMap}) => (
  <span className="vis_item-privacy">{privateMap ? 'Private' : 'Public'}</span>
);

const StyledVisualizationItem = styled.div`
  flex: 0 0 auto;
  width: 208px;
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  color: #3a414c;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid transparent;

  &:hover {
    .vis_item-icon,
    .vis_item-thumb,
    .vis_item-description,
    .vis_item-modification-date {
      opacity: 1;
    }
    border: 1px solid #bbbbbb;
  }

  .vis_item-icon,
  .vis_item-thumb,
  .vis_item-description,
  .vis_item-modification-date {
    opacity: 0.9;
    transition: opacity 0.4s ease;
  }

  .vis_item-icon {
    position: relative;
    flex: 0 0 108px;
    background-color: #6a7484;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .vis_item-thumb {
    position: relative;
    flex: 0 0 108px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
  }

  .vis_item-privacy {
    position: absolute;
    top: 0;
    left: 0;
    padding: 3px 6px;
    border-radius: 4px 0;
    background-color: rgba(58, 65, 76, 0.7);
    color: #fff;
    font-size: 11px;
    line-height: 18px;
  }

  .vis_item-title {
    margin-top: 16px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vis_item-description {
    flex: 1 1 auto;
    margin-top: 8px;
  }

  .vis_item-modification-date {
    margin-top: 16px;
    flex: 1 0 auto;
    color: #6a7484;
    line-height: 15px;
  }
`;

export const CloudItem = ({vis, onClick}) => {
  const thumbnailStyle = {backgroundImage: `url(${vis.thumbnail})`};
  return (
    <StyledVisualizationItem onClick={onClick}>
      {vis.thumbnail ? (
        <div role="thumbnail-wrapper" className="vis_item-thumb" style={thumbnailStyle}>
          {Object.prototype.hasOwnProperty.call(vis, 'privateMap') ? (
            <PrivacyBadge privateMap={vis.privateMap} />
          ) : null}
        </div>
      ) : (
        <MapIcon role="map-icon" className="vis_item-icon">
          {Object.prototype.hasOwnProperty.call(vis, 'privateMap') ? (
            <PrivacyBadge privateMap={vis.privateMap} />
          ) : null}
        </MapIcon>
      )}
      <span className="vis_item-title">{vis.title}</span>
      {vis.description?.length && <span className="vis_item-description">{vis.description}</span>}
      <span className="vis_item-modification-date">
        Last modified {moment.utc(vis.updatedAt).fromNow()}
      </span>
    </StyledVisualizationItem>
  );
};

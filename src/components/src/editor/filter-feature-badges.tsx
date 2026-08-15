// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {Filter, Feature} from '@kepler.gl/types';
import {getFilterFeatureAnchor} from '@kepler.gl/utils';

import {FilterFunnel} from '../common/icons';
import {MapViewport, isPointVisibleOnGlobe} from '../annotations/annotation-utils';

const BADGE_SIZE = 22;
const BADGE_OFFSET_X = 6;
const BADGE_OFFSET_Y = -BADGE_SIZE - 2;
// Same blue as the editor polygon outline ([0x26, 0xb5, 0xf2]).
const EDITOR_OUTLINE_COLOR = '#26b5f2';

const BadgeLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const FilterBadge = styled.button`
  position: absolute;
  width: ${BADGE_SIZE}px;
  height: ${BADGE_SIZE}px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${EDITOR_OUTLINE_COLOR};
  background-color: ${props => props.theme.panelBackground};
  color: ${EDITOR_OUTLINE_COLOR};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  svg {
    color: ${EDITOR_OUTLINE_COLOR};
    stroke: ${EDITOR_OUTLINE_COLOR};
  }
  pointer-events: auto;
  cursor: pointer;
`;

export type FilterFeatureBadgesProps = {
  filters: Filter[];
  viewport?: MapViewport | null;
  isGlobeEnabled?: boolean;
  onSelect?: (feature: Feature) => void;
};

function FilterFeatureBadges({
  filters,
  viewport,
  isGlobeEnabled,
  onSelect
}: FilterFeatureBadgesProps) {
  const intl = useIntl();
  const badges = useMemo(() => {
    if (!viewport?.project) {
      return [];
    }
    return filters.reduce<
      {id: string; x: number; y: number; feature: Feature}[]
    >((acc, filter) => {
      const feature = filter?.value as Feature | undefined;
      if (!feature) {
        return acc;
      }
      const anchor = getFilterFeatureAnchor(feature);
      if (!anchor) {
        return acc;
      }
      if (isGlobeEnabled && !isPointVisibleOnGlobe(anchor, viewport)) {
        return acc;
      }
      const projected = viewport.project(anchor);
      if (
        !projected ||
        !Number.isFinite(projected[0]) ||
        !Number.isFinite(projected[1])
      ) {
        return acc;
      }
      acc.push({
        id: String(feature.id || filter.id),
        x: projected[0] + BADGE_OFFSET_X,
        y: projected[1] + BADGE_OFFSET_Y,
        feature
      });
      return acc;
    }, []);
  }, [filters, viewport, isGlobeEnabled]);

  if (!badges.length) {
    return null;
  }

  return (
    <BadgeLayer className="editor-filter-badges">
      {badges.map(badge => (
        <FilterBadge
          key={badge.id}
          type="button"
          title={intl.formatMessage({
            id: 'editor.polygonFilter',
            defaultMessage: 'Polygon filter'
          })}
          aria-label={intl.formatMessage({
            id: 'editor.polygonFilter',
            defaultMessage: 'Polygon filter'
          })}
          style={{left: badge.x, top: badge.y}}
          onClick={event => {
            event.stopPropagation();
            onSelect?.(badge.feature);
          }}
        >
          <FilterFunnel height="12px" />
        </FilterBadge>
      ))}
    </BadgeLayer>
  );
}

export default React.memo(FilterFeatureBadges);

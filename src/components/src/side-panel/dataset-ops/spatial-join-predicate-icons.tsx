// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType} from 'react';
import Base, {BaseProps} from '../../common/icons/base';
import {SpatialJoinPredicate} from '@kepler.gl/table';

const SECONDARY = '#F7F8FA';

function PredicateIcon({
  className,
  children,
  ...props
}: Partial<BaseProps> & {className: string; children: React.ReactNode}) {
  return (
    <Base viewBox="0 0 42 42" height="16px" predefinedClassName={className} {...props}>
      {children}
    </Base>
  );
}

export const PredicateIntersectsIcon: ComponentType<Partial<BaseProps>> = props => (
  <PredicateIcon className="dataset-ops-predicate-intersects" {...props}>
    <path d="M24 6L36 13V27L24 34L12 27V13Z" fill="currentColor" opacity="0.9" />
    <path d="M18 12L30 19V31L18 38L6 31V19Z" fill={SECONDARY} opacity="0.92" />
  </PredicateIcon>
);

export const PredicateEqualsIcon: ComponentType<Partial<BaseProps>> = props => (
  <PredicateIcon className="dataset-ops-predicate-equals" {...props}>
    <path d="M21 7L33 14V28L21 35L9 28V14Z" fill="currentColor" opacity="0.9" />
    <path d="M21 11L29 16V26L21 31L13 26V16Z" fill={SECONDARY} />
  </PredicateIcon>
);

export const PredicateCrossesIcon: ComponentType<Partial<BaseProps>> = props => (
  <PredicateIcon className="dataset-ops-predicate-crosses" {...props}>
    <path d="M21 6L34 14V28L21 36L8 28V14Z" fill="currentColor" opacity="0.9" />
    <path d="M8 30L34 12" stroke={SECONDARY} strokeWidth="3" strokeLinecap="round" fill="none" />
  </PredicateIcon>
);

export const PredicateOverlapsIcon: ComponentType<Partial<BaseProps>> = props => (
  <PredicateIcon className="dataset-ops-predicate-overlaps" {...props}>
    <path d="M16 8L28 15V27L16 34L4 27V15Z" fill="currentColor" opacity="0.9" />
    <path d="M26 8L38 15V27L26 34L14 27V15Z" fill={SECONDARY} opacity="0.92" />
  </PredicateIcon>
);

export const PredicateWithinIcon: ComponentType<Partial<BaseProps>> = props => (
  <PredicateIcon className="dataset-ops-predicate-within" {...props}>
    <path d="M21 4L35 12V28L21 36L7 28V12Z" fill={SECONDARY} opacity="0.92" />
    <path d="M21 14L28 18V26L21 30L14 26V18Z" fill="currentColor" />
  </PredicateIcon>
);

export const PredicateTouchesIcon: ComponentType<Partial<BaseProps>> = props => (
  <PredicateIcon className="dataset-ops-predicate-touches" {...props}>
    <path d="M14 8L24 14V26L14 32L4 26V14Z" fill="currentColor" opacity="0.9" />
    <path d="M28 10L38 16V28L28 34L18 28V16Z" fill={SECONDARY} opacity="0.92" />
  </PredicateIcon>
);

export const SPATIAL_JOIN_PREDICATE_ICONS: Record<
  SpatialJoinPredicate,
  ComponentType<Partial<BaseProps>>
> = {
  intersects: PredicateIntersectsIcon,
  equals: PredicateEqualsIcon,
  crosses: PredicateCrossesIcon,
  overlaps: PredicateOverlapsIcon,
  within: PredicateWithinIcon,
  touches: PredicateTouchesIcon
};

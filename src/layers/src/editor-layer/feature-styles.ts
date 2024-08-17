// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {RGBAColor} from '@deck.gl/core';
import {Feature} from '@kepler.gl/types';

import {COLORS} from './constants';

const POINT_RADIUS = 5;
const STROKE_WIDTH_SELECTED = 2.5;
const STROKE_WIDTH_NOT_SELECTED = 2;

const STROKE_SOLID_ARRAY = [0, 0];
const STROKE_DASH_ARRAY = [4, 3];

const ALPHA_0 = 0x00;
const ALPHA_005 = 0x0d;
const ALPHA_01 = 0x1a;
const ALPHA_05 = 0x80;
const ALPHA_1 = 0xff;

const PRIMARY_COLOR_TRANSPARENT: RGBAColor = [...COLORS.PRIMARY, ALPHA_01];
const PRIMARY_COLOR: RGBAColor = [...COLORS.PRIMARY, ALPHA_1];
const SECONDARY_COLOR_TRANSPARENT: RGBAColor = [...COLORS.SECONDARY, ALPHA_0];
const TENTATIVE_FEATURE_COLOR: RGBAColor = [...COLORS.SECONDARY, ALPHA_1];
const TENTATIVE_FEATURE_COLOR_TRANSPARENT: RGBAColor = [...COLORS.SECONDARY, ALPHA_005];

export const EDIT_HANDLE_STYLE = {
  getRadius: POINT_RADIUS,
  getFillColor: SECONDARY_COLOR_TRANSPARENT,
  getOutlineColor: handle =>
    handle?.properties?.featureIndex < 0 ? TENTATIVE_FEATURE_COLOR : PRIMARY_COLOR,
  highlightMultiplier: [...COLORS.HIGHLIGHT, ALPHA_05],
  highlightMultiplierNone: SECONDARY_COLOR_TRANSPARENT
};

export const FEATURE_STYLE = {
  getColor: (feature: Feature, isSelected: boolean) =>
    isSelected ? PRIMARY_COLOR_TRANSPARENT : SECONDARY_COLOR_TRANSPARENT,
  highlightMultiplier: [...COLORS.HIGHLIGHT, ALPHA_01],
  highlightMultiplierNone: SECONDARY_COLOR_TRANSPARENT
};

export const LINE_STYLE = {
  getColor: (_feature: Feature, isSelected: boolean): RGBAColor =>
    isSelected ? PRIMARY_COLOR : PRIMARY_COLOR,
  getWidth: (_feature: Feature, isSelected: boolean): number =>
    isSelected ? STROKE_WIDTH_SELECTED : STROKE_WIDTH_NOT_SELECTED,
  getTentativeLineColor: (): RGBAColor => TENTATIVE_FEATURE_COLOR,
  getTentativeLineWidth: (): number => STROKE_WIDTH_NOT_SELECTED,
  getTentativeFillColor: TENTATIVE_FEATURE_COLOR_TRANSPARENT,
  dashArray: STROKE_DASH_ARRAY,
  solidArray: STROKE_SOLID_ARRAY,
  highlightMultiplier: [...COLORS.HIGHLIGHT, ALPHA_1]
};

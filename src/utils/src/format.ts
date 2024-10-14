// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {TOOLTIP_KEY} from '@kepler.gl/constants';
import {TimeLabelFormat} from '@kepler.gl/types';

export const getFormatValue = (fmt: TimeLabelFormat): string | null => fmt[TOOLTIP_KEY];

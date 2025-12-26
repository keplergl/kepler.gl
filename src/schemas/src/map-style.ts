// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

export const MapStyleSchema = z.unknown();
export type MapStyleSchema = z.infer<typeof MapStyleSchema>;

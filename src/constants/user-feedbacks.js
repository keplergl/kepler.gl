// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export const MISSING_MAPBOX_TOKEN =
  'Mapbox Token not valid. ' +
  '[Click here](https://github.com/keplergl/kepler.gl#mapboxapiaccesstoken-string-required)';

export const IMAGE_EXPORT_ERRORS = {
  dataUri: `[kepler.gl] Failed to create image from data uri.
  Copy the uri in the javascript console when reporting this bug.
  The uri is the string starts with "data:image/png"`,
  styleSheet: `[kepler.gl] Failed to fetch stylesheet when exporting image.
    This probably will not affect the map. It might affect the legend.
    The stylesheet failed to load is: `
};

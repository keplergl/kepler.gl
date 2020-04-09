// Copyright (c) 2020 Uber Technologies, Inc.
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

import {_BinSorter as BinSorter} from '@deck.gl/aggregation-layers';

export default class EnhancedBinSorter extends BinSorter {
  getValueRange(percentileRange) {
    if (!this.sortedBins) {
      this.sortedBins = this.aggregatedBins.sort((a, b) =>
        a.value > b.value ? 1 : a.value < b.value ? -1 : 0
      );
    }
    if (!this.sortedBins.length) {
      return [];
    }
    let lowerIdx = 0;
    let upperIdx = this.sortedBins.length - 1;

    if (Array.isArray(percentileRange)) {
      const idxRange = this._percentileToIndex(percentileRange);
      lowerIdx = idxRange[0];
      upperIdx = idxRange[1];
    }

    return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
  }

  getValueDomainByScale(scale, [lower = 0, upper = 100] = []) {
    if (!this.sortedBins) {
      this.sortedBins = this.aggregatedBins.sort((a, b) =>
        a.value > b.value ? 1 : a.value < b.value ? -1 : 0
      );
    }
    if (!this.sortedBins.length) {
      return [];
    }
    const indexEdge = this._percentileToIndex([lower, upper]);

    return this._getScaleDomain(scale, indexEdge);
  }
}

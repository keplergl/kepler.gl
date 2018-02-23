// Copyright (c) 2018 Uber Technologies, Inc.
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

/*eslint-disable */
import './utils/data-utils-test';
import './utils/data-processor-test';
import './utils/filter-utils-test';
import './utils/layer-utils-test';
import './utils/data-scale-utils-test';
import './utils/interaction-utils-test';

// test reducer
import './reducers/map-state-test';
import './reducers/vis-state-test';
import './reducers/ui-state-test';

// test schemas
import './schemas/vis-state-schema-test';
import './schemas/map-state-schema-test';
import './schemas/map-style-schema-test';
import './schemas/dataset-schema-test';
import './schemas/schema-conversion-test';

// test mergers
import './reducers/vis-state-merger-test';

// test layers
import './layer-tests/index';

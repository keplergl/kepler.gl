// Copyright (c) 2019 Uber Technologies, Inc.
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

const demos = [
  {
    id: 'seattle_coll_animation',
    name: 'Seattle Collisions animation',
    username: 'cartovl',
    dataset: 'seattle_collisions',
    viz: `strokeWidth: 0
color: ramp($addrtype, Bold)
filter: animation($incdate, 30, fade(1, 1))
`,
    mapState: {
      longitude: -122.39,
      latitude: 47.59,
      zoom: 10
    }
  },
  {
    id: 'cordoba_cadastral_animation',
    name: 'Cordoba cadastral data animation',
    username: 'cartovl',
    dataset: 'cordoba_catastro',
    sql: 'select * from cordoba_catastro where year > 1900',
    viz: `strokeWidth: 0
color: ramp($year, purpor)
filter: animation($year, 20, fade(0.1, hold))
`,
    mapState: {
      latitude: 37.87,
      longitude: -4.79,
      zoom: 11
    }
  },
  {
    id: 'denver_accidents',
    name: 'Denver accidents',
    username: 'cartovl',
    dataset: 'traffic_accidents',
    viz: `width: $count/2
color: opacity(ramp(linear($count, 0,120), RedOr), $count/20)
strokeWidth: 0
`,
    mapState: {
      latitude: 39.74961937824622,
      longitude: -104.96505621566746,
      zoom: 11
    }
  }
];

export default demos;

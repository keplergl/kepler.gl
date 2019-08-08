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
    id: 'basic_style_props',
    name: 'Basic styling properties',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `width: 3
color: hsv(0.7, 0.7, 1)
strokeColor: rgba(255, 255, 255, 0.5)
strokeWidth: 0.5
`,
    mapState: {
      longitude: -122.425611, 
      latitude: 37.756926,
      zoom: 11
    }
  },
  {
    id: 'expressions',
    name: 'Style with expressions',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `width: sqrt(10) * 0.5
color: #FF0000 + rgb(0, 0, 255)
strokeColor: opacity(#000,0.5)
strokeWidth: 0.5 + 0.2
`,
    mapState: {
      longitude: -122.425611, 
      latitude: 37.756926,
      zoom: 11
    }
  },
  {
    id: 'ramps_and_variables',
    name: 'Ramps and variables',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `@day: ramp($incident_day_of_week,bold)

width: 3
color: @day
strokeColor: @day
strokeWidth: 0.5
`,
    mapState: {
      longitude: -122.425611, 
      latitude: 37.756926,
      zoom: 11
    }
  },
  {
    id: 'color_buckets',
    name: 'Assign categories to colors',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `@buckets: ramp(buckets($incident_day_of_week,["Monday","Tuesday","Wednesday"]),[cyan,deeppink,yellow])

width: 3
color: @buckets
strokeWidth: 0
`,
    mapState: {
      longitude: -122.425611, 
      latitude: 37.756926,
      zoom: 11
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

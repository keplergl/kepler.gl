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
    viz: `width: 2.5
color: hsv(0.7, 0.7, 1)
strokeColor: rgba(255, 255, 255, 0.5)
strokeWidth: 0.5
`,
    mapState: {
      longitude: -122.448183, 
      latitude: 37.750759,
      zoom: 11.5
    }
  },
  {
    id: 'ramps_variables_filter',
    name: 'Ramps, filters and variables',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `@dist: ramp($police_district,bold)

width: 2.5
color: @dist
strokeColor: transparent
filter:
$incident_category in ["Larceny Theft","Motor Vehicle Theft"] and $resolution == "Open or Active"
`,
    mapState: {
      longitude: -122.448183, 
      latitude: 37.750759,
      zoom: 11.5
    }
  },
  {
    id: 'color_top_categories',
    name: 'Color top categories',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `@cat: ramp(top($police_district,3),[cyan,deeppink,yellow])

width: 2.5
color: @cat
strokeColor: transparent
filter: 
$incident_category in ["Larceny Theft","Motor Vehicle Theft"] and $resolution == "Open or Active"
`,
    mapState: {
      longitude: -122.448183, 
      latitude: 37.750759,
      zoom: 11.5
    }
  },
  {
    id: 'summarize_cluster_buckets',
    name: 'Clusters and buckets',
    username: 'cartovl',
    dataset: 'sf_crime_2019',
    viz: `@days: ["Friday","Saturday","Sunday"]
@color: [cyan,deeppink,yellow]
    
width: sqrt(clusterCount())
color: ramp(buckets(clusterMODE($incident_day_of_week),@days),@color)
strokeWidth: 0
resolution: 32
`,
    mapState: {
      longitude: -122.448183, 
      latitude: 37.750759,
      zoom: 12
    }
  },
  {
    id: 'viewport_style',
    name: 'Viewport based styles',
    username: 'cartovl',
    dataset: 'seattle_collisions',
    viz: `@viewport: viewportEqIntervals($personcount,7)

width: ramp(@viewport,[2,28])
color: ramp(@viewport,reverse(bluyl))
strokeWidth: 0
order: desc(width())
`,
    mapState: {
      longitude: -122.348270,
      latitude: 47.622349,
      zoom: 11
    }
  },
  {
    id: 'interpolation_zoom',
    name: 'Interpolation and zoom range',
    username: 'cartovl',
    dataset: 'seattle_collisions',
    viz: `@count: $personcount
    
width: ramp(zoomrange([10,12,16]),[1,@count,@count*2])
color: ramp(zoomrange([10,12]),[#5c53a5,ramp(@count,reverse(sunset))])
strokeColor: transparent
order: desc(width())
`,
    mapState: {
      longitude: -122.314732, 
      latitude: 47.622154,
      zoom: 10
    }
  },
  {
    id: 'stdev_classification',
    name: 'Classification - Standard Deviation',
    username: 'cartovl',
    dataset: 'county_demog',
    viz: `@income: globalStandardDev($median_income,5)
@color: geyser

color: opacity(ramp(@income,@color),0.9)
strokeColor: ramp(@income,@color)
strokeWidth: 1
`,
    mapState: {
      longitude: -103.456792,   
      latitude: 38.012550,
      zoom: 4
    }
  },
  {
    id: 'manual_classification',
    name: 'Classification - Manual',
    username: 'cartovl',
    dataset: 'county_demog',
    viz: `@edu: buckets($higher_ed,[30,40,50,60,70])
@color: reverse(purpor)
    
color: opacity(ramp(@edu,@color),0.9)
strokeColor: ramp(@edu,@color)
strokeWidth: 1
`,
    mapState: {
      longitude: -103.456792,   
      latitude: 38.012550,
      zoom: 4
    }
  },
  {
    id: 'linear_scale',
    name: 'Linear Scale',
    username: 'cartovl',
    dataset: 'mnmappluto',
    viz: `color: ramp(linear($numfloors),ag_grnyl)
strokeWidth: 0
filter: between($numfloors, 10, 120)
`,
    mapState: {
      longitude: -73.978442,   
      latitude: 40.739533,
      zoom: 11.5
    }
  },
  {
    id: 'logarithmic_scale',
    name: 'Logarithmic Scale',
    username: 'cartovl',
    dataset: 'mnmappluto',
    viz: `color: ramp(linear(log($numfloors), 2, 4), ag_grnyl)
strokeWidth: 0
filter: between($numfloors, 10, 120)
`,
    mapState: {
      longitude: -73.978442,   
      latitude: 40.739533,
      zoom: 11.5
    }
  },
  {
    id: 'color_normalize',
    name: 'Data driven color expression',
    username: 'cartovl',
    dataset: 'county_demog',
    viz: `color: 
rgb(255,0,255)*($black_pop)/($total_pop) + 
limegreen*($hispanic_pop)/($total_pop)

strokeColor: opacity(black,0.2)
strokeWidth: 0.5
`,
    mapState: {
      longitude: -103.456792,   
      latitude: 38.012550,
      zoom: 4
    }
  },
  {
    id: 'data_normalize',
    name: 'Data driven normalization',
    username: 'cartovl',
    dataset: 'county_demog',
    viz: `@style: ramp($white_pop/$total_pop,ag_sunset)

color: opacity(@style,0.9)
strokeColor: @style
strokeWidth: 1
`,
    mapState: {
      longitude: -103.456792,   
      latitude: 38.012550,
      zoom: 4
    }
  },
  {
    id: 'alpha_normalize',
    name: 'Data driven opacity expression',
    username: 'cartovl',
    dataset: 'table_30',
    viz: `@style: opacity(ramp(linear($sum_qpf,1,120),temps),($e_totpop/$area_sqmi)/300)

color: @style
strokeColor: @style
`,
    mapState: {
      longitude: -95.944719,    
      latitude: 30.211882,
      zoom: 6
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

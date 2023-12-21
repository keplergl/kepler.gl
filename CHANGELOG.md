# Change Log

All notable changes to kepler.gl will be documented in this file.

<!--
Each version should:
  List its release date in the above format.
  Group changes to describe their impact on the project, as follows:
  Added for new features.
  Changed for changes in existing functionality.
  Deprecated for once-stable features removed in upcoming releases.
  Removed for deprecated features removed in this release.
  Fixed for any bug fixes.
  Security to invite users to upgrade in case of vulnerabilities.
Ref: http://keepachangelog.com/en/0.3.0/
-->

## [3.0.0] - December 21 2023

- 21a445fd [chore] update readme, fix examples, show effects button (#2492)
- de8cb971 [Fix] GeoArrow demo not working (#2491)

## [3.0.0-alpha.2] - December 17 2023

- 5264c5f5 [fix] add thumbnails (#2486)
- 34bb812e [chore] Update all licenses to OpenJS recommendation (#2471)
- df87781a [Feat] add polygon filter based on mean centers for GeoJsonLayer (#2476)
- 50924867 [chore] Add file license header script (#2472)
- f33b09f8 [Demo] Add GeoArrow sample dataset (#2483)
- 09aee384 [feat] MapLibre basemap (#2461)
- 1544e202 [Fix] basemap frozen when incrementally loading GeoArrow (#2474)
- b290d871 [chore] pin luma.gl version to 8.5.21, to avoid mismatch (#2463)
- 955633df [chore] bump loaders (#2480)
- b481611c [fix] fix map import (#2479)
- 2024a6d8 [Feat] GeoArrow incremental rendering (1) (#2459)
- aa1c7d10 [chore] fix typo in landing page (#2402)
- 155a5825 [fix] Fix cloud tile fetching logic (#2456)
- 5eb62a9b [fix] Fixed website configuration to correctly import local kepler files (#2454)
- 39494866 [fix] update min value for hexagonal pixelate effect (#2453)
- 8e7b0ad1 [fix] Effects: fix possible 'undefined' in effect parameters (#2452)
- 84053786 [chore] Validate parameters for effects (#2450)
- d60ef31d [feat] Introduce Foursquare cloud provider (#2437)
- 82d616e4 [fix] ScenegraphLayer has broken lighting and textures (#2443)
- 110c2991 [chore] bump deck.gl, luma.gl, loaders.gl (#2442)
- f70b20ea [fix] effects: prevent time reset with invalid valese (#2441)
- 3ca8df02 [chore] Add effect MapControl test (#2440)
- 68bff82a [fix] effect-related UI fixes (#2439)
- 82fc69e2 [chore] Refactored cloud provider flow for performance and multi provider support (#2436)
- d975ea1e [Feat] support GeoArrow format (#2385)
- ee6f0754 [feat] Effect manager - UI improvements (timezone, time slider, time dropdown) (#2433)
- b5a6e9ce [chore] Making EffectPanelHeader actions configurable (#2432)
- 1ae4cd02 [feat] UI updates for effects (#2428)
- a69b0878 [chore] Effects - config refactoring (#2422)
- bfec82e5 [chore] Bump to loaders.gl@4.0.0 (#2424)
- e6e5a4c9 [Chore] export LayerBlendingSelector (#2419)
- a1878138 [chore] SplitMap type changes (#2418)
- 5e0ad511 [fix] Legend is rendered outside of widget (#2417)
- 473bd801 [fix] feature menu not working in shadow DOM (#2416)
- b995c9b5 [fix] Hexbin layer color aggregation incorrect on load (#2415)
- 58f0bb71 [Chore] merge other properties in splitMap merger (#2413)
- bcb8c4e8 [fix] long name in filter panel header (#2412)
- b8fa6ce1 [chore] Remove paths from tsconfig (#2414)
- 79002ea6 [feat] Support customized ref in useDimensions (#2409)
- 4d723317 [feat] Update Icon Layer to allow passing in svg icons as a prop to bypass remote resource fetching (#2410)
- 2ff3738f [fix] Viewports not always locked (#2408)
- 975a4762 [fix] Using resolution-corrected mapState for image export (#2407)
- 7fae622e [chore] adds additional properties to mock basemaps (#2411)
- df1397fd [fix] handle empty properties in GeoJson file (#2381)
- c8e2a9f1 [chore] move dev env to Node.js 18 (#2399)
- bb559750 [fix] long names in tooltips (#2405)
- c9c34c86 [chore] add custom classes to dropdown (#2404)
- 22dd6236 [chore] Remove unused deps (#2403)
- a36ec68b [fix] effect related fixes (split maps, shadows, timeline) (#2396)
- 5e7dd9b5 [fix] Upgrade Mapbox SDK (#2397)
- b54c1739 [chore] Upgrade to loaders.gl@4.0 (#2394)
- e47ccc07 [fix] Re-enabled plugin section in home page (#2400)
- 81a6e1fa [fix] Update layer domain in addLayer (#2393)
- bed4b7f8 [chore] Removed abs paths in mock state and layer utils (#2392)
- f1e654d8 [fix] place null values at the end when sorting table (#2391)
- 4f51abc3 [chore] extra typing for effects (#2390)
- 459ae555 [chore] fix lint in cmpEffects (#2389)
- 87df1197 [feat] Effects: shadow color picker; use animation & current time (#2387)
- dde3a6e3 [chore] Fix ColorMap type (#2388)
- 08492a8a [chore] Export effects types/utils and incapsulate dnd logic into new hooks (#2384)
- 2500a277 [feat] reorder tooltips (#2378)
- fdecb052 [fix] minor effect-related fixes (#2380)
- 5c16027d [chore] Drag&Drop context: extra check for the object type (#2379)
- a958586d [fix] fix for process is undefined (#2376)
- 9eb6b328 [chore] bump examples (#2375)

## [3.0.0-alpha.1] - October 17 2023

- a3521948 [feat] introduction of deck.gl effects (#2372)
- c798961d [feat] Introduced dnd-context factory to better override dnd properties (#2364)
- 673646ac [fix] fix map dropbox share (#2370)
- ec0881d7 [fix] Fix react-map-gl mapbox api props (#2362)
- d0a86587 [chore] Avoid confusion in viewstate context (#2361)
- 1fcdfde9 [fix] fix image export (#2368)
- 89043bd0 [fix] Fixed load remote map dialog exception (#2367)
- 7f9f211b [fix] Improved validation of field pairs suggestions for LayerColumnConfig (#2359)
- fa1edab9 [fix] add autoCreateTooltips as a prop in AddDataToMapOptions (#2358)
- e8220b0e [chore] pass custom classes to ListHeader (#2357)
- 5a9fa5bd [fix] Stronger AnimationConfig types (#2356)
- a2fd52ca [fix] Fix mapbox/deck syncing issue (#2355)
- cfee75a2 [fix] Text labels: can't set prop to false/0 with multiple labels (#2354)
- 357f77a8 [fix] text outlines are barely visible after upgrade to deck 8.9 (#2353)
- 9d99f0b6 [chore] Upgrade deck.gl to 8.9 (#2352)
- 032ad763 [fix] Layer column config: sometimes a suggested field pair will hard crash (#2351)
- 56afb092 [fix] remove <img> from field name when show in tooltip (#2350)
- a9181f69 [feat] Table widged: pass getRowCell as prop (#2349)
- 1f169df1 [fix] Improve data table horizontal overflow and dataset tabs overflow (#2348)
- f2559445 [chore] Bump react-virtualized (#2347)
- ced842ea [chore] Update public CDN URL (#2346)
- 6ef400d2 [Fix] Dispatch click event instead of click() (#2345)
- cf9cf21a [fix] Add guard for null legend label (#2344)
- b5405f52 [fix] serializeLayer fixes (#2343)
- 4383bffd [feat] Text layer: add outline width, outline color, background color (#2342)
- a59d8342 [Fix] Resize observer crashes when passed a non-Element target (#2340)
- ec35ea97 [feat] introduced jest to replace tape/sinon/enzyme for browser tests; upgrade typescript to 4.5.5 (#2339)
- 85fa66f3 [feat] Adding applyLayerConfig action (#2337)
- ae26de55 [fix] Fix website kepler.gl example (#2338)
- d14e7ff4 [chore] Updated more deps to be compatible with react 18 (#2335)
- 70128119 [chore] updated modal and panel title types to react 18 (#2334)
- a0e5db72 [chore] Upgrade to react 18 (#2323)
- 52c69c54 [feat] Add Deck onAfterRender callback prop support (#2332)
- 0b8ae8bc [feat] deck.gl render callbacks (#2330)
- 6596187b [fix] Remove fixed height for list item (#2331)
- bcd3ff1b [fix] dropdown in color scale does not work (#2324)
- 203829aa [fix] dropdown list alignment and spacing (#2325)
- ba6259d3 [Fix] polygon context menu is offscreen (#2326)
- 6fd7f7a9 [fix] When editing a custom basemap style do not unintentionally drop extra properties (#2327)
- b3472a37 [chore] Upgrade deck to 8.8.27, loaders to 3.4.14 (#2320)
- d9c164bb [Feat] Support WKB geometry column in CSV (#2312)
- cfada4d5 [Chore] delete typeahead mousedown listener, pass onOptionSelected to ListItem (#2319)
- 2714c755 [fix] fix horizontal "over scrolling" and misalignment of header row vs. data cells (#2318)
- d28674ea [feat] Add onMouseMove callback (#2317)
- 66a6364f [feat] add prop to allow turning off custom webkit scrollbar CSS (#2316)
- 69ce4d06 [Chore] export action creator (#2315)
- e051eb55 [fix] Fix map attribution color (#2314)
- 090ef0ba [fix] Conditionally apply escapeXhtml to prevent export image crash (#2313)
- 8bb0d469 Introduce new fsq studio section in home page (#2308)
- 3e39337e updated cdn from unfolded to fsq (#2307)
- 5bae745b [chore] drill disabled prop to layer-type-selector (#2274)
- b6a2b804 [feat] Edit a custom base map style redux (#2281)
- 74bc22a6 [feat] add complimentary base map style property (#2280)
- e056d01a [feat] Remove a custom map style from the base maps side panel (#2279)
- e09ed287 [fix] map style selector: provide backup UI content (#2277)
- 963df0cf [chore] Update SavedCustomMapStyle accessToken property to be defined as optional (#2278)
- 46df6014 [Chore] improved saved layer and interaction type (#2275)
- 2dff78ff [fix] Long field names in filter UI obscure the delete icon (#2273)
- 32356b46 [chore] pass through className prop to TippyTooltip (#2272)
- 52fb6844 [chore] Add nx module tag (#2271)
- b255d60e [chore] Add tooltip format (#2269)
- 7b45e4f1 [fix] collapsible layer config group ui improvements (#2268)
- a1689540 [chore] update browserslist deps (#2267)
- 5db83285 [chore] specify filter id in addFilter (#2266)
- a8599dcf [feat] Update custom map style updater to support managed map style (#2264)
- 84c07360 [feat] Support map overlays (#2260)
- 8312d060 [Chore] Upgrade to Node 14 (#2257)
- 23763f0b [Chore] Add layer header action component to deps (#2265)
- 043db65f [Chore] export single color palette selector (#2262)
- d362fc21 [feat] H3 Layer separate layer opacity into unique fill opacity and stroke opacity (#2261)
- a1084016 [fix] Use auto width for pinned column in table preview (#2259)
- c79e9f90 [Chore] rewrite stack overflow functions (#2258)
- 9d57f575 [chore] upgrade gl dependency version (#2256)
- 11242f01 [Chore] Added collapsed prop for layer config group (#2255)
- 8d79f7d0 [chore] export types and components (#2254)
- 4a659e84 [feat] H3 Layer: default text label anchor to middle position (#2252)
- acd05e91 [chore] export more components and types (#2251)
- f6be2491 [Chore] expose functions and types to fix deep import issues (#2250)
- 5fcbcdab [feat] H3 Layer: Add fill transparency and stroke color settings (#2249)
- 94cb2a15 [feat] Layer property additions: H3 Layer: Add text labels (#2243)
- 9ba6bcdd [Chore] add exports to expose functions and components types (#2242)
- 88dd4b36 [fix] exported image has a thin white bar at the bottom (#2241)
- f562fbe0 [fix] range slider doesn't work when step < 1 in dataset filter (#2240)
- fa3bb9c9 [fix] Overlapping column names in drop down menu (#2239)
- 796a9d29 [fix] time ticks are the same when using Minute to set interval (#2238)
- b9cd1ec4 [Fix] Map popover z-index less than size panel (#2237)
- 8de7ae41 [Fix] mapbox logo has not been styled correctly (#2236)
- ed5cb8ad [Chore]: Add onClickControlBtn prop to MapControlButton to pass additional callbacks (#2235)
- 97126155 [fix] Remove split map controls from legend in exported image (#2234)
- bc1cfc55 [Chore] use unfolded cdn for base map, layer type select and icon layer svg (#2233)
- 07f8c9f9 [feat] Add extraReducers arg to keplerGlReducer.initialState (#2232)
- a112c0e9 [Fix] Feature Action Panel menu and editing tooltip are cut-off in dual map mode (#2231)
- 7fb4cada [fix] Fix types for Typescript 4.8 (#2229)
- 41c80993 [Chore] Pass onBruch, filter and datasets through range slide to plot (#2220)
- f80853b0 [Chore] add test for vis state schema column save undefined typeerror (#2219)
- e1e165e6 [Feat] Added new options parameter to override single action reducer default behavior (#2217)
- 1c1345b4 [Bug] preserveLayerOrder when replace data (#2214)
- c06ceca7 [chore] Exported layer utils methods and added onDragStart onDragEnd props (#2210)
- 7d3c6026 [fix] Fixed bug when switching to dataset layer view (#2209)
- 2275b8e6 [chore] Make dataId non-optional in layer config (#2205)
- c130a2f5 [Fix] vis state schema column save undefined typeerror (#2211)
- d8a5defa [Fix] ColorBlock component TypeError: e.color.slice(...).join is not a function (#2212)
- 1380644f [Fix] time widget animation: apply same duration for last time filter (#2218)
- 1094e734 [BUG] fix dropdown list fail to update when prop change (#2213)
- dafec9b8 [Chore] add exports for scenegraph to layers index (#2215)
- 14c6d014 [chore] layer testing support (#2216)
- e5686fda [Bug] Fix composer types, schema types (#2208)
- 28fbcdbf [feat] Convert layer order from idx to layer IDs (#2203)
- e1ccfdff [Enhancement] Allow empty column when layer created from config (#2206)
- 30792f47 [Fix] Add selected style for light dropdowns (#2207)
- 44aafd15 [Feat] add kepler.gl to info.source in exported kepler.gl.json (#2195)
- 95fd2369 [fix] Empty cells with date time data are filled with Invalid date (#2201)
- 3b73dc07 [Feat] Add display format setting for table/tooltip (#2199)
- 87b79c3b [Feat] add replaceDataInMap action (#2198)
- e9896def [Feat] add table config with custom number format (#2192)
- e635e4cb [fix] Fixed crash when switching to dataset layer view mode (#2191)
- a246574e [Fix] Auto-display legend in split mode + Fix legend and layer panel bugs (#2190)
- 2d141ff5 [fix] Layer drag and drop label is barely visible on light map (#2189)
- 70cde834 [Fix] Drop the same layer multiple times to one map (#2188)
- 2f5da5ec [Chore] Removed unneeded preventDefault (#2177)
- b364f3d8 [Fix] intervals rendered incorrectly in time widget (#2183)
- c8475737 [feat] Create layer correctly from saved layer config (#2179)
- 4c6e99e3 [fix] previous drawn-selected geometries are lost after click Select geometry (#2175)
- 79d8c756 [fix] support Polygon and LineString mode in idToPolygonGeo (#2182)
- 85897309 [Fix] hide pinned selection outline when layer is hidden (#2181)
- d441d5fd [feat] three dots button change (#2180)
- 4dd27abe [Feat] Drag and drop interaction for split map (#2172)
- 485252ad [fix] Improved split+unsynced mode for better handling (#2176)
- 90572720 [fix] handle undefined values in updateViewport (#2178)
- afee4800 [fix] hide side panel close button when data preview is open (#2174)
- 695bcccd [feat] Improve disabled zoom lock text styling (#2173)
- 9fc98e86 [Feat] Unlocked split map viewports (#2170)
- 8896dc13 [fix] fix visible layers toggle for split maps mode(#2168)
- f0727c97 [fix] type fixes for map popover (#2169)
- 04451827 [Feat] enhance mouse selection toolset (#2164)
- f640822a [Fix] round the float number to up to 4 decimal places in table (#2163)
- a41e0118 [Chore] Add more types for schema (#2162)
- 502c1ba3 [fix] remove duplicates from changelog (#2145)
- 7d996a68 [fix] Fix onViewStateChange callback (#2154)
- 2e57238b [chore] Type and export fixups (#2152)
- 245ac53b [chore] update filter types (#2153)
- ce4e5c7e [Fix] Datasets and basemap attributions separated by "|" (#2150)
- 1fd7bad0 [Fix] Datasets attribution width styling (#2149)
- 06f085db [Feat] render dataset attributions in map container (#2148)
- 425a6011 [chore] ts fixes (#2147)
- abb0d1ce [fix] improve handling of "interpolate" mapbox colors during basemap switching (#2144)
- a6a6b270 [fix] fixes to async merger (#2139)
- 9d568af3 [Feat] Support async mergers (#2129)
- 28c34901 [Chore] support offset in map legend panel (#2130)
- 953711ac [feat] Introduced updateDatasetProps to update dataset information (#2133)
- 332a94ad [Feat] Add arrow and light theme props to TippyTooltip (#2140)
- c79896be [Chore] Export LayerGroupColorPickerFactory from kepler-wide components (#2138)
- bf890fa9 [chore] Update react-modal version (#2131)
- def2ce12 [fix] Basemap overlay blending updater must pass through entire payload (#2137)
- e2848008 [Feat] Add "No Basemap" option with map background color control (#2136)
- 5cc6faab [fix] fixes the logic to set map overlay type properly when switching layer type (#2135)
- f605167f [Chore] Request map styles on demand (#2134)
- fb829922 [Feat] Add list toggle to filters (#2115)
- 20fcb662 [Bug] Object and array field types made numeric (#2127)
- 31e44350 [Chore] export LayerTypeListItem type (#2122)
- 390f5af8 [chore] changes to order layers by datasets (#2114)
- 210af2b4 [fix] remove constant scroll around layer config group (#2116)
- a438383b [feat] Add minZoom, maxZoom, maxBounds (#2124)
- 0e5a4bbc [Bug] data modal and data table scrollbar style (#2123)
- cdb69f4a [chore] Export parseGeoJsonRawFeature from utils (#2121)
- 3d5db39e [feat] add support for object and array field type (#2120)
- 1f20ef71 [Feat] Introduce MapPopoverContent (for tooltip charts) (#2119)
- 918aaf98 [Enhancement] Render data table with smarter cell size, prevent scroll back (#2117)
- b1d92c85 Bump ua-parser-js from 0.7.25 to 0.7.33 (#2112)
- 630e8ede [Enhancement] Improve Feature action panel style (#2099)
- 20134f01 [fix] Fixed time filter toggling and display the correct filter (#2098)
- 83673fd5 [chore] bump nebula; add picking width for polygons; preserve rectangles; (#2097)
- eeb50d6a [fix] Checking if drawing is active when delete an editor feature (#2093)
- d1abf3ee [Enhancement] Fix dropdown list disabled color (#2094)
- 943ee50a [Bug] fix update layer type reset layer dataId, new layer at the top (#2096)
- ac5f490e [fix] fix layer config group collapsible content overflow (#2092)
- 608fa0f3 [Feat] refactored AnimationControl to handle both layer and minified filter playback (#2079)
- 409db23e [fix] CSS fixes to avoid conflicts with Jupyter styling when embedded without iframe (#2095)
- e1b70000 [Enchancement] number formatting improvements (#2109)
- cf8d3321 [Enchancement] number formatting improvements (#2106)
- c9cc689c [fix] use dataset name as default h3 layer name (#2100)
- 7f01ca1c [fix] Trip Layer: issues for path from 2 points (#2101)
- 92bae8e0 [fix] Icon Layer - Labels are visible even if layer is hidden (#2102)
- 47cc281c fix: Open map control and geocoder for extension (#2103)
- 0cd0e379 [fix] Improve render cell size script perf for data table rendering (#2104)
- 4e06992b [Fix] Image export change resolution (#2105)
- 7d9d54b8 [Feat] Map overlay blending (#2086)
- f4329fcc chore: more specific error message for context lost error (#2090)
- 14ef4366 [Feat] Disable a layer after an error in Deck (#2072)
- d24ea4a5 [fix] dont show hidden layers as options in polygon dropdown menu (#2085)
- fd3a7a8b [fix] Prevent the app from crashing on geojson layer hover (#2087)
- a66f98f9 fix(filters): fix for broken filter state, load crash (#2069)
- 47b1124d fix 3d buildings rendering (#2080)
- 8edb5b2e [fix] lock react-vis version to prevent CI fails (#2082)
- 9416be4a save and merge editor features in map config (#2071)
- 217b89e7 chore: Child support and type exports for FeatureActionPanel (#2070)
- f53188b9 show filtered out and hidden layers as options in polygon filter menu (#2068)
- b53a6b75 [fix] Move FeatureActionPanel to class component (#2067)
- 0f7a4242 fix Cant right click on polygon or rectangle filters to get the menu (#2066)
- db549742 bump licence year to 2023 (#2073)
- a22e4259 [Feat](Editor) Replace react-map-gl-draw with Nebula.gl (#2054)
- 3de77995 [fix] fix import in demo-app carto provider (#2050)
- 3e7581b1 [Feat] Add hasStats prop to data table adjust first cell size (#2040)
- 15d1426e FIX: Fix margin for style panel icons (#420) (#2041)
- a865ce8b [fix] correct provider downloadMap type (#2049)
- c53d81fd Bump moment-timezone from 0.5.33 to 0.5.35 (#1966)
- efa32f75 [fix] include CenterFlexbox in common components (#2035)
- 5f3d185f correct @kepler.gl/styles types file location (#2034)
- 76e1a4d0 [fix] Updated dataset item cursor style (#2013)
- d0bcaa89 [Fix][perf] String filter freezes browser when loading a large dataset (#2012)
- 1214bd9d [fix] Time filter: Add padding if min/max values are the same (#2011)
- 36657380 [fix] Fixed hex tile play animation (#2010)
- 6c266665 [Fix] dropdown item title (#2009)
- 81fcbb41 Bump loader-utils from 1.4.0 to 1.4.2 (#2025)
- f1b7e1a8 [Fix] no aggregation options can be selected for date field when groupby (#2008)
- b9a04468 [Feat] Replaced filter enlarged with view: side | enlarged | minified (#2007)
- 6692585e Handle loading map style gracefully (#2005)
- 920659ff Add header cell stats control toggle (#2004)
- dbba7daa [Chore] bump and fix examples for v3.0.0.alpha.0 (#2030)

## [3.0.0-alpha.0] - November 5 2022

- 4eb6b24b [Chore] dependencies update + publish process update (#1978)
- 72f201c9 kepler.gl-jupyter: Fixed wording in documentation (#1938)
- 791bbe21 [Feat] make data table header cell overridable (#1995)
- 77ba9509 deck upgrade fix (#1997)
- 9b483b22 better regex for mapbox style boundary detection (#1996)
- 306da3a2 add onClose for color picker (#1992)
- 13bcaa06 update isRGBColor (#1991)
- 2845432e Moved animation control button to the right (#1990)
- 51a05ffe color picker crashes studio inside iframe (#1989)
- 73dba52e [Chore] Extra memoization for components to prevent re-rendering (#1988)
- 4e88e839 [Bug] "load from storage" and "Share" modals fix (#1976)
- 9029b8ea [Feat] Hide Mapbox attribution when using non-Mapbox tiles (#1975)
- d77ffcb4 [Feat] Improve fieldpair detection logic, add altitude (#1968)
- b70c35c2 [Chore] refactor dynamic require (#1971)
- 8878cff4 [Fix] polygon filter reload (#1970)
- ea738594 [Chore]: Typescript 4.4 fixes (#1957)
- 49321f87 [Feat] mobile bottom widget styling (#1930)
- db39b496 [Chore]: Technical: Isolate components (#1967)
- 90248326 [Chore] remove iconComponent from interactionConfig (#1973)
- 64542aa2 [Chore] bump to deck 8.6.0 (#1959)
- ab5f9f33 [Fix]: Item selector closeOnClickoutside conflict with portable (#1958)
- 9b81e49f [Chore]: Technical: Isolate schemas (#1962)
- 57dea6a3 [Chore]: Technical: Isolate reducers (#1961)
- 28578e76 Import for filters fixed (#1965)
- 359e0387 [Bug] Fix getSampleData import (#1964)
- c2cb8213 [Chore]: Technical: Isolate table-utils (#1949)
- af79e2e5 [Bug] fix layer order not correctly reloaded (#1956)
- 47a184c6 [Bug] Fix Range brush maximum update exceeds crashes (#1955)
- f9485018 [Enhancement] improve tooltip format label, make it more intuitive (#1954)
- a42aae33 [Enhancement] use portable in item-selector (#1953)
- 6e2fe3dd update layer selector types; get length for dc; (#1951)
- 0630c8b7 fix deck.gl version for src utils (#1950)
- d5f0f0cf [Docs] fix broken link (#1952)
- 5e20ac68 [Chore]: add class names to map control (#1940)
- c7ed4dbd [Chore]: change types for modal (#1939)
- f53117fb [Chore]: pin browserlist (#1935)
- 8ea93d40 [Chore]: Technical: Isolate actions (#1948)
- f828f695 [Feat]: Passing root context to tippy
- 34ebb889 [Chore] Fix debounce typing
- 3db186e5 [Chore] bump deck to 8.5.7 (#1934)
- 99b38d26 [Feat] Implemented new feature flag by passing features flags prop (#1933)
- 50eda73f [fix] 3d buildings aren't rendered without layers (#1931)
- f21afd8d [Chore]: Technical: Isolate tasks (#1941)
- 88039cd3 [Chore]: Technical: Isolate cloud-providers (#1942)
- a98a015b [Bug] Fix getSampleData util import (#1947)
- 4615c480 [Fix]: Kepler.gl site issue fixed (#1944)
- f2459c6c [Chore]: Technical: Isolate utils (#1876)
- 88e15d5e [Fix] fix lint (#1932)
- 3301a7c5 [Chore]: bump deck to 8.5.4, loaders to 3.0.9 (#1928)
- 0889d0d1 [Enhancement] (Map Control) use lazy tippy to improve map legend rendering perf (#1924)
- 82baedfb [Chore](Types) move howto button out, add layer conf types, yarn lint (#1926)
- c9ef6972 [Chore]: extra export (#1925)
- 4fc85960 [Chore]: layer-utils, map-utils refactor (#1923)
- 5c38f851 [fix] prevent deck crash due to layer id duplicate
- fb3f35ba [Chore]: Use relative import in test-utils (#1921)
- eff5f902 Map Control: Use MapControlTooltip with TippyTooltip (#1920)
- 5551abd6 [chore] Export IconButton type (#1919)
- d358b3a8 fixed findMinFromSorted when list is null (#1918)
- 3a3be58d [Chore] Upgrade to deck 8.5.2 (#1917)
- 20d39b8c [Enhancement] add bin to filter hiitogram construct (#1673)
- 41414ceb [Enhancement] change export video playback button order (#1916)
- 38734422 fix color pick type using react-color types (#1915)
- f739a499 chore: Updated filter-selector, item-selector, range-slider file typescript definitions (#1902)
- 40ac3068 [chore] test valueAccessor in field (#1906)
- f82494d6 [Feat] Use custom style token if available instead of the default token (#1913)
- 77dc2560 [BUG] Fix crash after layer type change (#1912)
- ac59ac7d [Bug] rename dataset should not use spread (#1911)
- 486e3239 Prevent "Cannot read property 'layers' of undefined" error (#299) (#1910)
- fae2058f [Bug] Fix map saved with empty filter cannt be load; validate empty filter.name when merging (#1909)
- 26b5f849 add type to keplerTable (#1905)
- bec013e5 improve reducer updater typing, change visstate to be more relaxed (#1908)
- 6c51a2ae [feat] Hubble gl integration (#1899)
- d31fe649 [Bug] Fix mouse event evt.point evt.lngLat undefined crash (#1903)
- 39427d46 [Bug] fix trip layer timestamp check (#1904)
- cb76ae0f [Enhancement] render warning in layer panel header (#1901)
- 9d171c60 [Enhancement] set initial layer config when set layer type (#1898)
- 8d35d9b8 [Chore] Export more type def (#1890)
- d90cd188 [Chore] fix types and missing import (#1891)
- 28cbb759 update shader modifications for deck 8.4.16 (#1892)
- 66de62cf Fix crash: visualChannels: Cannot read property label of undefined (#1886)
- 57f77dd2 deck to 8.4.16 (#1889)
- 41dbd570 [Enhancement] add disableDataOperation to dataset (#1897)
- 1f5e26c8 [Enhancement] pass schema to processKeplerGlDataset (#1885)
- 156f898b [Bug] fix comparison tooltip color and position (#1887)
- 6c99bb04 [Bug] Disable layer copy when layer is invalid (#1882)
- dfd73a53 add supportedDatasetTypes to layer, show dataset selector even if there is only 1 or no option (#1883)
- 40a82dfa [Enhancement] disable layer column selection if empty (#1888)
- 9c042fe5 Bump follow-redirects from 1.13.3 to 1.15.1 (#1871)
- 2a55a1e3 [Enhancement] Improve style of layer header panel (#1881)
- ceb23e21 fix for cluster layer z-fighting; fix - render 3d building map style only once (#1874)
- a983be75 [Bug] allow tooltip format to apply to aggregation layer hover (#1872)
- 723e6050 FILED_TYPE_DISPLAY -> FIELD_TYPE_DISPLAY (#1879)
- 7d328315 Chore: Fix lint script and issues (#1862)
- 940f9aad [Chore]: Technical: Isolate styles (#1861)
- ad7646ac [Chore]: Technical: Isolate localization (#1858)
- e798f317 Middleware isolation (#1860)
- 6c178d77 [Chore]: Technical: Isolate processors (#1857)
- 9e315d25 [Chore]: Technical: Isolate layers (#1856)
- c1e20348 [Feat] Upgrade deck.gl@8.4.11 luma.gl@8.4.3 loaders.gl@2.3.12 (#1674)
- b668fd28 [Chore]: Technical: Isolate deckgl-layers (#1851)
- 9feddc66 Fonts issue fix (#1846)
- 9a3da3c0 [Chore]: Technical: Translate deckgl-layers/cluster-layer (#1815)
- 10868ecf [Chore]: Technical: constants and types modules isolation (#1840)
- fe293e71 [Chore]: Technical: js to ts convertion components root modals (#1801)
- 55abc874 [Chore]: Technical: Notification item types added (#1824)
- bd8c3327 [Chore]: Technical: Translate map components to typescript (#1803)
- 371649c6 Debounce typings added (#1825)
- 1034c33d Lodash.memoize typings added (#1827)
- 69f8534d [Chore]: Technical: fix linting errors of @types/styled-components plugin (#1834)
- 5ee0cd4f [Chore]: Technical: add types for side panel root components (#1822)
- 9bee093e validate url of Add data modal (#1837)
- b7d8edf4 [Chore]: Technical: add types for layer panel components (#1819)
- 7b95c236 hide layer size legend with nullish label (#1836)
- ecc743af [Chore]: Technical:layer base config data allow to be null (#1835)
- 2b51c7bb [Chore]: Technical: Fixed errors happening in folders/files due to the addition of @types/styled-components: components/common/slider (#1831)
- e27cf134 [Chore]: Technical: fix attributes of styled components animation-control (#1829)
- 442d1b23 [Chore]: Technical: add types for filters (#1809)
- fc8ab5af [Chore]: Technical: Translate deckgl-layers/hexagon-layer (#1818)
- 959f1e0b [Chore]: Technical: Translate deckgl-layers/grid-layer (#1816)
- cbd26743 add types for styled components in styles (#1830)
- f7715892 [Chore]: Technical: Translate components to typescript (#1814)
- a5a347ba [Chore]: Technical: Translate components to typescript (#1812)
- 9225e005 Throttle typings added (#1826)
- f0671f06 [Chore]: Technical: add types for editor component (#1797)
- 4e8197d5 [Chore]: Technical: add types for processors (#1798)
- 47e4963e [Chore]: Technical: add types for side panel common (#1807)
- 0d3c98c8 [Chore]: Technical: add types for filters side panel (#1799)
- 8c5e5075 [Chore]: Technical: Translate layers final changes (#1783)
- e663bb16 [Chore] fix typo in docs (stule -> style) (#1823)
- 2d557df3 Typings for some lodash packages added (#1817)
- ca45cef8 [Bug] validate s2 token in s2 geometry layer (#1805)
- 7453b951 [Chore]: Technical: components/geocoder translated to typescript (#1808)
- 5b918e00 Review fixes (#1813)
- ae1173ec [Chore]: Technical: Translate deckgl-layers/layer-utils typesfix (#1791)
- 6a7d44bc [Bug] Build fix (#1811)
- 8ac5bbc6 [Bug] visual channels cannot read property 'label' of undefined (#1804)
- b7c6c8df Translate deckgl-layers/3d-building-layer to .ts (#1794)
- a5bcd814 [Chore]: Technical: Translate root components to typescript (#1790)
- 258c82da add types for svg-icon-layer (#1796)
- 0de32bec [Chore]: Technical: Translate deckgl-layers/line-layer (#1792)
- 013b9878 [Chore]: Technical: Translate deckgl-layers/column-layer (#1793)
- f64b551f [Chore]: Technical: Translate tasks (#1779)
- 65228a85 [Bug]: fix grid hexbin and cluster layer crash (#1795)
- 7ada98a0 [Chore]: Technical: Translate examples/custom-map-style (#1780)
- 84312384 [Chore]: Technical: Translate deckgl-layers/layer-utils (#1789)
- ec3351b6 [Chore]: Technical: Translate cloud-providers (#1778)
- 24e3549c Added deckgl-typings from community repo (#1787)
- 68abc5b5 [Chore]: Technical: Translate geojson-layer (#1757)
- 2d2ba1d7 [Chore]: Technical: Translate hexagon-layer (#1775)
- 543045d0 [Chore]: Technical: Translate heatmap-layer (#1773)
- cf57260a [Chore]: Technical: Translate trip-layer (#1777)
- e80c18b1 [Chore]: Technical: Translate line-layer (#1776)
- 9a0ad623 [Chore]: Technical: Translate cluster-layer (#1774)
- bc18a6c4 [Chore]: Technical: Translate scenegraph-layer (#1768)
- 831504f9 [Chore]: Technical: Translate icon-layer (#1763)
- b87bba3a [Chore]: Technical: Translate grid-layer (#1761)
- 079da4cc [Chore]: Technical: Translate h3-hexagon-layer (#1762)
- cd05dd4b [Chore]: Technical: Translate point-layer (#1764)
- 0b3f2c0c [Chore]: Technical: Translate s2-geometry-layer (#1765)
- 18342926 [Chore]: Technical: Translate mapboxgl-layer (#1755)
- 9b695f85 [Chore]: Technical: Translate aggregation-layer (#1753)
- 13ba6bb7 [Chore]: Technical: Translate arc-layer (#1749)
- a3ada4e9 UN-14 Technical: Translate components/[root files] to typescript: side-panel (#1712)
- fb2190f1 [Bugfix]: Fixed Babel configuration (#1754)
- d9e9d8aa [Chore]: Technical: Translate layer factory (#1748)
- c0f75341 [Chore]: Technical: Translate components/common final part (#1750)
- b06dfb1c [Chore] Typescript 'components/common/slider' (#1740)
- 0057a1e4 [Chore]: Technical: Setup for different Visual channels per layer (#1751)
- 1193258b UN-14 Technical: Translate components/[root files] to typescript: maps-layout (#1713)
- 8a06f711 Moving bottom-widget to ts (#1710)
- dd14702e [Chore]: Technical: Translate base-layer (#1746)
- 4a687ed4 [Chore]: Technical: Translate index and other files (#1745)
- 7a11260d [Chore]: Technical: Translate table utils (#1742)
- 7ee74ebe [Chore]: Technical: Translate filter-utils and gpu-filter-utils (#1744)
- e5d5d1ba [Chore]: Components/common 1st part (#1729)
- d8abca9d [Chore]: Technical: Translate utils (color and data) (#1732)
- 55a7b510 [Chore]: Technical: Translate utils (dataset-utils and export-utils) (#1734)
- 0505fda4 [Chore]: Technical: Translate redusers (vis-state) (#1727)
- 5304d4dc [Chore]: Technical: Translate utils (files without d.ts typings) (#1728)
- 30616984 [Chore]: Technical: Translate redusers (UI-state and provider-states) (#1726)
- 2ba94858 [Chore]: Technical: Translate actions to typescript part 2 (#1725)
- e36cac5b UN-12 Technical: Translate redusers (main files) to typescript (#1722)
- fb170ae0 [Feat]: Technical: Translate actions to typescript (#1704)
- cb542853 UN-13 Technical: Translate schemas to typescript (#1721)
- 8121893c [Feat]: Technical: Translate redusers (map-state and map-style) to typescript (#1717)
- fbe626be [Feat]: Technical: Translate redusers (composers and combined-updaters) to typescript (#1711)
- d8d7e44f [Feat]: Technical: Translate localization to typescript (#1705)
- 614a5003 [Feat]: Technical: Translate templates to typescript (#1702)
- 0ef5ccd8 [Feat]: Technical: Translate middleware to typescript (#1703)
- 20ec6666 [Feat]: Technical: Translate styles to typescript (#1701)
- 11c5b4cc [Feat]: Technical: Translate constants to typescript (#1697)
- 283586d0 [Feat]: Technical: Translate connect to typescript (#1700)
- 995f3f93 [Feat]: Setup build process for ts source code support (#1688)
- b71dd6b4 [Chore] Update license year 2022 (#1689)
- 0dfc7e1b [Bug] fix filtered datasets memoization (#1678)
- 1e8b3c1a [Enhancement] order layers by dataset (#1675)
- f9ae108a [Enhancement] extract layers list to a separate component (#1665)
- 52993525 [chore] export types, add script to build types (#1636)
- 6fb00fa0 [Bug] fix pin table column overide dataset (#1625)
- 22ea7a9d [Bug] do not display geocoder dataset in side panel
- a20db971 [Feat] allow custom value in layer slider (#1631)
- 5e6b1c45 [Bug] allow empty data rows (#1624)
- 612e18a9 [Feat] support pin map legend in map control (#1614)
- bfcce3fd [Enhancement]Allow changing MAX_DEFAULT_TOOLTIPS (#1627)
- a810ee13 [Chore] added more properties to export layer type (#1613)
- 0931a55c [Enhancement] Render map control tooltip with TippyTooltip (#1612)
- d0fb78de Add registry-url to avoid 404 issue when publishing keplergl npm package (#1623)
- 9936b7b7 [Feat] add color picker to dataset tag (#1608)
- 3e3d1631 [Jupyter] Update example versions
- 5b442c5d [Jupyter] keplergl==0.3.2 (#1619)
- a56206c8 keplergl-jupyter v0.3.1
- e12039c6 [Feat] Add Copy Button to Export Map Dialog (#1609)
- 3f876ac1 [Jupyter] bump kepler.gl js version release keplergl-jupyter=0.3.1 (#1617)

## [2.5.5] - September 12 2021

- 392e9a21 [Bug] lock deck.gl to 8.2.0 (#1602)
- 6121a343 [Chore] Fix explicit src import (#1596)
- 0b71f399 [Bug] fix locale panel (#1603)
- 8b42be29 [Bug] Fix integration with CARTO (#1600)
- e8ba7a05 [Feat] add setMapControlVisibility action to set mapControl visibility (#1590)
- 78274562 [Feat] add supportedFilterTypes to dataset (#1594)
- 41b364a6 [Enhancement] s2 updateLayerMeta: push instead of spread (#1593)
- 1b5e0235 fix for long processing time of data-utils::unique (#1592)
- 91a52b16 [Enhancement] Use layer.visible prop in deck.gl when toggle layer visibility (#1591)
- c106ee06 [Chore] Create factory for LayerLegendHeader and LayerLegendContent (#1589)
- 878750c4 [Feat] Add MapsLayoutFactory for custom split map layouts (#1588)
- d8db8f6f [Chore] Refactored map control and decoupled action components (#1552)
- 2f8b19f2 [Feat] update keplergl-jupyter widget for JupyterLab 3, add build for conda-forge (#1572)
- 6947c8c8 [Feat] Added Russian localization (#1570)
- 9726a400 [Docs] Data container upgrade notes (#1575)
- 070b04b2 [Feature] Abstract Data Container (#1555)

## [2.5.4] - July 31 2021

- 62d03ab2 [Examples] update replace-component example (#1557)
- 089bb7a9 [Jupyter] Make showing User Guide link optional for jupyter widget (#1559)
- 5985d201 [Bug] Fix screenshot with images (#1558)

## [2.5.3] - July 18 2021

- a4a6734a [Docs] fix add data to map docs (#1551)
- 8524061e [Enhancement] add displayName to field and show displayName whenever available (#1538)
- a0d2a76b [Feat] Save and load highlightColor from layer config (#1550)
- a9b2ba07 [Examples] fix panel toggle exmaple, add layer hove info demo (#1549)
- 9bcb3415 [feat] Using tippy for map popover (#1539)
- 2e6f8b79 [Chore] refactored side-panel from class to functional component (#1536)
- 16fab11c [Bug] Geojson layer is not updated when dataset updated (#1533)
- 29cf0829 [Enhancement] add toggleLayerAnimationControl action (#1537)
- 01e93966 [Enhancement] add disableClose to map control (#1529)
- c6e5b8a6 [Feat] use appName in exported image html json map and csv data (#1528)
- 72354560 [Bug] Fix geojson layer duplicated index (#1530)
- 1ed0fd6d [Bug] fix histogram in range (#1531)
- 305edfcd [Docs] Update Map Styles Link (#1512)
- 1890133d [Chore] Update peer dependencies for styled-components (#1527)

## [2.5.2] - June 28 2021

- 1c7521b1 [Bug] Fix center map accuracy (#1502)
- b662892a [Bug] trim string value before passing to type analyzer (#1503)
- d35ad489 [Website] Add ecosystem Section (#1491)
- 1935c70a [Chore] Bump ini from 1.3.5 to 1.3.8 (#1385)
- b7d333b4 [Chore] Bump y18n from 3.2.1 to 3.2.2 (#1449)
- aeb8b45a [Chore] Bump ssri from 6.0.1 to 6.0.2 (#1460)
- 86577263 [Chore] Bump ua-parser-js from 0.7.22 to 0.7.28 (#1471)
- f0fda0e4 [Chore] Bump handlebars from 4.7.6 to 4.7.7 (#1472)
- 027aecfa [Chore] Bump url-parse from 1.4.7 to 1.5.1 (#1473)
- 6d5981a0 [Chore] Bump hosted-git-info from 2.8.8 to 2.8.9 (#1474)
- 54690fc8 [Chore] Bump browserslist from 4.14.7 to 4.16.6 (#1494)
- 846ec388 [Chore] Bump dns-packet from 1.3.1 to 1.3.4 (#1497)
- c6def591 [Chore] Bump ws from 6.2.1 to 6.2.2 (#1500)
- 614750f4 [Feat] Make keplergl-jupyter work with JupyterLab 3 (#1501)
- b4fcf7be [Feature]: add copy geometry to feature action panel (#1495)
- d786d0f3 [Bug] fix arc layer configurator render crash (#1490)
- b24cc57a [Enhancement] Support elevation in Icon layer (#1483)
- d51f3050 [Enhancement] Support elevation in Line layer (#1481)
- a09cd589 [Enhancement] Elevation zoom factor toggle (#1478)
- 8a6d2635 [Enhancement] add Japanese translation (#1469)
- 910eb5e7 [Chore] Move 'uber-licence' to devDep (#1450)
- 0b03f3a6 [Docs] fix typos on playback readme (#1482)
- 14c35fc0 [Doc] Add example using none mapbox base map (#1440)

## [2.5.1] - Mar 30 2021

- 16703c0b [CHORE] add utils.js to package.json
- a15109b3 [Feat] add timezone and timeFormat prop for time display in animation control and time - widget (#1411)
- 13c6171e Bump elliptic from 6.5.3 to 6.5.4 (#1435)
- cdcc0eea [Enhancement] make panel tab a factory (#172) (#1412)
- 173811a3 [bug]: Fixed range slider null selection bug (#1413)
- df3fee5c [Bug]: Updated babel dependencies (#1410)
- 119c8933 [Bug] fix update dataId not update layer data (#1414)
- b97b58a9 [Enhancement] Choose the default field to be integer if no reals are present (#1409)
- 072876df [bug] upgrade colorbrewer to 1.5.0 (#1439)
- d4698bb8 [Chore] add initial version of ts-smoosh (#1437)
- 6b39c43f [Chore] reformat changelog

## [2.5.0] - Mar 3 2021

- 58af5b65 [bug] Set colorbrewer version to 1.4.0 #1416 (#1428)
- a03250a4 CHORE: export processKeplerglDataset (#1422)
- ddaa8bf7 FIX: incorrect type strin -> string (#1421)
- 9e5bfdca [Feat] Duplicate layer and add layer from config (#1401)
- 29bfa406 [Bug] Interval animation doesn't stop when speed is set to 0 (#1397)
- 9476c293 feat: Converted dataset object to kepler table class (#1239)
- 498305cc [Bug] save to map provider (#1399)
- 6728b30f [Bug] Clamping slider values outside range (#1395)
- f0e51743 [Enhancement] add changedFilters to datasets when filter data is called (#1396)
- 8d68001d [Bug] Add style prop to kepler-gl container (#1398)
- d295c762 [Enhancement]: Save filter speed to schema (#1394)
- fb801d70 [Chore] Update license year (#1393)
- fa6deff0 (0116-babel-deps) [Enhancement] Show an error notification for errors in deck (#1373)
- 5d4b4547 [Bug] Bug fixes (#1388)
- 35bf90a9 [Bug]: FIxed issue with map popover object being null (#1384)
- fc2fb04d [CHORE] Typescript fixes (#1383)
- d6e28377 [Bug] Fix 12350 format in tooltip (#1327)
- 2ea82deb [Feat] fixed augumented numeric formats with ~ (#1369)
- e88b4f19 [Bug] Fix speed button input on timeline (#1376)
- 7aeca210 [Enhancement] bump loaders.gl to 2.3.3 (#1366)
- eff0a15d [Enhancement] Choose layer color by default (point layer) (#1367)
- 823405ab [Bug] fix arc layer configurator (#1375)
- a11c63c3 [Enhancement] avoid calling mapPopover setstate infinitely (#1346)
- ae234e72 [Bug] Prevent crash in react-map-gl when zoom cannot be calculated (#1365)
- be61b70b [Enhancement] automatically re-project GeoDataFrame to EPSG:4326 (#1350)
- 2aad97f3 [Bug] Added better check for bins in bottom widget (#1361)
- ef8bdbaf [Chore]: Upgraded to node 12, migrate from TravisCi to Github actions (#1326)
- c7726680 [Enhancement]: Added uiStateUpdater showDatasetTable in order to intercept showDatasetTable action (#1363)
- f33c76b4 [FEAT] Add rename dataset reducer (#1362)
- 027985af [Bug] Fixed color picker closure when selecting first custom palette value) (#1347)
- 7f3be27f [Enhancement] check bounds before calling fitbounds (#1348)
- f046ac1b [Enhancement] better arc layer column config layout (#1345)
- 2ea853b1 [Bug] Fixed bug with fixed radius after remove size field in pointlayer (#1343)
- 32d80182 [Bug] fixed geocoder crash and added ability to pass coordinates (#1342)
- c2ba7f04 [Enhancement] Fix negative button border (#1344)
- 55f74dcd [Enhancement] added check for oldLayerData (#1357)
- 223af2b6 [Enhanment] extract valdiate layer and validate filter function (#1349)
- 06ea669d [Enhancement] pass dataset to renderLayer function (#1341)
- 524fc591 [Feat] Visual channel refactor generalize get accessor and updateTrigger (#1338)
- c1d4943b [Enhancement] Adjust input light styles (#1340)
- 5642ca8b [Chore] SidePanel panels are now passed through only through props or default ones (#1339)
- f802f393 [Chore] Decouple table from dataset Id (#1337)
- c7f50fdc [Chore] Export KeyEvent and downloadFile utils (#1335)
- 335f82a3 [Enhancement] Added the ability to pass supported data types when exporting (#1336)
- 239051f0 keplergl==0.2.2
- 55053230 keplergl-jupyter@0.2.2
- 1bac01ab update example app versions

## [2.4.0] - Nov 30 2020

- 259022ee [Upgrade] Support React 17 (#1323)
- 6c48c422 [Enhancement] Export more utils (#1317)
- 81bc6b37 [Enhancement] make provider injector function to get injectedApp back (#1318)
- 5e2b8988 [Enhancement] update spanish and catalan translations (#1319)
- 334f0b76 [Enhancement] extend template for light theme (#1305)
- abbe032e [Chore] Dependency upgrade (#1314)
- f0a966cd [Bug] check category (#1316)
- 7f5282b4 [Feat] add incremental timeline animation (#1315)
- c1a251de [Enhancement] make visConfigSwitch a factory (#1313)
- 37cf1457 [Enhancement] Enable polygon filter on h3 layer (#1306)
- bdbea264 [Feat] allow changing dataset in layer config (#1312)
- 28f5204d [Bug] fix radio button style (#1310)
- c990a477 [Enhancement] Upgrade d3-scale (#1311)
- ea69da8a [Enhancement] fix item-selector dropdown value overflow nad tooltip pin color (#1309)
- d94de814 [Chores] Exported default formatters (#1308)
- 307cd3d4 [Bug] avoid duplicated h3 layer detection (#93) (#1307)
- 8bc11a37 [Enhancement] Add inputBGdActive for light theme (#1301)
- 3f0f7a6c [Bug] Check for valid layer pinned prop before performing comparison (#1297)
- 42acc1cf [Bug] Fixed bug when reversing color schema (#1296)
- 9949888f Table of content -> Table of contents
- 9a13ce68 [Chores] Fixed security vulnerabilities and added new factories (#1294)
- 3276cef3 Merge branch 'upwards_update'
- 70687cab [Docs] Add usage example in doc for _repr_html_ method (#1282)
- 32b519af [Chores] Updated yarn.lock and file license
- aecbdc55 [Bug] Fixed typo in renderedSize cell-size (#90)
- 9f8b84e1 upgrade react-palm to 3.3.7 (#89)
- 7410cfa5 [Enhancement] Disable layer select option when no data is loaded (#88)
- 7a69c865 data table style tiny adjustment
- 21d09475 add fontFamily to input style
- 96c37618 export renderSize from cell-size.js
- f356fe43 [Enhancement] Added modalStyle prop Portaled to override default values (#83)
- b6fd3916 [Enhancement] UI input style improvement (#1284)
- 92a2bb65 [Enhancement] Add preserveLayerOrder to layer merger (#1288)
- 480ead69 [Enhancement] Add a CTA button type (#80) (#1286)
- d882ba09 [Enhancement] Layer config: Add column validators (#1287)
- e8fc1c5e Export typeahead (#1289)
- ad5ec020 [Enhancement] render last added filter first (#1285)
- 42569ec3 [Enhancement] Export StyledDropdownSelect (#1283)
- 1b748471 [Jupyter] add _repr_html_ method (#1202)
- fbbd4c45 [Enhancement] export more utils and schema (#1280)
- e5a6f9e8 [Enhancement] Improve schema and utils typing (#1279)
- ad651700 [Enhancement] Create factory for histogram and line chart, add brush handle to range brush (#1274)
- 6681d2e2 [Enhancement] pass light theme through to item selector (#1276)
- 0184cf1e [Enhancement] add setTimeAnimation action (#70) (#1263)
- 908a5e2b [Chores] Bump http-proxy from 1.18.0 to 1.18.1 (#1268)
- 7acb3d66 [Auto] Bump elliptic from 6.5.2 to 6.5.3 (#1210)
- 490cafb0 [Jupyter] Updated Docs for Jupyter (#1267)
- a7865c8d [Enhancement] Added factory for the icons of the map control (#1273)
- 77b4e018 [Enhancement] switch style tweak (#1262)
- 9dbb9e73 [Bug] fix dropdown list item lineheight (#1261)
- d677c18f [Feat] Move more css to theme and create more factories (#1248)
- 2ebd1368 [Enhancement] Typescript improvement (#1254)
- 959f1a33 [Bug] fix export image size not set (#1257)
- 678aacc2 [Upgrade] upgrade react-palm to 3.3.6 (#1255)
- f54d6afb [Enhancement] Map control style improve (#1253)
- 3e40a48c [Website] disable banner (#1252)
- 3b81b59f [Enhancement] Add new theme variables (#1245)
- b09aa2e1 [Bug] Fix load data modal crash (#1244)
- 42670d89 [Bug] Fix provider preview image during map save and share flow (#1243)
- efd3676d [Bug] Fix component exports
- 0b91f4d1 [Enhancement] Improve react intl support (#1237)
- 7ff0c459 [Enhancement] Save merger and schema to visState (#1235)

- ## [2.3.2] - Aug 16 2020
- 10468e19 [Enhancement] Export more utils (#1233)
- 242dcf99 [Enhancement] Upgrade dependencies and fix vulnerabilities (#1236)
- 3d72066f [Bug] Fixed image export bug due to mapbox attrition logo (#1229)
- f4951102 [Feat] add readonly prop to KeplerGl component (#1220)
- 04991352 [Enhancement] Added props to panel-header iconComponent (#64) (#1219)
- b91785ec [Feat] Auto detect h3 layer from h3 field data (#53) (#1218)

## [2.3.1] - Aug 4 2020

- [Bug] fix tooltip config, add boolean formatter (#1216)
- [Enhancement] Geocoder interaction improvements (#1214)
- [Enhancement] add options.autoCreateLayers to addDataToMap (#1215)
- [Bug] Hide BottomWidgetContainer nothing to render (#1213)
- [Enhancement] Cleanup unused babel plugins (#1211)
- [Bug] fix file handler row parsing to support single geojson feature (#1212)
- [Enhancement] Add KeplerGl.onDeckInitialized callback (#1193)
- [Enhancement] Render geocode in readOnly mode (#1177)
- [Feat] pass initialUiState to prop (#1187)
- [Docs] Fix `replace-component` Readme (#1207)
- [Jupyter] Convert to gdf to a dataframe instead of a copy (#1201)
- New image export approach (#1199)
- Add prop to disable file extension checking (#1195)
- Load: extract extensions from loader objects (#1194)
- Add `visState.loaders` to let app inject a list of loaders.gl loaders. (#1192)
- Enable modal prop types (#1190)
- Enable modal types (#1189)
- Add types to top-level KeplerGl component (#1188)
- Add typescript types for upload modal and components (#1185)
- Add types for composer helpers (#1186)
- [Feat] add zoom to coordinate tooltip (#1179)
- [Enhancement] export more layer configurator components (#1176)
- [Bug/Enhancement] Pass PanelHeader props to the onClick handler of action items (#1181)
- [Bug] Fix import of the user guide link (#1182)
- [examples] update example version to 2.3.0

## [2.3.0] - July 6 2020

- [Enhancement] Improve animation sliders (#1157)
- [Enhancement] speed control step to 0.001 (#1155)
- [website] remove unused env, relax on package engines requirement (#1173)
- [Feat] Pinned tooltip + Compare (#1132)
- [Feat] Integration with loaders.gl 2.2 (#1156)
- [Feat] Bump deck.gl and luma.gl to v8.2 (#1166)
- [Chore] Bump websocket-extensions from 0.1.3 to 0.1.4 (#1138)
- [Website] Add 2020 Survey (#1154)
- [Bug] Tooltip formatting (#1129)
- [Jupyter] Default centerMap to False so that zoom map state configurations are not (#1142)
- [Enhancement] close modal when press escape key (#1134)
- [Enhancement] Export time widget factories (#1133)
- [Enhancement] filter invalid value when calculate trip layer domain (#1131)
- [Feat] enable tooltip formatting in interaction config (#1102)
- [Feat] Add type definition (#1116)
- [RFC] table class RFC (#1109)
- [Docs] adding missing bracket (#1094)
- add side-panel inner class (#1113)
- [Bug] add hexagon layer translation (#1114)
- [Jupyter] fix gitignore add missing files (#1118)
- [Jupyter] Publish keplergl jupyter 0.2.0 (#1110)
- [Enhancement] fix attribution color, add kepler smaller font (#1092)

## [2.2.0] - May 10 2020

- [Enhancement] Added Editor and FeatureActionPanel factories (#1093)
- [Feat] Geocoder Search (#1068)
- [Doc] Updated release docs with gh-release instructions (#1059)
- [Bug] Aggregation layer fix out-of-domain coloring for valid strings (#1070)
- [Feat] Add Spanish and Catalan translation (#1087)
- [Doc] Update playback documentation (#1072)
- [Bug] Fix link to umd folder
- [Doc] Refactored doc files for better structure (#1084)
- [Enhancement] Add Portuguese translations (#1063)
- [Bug] Fixed download file for microsoft edge (#1074)
- [Bug] Fix broken redirects in jupyter user guide (#1077)
- [Docs] update upgrade guide (#1044)

## [2.1.2] - April 3 2020

- [Enhancement] Add support for localization and Finnish translations (#994)
- [Bug] Fixes for case sensitive fields in CARTO storage (#1057)
- [Chore] Removed engine requirements (#1049)
- [Chore] Improve the secondary button color for base theme (#1048)
- [Chore] Updated examples to v2.1.1 (#1043)

## [2.1.1] - March 31 2020

- [Chore] Updated example to 2.1.0 (#1041)

## [2.1.0] - March 30 2020

- [Enhancement] Remove table cell char limit and increased cell header height (#1038)
- [Docs] CHANGELOG.md markup update (#1029)
- [Enhancement] add classes to button for easier style override (#1035)
- [Bugfix] Remove incorrect outlier calculation for better map centering (#1026)
- [Bug] fix scatterplot stroke width in pixels (#1018)
- [Test] e2e test (#940)
- [Enhancement] Move layer panel visible toggle to end (#1017)
- [Bug] export formatCsv (#1022)
- [Enhancement] Refactor load file tasks to better handle multiple file types (#986)
- [Bug] Fixed carto-provider example: importing the correct kepler.gl processor path (#1016)
- [Feat] Add satellite basemap (#1007)
- [Feat] Improved data table rendering (#1010)
- [Chore] Upgrade to Node 10 (#1009)
- [Feat] S2 layer (#800)
- [BUG] Fix provider test (#1008)
- [Enhancement] better handling provider tile update (#1000)
- [Enhancement] Loading and error feedback for shared maps loaded from URL #1002 (#1003)
- [Enhancement] adjust button color in light theme (#1004)
- [Bug] Reset selected provider status after loading and before sharing (#999)
- [Feat] Add more light themes (#1001)
- [Bug] fix bug map loaded with custom map style not save correctly (#993)
- [Bug] Fix username set to null after loading map from URL #995 (#996)
- [Enhancement] Decrease filter step size for small domains (#958)

## [2.0.1] - March 9 2020

- [Bug] Add cloud-providers.js to package.json (#991)
- [Feat] CARTO provider for cloud storage (#985)
- [Bugfix] Fix typo on variable name (#987)
- [Enhancement] pass appWebsite to logo component (#984)
- [Chore] Removed testing from publish action (#980)
- [Bug] remove console.log in filter.utils
- [Feat] Load cloud map with provider (#947)

## [2.0.0] - Feb 25 2020

- [Enhancement] Independently customize Geojson layer fill stroke opacity (#966)
- [Bug] Fix text collision on toggle input (#973)
- [Chore] upgrade prettier to 1.19 to better handle single line function compositions (#971)
- [Style] run prettier and lint on tests (#968)
- [Bug] Select dataset filter bug (#965)
- [Bug] fix hexagon layer hover crash (#964)
- [Style] run prettier (#963)
- [Feat] Allow adding custom side panel tabs
- [Chore] Fix prettier update config (#767)
- [Bug] Fixed json map export and added tests (#956)
- [Bug] Resolve deck luma version conflict (#955)
- [Feat] upgrade to deck.gl@8 (#889)
- [Feat] UI for save map to backend storage (#906)
- [Bug] Fixed geo-filter extra layer issue (#936)
- [Bug] Fix low projection accuracy in higher zoom level (#946)
- [Bug] fix hexagon layer hover cause app crash (#933)
- [Bug] fix heatmap crash when there is no filter (#934)
- [Bug] should add redux devtools in demo app by default (#932)
- [Feat] Gpu data filter (#878)
- [Feat] Global export of image export constants (#923)
- [Bug] Fix mix int/float column interpreted as sting (#927)
- [Chore] Correctly update the copy changes to actions.js (#914)
- [Enhancement] Hide data modal in export map (#920)
- [Chore] remove action to publish to github package repo (#919)
- [Feat] Geo-Operations: create and apply polygon filters (#595)
- [Bug] Fix h3 layer projection error at edge of world map (#918)

## [1.1.13] - Jan 17 2020

- [Enhancement] added coordinate to tooltip export configuration (#876)
- [Bug] mapState not applied in exported map html (#913)
- [Chore] Update grammar, cleanup whitespace, fix broken link (#912)
- [Docs] add Upgrade-guide
- [Docs] Remove hyperlink with "Advanced Usage" (#903)
- [Docs] add initial cloud provider api (#868)
- [Enhancement] treat type-analyzer type: NUMBER as strings (#891)
- [Bug] remove argument.length check in injector (#899)
- [Enhancement] add disabled to layer-configurator group (#897)
- [Bug] Fix a bug in file-drop.js that causes error in server side render (#896)
- [Bug] Ensure all colors returned from get3DBuildingColor are RGB arrays (#871)
- [Chore] License 2020 (#883)
- [Bug] Correctly copy over field.filterProps when merging multiple filters (#884)
- [Bug] Fix newDateEntries typo and formatting fixes (#870)
- [Bug] Fix multiple geojson layer found when properties contain object and array (#872)
- [Bug] fix demo-app resolve react-redux (#866)

## [1.1.12] - Dec 14 2019

- [Bug] Remove sqrt, log from default color aggregation for count (#856)
- [Bug] fix cluster point count, cluster layer failed to render on export image (#855)
- [Style] Remove extra semicolon (#850)
- [Docs] Update api-reference overview links
- [Bug] Don't merge domain when update filter name (#841)
- [Enhancement] React 17: replace componentWillReceiveProps and componentWillMount (#745)
- [Bug] Fixed delete dataset action (#835)
- [Chore] Github action to publish npm package (#825)
- [Enhancement] Demo App Cloud provider refactor (#831)

## [1.1.11] - Nov 13 2019

- [Bug] Correctly save filterProps to field while merging filter from config (#829)
- [Docs] fixing api reference broken link (#812)
- [Bug] fix empty geometry causing trip layer detection to fail (#826)
- [Docs] update a-add-data-to-the-map.md with embed geometries in CSV

## [1.1.10] - Oct 30 2019

- [Docs] Add instructions for image and weblink in tooltip (#797)
- [Enhancement] Add Bug Report User Guides to demo app panel header (#787)
- [Docs] Fix typos in add-data-workflow-user-guide (#807)
- [Feat] add stdev and variance aggregators to aggregation layer (#809)
- [Feat] Multiple datasets per filter (#773)
- [Bug] Fixed loading urls with query params (#780)
- [Jupyter] Publish keplergl jupyter 0.1.2 (#784)

## [1.1.9] - Oct 11 2019

- [Enhancement] improve Geojson processing performance and error handling (#781)
- [Enhancement] add file format instruction to file upload (#770)
- [Bug] Filter invalid H3 IDs (#775)
- [Bug] fix readonly in addDataToMap (#783)
- [Enhancement] Expose LayerHoverInfoFactory and CoordinateInfoFactory (#769)
- [Bug] Fixed dropbox upload in Firefox. Passing explicit file name to upload function
- [Enhancement] Demo app sample info (#758)
- [Enhancement] Generate custom map style icon from style url (#762)
- [Jupyter][bug] fix lab widget window responsiveness, add version to header (#771)
- [Jupyter][docs] add installation instruction to jupyter widget user guide
- [Docs] Update add data to map docs
- [Jupyter] Publish keplergl-jupyter for Jupyter labs (#764)
- [Jupyter][bug] fix flashing html export when open in window (#756)
- [Enhancement] Add logo and GA to exported html (#757)
- [Docs] update Trip Layer md

## [1.1.8] - Sep 30 2019

- [Bug] Fix saving animation speed (#752)
- [Feat] Add Trip Layer - Final (#699)
- [Feat] add custom color editor (#601)
- [Chore] add coverall (#748)
- [Docs] mapboxApiUrl usage examples (#737)
- [Feat] Support Policy page (#724)

## [1.1.7] - Sep 11 2019

- [Enhancement] Create more factories from SourceDataCatalog, add onClickTitle (#720)
- [Enhancement] Express example (#704)
- [Bug] check new layers based on new dataset id (#721)
- [Feat] Add Log and Sqrt scale (#670)
- [Chore] Add a script to automatically edit kepler.gl version (#714)

## [1.1.6] - Sep 5 2019

- [Bug] Upgrade to deck 7.1.11 (#715)

## [1.1.5] - Sep 4 2019

- [Bug] Unlock luma.gl version (#713)
- [Bug] fix heatmap getBounds (#711)
- [Feat] HTML Export: provide read only mode (#709)

## [1.1.4] - Sep 3 2019

- [Bug] Lock deck.gl to version 7.1.5 (#688)
- [Enhancement] add keepExistingConfig option to addDataToMap (#619)
- [Bug] Fixed issue with geojson fields (#683)
- [Enhancement] Switch from callback refs to createRef (#622)
- [Bug] Fix uglify error compiling dom-to-image in prod (#682)
- [Enhancement] pass set useDevicePixels to deck.gl to plot container (#663)
- [jupyter] Upgrade to kepler.gl v1.1.3 (#660)
- [Chore] use xvfb as a service in travis-ci (#669)

## [1.1.3] - Aug 5 2019

- [Enhancement] Use preserved state to apply keplerGlInit. when mint=false (#649)
- [Enhancement] Replace react-data-grid with react-virtualized (#629)

## [1.1.2] - Aug 1 2019

- [Bug] Fix issue in Layer.registerVisConfig preventing custom boolean properties
- [Enhancement] Simplify map layer visible logic in splitMaps and deck, mapbox overlay renders (#642)
- Netlify badge (#641)
- [Enhancement] Add 3d building color editor (#633)
- [Enhancement] Update mapbox-gl css version (#634)
- [Bug] fix SolidPolygonLayer import causing 3d building layer crash (#625)
- [Bug] Don't show null for labels if there is no data (#626)
- [Bug] add deckGlProps to pass preserveDrawingBuffer to plot container (#624)
- [Enhancement] DemoApp: explicitly pass window.fetch to Dropbox to suppress warning (#621)
- [Enhancement] Use theme in histogram plot color (#607)
- [Enhancement] Bump supercluster version (#590)
- [Feat] Add mapboxApiUrl to `KeplerGL` (#554)
- [Docs] Update link to the GitHub repo (#589)
- Fixed python3 compatiability and wrong variable in string format (#587)
- [Bug] Remove isMouseOver state from MapPopover (#577)
- [Docs] fix: Correct Custom Theme Example Link (#578)
- [Bug][jupyter] Replacing print statement with () to make it Python 3 compatible (#582)
- Update build command: remove yarn since netlify runs yarn by default (#585)
- [Jupyter] cleanup examples (#574)
- [Feat] Publish keplergl jupyter 0.1.0a5 (#572)
- [Chore] Add issue template for kepler.gl Jupyter
- [Bug] Solve issue #547 avoid crash application (#564)

## [1.1.1] - Jun 24 2019

- [Bug] Fix radius rendering when value = 0 (#551)
- [Docs] Updating Layer User Guides (#373)
- [Feat] Display mouse coordinate (#550)
- [Docs] Replace CLA with DCO (162a9f7)
- [Style] fix README typo (c1fafbf)
- [Docs] Add jupyter widget user guide link o README (17d3ec8)
- [Chore] Add jupyter widget issue templates (a40c1fe)
- [Feat] Bump deck.gl to v7.1.5 (#568)
- [Feat] Add ScenegraphLayer (#540)
- [Feat] Add kepler.gl-jupyter python package (#543)

## [1.1.0] - Jun 15 2019

- Upgrade to deck.gl 7.1 (#559)
- [Docs] update user documentation with newer layers and features (#552)
- Upgrade to deck.gl 7 and luma.gl 7 (#544)
- [Bug] Display color legend for stroke color scale (#546)
- [Enhancement] Image export error handling (#538)
- [Bug] Fix typo on layer-configurator.js (#549)

## [1.0.0] - May 23 2019

- [Enhancement] Detecting mapbox token validity (#513)
- [Enhancement] Netlify webpack optimization (#525)
- [Feat] More control over point label (#515)
- [Enhancement] Applied changes for enable netlify deployment (#516)
- [Enhancement] Refactored modal dialog to be more responsive (#501)
- [Bug] fix side panel unnecessary rerender (#512)
- [Feat] Upgrade deck.gl to 6.4 (#456)
- [BUG] Fixed layer list sorting dnd effect (#509)
- [Feat] add onViewStateChange callback to KeplerGl (#506)
- [Enhancement] More granular speed control (#500)
- [Docs] update all uber links to keplergl org (#502)

## [1.0.0-2] - May 2 2019

- [Bug] Fix missing default map styles after loading custom map style from saved json (#490)
- [Bug] Fix `fix radius` in point layer unclickable (#491)
- [Bug] fix image export doesnt get called when map rendered (#494)
- [Enhancement] Merge export config and map into one interaction (#488)

## [1.0.0-1] - Apr 23 2019

- [Bug] Fix point layer brushing and highlight (#487)
- [Feat] Add a light theme to KeplerGl Prop (#489)
- [Bug] Fix browse for file upload (#486)
- [Enhancement] Cleanup load map style tasks (#472)
- [Enhancement] load svg icons from aws, add bundle analyzer, reduce bundle size -1mb (#479)
- [Bug] upgrade kepler.gl version in examples
- [Docs] Fixed link to addDataToMap (#459)
- [Enhancement] expand bottom widget to full length if in read only mode(#465)

## [1.0.0-0] - Apr 2 2019

- [Enhancement] Replace react anything sortable with React-Sortable-Hoc
- [Enhancement] Replaced DI object storage with an actual Map
- [Feat] Able to overwrite custom theme
- [Chore] Upgraded waypoint library to support react16
- [Chore] Dropbox UI enhancements
- [Bug] Fix points disappear while panning across 180th meridian
- [Chore] Tweak save and export documentation
- [Chore] Add oss header and middleware.js
- [Chore] Added file header for user-guide.js
- [Feat] Single map page export
- [Chore] Upgraded libraries: react, styled-components

##### BREAKING CHANGES

- React 15 is no longer supported
- Style components v4+ is now required because is now a peer dependency

## [0.2.4] - Mar 13 2019

- [Enhancement] Slider: use clientX to calculate delta to support windows IE and Tableau kepler.gl (#431)
- [Bug] Range slider: correctly setting ranch brush selection when mount (#433)
- [Feat] Add getMapboxRef prop (#372)
- [Enhancement] Automatically loading custom dependencies when inject custom component factor (#430)
- [Bug] Range brush width change should not trigger onBrush callback (#432)
- [Bug] fix processor export, support previous (#428)

## [0.2.3] - Mar 3 2019

- [Docs] Export processors and Add Docs (#421)
- [Docs] Add docs for actions and updaters (#368)
- [Bug] Fix image export component failed to render (#418)

## [0.2.2] - Feb 26 2019

- (HEAD -> master, origin/master, origin/HEAD) [Bug] Fixed web doc link (#369)
- [Bug]: Fixed example dependencies (#362)
- [Bug] Fix missing 3d building layer in image export (#361)
- [Bug] fix 3d building layer missing mapbox token, fix image export (#360)
- [Docs] Add API Docs (#279)
- [Feature] UMD module in unpkg (#349)
- Disabled banner (#352)

## [0.2.1] - Feb 6 2019

- (HEAD -> master, origin/master) [Feature] Collapsible layer group (#350)
- [Enhancement] Added default feature flags to disable dropbox (#338)
- [Bug]: fix alias and module resolve in webpack.config.local (#348)
- [Enhancement] Upgraded Webpack, Babel and Eslint (#342)
- [Feature] Notification systems with new UI panel and helpers to generate messages (#333)
- GitHub browser history (#321)
- [Bug] Fix Maximum call stack size exceeded when double click (#323)
- [Docs] Export identity actions individually and add JSDocs (#290)
- [Docs] Edit PR guidance in contribution guidelines (#320)
- [Docs] Add Contribution Guidelines (#261)
- (overide-style) [Enhancement] Upgrade type-analyzer to pass 0/1 as integer (#317)
- [Typo] Misspellings in comments (#314)
- [Housekeeping] Update Copyright header to 2019, Happy New Year (#316)
- Feat: Implemented Dropbox integration (#312)

## [0.2.1-beta.1] - Dec 17 2018

- [Feature] Added a Tiled 3D Building Deck.gl Layer (#270)
- [Enhancement] Fossa Integration (#309)
- [Enhancement] Change BottomWidget to pure functional component (#249)
- [Docs]: updated docs for better readability(alignments) (#255)
- [Enhancement] export processKeplerglJSON from processors (#299)
- [website] BugFix: missing tracking payload (#311)
- [Enhancement] Hexbin Layer: smaller radius step and dynamic hover (#310)
- [Bug] remove unpm from yarn.lock (#303)
- [Enhancement] use mapbox style url for default (published) uber map styles (#292)
- [Feature] Load data and kepler.gl file using URLs (#260)

## [0.2.1-beta.0] - Nov 16 2018

- [Bug] Fixing global color issue #130 for the heat map (#277)
- [Enhancement] More exports (#284)

## [0.2.0] - Nov 16 2018

- [Enhancement] Export side panel component factories (#282)
- [Feature] Upgrade to deck.gl v6 (#272)
- [Refactor] Small update of readability (#250)
- [website] Click logo should go to kepler.gl website (#251)
- [Enhancement] Add contribution guidelines on contributing.md file (#108)
- [Enhancement] Scan through all text labels to get the entire character set (#245)

## [0.1.6] - Oct 3 2018

- [Enhancement] save and load text label config (#242)

## [0.1.5] - Oct 2 2018

- [Enhancement] Fix z-fighting issue between text label and scatter plot (#234)
- [Bug] Sort color steps (#241)
- [Bug] fix a bug where field is valid is always false (#240)

## [0.1.4] - Sep 15 2018

- [Enhancement] Null check for missing arc column (#235)

## [0.1.3] - Sep 10 2018

- [Enhancement] Add H3 layer (#217) (#198)
- [Enhancement] Add text label in Point layer (#166)

## [0.1.2] - Aug 24 2018

- [Bug] Fix server render error, remove react-ace (#206)

## [0.1.1] - Aug 24 2018

- [Enhancement] Bump react-palm@1.1.2 (#215)

## [0.1.0] - Aug 21 2018

- Upgrade to Deck.gl v5.3.4 (#153)

## [0.0.28] - Aug 8 2018

- Fix cluster layer label rendering

## [0.0.27] - Aug 3 2018

- Fix unable to fetch external stylesheets when taking the screenshot (#187)
- [Bug] Avoid repeatedly calling HIDE_EXPORT_DROPDOWN (#180)

## [0.0.26] - Aug 3 2018

- [Bug] fix mapStyles loaded as an empty object after load map from config (#169)

## [0.0.25] - Jul 10 2018

- [Bug] Create ellipsis when dataset name is a long name (#109)
- [Enhancement] Save custom reducer initialState, add custom-reducer example (#159)

## [0.0.24] - Jul 5 2018

- [Bug] fix image export failing (#155)
- [Enhancement] Add default map styles to mapStyle reducer initial state (#147)

## [0.0.23] - Jun 28 2018

- [Enhancement] Consider all mew layers when calculating the map bounds (#142)
- [Bug] Fix icon layer instructions (#131)
- [Website] add banner to demo app for survey (#117)

## [0.0.22] - Jun 10 2018

- [Bug] new filter shouldn't be enlarged if there is already an enlarged filter (#93)
- [Enhancement] Enable ordinal aggregation in aggregation layer (hex, grid, cluster) (#29)

## [0.0.21][0.0.20] - Jun 4 2018

- [Bug] TimeRangeSlider should not cache props.onChange (#100)

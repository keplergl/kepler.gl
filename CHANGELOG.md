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
#### [1.1.11] - Nov 13 2019
[Bug] Correctly save filterProps to field while merging filter from config (#829)
[Docs] fixing api reference broken link (#812)
[Bug] fix empty geometry causing trip layer detection to fail (#826)
[Docs] update a-add-data-to-the-map.md with embed geometries in CSV

#### [1.1.10] - Oct 30 2019
- [Docs] Add instructions for image and weblink in tooltip (#797)
- [Enhancement] Add Bug Report User Guides to demo app panel header (#787)
- [Docs] Fix typos in add-data-workflow-user-guide (#807)
- [Feat] add stdev and variance aggregators to aggregation layer (#809)
- [Feat] Multiple datasets per filter (#773)
- [Bug] Fixed loading urls with query params (#780)
- [Jupyter] Publish keplergl jupyter 0.1.2 (#784)

#### [1.1.9] - Oct 11 2019
- [Enhancement] improve Geojson processing performance and error handling (#781)
- [Enhancement] add file format instruction to file upload (#770)
- [Bug] Filter invalid H3 IDs (#775)
- [Bug] fix readonly in addDataToMap (#783)
- [Enhancement] Expose LayerHoverInfoFactory and CoordinateInfoFactory (#769)
- [Bug] Fixed dropbox upload in Firefox. Passing explicit file name to upload function
- [Enhancement] Demo app sample info (#758)
- [Enhancement] Generate custom map style icon from style url (#762)
- [Jupyter] [Bug] fix lab widget window responsiveness, add version to header (#771)
- [Jupyter] [Docs] add installation instruction to jupyter widget user guide
- [Docs] Update add data to map docs
- [Jupyter] Publish keplergl-jupyter for Jupyter labs (#764)
- [Jupyter] [Bug] fix flashing html export when open in window (#756)
- [Enhancement] Add logo and GA to exported html (#757)
- [Docs] update Trip Layer md

#### [1.1.8] - Sep 30 2019
- [Bug] Fix saving animation speed (#752)
- [Feat] Add Trip Layer - Final (#699)
- [Feat] add custom color editor (#601)
- [Chore] add coverall (#748)
- [Docs] mapboxApiUrl usage examples (#737)
- [Feat] Support Policy page (#724)

#### [1.1.7] - Sep 11 2019
- [Enhancement] Create more factories from SourceDataCatalog, add onClickTitle (#720)
- [Enhancement] Express example (#704)
- [Bug] check new layers based on new dataset id (#721)
- [Feat] Add Log and Sqrt scale (#670)
- [Chore] Add a script to automatically edit kepler.gl version (#714)

#### [1.1.6] - Sep 5 2019
- [Bug] Upgrade to deck 7.1.11 (#715)

#### [1.1.5] - Sep 4 2019
- [Bug] Unlock luma.gl version (#713)
- [Bug] fix heatmap getBounds (#711)
- [Feat] HTML Export: provide read only mode (#709)

#### [1.1.4] - Sep 3 2019
- [Bug] Lock deck.gl to version 7.1.5 (#688)
- [Enhancement] add keepExistingConfig option to addDataToMap (#619)
- [Bug] Fixed issue with geojson fields (#683)
- [Enhancement] Switch from callback refs to createRef (#622)
- [Bug] Fix uglify error compiling dom-to-image in prod (#682)
- [Enhancement] pass set useDevicePixels to deck.gl to plot container (#663)
- [jupyter] Upgrade to kepler.gl v1.1.3 (#660)
- [Chore] use xvfb as a service in travis-ci (#669)

#### [1.1.3] - Aug 5 2019
- [Enhancement] Use preserved state to apply keplerGlInit. when mint=false (#649)
- [Enhancement] Replace react-data-grid with react-virtualized (#629)

#### [1.1.2] - Aug 1 2019
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
- [Bug] [Jupyter] Replacing print statement with () to make it Python 3 compatible (#582)
- Update build command: remove yarn since netlify runs yarn by default (#585)
- [Jupyter] cleanup examples (#574)
- [Feat] Publish keplergl jupyter 0.1.0a5 (#572)
- [Chore] Add issue template for kepler.gl Jupyter
- [Bug] Solve issue #547 avoid crash application (#564)

#### [1.1.1] - Jun 24 2019
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

#### [1.1.0] - Jun 15 2019
- Upgrade to deck.gl 7.1 (#559)
- [Docs] update user documentation with newer layers and features (#552)
- Upgrade to  deck.gl 7 and luma.gl 7 (#544)
- [Bug] Display color legend for stroke color scale (#546)
- [Enhancement] Image export error handling (#538)
- [Bug] Fix typo on layer-configurator.js (#549)

#### [1.0.0] - May 23 2019
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

#### [1.0.0-2] - May 2 2019
- [Bug] Fix missing default map styles after loading custom map style from saved json (#490)
- [Bug] Fix `fix radius` in point layer unclickable (#491)
- [Bug] fix image export doesnt get called when map rendered (#494)
- [Enhancement] Merge export config and map into one interaction (#488)

#### [1.0.0-1] - Apr 23 2019
- [Bug] Fix point layer brushing and highlight (#487)
- [Feat] Add a light theme to KeplerGl Prop (#489)
- [Bug] Fix browse for file upload (#486)
- [Enhancement] Cleanup load map style tasks (#472)
- [Enhancement] load svg icons from aws, add bundle analyzer, reduce bundle size -1mb (#479)
- [Bug] upgrade kepler.gl version in examples
- [Docs] Fixed link to addDataToMap (#459)
- [Enhancement] expand bottom widget to full length if in read only mode(#465)

#### [1.0.0-0] - Apr 2 2019
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

#### [0.2.4] - Mar 13 2019
- [Enhancement] Slider: use clientX to calculate delta to support windows IE and Tableau kepler.gl (#431)
- [Bug] Range slider: correctly setting ranch brush selection when mount (#433)
- [Feat] Add getMapboxRef prop (#372)
- [Enhancement] Automatically loading custom dependencies when inject custom component factor (#430)
- [Bug] Range brush width change should not trigger onBrush callback (#432)
- [Bug] fix processor export, support previous  (#428)

#### [0.2.3] - Mar 3 2019
- [Docs] Export processors and Add Docs (#421)
- [Docs] Add docs for actions and updaters (#368)
- [Bug] Fix image export component failed to render (#418)

#### [0.2.2] - Feb 26 2019
- (HEAD -> master, origin/master, origin/HEAD) [Bug] Fixed web doc link (#369)
- [Bug]: Fixed example dependencies (#362)
- [Bug] Fix missing 3d building layer in image export (#361)
- [Bug] fix 3d building layer missing mapbox token, fix image export (#360)
- [Docs] Add API Docs (#279)
- [Feature] UMD module in unpkg (#349)
- Disabled banner (#352)

#### [0.2.1] - Feb 6 2019
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

#### [0.2.1-beta.1] - Dec 17 2018
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

#### [0.2.1-beta.0] - Nov 16 2018
- [Bug] Fixing global color issue #130 for the heat map (#277)
- [Enhancement] More exports (#284)

#### [0.2.0] - Nov 16 2018
- [Enhancement] Export side panel component factories (#282)
- [Feature] Upgrade to deck.gl v6 (#272)
- [Refactor] Small update of readability (#250)
- [website] Click logo should go to kepler.gl website (#251)
- [Enhancement] Add contribution guidelines on contributing.md file (#108)
- [Enhancement] Scan through all text labels to get the entire character set (#245)

#### [0.1.6] - Oct 3 2018
- [Enhancement] save and load text label config (#242)

#### [0.1.5] - Oct 2 2018

- [Enhancement] Fix z-fighting issue between text label and scatter plot (#234)
- [Bug] Sort color steps (#241)
- [Bug] fix a bug where field is valid is always false (#240)

#### [0.1.4] - Sep 15 2018

- [Enhancement] Null check for missing arc column (#235)

#### [0.1.3] - Sep 10 2018

- [Enhancement] Add H3 layer (#217) (#198)
- [Enhancement] Add text label in Point layer (#166)

#### [0.1.2] - Aug 24 2018

- [Bug] Fix server render error, remove react-ace (#206)

#### [0.1.1] - Aug 24 2018

- [Enhancement] Bump react-palm@1.1.2 (#215)

#### [0.1.0] - Aug 21 2018

- Upgrade to Deck.gl v5.3.4 (#153)

#### [0.0.28] - Aug 8 2018
- Fix cluster layer label rendering

#### [0.0.27] - Aug 3 2018
- Fix unable to fetch external stylesheets when taking the screenshot (#187)
- [Bug] Avoid repeatedly calling HIDE_EXPORT_DROPDOWN  (#180)

#### [0.0.26] - Aug 3 2018
- [Bug] fix mapStyles loaded as an empty object after load map from config (#169)

#### [0.0.25] - Jul 10 2018
- [Bug] Create ellipsis when dataset name is a long name (#109)
- [Enhancement] Save custom reducer initialState, add custom-reducer example (#159)

#### [0.0.24] - Jul 5 2018
- [Bug] fix image export failing (#155)
- [Enhancement] Add default map styles to mapStyle reducer initial state (#147)

#### [0.0.23] - Jun 28 2018
- [Enhancement] Consider all mew layers when calculating the map bounds (#142)
- [Bug] Fix icon layer instructions (#131)
- [Website] add banner to demo app for survey (#117)

#### [0.0.22] - Jun 10 2018
- [Bug] new filter shouldn't be enlarged if there is already an enlarged filter (#93)
- [Enhancement] Enable ordinal aggregation in aggregation layer (hex, grid, cluster) (#29)

#### [0.0.21][0.0.20] - Jun 4 2018
- [Bug] TimeRangeSlider should not cache props.onChange (#100)

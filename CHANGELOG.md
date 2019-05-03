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

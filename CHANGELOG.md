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

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

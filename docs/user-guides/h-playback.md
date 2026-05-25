# Playback

Follow these steps to create a playback video of an event:
1. Add a filter based on a time-related field, like timestamp. For GeoJson, property field should contain a timestamp entry.

2. The playback window will appear on the bottom of the map. The bars are distribution graphs of all data points by time. Select the desired rolling time window:

![select filters](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/h-playback-1.png "select filters")

3. Press play to start the video. Click on the speed value and select/input your desired value _1x_, _2x_, _4x_ on the top right to change the playback speed.

![change speed](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/h-playback-2.gif "select filters")

4. Choose custom y axis. You can click __Select Y Axis__ to change the default distribution graph to a timeseries of the selected column. An example use of this function is to show a distance vs. time graph of a given trip.

![custom y axis](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/h-playback-3.png "select filters")

## Zoom & precision controls

The enlarged timeline now lets you stay focused on the portion that matters:

- Use the mouse wheel to resize the window under the cursor, and pinch (or hold <kbd>Ctrl</kbd> on Windows/Linux or <kbd>⌘</kbd> on macOS while scrolling) to zoom the full timeline.
- A lightweight "Showing" bar appears whenever the full range is narrowed—click **Reset** to return to the original domain.
- Hold <kbd>Ctrl</kbd> (Windows/Linux) or <kbd>⌘</kbd> (macOS) and press the arrow keys to pan left/right, with <kbd>Shift</kbd> for bigger steps.


[Back to table of contents](README.md)

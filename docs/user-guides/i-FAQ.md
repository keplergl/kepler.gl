# FAQ

## Can I export my map to a video file?
Kepler.gl does not have built-in functionality for exporting video. It only allows you to export maps as an image. However, you can use screen capture softwares such as Quicktime Player, LICEcap, Giffy, and others to export your map.

## How can I get data from my back-end service into Kepler.gl?
You can create a react redux app with kepler.gl as your map display component, requesting data with any kind of server-side calls. The kepler.gl demo app uses simple AJAX calls to load data from a URL.

## Is there a limit on the number of datasets that can be added to a map?
There is no limit, but the more datasets you add, the more likely it is that performance will suffer. 

## What is the maximum file upload size?
Kepler.gl accepts files no larger than 250mb in chrome. You can load bigger files in safari, but performance will be limited.

## How many layers can I add to a map?
There is no limit on the amount of layers you can add. However, note that the more layers you have on your map, the more likely it is that performance will suffer. 

## Why does my layer color change during filtering?
When layer color is based on a numerical value (e.g, trip fare, distance, ETA), Kepler.gl recalculates the color scale based on filtered data. This is not the case for categorical values such as vehicle_name, cuisine_type and app version.

[Back to table of contents](README.md)

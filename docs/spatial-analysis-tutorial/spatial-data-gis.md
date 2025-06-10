# Spatial Data Wrangling (2) – GIS Operations

Original GeoDa lab: https://geodacenter.github.io/workbook/01_datawrangling_2/lab1b.html

## Introduction

Even though Kepler.gl and GeoDa are not GIS by design, a range of spatial data manipulation functions are available that perform some specialized GIS operations. This includes ~~an efficient treatment of projections~~, conversion between points and polygons, the computation of a minimum spanning tree, and spatial aggregation and spatial join through multi-layer support.

## Objectives

- Understand how projections are expressed in a coordinate reference system (CRS)
- ~~Be able to efficiently change from one projection to another~~
- Create shape centers (mean center and centroid) for polygons
- Construct Thiessen polygons for a point layer
- Compute a minimum spanning tree based on the max-min distance between points
- Operate on more than one layer
- Dissolve areal units and compute aggregate values
- Compute aggregate values based on a common indicator in a table
- Implement a spatial join to carry out point in polygon operations
- ~~Visualize the common link between two layers~~

## Preliminaries

We will continue to illustrate the various operations by means of a series of example data sets, all contained in the GeoDa Center data set collection.

Some of these are the same files used in the previous chapter. For the sake of completeness, we list all the sample data sets used:

- Chicago commpop: population data for 77 Chicago Community Areas in 2000 and 2010 https://geodacenter.github.io/data-and-lab/data/chicago_commpop.geojson

- Groceries: the location of 148 supermarkets in Chicago in 2015 https://geodacenter.github.io/data-and-lab//data/chicago_sup.geojson

- Natregimes: homicide and socio-economic data for 3085 U.S. counties in 1960-1990 https://geodacenter.github.io/data-and-lab/data/natregimes.geojson

- Home Sales: home sales in King County, WA during 2014-2015 (point data) https://geodacenter.github.io/data-and-lab//data/KingCountyHouseSales2015.geojson

## Projections

Spatial observations need to be georeferenced, i.e., associated with specific geometric objects for which the location is represented in a two-dimensional Cartesian coordinate system. Since all observations originate on the surface of the three-dimensional near-spherical earth, this requires a transformation. The transformation involves two steps that are often confused by non-geographers. The topic is complex and forms the basis for the discipline of geodesy. A detailed treatment is beyond our scope, but a good understanding of the fundamental concepts is important. The classic reference is Snyder (1993), and a recent overview of a range of technical issues is offered in Kessler and Battersby (2019).

The basic building blocks are degrees latitude and longitude that situate each location with respect to the equator and the Greenwich Meridian (near London, England). Longitude is the horizontal dimension (x), and is measured in degrees East (positive) and West (negative) of Greenwich, ranging from 0 to 180 degrees. Since the U.S. is west of Greenwich, the longitude for U.S. locations is negative. Latitude is the vertical dimension (y), and is measured in degrees North (positive) and South (negative) of the equator, ranging from 0 to 90 degrees. Since the U.S. is in the northern hemisphere, its latitude values will be positive.

In Kepler.gl, the WGS84 geographic coordinate system is used by default. All data is visualized using latitude and longitude in this system to represent geographic locations accurately. Note: the GeoJSON format uses the WGS84 geographic coordinate system by default. If you have datasets not in the WGS84 geographic coordinate system, you can convert them to WGS84 using GeoDa software (see [Reprojection](https://geodacenter.github.io/workbook/01_datawrangling_2/lab1b.html#mean-centers-and-centroids)).

However, when computing geometric measurements—such as distance, buffer, area, length, and perimeter—the AI assistant automatically uses GeoDa library to convert geographic coordinates (latitude and longitude) into projected coordinates (easting and northing) using the UTM projection with the WGS84 datum. This ensures accurate calculations in meters.

For Universal Transverse Mercator or UTM, the global map is divided into parallel zones, as shown in Figure below. With each zone corresponds a specific projection that can be used to convert geographic coordinates (latitude and longitude) into projected coordinates (easting and northing).

<img width="1042" alt="Screenshot 2025-06-08 at 5 01 00 PM" src="https://geodacenter.github.io/workbook/01_datawrangling_2/pics1b/00_utm_zones.png" />
UTM zones for North America (source: GISGeography)

## Converting Between Points and Polygons

So far, we have represented the geography of the community areas by their actual boundaries. However, this is not the only possible way. We can equally well choose a representative point for each area, such as a mean center or a centroid. In addition, we can create new polygons to represent the community areas as tessellations around those central points, such as Thiessen polygons. The key factor is that all three representations are connected to the same cross-sectional data set. As we will see in later chapters, for some types of analyses it is advantageous to treat the areal units as points, whereas in other situations Thiessen polygons form a useful alternative to dealing with an actual point layer.

The center point and Thiessen polygon functionality is brought up through the options menu associated with any map view (right click on the map to bring up the menu). We illustrate these features with the projected community area map we just created.

### Mean centers and centroids

The **mean centers** is obtained as the simple average of the the X and Y coordinates that define the vertices of the polygon. The **centroid** is more complex, and is the actual center of mass of the polygon (image a cardboard cutout of the polygon, the centroid is the central point where a pin would hold up the cutout in a stable equilibrium).

Both methods can yield strange results when the polygons are highly irregular or in a so-called multi-polygon situation (different polygons associated with the same ID, such as a mainland area and an island belonging to the same county). In those instances the centers can end up being located outside the polygon. Nevertheless, the shape centers are a handy way to convert a polygon layer to a corresponding point layer with the same underlying geography. For example, as we will see in a later chapter, they are used under the hood to calculate distance-based spatial weights for polygons.

To add centroids of the map layer, you can use the following prompt to create a map layer first:

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/chicago_commpop.geojson?
```

After the map layer is created, you can add centroids by just prompting:

```
Can you get the centroids of the map layer and save it as a new dataset?
```

<img width="1042" alt="Screenshot 2025-06-08 at 5 01 00 PM" src="https://github.com/user-attachments/assets/00000000-0000-0000-0000-000000000000" />

### Thiessen polygons

Point layers can be turned into a so-called tessellation or regular tiling of polygons centered around the points. Thiessen polygons are those polygons that define an area that is closer to the central point than to any other point. In other words, the polygon contains all possible locations that are nearest neighbors to the central point, rather than to any other point in the data set. The polygons are constructed by considering a line perpendicular at the midpoint to a line connecting the central point to its neighbors.

For example, we can prompt the AI assistant to create Thiessen polygons for the point layer:

```
Can you create Thiessen polygons for the point layer?
```

<img width="1042" alt="Screenshot 2025-06-08 at 5 01 00 PM" src="https://github.com/user-attachments/assets/00000000-0000-0000-0000-000000000000" />

### Minimum spanning tree

A graph is a data structure that consists of nodes and vertices connecting these nodes. In our later discussions, we will often encounter a connectivity graph, which shows the observations that are connected for a given distance band. The connected points are separated by a distance that is smaller than the specified distance band.

An important graph is the so-called max-min connectivity graph, which shows the connectedness structure among points for the smallest distance band that guarantees that each point has at least one other point it is connected to.

A minimum spanning tree (MST) associated with a graph is a path through the graph that ensures that each node is visited once and which achieves a minimum cost objective. A typical application is to minimize the total distance traveled through the path. The MST is employed in a range of methods, particularly clustering algorithms.

The Ai assistant uses GeoDa library to construct an MST based on the max-min connectivity graph for any point layer. The construction of the MST employs Prim’s algorithm, which is illustrated in more detail in the [Appendix](https://geodacenter.github.io/workbook/01_datawrangling_2/lab1b.html#appendix).

To create a minimum spanning tree for the point layer, you can use the following prompt:

```
Can you create a minimum spanning tree for the point layer?
```

## Aggregation

Spatial data sets often contain identifiers of larger encompassing units, such as states for counties, or census tracts for individual household data. Spatial disolve is a function that allows us to aggregate the smaller units into the larger units.

We illustrate this functionality with the natregimes dataset.
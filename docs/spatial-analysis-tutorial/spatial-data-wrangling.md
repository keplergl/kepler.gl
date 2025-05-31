# Spatial Data Wrangling

## Introduction

In this chapter, we tackle the topic of data wrangling, i.e., the process of getting data from its raw input into a form that is amenable for analysis. This is often considered to be the most time consuming part of a data science project, taking as much as 80% of the effort (Dasu and Johnson 2003). However, with Kepler.gl AI Assistant, we can now achieve the same data manipulation goals with significantly less effort compared to traditional approaches using software like GeoDa.

While data wrangling has increasingly evolved into a field of its own, with a growing number of operations turning into automatic procedures embedded into software (Rattenbury et al. 2017), the integration of AI assistance represents the next evolution in making these processes even more intuitive and efficient. A detailed discussion of the underlying technical implementations is beyond our scope, but we'll provide practical examples of how to harness this technology for your spatial analysis needs.

### Objectives

- Load a spatial layer from a range of formats
- Create a point layer from coordinates in a table
- Create a grid layer
- Create new variables
- Variable standardization
- Merging tables

## Preliminaries

We will illustrate the basic data input operations by means of a series of example data sets, all contained in the GeoDa Center data set collection.

Specifically, we will use files from the following data sets:

- Chicago commpop: population data for 77 Chicago Community Areas in 2000 and 2010
- Groceries: the location of 148 supermarkets in Chicago in 2015
- Natregimes: homicide and socio-economic data for 3085 U.S. counties in 1960-1990
- SanFran Crime: San Francisco crime incidents in 2012 (point data)

You can download these data sets from the [GeoDa Center data and lab](https://geodacenter.github.io/data-and-lab). In this tutorial, we will use the following urls:

- Chicago commonpop: https://geodacenter.github.io/data-and-lab/data/chicago_commpop.geojson
- Groceries: https://geodacenter.github.io/data-and-lab//data/chicago_sup.geojson
- Natregimes: https://geodacenter.github.io/data-and-lab/data/natregimes.geojson
- SanFran Crime: https://geodacenter.github.io/data-and-lab/data/SFcartheft_july12.geojson

A GeoJSON file is simple text and can easily be read by humans. As shown in Figure below, we see how the locational information is combined with the attributes. After some header information follows a list of features. Each of these contains properties, of which the first set consists of the different variable names with the associated values, just as would be the case in any standard data table. However, the final item refers to the geometry. It includes the type, here a MultiPolygon, followed by a list of x-y coordinates. In this fashion, the spatial information is integrated with the attribute information.

<img width="1087" alt="Screenshot 2025-05-30 at 4 06 36 PM" src="https://geodacenter.github.io/workbook/01_datawrangling_1/pics1a/00_geojson.png" />

### Spatial Data and GIS files

If you are not familiar with spatial data and GIS files, you can refer to the [Spatial Data and GIS files](https://geodacenter.github.io/workbook/01_datawrangling_1/lab1a.html) chapter.

### Polygon Layer

Most of the analyses covered in these chapters will pertain to areal units, or polygon layers. In Kepler.gl, you can drag and drop the e.g. chicago_commonpop.geojson file to load the data and create a polygon layer automatically (see [Add Data to your Map](https://docs.kepler.gl/docs/user-guides/j-get-started)).

Here we will use the AI Assistant to load the data and create a polygon layer.

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/chicago_commpop.geojson
?
```
<img width="1087" alt="Screenshot 2025-05-30 at 4 06 36 PM" src="https://github.com/user-attachments/assets/f0ac871e-a321-47e8-9e7c-e635d16cc250" />


### Point Layer

Point layer GIS files are loaded in the same fashion. For example, we can load the chicago_sup.geojson file to create a point layer.

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/chicago_sup.geojson?
```

<img width="1079" alt="Screenshot 2025-05-30 at 4 35 31 PM" src="https://github.com/user-attachments/assets/0b85a3c6-45b7-4660-aa63-b0cc8147c6f1" />

### Tabular files

Tabular files e.g. the comma separated value (csv) files are also supported. For example, we can load the commpopulation.csv file, which doesn't contain any geometric data.

```
Can you load a dataset from https://geodacenter.github.io/data-and-lab/data/commpopulation.csv?
```

<img width="1205" alt="Screenshot 2025-05-30 at 6 22 22 PM" src="https://github.com/user-attachments/assets/04593e4e-ff28-4551-8eb9-82442bc5ece6" />

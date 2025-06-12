# Basic Mapping

Original GeoDa lab by Luc Anselin: https://geodacenter.github.io/workbook/3a_mapping/lab3a.html

## Introduction

In this Chapter, we will explore a range of mapping and geovisualization options. We start with a review of common thematic map classifications. We next focus on different statistical maps, in particular maps that are designed to highight extreme values or outliers. We also illustrate maps for categorical variables (unique value maps), and their extension to multiple categories in the form of co-location maps. We close with a review of some special approaches to geovisualization, i.e., ~~conditional maps~~, the cartogram and map animation.

 The main objective is to use the maps to interact with the data as part of the exploration process.

## Preliminaries

We will illustrate the various operations by means of the data set with demographic and socio-economic information for 55 New York City sub-boroughs.

- [nyc](https://geodacenter.github.io/data-and-lab/nyc/) socio-economic data for 55 New York City sub-boroughs: https://geodacenter.github.io/data-and-lab/data/nyc.geojson

## Thematic Maps – Overview

We start by loading the NYC sub-boroughs dataset:

```
Load the dataset https://geodacenter.github.io/data-and-lab/data/nyc.geojson
```

Common map classifications include the Quantile Map, Natural Breaks Map, and Equal Intervals Map. Specialized classifications that are designed to bring out extreme values include the Percentile Map, Box Map (with two options for the hinge), and the Standard Deviation Map. The Unique Values Map does not involve a classification algorithm, since it uses the integer/string values of a categorical variable itself as the map categories. The Co-location Map is an extension of this principle to multiple categorical variables. Finally, Custom Breaks allows for the use of customized classifications.

### Common map classifications

#### Quantile Map

A quantile map is based on sorted values for a variable that are then grouped into bins that each have the same number of observations, the so-called quantiles. The number of bins corresponds to the particular quantile, e.g., five bins for a quintile map, or four bins for a quartile map, two of the most commonly used categories.

For example, we can create a quantile map for the variable `rent2008` with 4 categories (quartile map):

```
Can you create a quantile map for the variable 'rent2008' with 4 categories?
```

or

```
Can you create a quartile map for the variable 'rent2008'?
```

<img width="1042" alt="Screenshot 2025-06-12 at 12 09 10 PM" src="https://github.com/user-attachments/assets/a0638653-2c12-4510-9176-64e66df0f6f2" />

:::tip
LLM has the 'knowledge' that to create a quartile map, it will use the quantile map with 4 categories.
:::

The quantile map has been created with a default color scheme. If you want to replicate the same result in original GeoDa lab which use the colorbrewer2.org color scheme 'YlOrBr', you can use the following prompt:

```
Can you update the colors of the layers using colorBrewer's 4-class YlOrBr color scheme?
```

<img width="1046" alt="Screenshot 2025-06-12 at 12 23 06 PM" src="https://github.com/user-attachments/assets/b6706233-9484-417c-9bbb-fdac937e5fc8" />


#### Natural Breaks Map

The Natural Breaks Map is a type of thematic map that uses the natural breaks classification method to divide the data into groups. This method is based on the idea of dividing the data into groups that are as similar as possible to each other, with each group having the same number of observations.
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

<img width="1068" alt="Screenshot 2025-06-12 at 2 37 01 PM" src="https://github.com/user-attachments/assets/44dbf94c-314a-4798-98db-b576763c3b91" />


You can further explore the quantile results by querying the number of areas in each category:

```
How many areas are in each category?
```

<img width="1069" alt="Screenshot 2025-06-12 at 2 39 19 PM" src="https://github.com/user-attachments/assets/18aa104a-fa0c-4734-b628-4b49967267d2" />

Upon closer examination from the screenshot, something doesn’t seem to be quite right. With 55 total observations, we should expect roughly 14 (55/4 = 13.75) observations in each group. But the first group only has 7, and the third group has 19! If we open up the Table and sort on the variable `RENT2008`, we can see where the problem lies.

Ignoring the zero entries for now (those are a potential problem in their own right), we see that observations starting in row 8 up to row 21 all have a value of 1000. The cut-off for the first quartile is at 14-th row. In a non-spatial analysis, this is not an issue, the first quartile value is given as 1000. But in a map, the observations are locations that need to be assigned to a group (with a separate color). Other than an arbitrary assignment, there is no way to classify observations with a rent of 1000 in either category 1 or category 2. To deal with these ties, then quantile algorithm (implemented in [geoda-lib](https://github.com/geodacenter/geoda-lib)) moves all the observations with a value of 1000 to the second category. As a result, even though the value of the first quartile is given as 1000 in the map legend, only those observations with rents less than 1000 are included in the first quartile category. As we see from the table, there are seven such observations.

Any time there are ties in the ranking of observations that align with the values for the breakpoints, the classification in a quantile map will be problematic and result in categories with an unequal number of observations.

A natural (Jenks) breaks map uses a nonlinear algorithm to group observations such that the within-group homogeneity is maximized, following the pathbreaking work of Fisher ([1958](https://www.jstor.org/stable/2281952)) and Jenks ([1977](https://books.google.com/books/about/Optimal_Data_Classification_for_Chorople.html?id=HvAENQAACAAJ)). In essence, this is a clustering algorithm in one dimension to determine the break points that yield groups with the largest internal similarity.

To create such a map with four categories, you can use the following prompt:

```
Can you create a natural breaks map for the variable 'rent2008' with 4 categories using the same YlOrBr color scheme?
```

<img width="1067" alt="Screenshot 2025-06-12 at 3 03 58 PM" src="https://github.com/user-attachments/assets/8ce1b2e1-8e23-487a-9239-65e22644275d" />

:::tip
You will see there is a new map layer been created. But it has the same name as the previous one. You can click on the label of the map layer in the Layers panel to edit the name of the layer.
:::

If you want to compare the results of natural breaks map with the quartile map, you can click 'Switch to dual map view' button on the top right corner of the map to compare the two layers side by side.

<img width="1069" alt="Screenshot 2025-06-12 at 3 02 54 PM" src="https://github.com/user-attachments/assets/bd276c8a-e374-4571-b6f4-22958cc7d1be" />

In comparison to the quartile map, the natural breaks criterion is better at grouping the extreme observations. The three observations with zero values make up the first category, whereas the five high rent areas in Manhattan make up the top category. Note also that in contrast to the quantile maps, the number of observations in each category can be highly unequal.

#### Equal Intervals Map

An equal intervals (quantize) map uses the same principle as a histogram to organize the observations into categories that divide the range of the variable into equal interval bins. This contrasts with the quantile map, where the number of observations in each bin is equal, but the range for each bin is not. For the equal interval classification, the value range between the lower and upper bound in each bin is constant across bins, but the number of observations in each bin is typically not equal.

:::tip
In Kepler.gl, the equal intervals method is also callled 'quantize'. See documentation for more details: https://docs.kepler.gl/docs/user-guides/d-layer-attributes
:::

To create an equal intervals map for the variable `rent2008` with 4 categories, you can use the following prompt:

```
Can you create a equal intervals map for the variable 'rent2008' with 4 categories using the same YlOrBr color scheme?
```

<img width="1068" alt="Screenshot 2025-06-12 at 3 16 40 PM" src="https://github.com/user-attachments/assets/d985a359-f053-4a3e-bdcf-f3e015adc70d" />

As in the case of natural breaks, the equal interval approach can yield categories with highly unequal numbers of observations. In our example, the three zero observations again get grouped in the first category, but the second range (from 725 to 1450) contains the bulk of the spatial units (42).

To illustrate the similarity with the histogram, you can use the following prompt:

```
Can you create a histogram for the variable 'rent2008' with 4 bins?
```

<img width="1067" alt="Screenshot 2025-06-12 at 3 18 18 PM" src="https://github.com/user-attachments/assets/455c5402-d8be-4dd6-89ae-837f5cc8f5e3" />

The resulting histogram has the exact same ranges for each interval as the equal intervals map. The number of observations in each category is the same as well. The values for the number of observations in the descriptive statistics below the graph match the values given in the map legend.

Finally, we illustrate the equivalence between the two graphs by selecting a category in the map legend. To accomplish this, we select the highest category in the histogram. This selects will highlights the related observations in the map, through linking.

![equal-map-histogram-link](https://github.com/user-attachments/assets/e60c9d4b-4c56-4993-8b65-6c9ca5325ce0)

:::note
The linking is now way one for now: from plot to map. The two-way linking is not supported yet.
:::


### Map options

In Kepler.gl, there are several options to customize the map.

- change base map [doc](https://docs.kepler.gl/docs/user-guides/f-map-styles)
- chang layer order [doc](https://docs.kepler.gl/docs/user-guides/b-kepler-gl-workflow/add-data-to-layers/d-blend-and-rearrange-layers)
- configure layer [doc](https://docs.kepler.gl/docs/user-guides/d-layer-attributes)
- configure color palettes [doc](https://docs.kepler.gl/docs/user-guides/l-color-attributes)

For saving and exporting the map, please refer to the following documentation:

- save and export [doc](https://docs.kepler.gl/docs/user-guides/k-save-and-export)

### Extreme Value Maps

Extreme value maps are variations of common choropleth maps where the classification is designed to highlight extreme values at the lower and upper end of the scale, with the goal of identifying outliers. These maps were developed in the spirit of spatializing EDA, i.e., adding spatial features to commonly used approaches in non-spatial EDA ([Anselin 1994](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C3&q=Exploratory+Spatial+Data+Analysis+and+Geographic+Information+Systems&btnG=)).

There are three types of extreme value maps:

- Percentile Map
- Box Map
- Standard Deviation Map

These are briefly described below. Only their distinctive features are highlighted, since they share all the same options with the other choropleth map types.

#### Percentile Map

The percentile map is a variant of a quantile map that would start off with 100 categories. However, rather than having these 100 categories, the map classification is reduced to six ranges, the lowest 1%, 1-10%, 10-50%, 50-90%, 90-99% and the top 1%.

For example, you can create a percentile map for the variable `rent2008`, using the following prompt:

```
Can you create a percentile map for the variable 'rent2008' with color scheme: BuRd?
```

<img width="1072" alt="Screenshot 2025-06-12 at 10 46 35 PM" src="https://github.com/user-attachments/assets/3d4e0384-dd9f-4b7a-95bc-acb99bbbec31" />

:::tip
The percentile has been defined as 6 categories mentioned above, so there is no need to specify the number of categories in the prompt.
:::

Note how the extreme values are much better highlighted, especially at the upper end of the distribution. The classification also illustrates some common problems with this type of map. First of all, since there are fewer than 100 observations, in a strict sense there is no 1% of the distribution. This is handled (arbitrarily) by rounding, so that the highest category has one observation, but the lowest does not have any.

In addition, since the values are sorted from low to high to determine the cut points, there can be an issue with ties. As we have seen, this is a generic problem for all quantile maps. As pointed out, the [algorithm](https://github.com/GeoDaCenter/geoda-lib/blob/main/cpp/src/mapping/percentile-breaks.cpp) handles ties by moving observations to the next highest category. For example, when there are a lot of observations with zero values (e.g., in the crime rate map for the U.S. counties), the lowest percentile can easily end up without observations, since all the zeros will be moved to the next category.

#### Box Map

A box map ([Anselin 1994](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C3&q=Exploratory+Spatial+Data+Analysis+and+Geographic+Information+Systems&btnG=)) is the mapping counterpart of the idea behind a box plot. The point of departure is again a quantile map, more specifically, a quartile map. But the four categories are extended to six bins, to separately identify the lower and upper outliers. The definition of outliers is a function of a multiple of the inter-quartile range (IQR), the difference between the values for the 75 and 25 percentile. As we will see in a later chapter in our discussion of the box plot, we use two options for these cut-off values, or hinges, 1.5 and 3.0. The box map uses the same convention.

To create a box map for the variable `rent2008`, you can use the following prompt:

```
Can you create a box map for the variable 'rent2008' using BuRd color scheme?
```

<img width="1130" alt="Screenshot 2025-06-13 at 12 06 55 PM" src="https://github.com/user-attachments/assets/1f0118e4-8212-4ae1-a58f-244d3f88a226" />

Compared to the quartile map, the box map separates the three lower outliers (the observations with zero values) from the other four observations in the first quartile. They are depicted in dark blue. Similarly, it separates the six outliers in Manhattan from the eight other observations in the upper quartile. The upper outliers are colored dark red.

To illustrate the correspondence between the box plot and the box map, we create a box plot for the variable `rent2008`.

```
Can you create a box plot for the variable 'rent2008'?
```

<img width="1128" alt="Screenshot 2025-06-13 at 12 07 25 PM" src="https://github.com/user-attachments/assets/75d5b420-d984-4d8d-84e3-50d1a8d0c23a" />

In the box plot, we select the upper outliers, the matching six outlier locations in the box map are highlighted. Note that the outliers in the box plot do not provide any information on the fact that these locations are also adjoining in space. This the spatial perspective that the box map adds to the data exploration.

![box-map-plot-link](https://github.com/user-attachments/assets/5d02795e-abe1-452a-9fd2-e32aff8d4f53)

The default box map uses the hinge criterion of 1.5. You can change the hinge criterion to 3.0 by using the following prompt:

```
Can you create a box map for the variable 'rent2008' with the hinge criterion of 3.0?
```

<img width="1113" alt="Screenshot 2025-06-13 at 3 28 52 PM" src="https://github.com/user-attachments/assets/8eabac38-0a7b-4139-bc6f-6ae3afeacd57" />

The resulting box map, shown in screenshot, no longer has lower outliers and has only five upper outliers (compared to six for the 1.5 hinge).

The box map is the preferred method to quickly and efficiently identify outliers and broad spatial patterns in a data set.

#### Standard Deviation Map

The third type of extreme values map is a standard deviation map. In some way, this is a parametric counterpart to the box map, in that the standard deviation is used as the criterion to identify outliers, instead of the inter-quartile range.

In a standard deviation map, the variable under consideration is transformed to standard deviational units (with mean 0 and standard deviation 1). This is equivalent to the z-standardization we have seen before.

The number of categories in the classification depends on the range of values, i.e., how many standard deviational units cover the range from lowest to highest. It is also quite common that some categories do not contain any observations (as in the example in the screenshot below).

To create a standard deviation map for the variable `rent2008`, you can use the following prompt:

```
Can you create a standard deviation map for the variable 'rent2008'?
```

<img width="1113" alt="Screenshot 2025-06-13 at 3 30 28 PM" src="https://github.com/user-attachments/assets/a96ab4cc-6180-4019-a00e-10483f942d75" />

In the screenshot above, there are five neighborhoods with median rent more than two standard deviations above the mean, and three with a median rent less than two standard deviations below the mean. Both sets would be labeled outliers in standard statistical practice. Also, note how the second lowest category does not contain any observations (so the corresponding color is not present in the map).

## Mapping Categorical Variables

So far, our maps have pertained to continuous variables, with a clear order from low to high. The AI assistant in Kepler.gl also contains some functionality to map categorical variables, for which the numerical values are distinct, but not necessarily meaningful in and of themselves. Most importantly, the numerical values typically do not imply any ordering of the categories. The two relevant functions are the unique value map, for a single variable, and the co-location map, where the categories for multiple variables are compared.

### Unique Value Map

To illustrate the categorical map, we first create a box map (with hinge 1.5) for each of the variables `kids2000` (the percentage households with kids under 18) and `pubast00` (the percentage households receiving public assistance). In each of these maps, we save the categories, respectively as `kidscat` and `asstcat`.

The category labels go from 1 to 6, but not all categories necessarily have observations. For example, the map for public assistance does not have either lower (label 1) or higher (label 6), outliers, only observations for 2–5. For the kids map, we have categories 1–5.

```
Can you create a box map for the variable 'kids2000' with the hinge criterion of 1.5 using BuRd color scheme?
```

<img width="1115" alt="Screenshot 2025-06-13 at 3 37 59 PM" src="https://github.com/user-attachments/assets/8a98b93a-16ce-422a-bd31-3a89d9b31da8" />


Then, you can save the categories from the box map result into a new column. For example:

```
Can you save the 6 categories (index starts from 1) into a new column "kidscat" from the box map result?
```

<img width="1117" alt="Screenshot 2025-06-13 at 6 23 32 PM" src="https://github.com/user-attachments/assets/4d8d61a7-4e5d-488b-a729-193b7f530a22" />


:::tip
Expand the 'tableTool' function calling to see the result. The AI Assistant uses the following SQL query to get the categories:

SELECT ..., CASE
  WHEN KIDS2000 < 10.8864 THEN 1
  WHEN KIDS2000 >= 10.8864 AND KIDS2000 < 30.090975 THEN 2
  WHEN KIDS2000 >= 30.090975 AND KIDS2000 < 38.2278 THEN 3
  WHEN KIDS2000 >= 38.2278 AND KIDS2000 < 42.894025 THEN 4
  WHEN KIDS2000 >= 42.894025 AND KIDS2000 < 62.0986 THEN 5
  WHEN KIDS2000 >= 62.0986 THEN 6
END AS kidscat FROM nyctable;
:::

To replicate the same result in the original [GeoDa lab](https://geodacenter.github.io/workbook/3a_mapping/lab3a.html), you can use the following prompt:

```
Can you create a unique values map using 'kidscat' in the new dataset with Paired color scheme?
```

<img width="1116" alt="Screenshot 2025-06-13 at 6 31 11 PM" src="https://github.com/user-attachments/assets/b98ae8d4-a4a2-49e3-92b9-a482cef840c4" />

Then, you can do the same for the variable `pubast00` to save the categories into a new column. For example:

```
Can you create a box map for the variable 'pubast00' with the hinge criterion of 1.5 using BuRd color scheme?
```
<img width="1115" alt="Screenshot 2025-06-13 at 6 32 29 PM" src="https://github.com/user-attachments/assets/64ce96f9-bf52-4358-9dc4-7ad97e1f0030" />

```
Can you save the categories (index starts from 1) into a new column "asstcat" from the box map result?
```
<img width="1115" alt="Screenshot 2025-06-13 at 6 34 19 PM" src="https://github.com/user-attachments/assets/0fdca743-5756-4342-bdbb-ead587477c7b" />

To replicate the same result in the original GeoDa lab, you can use the following prompt:

```
Can you create a unique values map using 'asstcat' in the new dataset with Paired color scheme?
```
<img width="1112" alt="Screenshot 2025-06-13 at 6 35 39 PM" src="https://github.com/user-attachments/assets/ad9f7a0e-5491-43a8-bb6e-2502a9061303" />

### Co-location Map

The co-location map is a map that shows the co-location of two categorical variables. It is a variant of the unique value map, where the categories for multiple variables are compared.

To create a co-location map for the variables `kidscat` and `asstcat`, you can use the following prompt:

```
Can you compare the two categorical values 'asstcat' and 'kidscat' (keep the value if they are the same, 0 if they are different) and save the result into a new column 'co_location' to a new dataset?
```

```
Can you create a unique values map using 'co_location' in the new dataset with Paired color scheme? please assign gray color to value 0.
```

<img width="1114" alt="Screenshot 2025-06-13 at 6 52 16 PM" src="https://github.com/user-attachments/assets/a31d0c07-3003-4a88-beae-b61f8f20ed83" />

The above steps show how to create a co-location map of two variables step by step:
- create a categorical variable from a continuous variable A using e.g. box map
- create a categorical variable from a continuous variable B using the same method
- compare the two categorical variables and save the result into a new column 'co_location' to a new dataset
- create a unique values map using 'co_location' in the new dataset with Paired color scheme

In Kepler.gl AI Assistant, we create a specific 'colocation' tool, so you can create a co-location map just with the following prompt:

```
Can you create a co-location map for the variables 'kids2000' and 'pubast00' using quantile breaks (k=5)?
```

<img width="1156" alt="Screenshot 2025-06-16 at 12 42 22 PM" src="https://github.com/user-attachments/assets/b72ac213-ffc0-4cba-97ac-b41d49db71d8" />

From the screenshot, you can see how AI Assistant plans the similar steps to create the co-location map:

- Classify 'kids2000' into 5 quantile bins.
- Classify 'pubast00' into 5 quantile bins.
- Create a new dataset with both categorical variables.
- Compare the two categorical variables:
  - Assign the same value if they match.
  - Assign -1 if they differ.
- Visualize the result with a unique color for each match and gray for mismatches.

### Custom Classification

In addition to the range of pre-defined classifications available for choropleth maps, it is also possible to create a custom classification using AI Assistant. This is often useful when substantive concerns dictate the cut points, rather than data driven criteria. For example, this may be appropriate when specific income categories are specified for certain government programs.

A custom classification may also be useful when comparing the spatial distribution of a variable over time. All included pre-defined classifications are relative and would be re-computed for each time period. For example, when mapping crime rates over time, in an era of declining rates, the observations in the upper quartile in a later period may have crime rates that correspond to a much lower category in an earlier period. This would not be apparent using the pre-defined approaches, but could be visualized by setting the same break points for each time period.

For example, you can create a custom classification for the variable `rent2008` with the following prompt:

```
Can you create a new map layer using the variable 'kids2000' with the break points: [20, 30, 40, 45, 50] and color scheme YlOrBr?
```

<img width="1152" alt="Screenshot 2025-06-16 at 11 53 44 AM" src="https://github.com/user-attachments/assets/eef1834e-e4c0-4ab1-84b1-50a8937b1a86" />


Tip: to create a custom classification, what you need to prompt includes:
- the variable name
- the custom break values
- the color scheme (optional)

Kepler.gl has a custom classification tool that allows you to adjust the break points by simply dragging the break points. See [Custom Breaks Editor](https://docs.foursquare.com/analytics-products/docs/layers-color-scale-and-palettes#custom-breaks-editor).

## ~~Conditional Map~~

## Cartogram

A cartogram is a map type where the original layout of the areal unit is replaced by a geometric form (usually a circle, rectangle, or hexagon) that is proportional to the value of the variable for the location. This is in contrast to a standard choropleth map, where the size of the polygon corresponds to the area of the location in question. The cartogram has a long history and many variants have been suggested, some quite creative. In essence, the construction of a cartogram is an example of a nonlinear optimization problem, where the geometric forms have to be located such that they reflect the topology (spatial arrangement) of the locations as closely as possible (see [Tobler 2004](https://www.jstor.org/stable/3694068), for an extensive discussion of various aspects of the cartogram).

The AI assistant in Kepler.gl implements a circular cartogram [algorithm](https://github.com/GeoDaCenter/geoda-lib/blob/main/cpp/src/geometry/cartogram.h), in which the areal units are represented as circles, whose size (and color) is proportional to the value observed at that location. The changed shapes remove the misleading effect that the area of the unit might have on perception of magnitude. This circular cartogram is implemented as the `cartogram` tool in the AI assistant.

To create a cartogram for the variable `rent2008`, you can use the following prompt:

```
Can you create a cartogram for the variable 'rent2008' and create a box map using the cartogram with color scheme BuRd?
```

<img width="1152" alt="Screenshot 2025-06-16 at 11 53 44 AM" src="https://github.com/user-attachments/assets/eef1834e-e4c0-4ab1-84b1-50a8937b1a86" />

The cartogram is most insightful when used in conjunction with a regular choropleth map. Selecting an observation in the cartogram then immediately links it with the corresponding area in the choropleth map.

Except for multi-layer and base map, the cartogram has all the same options as a regular choropleth map, with one addition. The positioning of the circles in the cartogram is the result of a non-linear optimization algorithm. This tries to locate the center of the circle as close as possible to the centroid of the areal unit with which it corresponds, while respecting the contiguity structure as much as possible. There is no unique solution to this problem, and it is often good practice to experiment with further iterations that will slightly reposition the circles. This is implemented in the Improve Cartogram by specify the number of different iterations.

```
Can you create a cartogram for the variable 'rent2008' with 200 iterations and create a box map using the cartogram with color scheme BuRd?
```

You can use split map in Kepler.gl to compare the cartogram and the box map.

<img width="1081" alt="Screenshot 2025-06-17 at 4 46 59 PM" src="https://github.com/user-attachments/assets/7a34d390-7424-4a89-a483-488f9d1e0285" />

## ~~Map Animation~~

# Spatial Data Wrangling

Original GeoDa lab by Luc Anselin: https://geodacenter.github.io/workbook/01_datawrangling_1/lab1a.html

## Introduction

In this chapter, we tackle the topic of data wrangling, i.e., the process of getting data from its raw input into a form that is amenable for analysis. This is often considered to be the most time consuming part of a data science project, taking as much as 80% of the effort ([Dasu and Johnson 2003](https://onlinelibrary.wiley.com/doi/book/10.1002/0471448354)). However, with Kepler.gl AI Assistant, we can now achieve the same data manipulation goals with significantly less effort compared to traditional approaches using software like GeoDa.

While data wrangling has increasingly evolved into a field of its own, with a growing number of operations turning into automatic procedures embedded into software ([Rattenbury et al. 2017](https://www.oreilly.com/library/view/principles-of-data/9781491938911/)), the integration of AI assistance represents the next evolution in making these processes even more intuitive and efficient. A detailed discussion of the underlying technical implementations is beyond our scope, but we'll provide practical examples of how to harness this technology for your spatial analysis needs.

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

If the csv file contains coordinates, the AI Assistant will automatically create a point layer.

Here we convert the chicago_sup.dbf, which is used in [GeoDa workbook](https://geodacenter.github.io/workbook/01_datawrangling_1/lab1a.html), to chicago_sup.csv file:

```
Can you create a map layerfrom https://geodacenter.github.io/data-and-lab/data/chicago_sup.csv?
```

<img width="1092" alt="Screenshot 2025-05-31 at 10 45 07 PM" src="https://github.com/user-attachments/assets/0a3059db-bc76-427d-8866-885f21bded71" />

As you can see in the screenshot above, the AI Assistant confirms with you what type of map layer you want to create. Then, it performs fetching the data from the URL. However, it is not sure about which columns should be used for latitude and longitude coordinates since the columns in the csv file are "XCoord" and "YCoord" not named as "latitude" and "longitude".

In the GeoDa workbook, you will need to specify the latitude/longitude columns in the configuration UI. However, with AI assistant, you can simply ask it to guess the columns based on the data. Once you confirm that you want to guess the columns, the AI Assistant successfully identifies the appropriate columns and creates the point layer, showing the grocery store locations as points on the map.


## Grid

Grid layers are useful to aggregate counts of point locations in order to calculate point pattern statistics, such as quadrat counts. In Kepler.gl, users can create a grid layer from a dataset easily. See [Kepler.gl Grid Layer](https://docs.kepler.gl/docs/user-guides/c-types-of-layers/d-grid) for more details.

In this tutorial, we are using the Ai assistant to create a grid layer from either the current map view (the map bounds defind by northwest and southweast points), or use the bounding box of an available data source.

```
Can you create a 20x20 grid layer over the chicago_commpop areas?
```

<img width="1330" alt="Screenshot 2025-06-04 at 3 55 13 PM" src="https://github.com/user-attachments/assets/3ac2b9b7-8aa9-44c4-9f91-b85089c63782" />

Since there is a spatial join tool in the AI Assistant, we can also use it to filter the grids that intersect with chicago commpop polygons. The result will be more useful for a spatial data analysis.

```
Can you filter the grids that intersect with chicago commpop polygons?
```

<img width="1333" alt="Screenshot 2025-06-04 at 4 38 07 PM" src="https://github.com/user-attachments/assets/94a2da06-13c6-4e39-8691-f4a3e78fafcb" />

## Table Manipulations

A range of variable transformations are supported through the query tool in the AI Assistant. To illustrate these, we will use the Natregimes sample data set. After loading the natregimes.shp file, we obtain the base map of 3085 U.S. counties, shown in the screenshot below.

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/natregimes.geojson?
```

<img width="1147" alt="Screenshot 2025-06-06 at 3 49 01 PM" src="https://github.com/user-attachments/assets/892a8219-b400-4b76-ac02-adb82cc2e14b" />

The table of the dataset can be opened by using the 'Show Data Table' button when mouse over the dataset name in Kepler.gl layer panel.

<img width="1145" alt="Screenshot 2025-06-06 at 3 49 55 PM" src="https://github.com/user-attachments/assets/fa80088b-59d7-4821-ae12-1b7c063fac90" />

This is a view only table. You can not e.g. edit the data, or add/remove a column in this table. The Foursqure Studio, which is developed based on Kepler.gl, has a more powerful table editor (see docs [here](https://docs.foursquare.com/analytics-products/docs/data)). We hope these features will be upstream back to Kepler.gl in the future.

However, using different AI Assistant tools, like query, standardizeVariable, etc., you can achieve the same goal of manipulating the data in the table. The limitation is that you can not directly edit the data in the table, but you can create a new dataset with the manipulated data.

```
Can you create a new variable called "HR60_Z" and assign the z-value of the variable HR60 to it?
```

### Variable properties

### Change variable properties

One of the most used initial transformations pertains to getting the data into the right format. Often, observation identifiers, such as the FIPS code used by the U.S. census, are recorded as character or string variables, not in a numeric format. In order to use these variables effectively, we need to convert them to a different format. For example:

```
Can you change the column NOSOUTH to integer type and save it in a new dataset?
```

<img width="1146" alt="Screenshot 2025-06-06 at 4 13 37 PM" src="https://github.com/user-attachments/assets/df1ccc5b-e4f7-43ec-a120-95b135046c5f" />

:::info
The AI Assistant calls the `tableTool` to achieve the goal. You can click to expand the `tableTool` to see the details of the tool. This tool uses a SQL query  and a in-memory duckdb database to manipulate the data in the table e.g. `SELECT _geojson, ..., CAST(NOSOUTH AS VARCHAR) AS NOSOUTH, ... FROM natregimes_geojson_123456`. The result arrow object is a duckdb table, which can be used to create a new dataset in Kepler.gl.
:::

### Other variable operations

The other variable operations, like add a variable, delete a variable or rename a variable, should also be supported via the `tableTool`.

## Calculator

The calculator functionality is to create a new variable with:
- special functions
- univariate and bivariate operations
- spatial lag
- rates
- data/time operations

Spatial Lag and Rates are advanced functions that are discussed separately in later chapters.

To illustrate the calculator functionality, we return to the Chicago community area sample data and load the commpopulation.csv file. This file only contains the population totals.

```
Can you load a dataset from https://geodacenter.github.io/data-and-lab/data/commpopulation.csv?
```

<img width="1205" alt="Screenshot 2025-06-06 at 4 20 05 PM" src="https://github.com/user-attachments/assets/04593e4e-ff28-4551-8eb9-82442bc5ece6" />

##### Special

The three Special functions are:
- **NORMAL**: generate random numbers with normal distribution
- **UNIFORM RANDOM**: generate random numbers with uniform distribution
- **ENUMERATE**: generate a sequence of numbers, which is especially useful to retain the order of observations after sorting on a given variable

For example:

```
Can you create a new variable called "RANDOM" and assign random numbers with normal distribution to it?
```

<img width="1147" alt="Screenshot 2025-06-06 at 4 35 10 PM" src="https://github.com/user-attachments/assets/da92eb4d-3a40-4c19-b62a-64db6645c702" />

> As you can see from the screenshot, the AI Assistant tries to use `tableTool` to add a new column "RANDOM" using the Box-Muller transform with SQL query: `SELECT community, NID, POP2010, POP2000, (sqrt(-2 * log(random())) * cos(2 * pi() * random())) AS RANDOM FROM commpopulation_246810)`.

:::note
AI Assistant can make mistakes by trying to generate complex SQL query to add variable. One way to improve the result is to add SQL examples with your prompt, e.g. `can you create a variable using [random()](https://duckdb.org/docs/stable/sql/functions/numeric.html#random) function?`
:::

##### Univariate

In Kepler.gl AI Assistant, there are six straightforward univariate transformations:
- **NEGATIVE**: changing the sign
- **INVERSE**: taking the inverse
- **SQUARE ROOT**: taking the square root
- **LOG (base 10/e)**: carrying out a log transformation
- **ASSIGN**: assign a new variable to be set equal to any other variable, or to a constant (the typical use)
- **SHUFFLE**: shuffle the values of a variable, which is an efficient way to implement spatial randomness, i.e., an allocation of values to locations, but where the location itself does not matter (any location is equally likely to receive a given observation value).

For example:

```
Can you create a new variable called "POP2010_INV" and assign the inverse of the variable POP2010 to it?
```

<img width="1146" alt="Screenshot 2025-06-06 at 7 29 18 PM" src="https://github.com/user-attachments/assets/171c03f4-17df-43fc-a279-8fafa8598d71" />

Since the `tableTool` uses DuckDB to manipulate the data, it can support more univariate transformations. For example, you can use functions like pow(), sqrt(), abs() etc., to transform the variable. For more details, you can refer to the [DuckDB documentation](https://duckdb.org/docs/stable/sql/functions/numeric).

##### Variable Standardization

The univariate operations also include five types of variable standardization:
- **STANDARDIZED (Z)**
- **DEVIATION FROM MEAN**
- **STANDARDIZED (MAD)**
- **RANGE ADJUST**
- **RANGE STANDARDIZED**

The most commonly used is undoubtedly **STANDARDIZED (Z)**. This converts the specified variable such that its mean is zero and variance one, i.e., it creates a z-value as

$$
z = \frac{x - \mu}{\sigma}
$$

where $x$ is the original variable, $\mu$ is the mean, and $\sigma$ is the standard deviation.

```
Can you apply standardization (Z-score) to the variable POP2010?
```

A subset of this standardization is **DEVIATION FROM MEAN**, which only computes the numerator of the z-transformation.

An alternative standardization is **STANDARDIZED (MAD)**, which uses the mean absolute deviation (MAD) as the denominator in the standardization. This is preferred in some of the clustering literature, since it diminishes the effect of outliers on the standard deviation (see, for example, the illustration in Kaufman and Rousseeuw 2005, 8–9). The mean absolute deviation for a variable $x$ is computed as:

$$
mad = \frac{1}{n} \sum_{i} |x_i - \bar{x}|,
$$

i.e., the average of the absolute deviations between an observation and the mean for that variable. The estimate for mad takes the place of $\sigma(x)$ in the denominator of the standardization expression.

```
Can you apply STANDARDIZED (MAD) to the variable POP2010?
```

Two additional transformations that are based on the range of the observations, i.e., the difference between the maximum and minimum. These are the **RANGE ADJUST** and the **RANGE STANDARDIZE**.

RANGE ADJUST divides each value by the range of observations:

$$
r_a = \frac{x_i - x_{max}}{x_{max} - x_{min}}
$$

While RANGE ADJUST simply rescales observations in function of their range, RANGE STANDARDIZE turns them into a value between zero (for the minimum) and one (for the maximum):

$$
r_s = \frac{x_i - x_{min}}{x_{max} - x_{min}}
$$

In original GeoDa lab, the standardization is limited to one variable at a time, which is not very efficient. However, with the AI Assistant, you can apply the standardization to multiple variables at once in Kepler.gl.

```
Can you apply standardization (Z-score) to the variables POP2010 and POP2000?
```

<img width="1146" alt="Screenshot 2025-06-07 at 11 49 29 AM" src="https://github.com/user-attachments/assets/b1ea7556-cf4c-498c-aa18-dab35203cd4a" />

##### Bivariate or Multivariate

The bivariate functionality includes all classic algebraic operations. For example, to compute the population change for the Chicago community areas between 2010 and 2000, you can create a new variable `POPCH = POP2010 - POP2000`:

```
Can you create a new variable POPCH = POP2010 - POP2000?
```

<img width="1146" alt="Screenshot 2025-06-07 at 11 45 44 AM" src="https://github.com/user-attachments/assets/ceb5ccfa-471c-43ed-b33d-30533e957c51" />

:::tip
Since the AI Assistant can use SQL query to manipulate the data, you can also use it to create a new variable with multiple variables and operations. One example is the **NORMAL** function in the previous example: `SELECT community, NID, POP2010, POP2000, (sqrt(-2 * log(random())) * cos(2 * pi() * random())) AS RANDOM FROM commpopulation_246810)`.
:::

##### Date and time

To illustrate these operations, we will use the SanFran Crime data set from the sample collection, which is one of the few sample data sets that contains a date stamp.

We load the sf_cartheft dataset from the Crime Events subdirectory of the sample data set. This data set contains the locations of 3384 car thefts in San Francisco between July and December 2012.

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/SFcartheft_july12.geojson?
```

<img width="1146" alt="Screenshot 2025-06-07 at 11 52 11 AM" src="https://github.com/user-attachments/assets/80325909-5676-49ab-a335-a768e4eee805" />

We bring up the data table and note the variable Date in the seventh column. We can ask the AI Assistant to create a new variable called "YEAR" and assign the year of the Date to it.

```
Can you create a new variable called "YEAR" and assign the year of the Date to it?
```
<img width="1030" alt="Screenshot 2025-06-07 at 10 05 26 PM" src="https://github.com/user-attachments/assets/e6a5a6aa-b67c-4c68-ab15-d5b1da5dac73" />

:::note
You will see the AI assistant tried to call tableTools several times to complete the task. If the tool returns error, the AI assistant will try to fix it and recall the tool. The best practice is providing some extra information or example with your prompt e.g. please use date_part() function.
:::

## Merging tables

An important operation on tables is the ability to Merge new variables into an existing data set. We illustrate this with the Chicago community area population data.

First load the chicago_commpop.geojson file to create a polygon layer.

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/chicago_commpop.geojson?
```

A number of important parameters need to be selected. First is the datasource from which the data will be merged. In our example, we have chosen commpopulation.csv. Even though this contains the same information as we already have, we select it to illustrate the principles behind the merging operation.

```
Can you load a dataset from https://geodacenter.github.io/data-and-lab/data/commpopulation.csv?
```

There are two ways to merge two datasets: horizontal merge and vertical merge. The default method is Merge horizontally, but Stack (vertically) is supported as well. The latter operation is used to add observations to an existing data set.

Best practice to carry out a merging operation is to select a key, i.e., a variable that contains (numeric) values that match the observations in both data sets.

```
Can you merge the table commpopulation.csv to chicago_commpop.geojson using NID as key?
```

<img width="1042" alt="Screenshot 2025-06-08 at 4 37 00 PM" src="https://github.com/user-attachments/assets/a54a7101-958c-4485-8d2d-45a805172448" />

Since we are using SQL to merge the two datasets, the key column is required to merge horizontally.

If you want to specify which columns you want to merge, you can mention them in the prompt:

```
Can you merge the table commpopulation.csv to chicago_commpop.geojson using NID as key and merge the column 'community'?

## Queries

With the AI Assistant, you can easily query the dataset by just prompting.

Load the sf_cartheft.geojson file to create a point layer.

```
Can you create a map layer from https://geodacenter.github.io/data-and-lab/data/sf_cartheft.geojson?
```

Then, you can query the dataset by just prompting.

```
Can you query the sf_cartheft dataset in October?
```

<img width="1038" alt="Screenshot 2025-06-08 at 4 52 41 PM" src="https://github.com/user-attachments/assets/f015581c-47aa-4d9c-9599-03041af56a5a" />

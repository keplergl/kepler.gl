# Maps for Rates or Proportions

Original GeoDa lab by Luc Anselin: https://geodacenter.github.io/workbook/3b_ratemaps/lab3b.html

## Introduction

In this chapter, we will explore some important concepts that are relevant when mapping rates or proportions. Such data are characterized by an intrinsic variance instability, in that the precision of the rate as an estimate for underlying risk is inversely proportional to the population at risk. Specifically, this implies that rates estimated from small populations (e.g., small rural counties) may have a large standard error. Furthermore, such rate estimates may potentially erroneously suggest the presence of outliers.

In what follows, we will cover two basic methods to map rates. We will also consider the most commonly used rate smoothing technique, based on the Empirical Bayes approach. Spatially explicit smoothing techniques will be treated after we cover distance-based spatial weights.

### Objectives

- Create thematic maps for rates
- Assess extreme rate values by means of an excess risk map
- Understand the principle behind shrinkage estimation or smoothing rates
- Apply the Empirical Bayes smoothing principle to maps for rates

## Getting Started

In this chapter, we will use a sample data set with lung cancer data for the 88 counties of the state of Ohio. This is a commonly used example in many texts that cover disease mapping and spatial statistics.2 The data set is also included as one of the Center for Spatial Data Science example data sets and can be downloaded from the [Ohio Lung Cancer Mortality page](https://geodacenter.github.io/data-and-lab/ohiolung/).

- [ohlung.geojson](https://geodacenter.github.io/data-and-lab/data/ohlung.geojson)

We can load the data by prompting:

```
Can you load the dataset: https://geodacenter.github.io/data-and-lab/data/ohlung.geojson?
```

<img width="1168" alt="Screenshot 2025-06-19 at 4 04 17 PM" src="https://github.com/user-attachments/assets/c215e865-59cb-443c-9d7a-5ff9975a8801" />


## Choropleth Map for Rates

### Spatially extensive and spatially intensive variables

We start our discussion of rate maps by illustrating something we should not be doing. This pertains to the important difference between a spatially extensive and a spatially intensive variable. In many applications that use public health data, we typically have access to a count of events, such as the number of cancer cases (a spatially extensive variable), as well as to the relevant population at risk, which allows for the calculation of a rate (a spatially intensive variable).

In our example, we could consider the number (count) of lung cancer cases by county among white females in Ohio (say, in 1968). The corresponding variable in our data set is LFW68. We can create a box map (hinge 1.5) in the by now familar prompt:

```
Can you create a box map (hinge 1.5) for the LFW68 variable using color theme BuRd?
```

<img width="1167" alt="Screenshot 2025-06-19 at 4 05 08 PM" src="https://github.com/user-attachments/assets/c77a013b-5c79-48ee-b6a0-b13d28e2a4bf" />

Anyone familiar with the geography of Ohio will recognize the outliers as the counties with the largest populations, i.e., the metropolitan areas of Cincinnati, Columbus, Cleveland, etc. The labels for these cities in the base layer make this clear. This highlights a major problem with spatially extensive variables like total counts, in that they tend to vary with the size (population) of the areal units. So, everything else being the same, we would expect to have more lung cancer cases in counties with larger populations.

Instead, we opt for a spatially intensive variable, such as the ratio of the number of cases over the population. More formally, if $O_i$ is the number of cancer cases in area $i$, and $P_i$ is the corresponding population at risk (in our example, the total number of white females), then the raw or crude rate or proportion follows as:

$$r_i = \frac{O_i}{P_i}$$

#### Variance instability

The crude rate is an estimator for the unknown underlying risk. In our example, that would be the risk of a white woman to be exposed to lung cancer. The crude rate is an unbiased estimator for the risk, which is a desirable property. However, its variance has an undesirable property, namely

$$Var[r_i] = \frac{\pi_i(1-\pi_i)}{P_i}$$

where $\pi_i$ is the unknown underlying risk. This implies that the larger the population of an area ($P_i$ in the denominator), the smaller the variance for the estimator, or, in other words, the greater the precision.

The flip side of this result is that for areas with sparse populations (small $P_i$), the estimate for the risk will be imprecise (large variance). Moreover, since the population typically varies across the areas under consideration, the precision of each rate will vary as well. This variance instability needs to somehow be reflected in the map, or corrected for, to avoid a spurious representation of the spatial distribution of the underlying risk. This is the main motivation for smoothing rates, to which we return below.

The AI assistant in kepler.gl provides a tool to calculate the different types of rates:

- [Raw Rate]()
- [Excess Risk]()
- [Empirical Bayes Rate]()
- [Spatial Rate]()
- [Spatial Empirical Bayes Rate]()

### Raw rate map

First, we consider the Raw Rate or crude rate (proportion), the simple ratio of the events (number of lung cancer cases) over the population at risk (the county population). For example, we can use the following prompt:

```
Can you calculate the raw rates using event variable LFW68 and base variable POPFW68, and create a box map using the raw rates?
```

We immediately notice that the counties identified as upper outliers in this screenshot are very different from what the map for the counts suggested in the previous box map.

If we use split map to compare the two maps, we can see that none of the original count outliers remain as extreme values in the rate map. In fact, some counties are in the lower quartiles (blue color) for the rates.

<img width="1167" alt="Screenshot 2025-06-19 at 4 18 20 PM" src="https://github.com/user-attachments/assets/5541865c-b5aa-4baf-92d5-f9b60c6e388f" />


#### Raw rate values in table

From the response text, we can see that there is a new dataset 'rates_qxxx' has been created and added in Kepler.gl. If we click on the table icon, we can see the raw rates column:

<img width="1166" alt="Screenshot 2025-06-19 at 4 20 20 PM" src="https://github.com/user-attachments/assets/b3ee3dc5-3f6c-4df3-bfcd-b7c8078bf110" />

### Excess risk map

#### Relative risk

A commonly used notion in demography and public health analysis is the concept of a standardized mortality rate (SMR), sometimes also referred to as relative risk or excess risk. The idea is to compare the observed mortality rate to a national (or regional) standard. More specifically, the observed number of events is compared to the number of events that would be expected had a reference risk been applied.

In most applications, the reference risk is estimated from the aggregate of all the observations under consideration. For example, if we considered all the counties in Ohio, the reference rate would be the sum of all the events over the sum of all the populations at risk. Note that this average is not the average of the county rates. Instead, it is calculated as the ratio of the total sum of all events over the total sum of all populations at risk (e.g., in our example, all the white female deaths in the state over the state white female population). Formally, this is expressed as:

$$\tilde{\pi} = \frac{\sum_{i=1}^{n} O_i}{\sum_{i=1}^{n} P_i},$$
which yields the expected number of events for each area $i$ as:
$$E_i = \tilde{\pi} \times P_i.$$
The relative risk then follows as the ratio of the observed number of events (e.g., cancer cases) over the expected number:
$$SMR_i = \frac{O_i}{E_i}.$$

#### Excess risk map

We can map the standardized rates directly using the following prompt:

```
Can you calculate the excess risk rates using event variable LFW68 and base variable POPFW68, and create a box map using the excess risk rates?
```

In the excess risk map, the legend categories are hard coded, with the blue tones representing counties where the risk is less than the state average (excess risk ratio < 1), and the brown tones corresponding to those counties where the risk is higher than the state average (excess risk ratio > 1).

<img width="1168" alt="Screenshot 2025-06-19 at 4 24 09 PM" src="https://github.com/user-attachments/assets/37d4eb07-27be-4576-926c-33588120dff0" />

In the map above, we have six counties with an SMR greater than 2 (the brown colored counties), suggesting elevated rates relative to the state average.

## Empirical Bayes (EB) Smoothed Rate Map

### Borrowing strength

As mentioned in the introduction, rates have an intrinsic variance instability, which may lead to the identification of spurious outliers. In order to correct for this, we can use smoothing approaches (also called shrinkage estimators), which improve on the precision of the crude rate by borrowing strength from the other observations. This idea goes back to the fundamental contributions of James and Stein (the so-called James-Stein paradox), who showed that in some instances biased estimators may have better precision in a mean squared error sense.

The AI assistant in kepler.gl includes three methods to smooth the rates: an Empirical Bayes approach, a spatial averaging approach, and a combination between the two. We will consider the spatial approaches after we discuss distance-based spatial weights. Here, we focus on the Empirical Bayes (EB) method. First, we provide some formal background on the principles behind smoothing and shrinkage estimators.

#### Bayes Law

The formal logic behind the idea of smoothing is situated in a Bayesian framework, in which the distribution of a random variable is updated after observing data. The principle behind this is the so-called Bayes Law, which follows from the decomposition of a joint probability (or density) into two conditional probabilities:

$$P[AB] = P[A|B] \times P[B] = P[B|A] \times P[A],$$

where $A$ and $B$ are random events, and |
 stands for the conditional probability of one event, given a value for the other. The second equality yields the formal expression of Bayes law as:

$$P[A|B] = \frac{P[B|A] \times P[A]}{P[B]}.$$

In most instances in practice, the denominator in this expression can be ignored, and the equality sign is replaced by a proportionality sign:

$$P[A|B] \propto P[B|A] \times P[A].$$

In the context of estimation and inference, the $A$ typically stands for a parameter (or a set of parameters) and $B$ stands for the data. The general strategy is to update what we know about the parameter $A$ a priori (reflected in the prior distribution $P[A]$), after observing the data $B$, to yield a posterior distribution, $P[A|B]$. The link between the prior and posterior distribution is established through the likelihood, $P[B|A]$. Using a more conventional notation with say $\pi$ as the parameter and $y$ as the observations, this gives:

$$P[\pi|y] \propto P[y|\pi] \times P[\pi].$$

#### The Poisson-Gamma model

For each particular estimation problem, we need to specify distributions for the prior and the likelihood in such a way that a proper posterior distribution results. In the context of rate estimation, the standard approach is to specify a Poisson distribution for the observed count of events (conditional upon the risk parameter), and a Gamma distribution for the prior of the risk parameter $\pi$. This is referred to as the Poisson-Gamma model.

In this model, the prior distribution for the (unknown) risk parameter $\pi$ is $\text{Gamma}(\alpha, \beta)$, where $\alpha$ and $\beta$ are the shape and scale parameters of the Gamma distribution. In terms of the more familiar notions of mean and variance, this implies:

$$E[\pi] = \frac{\alpha}{\beta},$$

and

$$\text{Var}[\pi] = \frac{\alpha}{\beta^2}.$$

Using standard Bayesian principles, the combination of a Gamma prior for the risk parameter with a Poisson distribution for the count of events ($O$) yields the posterior distribution as $\text{Gamma}(O + \alpha, P + \beta)$. The new shape and scale parameters yield the mean and variance of the posterior distribution for the risk parameter as:

$$E[\pi|O, P] = \frac{O + \alpha}{P + \beta},$$

and

$$\text{Var}[\pi|O, P] = \frac{O + \alpha}{(P + \beta)^2}.$$

Different values for the $\alpha$ and $\beta$ parameters (reflecting more or less precise prior information) will yield smoothed rate estimates from the posterior distribution. In other words, the new risk estimate adjusts the crude rate with parameters from the prior Gamma distribution.

#### The Empirical Bayes approach

In the Empirical Bayes approach, values for $\alpha$ and $\beta$ of the prior Gamma distribution are estimated from the actual data. The smoothed rate is then expressed as a weighted average of the crude rate, say $r_i$, and the prior estimate, say $\theta$. The latter is estimated as a reference rate, typically the overall statewide average or some other standard.

In essence, the EB technique consists of computing a weighted average between the raw rate for each county and the state average, with weights proportional to the underlying population at risk. Simply put, small counties (i.e., with a small population at risk) will tend to have their rates adjusted considerably, whereas for larger counties the rates will barely change.

More formally, the EB estimate for the risk in location $i$ is:

$$\pi_{EBi} = w_i r_i + (1 - w_i) \theta.$$

In this expression, the weights are:

$$w_i = \frac{\sigma^2}{\sigma^2 + \mu/P_i},$$

with $P_i$ as the population at risk in area $i$, and $\mu$ and $\sigma^2$ as the mean and variance of the prior distribution.

In the empirical Bayes approach, the mean $\mu$ and variance $\sigma^2$ of the prior (which determine the scale and shape parameters of the Gamma distribution) are estimated from the data.

For $\mu$ this estimate is simply the reference rate (the same reference used in the computation of the SMR),

$\sum_{i=1}^{n} O_i / \sum_{i=1}^{n} P_i$.

The estimate of the variance is a bit more complex:

$$\sigma^2 = \frac{\sum_{i=1}^{n} P_i (r_i - \mu)^2}{\sum_{i=1}^{n} P_i} - \frac{\mu \sum_{i=1}^{n} P_i}{n}.$$

While easy to calculate, the estimate for the variance can yield negative values. In such instances, the conventional approach is to set $\sigma^2$ to zero. As a result, the weight $w_i$ becomes zero, which in essence equates the smoothed rate estimate to the reference rate.

### EB rate map

You can use the following prompt to create an EB smoothed rate map by using the dataset with raw rates, which we will compare to the EB rates in the next step:

```
Can you calculate the empirical bayes smoothed rates using event variable LFW68 and base variable POPFW68 from dataset with raw rates, and create a box map using the empirical bayes smoothed rates?
```

<img width="1324" alt="Screenshot 2025-06-23 at 7 24 53 PM" src="https://github.com/user-attachments/assets/471c6e4a-aac5-4df0-b9d5-50cf481de7b9" />

In comparison to the box map for the crude rates and the excess rate map, none of the original outliers remain identified as such in the smoothed map. Instead, a new outlier is shown in the very southwestern corner of the state (Hamilton county).

Since many of the original outlier counties have small populations at risk (check in the data table), their EB smoothed rates are quite different (lower) from the original. In contrast, Hamilton county is one of the most populous counties (it contains the city of Cincinnati), so that its raw rate is barely adjusted. Because of that, it percolates to the top of the distribution and becomes an outlier.

To illustrate this phenomenon, we can systematically select observations in the box plot for the raw rates and compare their position in the box plot for the smoothed rates. This will reveal which observations are affected most.

We create the box plots in the usual way using the raw rates and the empirical bayes smoothed rates by prompting:

```
Can you create a box plot for the raw rates and the empirical bayes smoothed rates?
```

<img width="1222" alt="Screenshot 2025-06-23 at 8 11 51 PM" src="https://github.com/user-attachments/assets/7a8f0a1c-9d5e-418d-a089-88af81ad7351" />

Now, the AI assistant will create two box plots for the raw rates and the empirical bayes smoothed rates. We select the three outliers in the raw rates box plot. The corresponding observations are within the upper quartile for the EB smoothed rates, but well within the fence, and thus no longer outliers after smoothing. We can of course also locate these observations on the map, or any other open views.

<img width="1123" alt="Screenshot 2025-06-23 at 8 15 36 PM" src="https://github.com/user-attachments/assets/ff24346c-c804-42e3-9430-b2d2b40097a5" />

Next, we can carry out the reverse and select the outlier in the box plot for the EB smoothed rate. Its position is around the 75 percentile in the box plot for the crude rate. Also note how the range of the rates has shrunk. Many of the higher crude rates are well below 0.00012 for the EB rate, whereas the value for the EB outlier has barely changed.

<img width="1129" alt="Screenshot 2025-06-23 at 8 15 19 PM" src="https://github.com/user-attachments/assets/c38531b0-bc50-4a46-aed8-0681f2535606" />


Here is a screen captured video of the above steps:

![rates_box_plots-1](https://github.com/user-attachments/assets/62a416e8-d54b-4a74-a81a-777cf0cea103)

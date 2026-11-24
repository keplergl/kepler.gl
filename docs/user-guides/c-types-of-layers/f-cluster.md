# Cluster

![Cluster layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image46.png "Cluster layer")

Cluster layers group nearby points. By default, **Cluster Radius in Pixels** controls grouping at the current zoom level, so clusters split as you zoom in.

Enable **Use Meters** in the Radius settings to group by ground distance instead. **Cluster Radius in Meters** uses spherical distance and keeps the same groups when you pan or zoom. Each group starts with the first unassigned point in the data and collects unassigned points within the chosen distance of that point. Groups do not expand through chains of neighbors; changing the data order or filters can change the groups. The displayed marker is placed at the group's spherical mean position, which may differ from its starting point.

Pixel and meter radii are saved separately, so switching modes restores the previous value for that mode. Existing saved maps continue to use pixels. **Radius Range in pixels** controls the drawn bubble sizes independently of the grouping distance.

[Back to table of contents](../README.md)

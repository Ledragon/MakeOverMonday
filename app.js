(function () {
    'use strict';
    var chart = d3.chart(d3.select('#container'), 800, 600);
    var chart2015 = d3.chart(d3.select('#container2015'), 800, 600);

    d3.csv('Female Corporate Talent Pipeline.csv',
        function (d) {
            return {
                year: +d.Year,
                level: d.Level,
                female: +d.Female.replace('%', '') / 100,
                male: +d.Male.replace('%', '') / 100
            }
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                var byYear = d3.nest()
                    .key(d => d.year)
                    .entries(data);
                chart.update(byYear[0].values);
                chart2015.update(byYear[1].values);
                //                 xScale.domain(byYear[0].values.map(d => d.level));
                //                 xAxisGroup.call(xAxis);

                //                 var seriesGroup = plotGroup.append('g')
                //                     .classed('series', true);
                //                 var items = seriesGroup.selectAll('.item')
                //                     .data(byYear[0].values)
                //                     .enter()
                //                     .append('g')
                //                     .classed('item', true);
                //                 items.append('rect')
                //                     .style('fill', 'pink')
                //                     .attr({
                //                         'x': d => xScale(d.level),
                //                         'y': d => yScale(d.female),
                //                         'width': xScale.rangeBand(),
                //                         height: d => plotHeight - yScale(d.female)
                //                     })
                //                 items.append('rect')
                //                     .style('fill', 'lightblue')
                //                     .attr({
                //                         'x': d => xScale(d.level),
                //                         'y': 0,
                //                         'width': xScale.rangeBand(),
                //                         height: d => yScale(d.female)
                //                     })
            }
        })
} ());
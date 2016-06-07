(function () {
    var width = 800;
    var height = 600;
    marginBottom = 50;
    marginTop = 0;
    marginLeft = 50;
    marginRight = 50;
    'use strict';
    var chartGroup = d3.select('svg')
        .append('g')
        .attr('transform', `translate(${marginLeft},${marginTop})`);
    d3.csv('Facebook Energy Sources.csv',
        function (d) {
            return {
                year: +d.Year,
                energySource: d['Energy Source'],
                amount: +(d.Amount.replace('%', '')) / 100
            }
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                var test = d3.nest()
                    .key((d) => d.year)
                    .entries(data);
                console.log(test);
                var x0 = d3.scale.ordinal()
                    .domain(test.map(d=>d.key))
                    .rangeRoundBands([0, width - marginLeft - marginRight], 0.1);

                var xAxis = d3.svg.axis().scale(x0);
                var xAxisGroup = chartGroup
                    .append('g')
                    .attr('transform', `translate(0,${height - 50})`);
                xAxisGroup.call(xAxis);
            }
        })
} ());
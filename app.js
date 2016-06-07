(function () {
    'use strict';
    d3.select('#container')
        .append('rect')
        .attr({
            'x': 10,
            'y': 10,
            'width': 100,
            'height': 100
        });
    d3.csv('Facebook Energy Sources.csv',
        function (d) {
            return {
                year: +d.Year,
                energySource: d['Energy Source'],
                amount: +(d.Amount.replace('%',''))/100
            }
        }, function (error, data) {
        if (error) {
            console.error(error);
        } else {
            var test = d3.nest()
                .key((d) => d.year)
                .entries(data);
            console.log(test);
            var keys = d3.keys(test);
            console.log(keys);
        }
    })
} ());
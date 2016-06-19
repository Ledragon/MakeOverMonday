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
            }
        })
} ());
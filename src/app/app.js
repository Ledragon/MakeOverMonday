"use strict";
var d3_request_1 = require('d3-request');
var d3_selection_1 = require('d3-selection');
var statistics_1 = require('../charts/statistics');
var chart_1 = require('../charts/chart');
d3_request_1.csv('data/Data Breaches.csv', function (d) {
    return {
        year: +d.Year,
        company: d.Entity,
        recordsStolen: +d['Records Stolen'],
        recordsLost: +d['Records Lost']
    };
}, function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        var stats = new statistics_1.statistics(d3_selection_1.select('#statistics'), 200, 500);
        stats.update(data);
        var chartSelection = d3_selection_1.select('#chart')
            .append('svg')
            .attr('width', 1200)
            .attr('height', 600);
        var ch = new chart_1.chart(chartSelection, 1200, 600);
        ch.update(data);
    }
});
//# sourceMappingURL=app.js.map
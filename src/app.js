"use strict";
var d3_selection_1 = require('d3-selection');
var d3_queue_1 = require('d3-queue');
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var d3_shape_1 = require('d3-shape');
var d3_time_format_1 = require('d3-time-format');
var d3_array_1 = require('d3-array');
var width = 1900;
var height = 780;
var margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};
var container = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var plotGroup = container.append('g')
    .classed('container', true)
    .attr('transform', "translate(" + margins.left + "," + margins.top + ")");
var plotWidth = width - margins.left - margins.right;
var plotHeight = height - margins.top - margins.bottom;
var seriesGroup = plotGroup.append('g')
    .classed('series', true);
var colors = ['red', 'blue', 'green', 'gray'];
var timeParser = d3_time_format_1.timeParse('%d-%m-%y');
var q = d3_queue_1.queue()
    .defer(d3_request_1.csv, 'data/Votamatic.csv')
    .defer(d3_request_1.json, 'data/us.geo.json');
q.awaitAll(function (error, responses) {
    if (error) {
        console.error(error);
    }
    else {
        var mapped = responses[0]
            .map(function (d) {
            return {
                state: d.State,
                clinton: parseFloat(d.Clinton),
                trump: parseFloat(d.Trump),
                other: parseFloat(d.Other),
                undecided: parseFloat(d.Undecided),
                date: timeParser(d.Date)
            };
        });
        var byDate = d3_collection_1.nest()
            .key(function (d) { return d.date; })
            .entries(mapped)
            .map(function (d) {
            return {
                date: new Date(d.key),
                clinton: d3_array_1.mean(d.values, function (v) { return v.clinton; }),
                trump: d3_array_1.mean(d.values, function (v) { return v.trump; }),
                other: d3_array_1.mean(d.values, function (v) { return v.other; }),
                undecided: d3_array_1.mean(d.values, function (v) { return v.undecided; }),
            };
        });
        var timeScale = d3_scale_1.scaleTime()
            .domain(d3_array_1.extent(byDate, function (d) { return d.date; }))
            .range([0, plotWidth]);
        var yScale = d3_scale_1.scaleLinear()
            .domain([0, 1])
            .range([plotHeight, 0]);
        var timeAxis = d3_axis_1.axisBottom(timeScale);
        var timeAxisGroup = plotGroup.append('g')
            .classed('time-axis', true)
            .attr('transform', "translate(" + 0 + "," + plotHeight + ")")
            .call(timeAxis);
        var stackGenerator = d3_shape_1.stack()
            .keys(byDate.map(function (d) { return d.date; }));
        var stacked = stackGenerator(byDate);
        console.log(stacked);
    }
});
//# sourceMappingURL=app.js.map
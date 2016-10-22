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
var container = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var margins = {
    top: 120,
    bottom: 20,
    left: 20,
    right: 20
};
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
        // console.log(mapped);
        var byCountry = d3_collection_1.nest()
            .key(function (d) { return d.state; })
            .entries(mapped);
        var scale_1 = d3_scale_1.scaleBand()
            .range([0, width - margins.left - margins.right])
            .domain(byCountry.map(function (d) { return d.key; }));
        var leftAxis = d3_axis_1.axisTop(scale_1);
        var plotGroup = container.append('g')
            .classed('container', true)
            .attr('transform', "translate(" + margins.left + "," + margins.top + ")");
        var axis = plotGroup.append('g')
            .classed('top-axis', true)
            .call(leftAxis);
        axis.selectAll('.tick')
            .select('text')
            .style('text-anchor', 'start')
            .attr('transform', "rotate(" + -90 + ") translate(10," + 10 + ")");
        var bandWidth = scale_1.bandwidth() * .75;
        var seriesGroup = plotGroup.append('g')
            .classed('series', true);
        var enterSelection = seriesGroup.selectAll('g.country')
            .data(byCountry)
            .enter()
            .append('g')
            .classed('country', true)
            .attr('transform', function (d, i) { return ("translate(" + scale_1(d.key) + "," + 0 + ")"); });
        var timeScale_1 = d3_scale_1.scaleTime()
            .domain(d3_array_1.extent(mapped, function (d) { return d.date; }))
            .range([0, height - margins.top - margins.bottom]);
        var xScale_1 = d3_scale_1.scaleLinear()
            .domain([0, 1])
            .range([0, bandWidth]);
        var lineGenerator = d3_shape_1.line()
            .x(function (d) {
            // console.log(xScale(d.clinton))
            return xScale_1(d.clinton);
        })
            .y(function (d) {
            console.log(timeScale_1(d.date));
            return timeScale_1(d.date);
        });
        // dataBound.append('path')
        //     .attr('d', d => {
        //         // console.log(d.values);
        //         return lineGenerator(d.values);
        //     });
        enterSelection.selectAll('circle.clinton')
            .data(function (d) { return d.values; })
            .enter()
            .append('circle')
            .classed('clinton', true)
            .attr('r', 2)
            .attr('cx', function (d) { return xScale_1(d.clinton); })
            .attr('cy', function (d) { return timeScale_1(d.date); });
        enterSelection.selectAll('circle.trump')
            .data(function (d) { return d.values; })
            .enter()
            .append('circle')
            .classed('trump', true)
            .attr('r', 2)
            .attr('cx', function (d) { return xScale_1(d.clinton) + xScale_1(d.trump); })
            .attr('cy', function (d) { return timeScale_1(d.date); });
    }
});
//# sourceMappingURL=app.js.map
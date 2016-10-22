"use strict";
var d3_selection_1 = require('d3-selection');
var d3_queue_1 = require('d3-queue');
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var width = 1900;
var height = 780;
var container = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var margins = {
    top: 20,
    bottom: 20,
    left: 150,
    right: 20
};
var q = d3_queue_1.queue()
    .defer(d3_request_1.csv, 'data/Votamatic.csv')
    .defer(d3_request_1.json, 'data/us.geo.json');
q.awaitAll(function (error, responses) {
    if (error) {
        console.error(error);
    }
    else {
        var byCountry = d3_collection_1.nest()
            .key(function (d) { return d.State; })
            .entries(responses[0]);
        var scale = d3_scale_1.scaleBand()
            .range([0, height - margins.top - margins.bottom])
            .domain(byCountry.map(function (d) { return d.key; }));
        var leftAxis = d3_axis_1.axisLeft(scale);
        container.append('g')
            .classed('left-axis', true)
            .attr('transform', "translate(" + margins.left + "," + margins.top + ")")
            .call(leftAxis);
    }
});
//# sourceMappingURL=app.js.map
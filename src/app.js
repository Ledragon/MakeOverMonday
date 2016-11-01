"use strict";
var d3_selection_1 = require('d3-selection');
var d3_request_1 = require('d3-request');
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var d3_array_1 = require('d3-array');
var d3_scale_chromatic_1 = require('d3-scale-chromatic');
var _ = require('lodash');
var width = 960;
var height = 600;
var svg = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};
var plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', "translate(" + plotMargins.left + "," + plotMargins.top + ")");
var plotWidth = width - plotMargins.left - plotMargins.right;
var plotHeight = height - plotMargins.top - plotMargins.bottom;
d3_request_1.csv('data/Scottish Index of Multiple Deprivation 2012.csv', function (error, data) {
    var authorities = _.chain(data).map(function (d) { return d['Local Authority Name']; }).uniq().value();
    var authorityScale = d3_scale_1.scaleBand()
        .range([0, plotHeight])
        .domain(authorities);
    var authoritiesAxis = d3_axis_1.axisLeft(authorityScale);
    var authorityAxisGroup = plotGroup.append('g')
        .classed('axis', true);
    authorityAxisGroup.call(authoritiesAxis);
    var rankScale = d3_scale_1.scaleLinear()
        .range([0, plotWidth])
        .domain([0, d3_array_1.max(data, function (d) { return parseFloat(d['Overall SIMD 2012 Rank']); })]);
    var rankAxis = d3_axis_1.axisTop(rankScale);
    var rankAxisGroup = plotGroup.append('g')
        .classed('axis', true);
    rankAxisGroup.call(rankAxis);
    var seriesGroup = plotGroup.append('g')
        .classed('series-group', true);
    var dataBound = seriesGroup.selectAll('.series')
        .data(data);
    dataBound.exit().remove();
    var enterSelection = dataBound.enter()
        .append('g')
        .classed('series', true);
    var colorScale = d3_scale_1.scaleLinear()
        .range([0, 1])
        .domain(rankScale.domain());
    enterSelection.append('circle')
        .attr('r', 2)
        .attr('cx', function (d) { return rankScale(parseFloat(d['Overall SIMD 2012 Rank'])); })
        .attr('cy', function (d) { return authorityScale(d['Local Authority Name']) + authorityScale.bandwidth() / 2; })
        .style('fill', function (d) { return d3_scale_chromatic_1.interpolateRdYlBu(colorScale(parseFloat(d['Overall SIMD 2012 Rank']))); });
});
//# sourceMappingURL=app.js.map
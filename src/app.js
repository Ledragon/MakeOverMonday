"use strict";
var d3_selection_1 = require('d3-selection');
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
var d3_array_1 = require('d3-array');
var d3_scale_1 = require('d3-scale');
var svg1 = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', 900)
    .attr('height', 780);
d3_request_1.csv('data/data.csv', function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(data.columns);
        var bySurveyDate = d3_collection_1.nest()
            .key(function (d) { return d['Survey Date']; })
            .entries(data);
        var byCountry2012 = d3_collection_1.nest()
            .key(function (d) { return d.Country; })
            .entries(bySurveyDate[0].values);
        console.log(byCountry2012);
        var mapped = byCountry2012.map(function (d) {
            var total = d3_array_1.sum(d.values, function (v) { return parseFloat(v.TOTAL); });
            return {
                country: d.key,
                verySatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Very satisfied']); }) / total,
                ratherSatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Rather satisfied']); }) / total,
                ratherUnsatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Rather unsatisfied']); }) / total,
                notAtAllSatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Not at all satisfied']); }) / total,
                dontKnow: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Don\'t know']); }) / total,
            };
        });
        console.log(mapped);
        var c1 = svg1.append('g')
            .classed('c2012', true)
            .attr('transform', "translate(" + 0 + "," + 0 + ")");
        // c1.append('text')
        //     .style('text-anchor', 'middle')
        //     .attr('x', 200)
        //     .attr('y', 0)
        //     .text('Total')
        // c1.append('text')
        //     .style('text-anchor', 'middle')
        //     .attr('x', 300)
        //     .attr('y', 0)
        //     .text('Very')
        var scale_1 = d3_scale_1.scaleLinear()
            .range([0, 600])
            .domain([0, 1]);
        var enterSelection = c1.selectAll('.country')
            .data(mapped)
            .enter()
            .append('g')
            .classed('country', true)
            .attr('transform', function (d, i) { return ("translate(" + 0 + "," + (i * 22 + 10) + ")"); });
        enterSelection.append('text')
            .attr('x', 10)
            .attr('y', 15)
            .text(function (d, i) { return i + '. ' + d.country; });
        var rects = enterSelection.append('g')
            .classed('rects', true)
            .attr('transform', "translate(" + 200 + "," + 0 + ")");
        rects.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', d3_scale_1.schemeCategory10[3])
            .attr('width', function (d) { return scale_1(d.notAtAllSatisfied); });
        rects.append('rect')
            .attr('x', function (d) { return scale_1(d.notAtAllSatisfied); })
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', d3_scale_1.schemeCategory10[1])
            .attr('width', function (d) { return scale_1(d.ratherUnsatisfied); });
        rects.append('rect')
            .attr('x', function (d) { return scale_1(d.notAtAllSatisfied + d.ratherUnsatisfied); })
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', d3_scale_1.schemeCategory10[8])
            .attr('width', function (d) { return scale_1(d.ratherSatisfied); });
        rects.append('rect')
            .attr('x', function (d) { return scale_1(d.notAtAllSatisfied + d.ratherUnsatisfied + d.ratherSatisfied); })
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', d3_scale_1.schemeCategory10[2])
            .attr('width', function (d) { return scale_1(d.verySatisfied); });
        rects.append('rect')
            .attr('x', function (d) { return scale_1(d.ratherSatisfied + d.verySatisfied + d.ratherUnsatisfied + d.notAtAllSatisfied); })
            .attr('y', 0)
            .attr('height', 20)
            .style('fill', d3_scale_1.schemeCategory10[0])
            .attr('width', function (d) { return scale_1(d.dontKnow); });
    }
});
//# sourceMappingURL=app.js.map
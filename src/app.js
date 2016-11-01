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
var svg2 = d3_selection_1.select('#chart2')
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
        var nestFct = d3_collection_1.nest()
            .key(function (d) { return d.Country; });
        var byCountry2012 = nestFct
            .entries(bySurveyDate[0].values);
        var byCountry2015 = nestFct
            .entries(bySurveyDate[1].values);
        var c2 = svg2.append('g')
            .classed('c2015', true)
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
        var scale = d3_scale_1.scaleLinear()
            .range([0, 600])
            .domain([0, 1]);
        var c1 = svg1.append('g')
            .classed('c2012', true)
            .attr('transform', "translate(" + 0 + "," + 0 + ")");
        drawChart(c1, mapData(byCountry2012), scale, '2012');
        drawChart(c2, mapData(byCountry2015), scale, '2015');
    }
});
function mapData(data) {
    var mapped = data.map(function (d) {
        var total = d3_array_1.sum(d.values, function (v) { return parseFloat(v.TOTAL); });
        return {
            country: d.key,
            verySatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Very satisfied']); }) / total,
            ratherSatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Rather satisfied']); }) / total,
            ratherUnsatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Rather unsatisfied']); }) / total,
            notAtAllSatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Not at all satisfied']); }) / total,
            dontKnow: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Don\'t know']); }) / total,
        };
    })
        .sort(function (a, b) { return b.notAtAllSatisfied - a.notAtAllSatisfied; });
    console.log(mapped);
    return mapped;
}
function drawChart(c1, mapped, scale, year) {
    var group = c1.append('g')
        .attr('transform', "translate(" + 0 + "," + 30 + ")");
    c1.append('g')
        .classed('title', true)
        .attr('transform', "translate(" + 450 + "," + 20 + ")")
        .append('text')
        .style('text-anchor', 'middle')
        .text(year);
    var enterSelection = group.selectAll('.country')
        .data(mapped)
        .enter()
        .append('g')
        .classed('country', true)
        .attr('transform', function (d, i) { return ("translate(" + 0 + "," + (i * 22 + 10) + ")"); });
    enterSelection.append('text')
        .attr('x', 10)
        .attr('y', 15)
        .text(function (d, i) { return d.country; });
    var rects = enterSelection.append('g')
        .classed('rects', true)
        .attr('transform', "translate(" + 200 + "," + 0 + ")");
    rects.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3_scale_1.schemeCategory10[3])
        .attr('width', function (d) { return scale(d.notAtAllSatisfied); });
    rects.append('rect')
        .attr('x', function (d) { return scale(d.notAtAllSatisfied); })
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3_scale_1.schemeCategory10[1])
        .attr('width', function (d) { return scale(d.ratherUnsatisfied); });
    rects.append('rect')
        .attr('x', function (d) { return scale(d.notAtAllSatisfied + d.ratherUnsatisfied); })
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3_scale_1.schemeCategory10[8])
        .attr('width', function (d) { return scale(d.ratherSatisfied); });
    rects.append('rect')
        .attr('x', function (d) { return scale(d.notAtAllSatisfied + d.ratherUnsatisfied + d.ratherSatisfied); })
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3_scale_1.schemeCategory10[2])
        .attr('width', function (d) { return scale(d.verySatisfied); });
    rects.append('rect')
        .attr('x', function (d) { return scale(d.ratherSatisfied + d.verySatisfied + d.ratherUnsatisfied + d.notAtAllSatisfied); })
        .attr('y', 0)
        .attr('height', 20)
        .style('fill', d3_scale_1.schemeCategory10[9])
        .attr('width', function (d) { return scale(d.dontKnow); });
}
//# sourceMappingURL=app.js.map
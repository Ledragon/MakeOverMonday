"use strict";
var d3_request_1 = require('d3-request');
var d3_shape_1 = require('d3-shape');
var d3_selection_1 = require('d3-selection');
var width = 400;
var height = 400;
var radius = 130;
d3_request_1.csv('data/US debt.csv', function (error, data) {
    console.log(data);
    var mapped = data.map(function (d) { return parseFloat(d.Debt); });
    console.log(mapped);
    var p = d3_shape_1.pie()(mapped);
    console.log(p);
    var arcGenerator = d3_shape_1.arc()
        .innerRadius(0)
        .outerRadius(radius);
    var colors = ['#2ca25f', '#99d8c9'];
    var svg = d3_selection_1.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.append('g')
        .attr('transform', "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll('.arc')
        .data(p)
        .enter()
        .append('path')
        .classed('arc', true)
        .attr('d', function (d) { return arcGenerator.startAngle(d.startAngle).endAngle(d.endAngle)(); })
        .style('fill', function (d, i) { return colors[i]; });
    var items = svg.append('g')
        .classed('legend', true)
        .attr('transform', "translate(" + 280 + "," + 350 + ")")
        .selectAll('.legend-item')
        .data(['US', 'Rest of the world'])
        .enter()
        .append('g')
        .classed('legend-item', true)
        .attr('transform', function (d, i) { return ("translate(" + 0 + "," + i * 20 + ")"); });
    items.append('text')
        .attr('x', 15)
        .text(function (d) { return d; });
    items.append('rect')
        .attr('y', -8)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) { return colors[i]; });
});
//# sourceMappingURL=app.js.map
"use strict";
var d3_selection_1 = require('d3-selection');
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var d3_array_1 = require('d3-array');
var d3_collection_1 = require('d3-collection');
var d3_format_1 = require('d3-format');
var chart = (function () {
    function chart(selection, width, height) {
        this._selection = selection.append('g')
            .classed('chart', true);
        var plotMargins = {
            top: 50,
            bottom: 50,
            left: 50,
            right: 10
        };
        var plotGroup = this._selection.append('g')
            .classed('plot-group', true)
            .attr('transform', "translate(" + plotMargins.left + "," + plotMargins.top + ")");
        plotGroup.append('g')
            .classed('data-container', true);
        this._xAxisGroup = plotGroup.append('g')
            .classed('x-axis', true)
            .attr('transform', "translate(" + 0 + "," + 0 + ")");
        this._xScale = d3_scale_1.scaleLinear()
            .range([0, height - plotMargins.top - plotMargins.bottom]);
        this._xAxis = d3_axis_1.axisLeft(this._xScale);
        this._radiusScale = d3_scale_1.scaleLinear()
            .range([2, 30]);
        this._yScale = d3_scale_1.scaleLinear()
            .range([30, width - plotMargins.left - plotMargins.right]);
    }
    chart.prototype.update = function (data) {
        var _this = this;
        this._xScale.domain(d3_array_1.extent(data, function (d) { return d.year; }));
        this._xAxisGroup.call(this._xAxis);
        this._radiusScale
            .domain(d3_array_1.extent(data, function (d) { return d.recordsStolen; }));
        var byYear = d3_collection_1.nest().key(function (d) { return d.year; }).entries(data);
        this._yScale.domain([0, d3_array_1.max(byYear, function (d) { return d.values.length; })]);
        var enterSelection = this._selection.select('.data-container')
            .selectAll('.year')
            .data(byYear)
            .enter()
            .append('g')
            .classed('year', true)
            .attr('transform', function (d) { return ("translate(" + 0 + "," + _this._xScale(+d.key) + ")"); });
        var dataPoints = enterSelection.selectAll('.data-point')
            .data(function (d) { return d.values; })
            .enter()
            .append('g')
            .classed('data-point', true)
            .attr('transform', function (d, i) { return ("translate(" + _this._yScale(i) + "," + 0 + ")"); })
            .on('mouseenter', function (d, i) {
            d3_selection_1.select(this)
                .select('.legend')
                .style('visibility', 'visible');
        }).on('mouseleave', function (d, i) {
            d3_selection_1.select(this)
                .select('.legend')
                .style('visibility', 'hidden');
        });
        dataPoints.append('circle')
            .attr('r', function (d) { return _this._radiusScale(d.recordsStolen); });
        var legend = dataPoints
            .append('g')
            .classed('legend', true)
            .style('visibility', 'hidden');
        legend.append('rect')
            .attr('width', 200)
            .attr('height', 40)
            .attr('transform', "translate(" + -100 + "," + 0 + ")")
            .style('fill', 'rgb(200,200,200)');
        legend.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 15)
            .text(function (d) { return d.company; });
        legend.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 35)
            .text(function (d) { return (d3_format_1.format('.0s')(d.recordsStolen) + " records stolen"); });
    };
    return chart;
}());
exports.chart = chart;
//# sourceMappingURL=chart.js.map
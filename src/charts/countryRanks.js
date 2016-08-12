"use strict";
var d3_axis_1 = require('d3-axis');
var d3_scale_1 = require('d3-scale');
var d3_array_1 = require('d3-array');
var d3_collection_1 = require('d3-collection');
var d3_shape_1 = require('d3-shape');
var d3_scale_chromatic_1 = require('d3-scale-chromatic');
var countryRank = (function () {
    function countryRank(container, width, height) {
        this._chartMargins = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        this._plotMargins = {
            top: 10,
            bottom: 10,
            left: 50,
            right: 10
        };
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', "translate(" + this._chartMargins.left + "," + this._chartMargins.top + ")");
        var chartWidth = width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = height - this._chartMargins.top - this._chartMargins.bottom;
        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', "translate(" + this._plotMargins.left + "," + this._plotMargins.top + ")");
        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;
        this._xScale = d3_scale_1.scaleLinear()
            .range([0, plotWidth]);
        this._xAxis = d3_axis_1.axisBottom(this._xScale);
        this._xAxisGroup = plotGroup.append('g')
            .classed('axis-group', true)
            .attr('transform', "translate(" + 0 + "," + plotHeight + ")");
        this._yScale = d3_scale_1.scaleLinear()
            .range([plotHeight, 0]);
        this._yAxis = d3_axis_1.axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.append('g')
            .classed('axis-group', true);
        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
    }
    countryRank.prototype.update = function (data) {
        var _this = this;
        this._xScale.domain(d3_array_1.extent(data, function (d) { return d.edition; }));
        this._xAxisGroup.call(this._xAxis);
        this._yScale
            .domain([0, d3_array_1.max(data, function (d) { return d.total; })])
            .nice();
        this._yAxisGroup.call(this._yAxis);
        var byCountry = d3_collection_1.nest()
            .key(function (d) { return d.country; })
            .entries(data)
            .sort(function (a, b) { return d3_array_1.sum(b.values, function (v) { return v.total; }) - d3_array_1.sum(a.values, function (v) { return v.total; }); })
            .splice(0, 10);
        var lineGenerator = d3_shape_1.line()
            .x(function (d) { return _this._xScale(d.edition); })
            .y(function (d) { return _this._yScale(d.total); });
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(byCountry);
        dataBound
            .exit()
            .remove();
        dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .append('path')
            .attr('d', function (d) { return lineGenerator(d.values); })
            .style('stroke', function (d, i) { return d3_scale_chromatic_1.schemePaired[i]; });
    };
    return countryRank;
}());
exports.countryRank = countryRank;
//# sourceMappingURL=countryRanks.js.map
"use strict";
var d3_axis_1 = require('d3-axis');
var d3_scale_1 = require('d3-scale');
var d3_array_1 = require('d3-array');
var d3_collection_1 = require('d3-collection');
var d3_shape_1 = require('d3-shape');
// import { schemePaired, schemeAccent, interpolateBlues } from 'd3-scale-chromatic';
var colorScale_1 = require('./colorScale');
var legend_1 = require('./legend');
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
            bottom: 25,
            left: 50,
            right: 10
        };
        this._width = width;
        this._height = height;
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', "translate(" + this._chartMargins.left + "," + this._chartMargins.top + ")");
        var chartWidth = this.width();
        var chartHeight = this.height();
        // chartGroup.append('rect')
        //     .attr('width', chartWidth)
        //     .attr('height', chartHeight)
        //     .style('fill', 'pink');
        this._legendGroup = chartGroup.append('g')
            .classed('legendGroup-group', true);
        this._legend = new legend_1.legend(this._legendGroup);
        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', "translate(" + this._plotMargins.left + "," + this._plotMargins.top + ")");
        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right - this._legend.width();
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;
        // plotGroup.append('rect')
        //     .attr('width', plotWidth)
        //     .attr('height', plotHeight)
        //     .style('fill', 'lightblue');
        this._legendGroup.attr('transform', "translate(" + (chartWidth - this._legend.width()) + "," + (chartHeight / 2 - this._legend.height() / 2) + ")");
        this._plotHeight = plotHeight;
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
        // this.initLegend(chartGroup, chartWidth, chartHeight);
    }
    // private initLegend(chartGroup: any, chartWidth: number, chartHeight: number) {
    //     this._legendGroup = chartGroup.append('g')
    //         .classed('legend-group', true)
    //         .attr('transform', `translate(${chartWidth - this._legendWidth - this._legendMargins.left},${(chartHeight / 2 - this._legendHeight / 2 - (this._legendMargins.top) / 2)})`);
    //     this._legendGroup.append('rect')
    //         .attr('width', this._legendWidth)
    //         .attr('height', this._legendHeight)
    //         .style('fill', 'white')
    //         .style('stroke', 'darkgray');
    // }
    countryRank.prototype.width = function () {
        return this._width - this._chartMargins.left - this._chartMargins.right;
    };
    countryRank.prototype.height = function () {
        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    };
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
        var areaGenerator = d3_shape_1.area()
            .x(function (d) { return _this._xScale(d.edition); })
            .y0(this._plotHeight)
            .y1(function (d) { return _this._yScale(d.total); });
        var countryNames = byCountry.map(function (d) { return d.key; });
        var filtered = data.filter(function (d) { return countryNames.indexOf(d.country) >= 0; });
        console.log(filtered);
        var stackGenerator = d3_shape_1.stack()
            .keys(countryNames)
            .value(function (d) { return d.values; });
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
            .attr('d', function (d) { return areaGenerator(d.values); })
            .style('fill', function (d, i) { return colorScale_1.color(i); });
        this._legend.update(countryNames);
    };
    return countryRank;
}());
exports.countryRank = countryRank;
//# sourceMappingURL=countryRanks.js.map
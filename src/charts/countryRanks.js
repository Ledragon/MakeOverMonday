"use strict";
var d3_axis_1 = require('d3-axis');
var d3_scale_1 = require('d3-scale');
var d3_array_1 = require('d3-array');
var d3_collection_1 = require('d3-collection');
var d3_shape_1 = require('d3-shape');
// import { schemePaired, schemeAccent, interpolateBlues } from 'd3-scale-chromatic';
var colorScale_1 = require('./colorScale');
var legend_1 = require('./legend');
var title_1 = require('./title');
var xAxis_1 = require('./xAxis');
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
        var titleGroup = chartGroup.append('g')
            .classed('title-group', true);
        var t = new title_1.title(titleGroup)
            .text('Best performing countries');
        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', "translate(" + this._plotMargins.left + "," + (this._plotMargins.top + t.height()) + ")");
        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right - this._legend.width();
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom - t.height();
        titleGroup
            .attr('transform', "translate(" + plotWidth / 2 + "," + 20 + ")");
        // plotGroup.append('rect')
        //     .attr('width', plotWidth)
        //     .attr('height', plotHeight)
        //     .style('fill', 'lightblue');
        this._legendGroup.attr('transform', "translate(" + (chartWidth - this._legend.width()) + "," + (chartHeight / 2 - this._legend.height() / 2) + ")");
        this._plotHeight = plotHeight;
        this._xAxis = new xAxis_1.horizontalLinearAxis(plotGroup, plotWidth, plotHeight);
        this._yScale = d3_scale_1.scaleLinear()
            .range([plotHeight, 0]);
        this._yAxis = d3_axis_1.axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.append('g')
            .classed('axis-group', true);
        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
    }
    countryRank.prototype.width = function () {
        return this._width - this._chartMargins.left - this._chartMargins.right;
    };
    countryRank.prototype.height = function () {
        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    };
    countryRank.prototype.update = function (data) {
        var _this = this;
        var e = d3_array_1.extent(data, function (d) { return d.edition; });
        this._xAxis.update(e);
        var byCountry = d3_collection_1.nest()
            .key(function (d) { return d.country; })
            .entries(data)
            .sort(function (a, b) { return d3_array_1.sum(b.values, function (v) { return v.total; }) - d3_array_1.sum(a.values, function (v) { return v.total; }); })
            .splice(0, 10);
        var byYear = d3_collection_1.nest()
            .key(function (d) { return d.edition; })
            .entries(data);
        var toto = [];
        byYear.forEach(function (c, i) {
            var result = {};
            result.edition = c.key;
            c.values.forEach(function (v) {
                result[v.country] = v.total;
            });
            toto.push(result);
        });
        var countryNames = byCountry.map(function (d) { return d.key; });
        var stackGenerator = d3_shape_1.stack()
            .keys(countryNames);
        var stacked = stackGenerator(toto);
        this._yScale
            .domain([0, 450])
            .nice();
        this._yAxisGroup.call(this._yAxis);
        // console.log(stackGenerator(filtered))
        var areaGenerator = d3_shape_1.area()
            .x(function (d) {
            var x = _this._xAxis.scale(+d.data.edition);
            return x;
        })
            .y0(function (d, i) {
            var y0 = isNaN(d[0]) ? _this._yScale(0) : _this._yScale(d[0]);
            return y0;
        })
            .y1(function (d, i) {
            var y1 = isNaN(d[1]) ? _this._yScale(d[0]) : _this._yScale(d[1]);
            return y1;
        });
        // .y1(d => d[1]);
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(stacked);
        dataBound
            .exit()
            .remove();
        dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .append('path')
            .attr('d', function (d) {
            return areaGenerator(d);
        })
            .style('fill', function (d, i) { return colorScale_1.color(i); });
        this._legend.update(countryNames);
        this._legendGroup.attr('transform', "translate(" + (this.width() - this._legend.width()) + "," + (this.height() / 2 - this._legend.height() / 2) + ")");
    };
    return countryRank;
}());
exports.countryRank = countryRank;
//# sourceMappingURL=countryRanks.js.map
"use strict";
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var d3_array_1 = require('d3-array');
var d3_shape_1 = require('d3-shape');
var group_1 = require('./pieces/group');
var xAxis_1 = require('./pieces/xAxis');
var timeChart = (function () {
    function timeChart(container, width, height) {
        var timeChart = container.append('g')
            .classed('time-chart', true);
        var chartGroup = new group_1.group(timeChart, width, height, { top: 0, bottom: 0, left: 0, right: 0 }, 'chart-group');
        var plotGroup = new group_1.group(chartGroup.group(), chartGroup.width(), chartGroup.height(), { top: 20, bottom: 30, left: 100, right: 30 }, 'plot-group');
        // chartGroup.append('g')
        //     .classed('legend', true)
        //     .attr('transform', `translate(${chartGroup.width() - legendWIdth - 10},${chartGroup.height() / 2 - legendHeight / 2})`)
        //     .append('rect')
        //     .attr('width', legendWIdth)
        //     .attr('height', legendHeight);
        this._xAxis = new xAxis_1.horizontalLinearAxis(plotGroup.group(), plotGroup.width(), plotGroup.height());
        this._yScale = d3_scale_1.scaleLinear()
            .domain([0, 1])
            .range([plotGroup.height(), 0]);
        this._yAxis = d3_axis_1.axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.group().append('g')
            .classed('axis', true)
            .call(this._yAxis);
        this._plotGroup = plotGroup;
        this._plotGroup
            .append('g')
            .classed('series-group', true);
        //TODO legend
    }
    timeChart.prototype.updateYears = function (value) {
        this._xAxis.update(d3_array_1.extent(value));
        this._years = value;
    };
    timeChart.prototype.update = function (data) {
        var _this = this;
        var merged = [].concat.apply([], data.map(function (d) { return d.values; }));
        console.log(merged);
        var maxY = d3_array_1.max(merged, function (d) { return d.value; });
        this._yScale.domain([0, maxY]).nice();
        this._yAxisGroup.call(this._yAxis);
        var generator = d3_shape_1.line().x(function (d, i) { return _this._xAxis.scale(d.year); })
            .y(function (d, i) { return _this._yScale(d.value); });
        var dataBound = this._plotGroup.group()
            .select('.series-group')
            .selectAll('.series')
            .data(data);
        dataBound.exit()
            .remove();
        var paths = dataBound.enter()
            .append('g')
            .attr('data-name', function (d) { return d.name; })
            .classed('series', true)
            .append('path')
            .attr('d', function (d) {
            return generator(d.values);
        })
            .style('stroke', function (d) { return d.color; });
        dataBound
            .attr('data-name', function (d) { return d.name; })
            .select('path')
            .attr('d', function (d) {
            return generator(d.values);
        })
            .style('stroke', function (d) { return d.color; });
    };
    return timeChart;
}());
exports.timeChart = timeChart;
//# sourceMappingURL=timeline.js.map
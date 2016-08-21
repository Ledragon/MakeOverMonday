"use strict";
var d3_axis_1 = require('d3-axis');
var d3_scale_1 = require('d3-scale');
var pane = (function () {
    function pane(container, width, height) {
        this._chartMargins = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        this._plotMargins = {
            top: 10,
            bottom: 10,
            left: 120,
            right: 10
        };
        this._width = width;
        this._height = height;
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', "translate(" + this._chartMargins.left + "," + this._chartMargins.top + ")");
        var chartWidth = this.width();
        var chartHeight = this.height();
        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', "translate(" + this._plotMargins.left + "," + this._plotMargins.top + ")");
        this._plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right; // - this._legend.width();
        this._plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom; // - t.height();
        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
        this._yScale = d3_scale_1.scaleBand()
            .range([this._plotHeight, 0]);
        this._yAxis = d3_axis_1.axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.append('g')
            .classed('y-axis', true);
    }
    pane.prototype.width = function () {
        return this._width - this._chartMargins.left - this._chartMargins.right;
    };
    pane.prototype.height = function () {
        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    };
    pane.prototype.update = function (data) {
        var _this = this;
        var height = this._plotHeight / data.length;
        this._yScale.domain(data.map(function (d) { return d.product; }));
        this._yAxisGroup.call(this._yAxis);
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(data);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', function (d, i) { return ("translate(" + 0 + "," + _this._yScale(d.product) + ")"); });
    };
    return pane;
}());
exports.pane = pane;
//# sourceMappingURL=pane.js.map
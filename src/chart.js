"use strict";
var d3_scale_1 = require('d3-scale');
var d3_array_1 = require('d3-array');
var d3_collection_1 = require('d3-collection');
var colorScale_1 = require('./colorScale');
var chart = (function () {
    function chart(container, width, height) {
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
        this._group = container.append('g')
            .classed('chart', true)
            .attr('transform', "translate(" + this._chartMargins.left + "," + this._chartMargins.top + ")");
        this._width = width;
        this._height = height;
        // this._width = width;
        // this._height = height;
        // var chartGroup = container.append('g')
        //     .classed('chart-group', true)
        //     .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);
        // var chartWidth = this.width();
        // var chartHeight = this.height();
        // var plotGroup = chartGroup.append('g')
        //     .classed('plot-group', true)
        //     .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);
        // var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;// - this._legend.width();
        // var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;// - t.height();
    }
    chart.prototype.width = function () {
        return this._width - this._chartMargins.left - this._chartMargins.right;
    };
    chart.prototype.height = function () {
        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    };
    chart.prototype.update = function (data) {
        var byCategory = d3_collection_1.nest()
            .key(function (d) { return d.category; })
            .entries(data);
        var c = byCategory.map(function (d) { return d.key; });
        var tmpScale = d3_scale_1.scaleBand()
            .domain(c)
            .range([0, c.length]);
        var h = this.height() / byCategory.length;
        var w = 20;
        var that = this;
        var yScale = d3_scale_1.scaleLinear()
            .domain(d3_array_1.extent(data, function (d) { return d.change; }))
            .range([this.height(), 0]);
        var dataBound = this._group.selectAll('.pane')
            .data(byCategory);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('pane', true)
            .attr('transform', function (d, i) { return ("translate(" + d3_array_1.sum(byCategory.filter(function (dd, j) { return j < i; }), function (d) { return d.values.length; }) * w + "," + 0 + ")"); });
        enterSelection.append('rect')
            .classed('background-rect', true)
            .attr('width', function (d) { return d.values.length * w; })
            .attr('height', this.height())
            .style('fill', function (d, i) {
            return colorScale_1.color(tmpScale(d.key));
        });
        enterSelection
            .selectAll('rect')
            .data(function (d) { return d.values; })
            .enter()
            .append('rect')
            .attr('x', function (d, i) { return i * w; })
            .attr('width', 15)
            .attr('height', function (d) { return yScale(d.change); });
        // .each(function (d) {
        //     let p = new pane(select(this), that.width(), h);
        //     p.update(d.values);
        // });
    };
    return chart;
}());
exports.chart = chart;
//# sourceMappingURL=chart.js.map
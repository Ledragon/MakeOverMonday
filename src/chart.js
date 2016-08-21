"use strict";
var d3_selection_1 = require('d3-selection');
var pane_1 = require('./pane');
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
            .classed('chart', true);
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
        var h = this.height() / data.length;
        var that = this;
        var dataBound = this._group.selectAll('.pane')
            .data(data);
        dataBound
            .exit()
            .remove();
        dataBound
            .enter()
            .append('g')
            .classed('pane', true)
            .attr('transform', function (d, i) { return ("translate(" + 0 + "," + i * h + ")"); })
            .each(function (d) {
            var p = new pane_1.pane(d3_selection_1.select(this), that.width(), h);
            p.update(d.values);
        });
    };
    return chart;
}());
exports.chart = chart;
//# sourceMappingURL=chart.js.map
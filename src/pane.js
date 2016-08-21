"use strict";
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
        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', "translate(" + this._plotMargins.left + "," + this._plotMargins.top + ")");
        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right; // - this._legend.width();
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom; // - t.height();
        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
    }
    pane.prototype.width = function () {
        return this._width - this._chartMargins.left - this._chartMargins.right;
    };
    pane.prototype.height = function () {
        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    };
    pane.prototype.update = function (data) {
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(data);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', function (d, i) { return ("translate(" + 0 + "," + i * 20 + ")"); });
    };
    return pane;
}());
exports.pane = pane;
//# sourceMappingURL=pane.js.map
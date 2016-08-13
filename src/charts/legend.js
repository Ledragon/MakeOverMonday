"use strict";
var colorScale_1 = require('./colorScale');
var legend = (function () {
    function legend(container) {
        this._margins = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        this._width = 100;
        this._height = 50;
        this._group = container.append('g')
            .classed('legend-group', true)
            .attr('transform', "translate(" + this._margins.left + "," + this._margins.top + ")");
        this._group.append('rect')
            .classed('border', true)
            .attr('width', this._width)
            .attr('height', this._height)
            .style('fill', 'white')
            .style('stroke', 'darkgray');
    }
    legend.prototype.width = function () {
        return this._width + this._margins.left + this._margins.right;
    };
    legend.prototype.height = function () {
        return this._height + this._margins.top + this._margins.bottom;
    };
    legend.prototype.update = function (data) {
        var dataBound = this._group.selectAll('.legend-item')
            .data(data);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', function (d, i) { return ("translate(" + 0 + "," + i * 20 + ")"); });
        enterSelection.append('rect')
            .attr('transform', "translate(" + 5 + "," + 5 + ")")
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function (d, i) { return colorScale_1.color(i); });
        enterSelection.append('text')
            .attr('transform', function (d, i) { return ("translate(" + 20 + "," + 15 + ")"); })
            .text(function (d) { return d; });
        this._height = data.length * 20;
        this._group.select('.border').attr('height', this._height);
    };
    return legend;
}());
exports.legend = legend;
//# sourceMappingURL=legend.js.map
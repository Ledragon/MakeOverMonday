"use strict";
var d3_axis_1 = require('d3-axis');
var d3_scale_1 = require('d3-scale');
var horizontalLinearAxis = (function () {
    function horizontalLinearAxis(container, width, height) {
        this._xScale = d3_scale_1.scaleLinear()
            .range([0, width]);
        this._xAxis = d3_axis_1.axisBottom(this._xScale);
        this._xAxisGroup = container.append('g')
            .classed('axis-group', true)
            .attr('transform', "translate(" + 0 + "," + height + ")");
    }
    horizontalLinearAxis.prototype.update = function (domain) {
        this._xScale.domain(domain);
        this._xAxisGroup.call(this._xAxis);
        return this;
    };
    horizontalLinearAxis.prototype.scale = function (value) {
        return this._xScale(value);
    };
    return horizontalLinearAxis;
}());
exports.horizontalLinearAxis = horizontalLinearAxis;
//# sourceMappingURL=xAxis.js.map
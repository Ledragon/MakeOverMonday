"use strict";
var group = (function () {
    function group(container, _width, _height, _margins, classed) {
        this._width = _width;
        this._height = _height;
        this._margins = _margins;
        this._group = container.append('g')
            .classed(classed, true)
            .attr('transform', "translate(" + this._margins.left + "," + this._margins.top + ")");
    }
    group.prototype.width = function () {
        return this._width - this._margins.left - this._margins.right;
    };
    group.prototype.height = function () {
        return this._height - this._margins.top - this._margins.bottom;
    };
    group.prototype.group = function () {
        return this._group;
    };
    return group;
}());
exports.group = group;
//# sourceMappingURL=group.js.map
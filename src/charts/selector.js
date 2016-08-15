"use strict";
var d3_array_1 = require('d3-array');
var container_1 = require('./container');
var xAxis_1 = require('./xAxis');
var selector = (function () {
    function selector(c, width, height) {
        this._container = new container_1.container(c, width, height, 'selector');
        this._axis = new xAxis_1.horizontalLinearAxis(this._container.group(), width - 20, 10);
    }
    selector.prototype.update = function (data) {
        this._axis.update(d3_array_1.extent(data));
        return this;
    };
    return selector;
}());
exports.selector = selector;
//# sourceMappingURL=selector.js.map
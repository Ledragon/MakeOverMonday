"use strict";
var container = (function () {
    function container(container, width, height, margins) {
        this._margins = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        this._width = 100;
        this._height = 50;
        this._width = width;
        this._height = height;
        if (margins) {
            this._margins = margins;
        }
    }
    container.prototype.width = function () {
        return this._width + this._margins.left + this._margins.right;
    };
    container.prototype.height = function () {
        return this._height + this._margins.top + this._margins.bottom;
    };
    return container;
}());
exports.container = container;
//# sourceMappingURL=container.js.map
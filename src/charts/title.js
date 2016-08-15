"use strict";
var container_1 = require('./container');
var title = (function () {
    function title(c) {
        this._container = new container_1.container(c, 100, 30, 'title');
        this._group = this._container.group();
        this._group.append('text')
            .style('text-anchor', 'middle');
    }
    title.prototype.text = function (value) {
        this._group.select('text')
            .text(value);
        return this;
    };
    title.prototype.width = function () {
        return this._container.width();
    };
    title.prototype.height = function () {
        return this._container.height();
    };
    return title;
}());
exports.title = title;
//# sourceMappingURL=title.js.map
"use strict";
var d3_array_1 = require('d3-array');
var d3_collection_1 = require('d3-collection');
var d3_format_1 = require('d3-format');
var statistics = (function () {
    function statistics(selection, width, height) {
        this._selection = selection.append('div')
            .classed('statistics', true);
        this._selection.append('p')
            .classed('total', true);
        this._selection.append('p')
            .classed('companies', true);
        this._selection.append('p')
            .classed('records-stolen', true);
    }
    statistics.prototype.update = function (data) {
        this._selection.select('.total')
            .text(data.length + " data breaches between " + d3_array_1.min(data, function (d) { return d.year; }) + " and " + d3_array_1.max(data, function (d) { return d.year; }));
        this._selection.select('.companies')
            .text(d3_collection_1.nest().key(function (d) { return d.company; }).entries(data).length + " companies involved");
        this._selection.select('.records-stolen')
            .text(d3_format_1.formatPrefix('.3', 1e9)(d3_array_1.sum(data, function (d) { return d.recordsStolen; })) + " records stolen");
    };
    return statistics;
}());
exports.statistics = statistics;
//# sourceMappingURL=statistics.js.map
"use strict";
var d3_selection_1 = require('d3-selection');
var dataService_1 = require('./services/dataService');
var bySubsidiariesCount_1 = require('./charts/bySubsidiariesCount');
var w = 800;
var h = 800;
var subsidiariesSvg = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
var sub = bySubsidiariesCount_1.bySubsidiariesCount(subsidiariesSvg, w, h);
dataService_1.read('data/Corporate Tax Havens.csv', function (data) {
    var mapped = data.map(function (d) {
        return {
            company: d['Company'],
            subsidiariesCount: +d['Tax Haven Subsidiaries'],
            amount: +d['Amount Held Offshore ($ millions)'],
            subsidiariesLocation: d['Location of Tax Haven Subsidiaries'].split(',')
        };
    });
    sub.update(mapped);
});
//# sourceMappingURL=app.js.map
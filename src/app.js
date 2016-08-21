"use strict";
var d3_selection_1 = require('d3-selection');
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
var chart_1 = require('./chart');
var w = 800;
var h = 600;
var svg = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
var c = new chart_1.chart(svg, w, h);
d3_request_1.csv('data/data.csv', function (d) {
    return {
        category: d.Category,
        product: d.Product,
        current: d['2014'],
        previous: d['2013'],
        'change': parseFloat(d['% Change']) / 100
    };
}, function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(data);
        var byCategory = d3_collection_1.nest()
            .key(function (d) { return d.category; })
            .entries(data);
        c.update(byCategory);
    }
});
//# sourceMappingURL=app.js.map
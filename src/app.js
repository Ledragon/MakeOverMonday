"use strict";
var d3_request_1 = require('d3-request');
var d3_selection_1 = require('d3-selection');
var d3_queue_1 = require('d3-queue');
var node = d3_selection_1.select('.content').node().getBoundingClientRect();
var width = node.width; //- 20;
var height = node.height; // - 10;
var chartSvg = d3_selection_1.select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var q = d3_queue_1.queue()
    .defer(d3_request_1.csv, 'data/Global Peace Index 2016.csv')
    .defer(d3_request_1.json, 'data/world.json')
    .await(function (error, csvData, world) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(csvData);
        console.log(world);
    }
});
// q.defer(csv('data/Global Peace Index 2016.csv'))
// csv('data/Global Peace Index 2016.csv', function (error: any, data: any) {
//     if (error) {
//         console.error(error);
//     }
//     else {
//         console.log(data);
//     }
// }) 
//# sourceMappingURL=app.js.map
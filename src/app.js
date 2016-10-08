"use strict";
var d3_request_1 = require('d3-request');
var d3_selection_1 = require('d3-selection');
var d3_queue_1 = require('d3-queue');
var d3_collection_1 = require('d3-collection');
var d3_array_1 = require('d3-array');
var d3_geo_1 = require('d3-geo');
var d3_scale_1 = require('d3-scale');
var d3_scale_chromatic_1 = require('d3-scale-chromatic');
var node = d3_selection_1.select('.content').node().getBoundingClientRect();
var width = node.width; //- 20;
var height = node.height; // - 10;
var chartSvg = d3_selection_1.select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var colorScale = d3_scale_1.scaleLinear()
    .range([0, 1]);
var q = d3_queue_1.queue()
    .defer(d3_request_1.csv, 'data/Global Peace Index 2016.csv')
    .defer(d3_request_1.json, 'data/countries.json')
    .await(function (error, csvData, world) {
    if (error) {
        console.error(error);
    }
    else {
        var byYear = d3_collection_1.nest()
            .key(function (d) { return d.Year; })
            .entries(csvData);
        var years = byYear.map(function (d) { return +d.key; });
        var projection = d3_geo_1.geoMercator()
            .fitSize([width, height], world);
        var pathGenerator_1 = d3_geo_1.geoPath()
            .projection(projection);
        // console.log(pathGenerator(world.features[0]));
        chartSvg
            .selectAll('path')
            .data(world.features)
            .enter()
            .append('path')
            .classed('country', true)
            .attr('d', function (d) { return pathGenerator_1(d); });
        var first = byYear[0].values;
        colorScale.domain(d3_array_1.extent(first, function (f) { return parseFloat(f.Score); }));
        console.log(colorScale.domain());
        chartSvg.selectAll('path')
            .style('fill', function (d) {
            var index = first.filter(function (f) { return f.Code === d.properties.ADM0_A3; });
            if (index.length > 0) {
                var found = index[0];
                console.log(found);
                return d3_scale_chromatic_1.interpolateBlues(colorScale(parseFloat(found.Score)));
            }
        });
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
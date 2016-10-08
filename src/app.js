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
var width = 960; //node.width;//- 20;
var height = 640; //node.height;// - 10;
var chartSvg = d3_selection_1.select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var legend = chartSvg.append('g')
    .classed('legend', true)
    .attr('transform', "translate(" + 30 + "," + 50 + ")");
legend.append('text')
    .style('font-size', '36px')
    .text(2000);
var scaleLegend = legend.append('g')
    .classed('scale', true)
    .attr('transform', "translate(" + 0 + "," + 10 + ")");
var rectWidth = 2;
scaleLegend.selectAll('rect')
    .data(d3_array_1.range(0, 1, 0.01))
    .enter()
    .append('rect')
    .attr('x', function (d, i) { return i * rectWidth; })
    .attr('height', 10)
    .attr('width', rectWidth)
    .style('fill', function (d) { return d3_scale_chromatic_1.interpolateBlues(d); });
legend.append('text')
    .text('Less peaceful')
    .attr('transform', "translate(" + 0 + "," + 30 + ")");
legend.append('text')
    .text('More peaceful')
    .style('text-anchor', 'end')
    .attr('transform', "translate(" + 200 + "," + 30 + ")");
var projection = d3_geo_1.geoMercator();
// .fitSize([width, height], world);
var pathGenerator = d3_geo_1.geoPath()
    .projection(projection);
drawMap();
function drawMap() {
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
            var byYear_1 = d3_collection_1.nest()
                .key(function (d) { return d.Year; })
                .entries(csvData);
            var years = byYear_1.map(function (d) { return +d.key; });
            // console.log(pathGenerator(world.features[0]));
            projection.fitSize([width, height], world);
            chartSvg
                .selectAll('path')
                .data(world.features)
                .enter()
                .append('path')
                .classed('country', true)
                .attr('d', function (d) { return pathGenerator(d); });
            var i_1 = 0;
            setInterval(function () {
                if (i_1 >= byYear_1.length) {
                    i_1 = 0;
                }
                updateMap(byYear_1[i_1]);
                i_1++;
            }, 500);
        }
    });
    function updateMap(kvp) {
        chartSvg.select('text').text(kvp.key);
        var first = kvp.values;
        colorScale.domain(d3_array_1.extent(first, function (f) { return parseFloat(f.Score); }));
        chartSvg.selectAll('path')
            .style('fill', function (d) {
            var index = first.filter(function (f) { return f.Code === d.properties.ADM0_A3; });
            if (index.length > 0) {
                var found = index[0];
                // console.log(found)
                return d3_scale_chromatic_1.interpolateBlues(colorScale(parseFloat(found.Score)));
            }
        });
    }
}
//# sourceMappingURL=app.js.map
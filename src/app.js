"use strict";
var d3_request_1 = require('d3-request');
var d3_selection_1 = require('d3-selection');
var d3_scale_chromatic_1 = require('d3-scale-chromatic');
var timeline_1 = require('./charts/timeline');
var node = d3_selection_1.select('.content').node().getBoundingClientRect();
console.log(node);
var width = node.width - 20;
var height = node.height - 10;
var chartSvg = d3_selection_1.select('.content')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var tc = new timeline_1.timeChart(chartSvg, width, height);
d3_request_1.csv('data/Global Peach Index.csv', function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        // let countries:Array<string> = data.map(d => d.Country);
        var years_1 = data.columns.splice(3, data.columns.length - 1).map(function (d) { return +d; });
        var mapped = data.map(function (d) {
            return {
                name: d.Country,
                values: years_1.map(function (y) {
                    return {
                        year: y,
                        value: +d[y]
                    };
                })
            };
        });
        var selected = [];
        d3_selection_1.select('.left-menu')
            .selectAll('.country')
            .data(mapped)
            .enter()
            .append('div')
            .classed('country', true)
            .on('click', function (d) {
            var sel = d3_selection_1.select(this);
            // let hasClass = sel.classed('highlight');
            // sel.classed('highlight', !hasClass);
            var indexOf = selected.indexOf(d);
            if (indexOf >= 0) {
                selected.splice(indexOf, 1);
                sel.style('background', '');
            }
            else {
                selected.push(d);
                indexOf = selected.indexOf(d);
                sel.style('background', d3_scale_chromatic_1.schemeDark2[indexOf]);
            }
            d.color = d3_scale_chromatic_1.schemeDark2[indexOf];
            tc.update(selected);
        })
            .text(function (d) { return d.name; });
        tc.updateYears(years_1);
    }
});
//# sourceMappingURL=app.js.map
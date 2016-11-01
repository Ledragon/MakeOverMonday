"use strict";
var d3_selection_1 = require('d3-selection');
var d3_queue_1 = require('d3-queue');
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var d3_time_format_1 = require('d3-time-format');
var width = 1900;
var height = 700;
var margins = {
    top: 30,
    bottom: 50,
    left: 20,
    right: 20
};
var container = d3_selection_1.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
var plotGroup = container.append('g')
    .classed('container', true)
    .attr('transform', "translate(" + margins.left + "," + margins.top + ")");
var plotWidth = width - margins.left - margins.right;
var plotHeight = height - margins.top - margins.bottom;
var stateScale = d3_scale_1.scaleBand()
    .range([0, plotWidth]);
var stateScaleGroup = plotGroup.append('g')
    .classed('axis', true);
var stateAxis = d3_axis_1.axisTop(stateScale);
var seriesGroup = plotGroup.append('g')
    .classed('series', true);
var colors = ['red', 'blue', 'green', 'gray'];
var timeParser = d3_time_format_1.timeParse('%d-%m-%y');
var q = d3_queue_1.queue()
    .defer(d3_request_1.csv, 'data/Votamatic.csv')
    .defer(d3_request_1.json, 'data/us.geo.json');
q.awaitAll(function (error, responses) {
    if (error) {
        console.error(error);
    }
    else {
        var mapped = responses[0]
            .map(function (d) {
            return {
                state: d.State,
                clinton: parseFloat(d.Clinton),
                trump: parseFloat(d.Trump),
                other: parseFloat(d.Other),
                undecided: parseFloat(d.Undecided),
                date: timeParser(d.Date)
            };
        });
        var byDate_1 = d3_collection_1.nest()
            .key(function (d) { return d.date; })
            .entries(mapped);
        stateScale.domain(mapped.map(function (d) { return d.state; }));
        stateScaleGroup.call(stateAxis);
        // let timeScale = scaleTime()
        //     .domain(extent(byDate, d => d.date))
        //     .range([0, plotWidth]);
        var yScale_1 = d3_scale_1.scaleLinear()
            .domain([0, 1])
            .range([0, plotHeight]);
        var dateFormat_1 = d3_time_format_1.timeFormat('%B %d');
        var i_1 = 0;
        setInterval(function () {
            if (i_1 >= byDate_1.length) {
                i_1 = 0;
            }
            d3_selection_1.select('#date')
                .select('span')
                .text(dateFormat_1(new Date(byDate_1[i_1].key)));
            var databound = seriesGroup.selectAll('.series-individual')
                .data(byDate_1[i_1].values);
            var enterSelection = databound
                .enter()
                .append('g')
                .classed('series-individual', true)
                .attr('transform', function (d) { return ("translate(" + stateScale(d.state) + "," + 0 + ")"); });
            var rectWidth = stateScale.bandwidth() / 2;
            enterSelection.append('rect')
                .classed('clinton', true)
                .attr('x', rectWidth / 2)
                .attr('y', 0)
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.clinton); });
            databound.select('.clinton')
                .attr('x', rectWidth / 2)
                .attr('y', 0)
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.clinton); });
            enterSelection.append('rect')
                .classed('trump', true)
                .attr('x', rectWidth / 2)
                .attr('y', function (d) { return yScale_1(d.clinton); })
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.trump); });
            databound.select('.trump')
                .attr('x', rectWidth / 2)
                .attr('y', function (d) { return yScale_1(d.clinton); })
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.trump); });
            enterSelection.append('rect')
                .classed('other', true)
                .attr('x', rectWidth / 2)
                .attr('y', function (d) { return yScale_1(d.clinton) + yScale_1(d.trump); })
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.other); });
            databound.select('.other')
                .attr('x', rectWidth / 2)
                .attr('y', function (d) { return yScale_1(d.clinton) + yScale_1(d.trump); })
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.other); });
            enterSelection.append('rect')
                .classed('undecided', true)
                .attr('x', rectWidth / 2)
                .attr('y', function (d) { return yScale_1(d.clinton) + yScale_1(d.trump) + yScale_1(d.other); })
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.undecided); });
            databound.select('.undecided')
                .attr('x', rectWidth / 2)
                .attr('y', function (d) { return yScale_1(d.clinton) + yScale_1(d.trump) + yScale_1(d.other); })
                .attr('width', rectWidth)
                .attr('height', function (d) { return yScale_1(d.undecided); });
            databound.exit()
                .remove();
            // console.log(i)
            // databound.select('.clinton')
            //     .attr('x', 0)
            //     .attr('y', 0)
            //     .attr('width', stateScale.bandwidth())
            //     .attr('height', d => yScale(d.clinton));
            i_1++;
        }, 100);
    }
});
//# sourceMappingURL=app.js.map
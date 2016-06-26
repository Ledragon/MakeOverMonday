(function () {
    'use strict';
    var width = 800;
    var height = 600;

    var marginBottom = 50;
    var marginTop = 50;
    var marginLeft = 50;
    var marginRight = 50;
    var plotMargin = {
        top: 40,
        left: 0,
        right: 0,
        bottom: 0
    };
    var container = d3.select('svg');
    // var chartGroup = 
    //     .append('g')
    //     .attr('transform', `translate(${marginLeft},${marginTop})`);
    // var chartWidth = width - marginLeft - marginRight;
    // var chartHeight = height - marginTop - marginBottom;

    // var plotGroup = chartGroup
    //     .append('g')
    //     .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
    // var plotWidth = chartWidth - plotMargin.left - plotMargin.right;
    // var plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;


    // chartGroup.append('g')
    //     .classed('title', true)
    //     .attr('transform', `translate(${chartWidth / 2},${0})`)
    //     .append('text')
    //     .text('Number of submissions per week');








    // d3.csv('data/Makeover Monday.csv',
    //     (d) => {
    //         return {
    //             pinterestBoard: d['Pinterest Board'],
    //             pinboardUrl: d['Pinboard URL'],
    //             description: d.Description,
    //             pinNote: d['Pin Note'],
    //             originalLink: d['Original Link'],
    //             name: d['Name'],
    //             week: +d.Week,
    //             datePinned: moment(d['Date Pinned'], 'DD-MM-YY HH:mm')
    //         }
    //     },
    //     (error, data) => {
    //         if (error) {
    //             console.error(error);
    //         } else {
    //             var byWeek = d3.nest()
    //                 .key(d => d.week)
    //                 .entries(data);

    //             var xScale = d3.scale.linear()
    //                 .domain([0, d3.max(byWeek, w => +w.key)])
    //                 .range([0, plotWidth]);
    //             var xAxis = d3.svg.axis()
    //                 .orient('bottom')
    //                 .scale(xScale);
    //             var xAxisGroup = plotGroup.append('g')
    //                 .classed('axis', true)
    //                 .attr('transform', `translate(${0},${plotHeight})`)
    //                 .call(xAxis);


    //             var yScale = d3.scale.linear()
    //                 .domain([0, d3.max(byWeek, w => +w.values.length)])
    //                 .range([plotHeight, 0]);
    //             var yAxis = d3.svg.axis()
    //                 .orient('left')
    //                 .scale(yScale);
    //             var yAxisGroup = plotGroup.append('g')
    //                 .classed('axis', true)
    //                 .call(yAxis);


    //             var dataBound = plotGroup.selectAll('.data')
    //                 .data(byWeek);
    //             dataBound
    //                 .exit()
    //                 .remove();
    //             var enterSelection = dataBound
    //                 .enter()
    //                 .append('g')
    //                 .classed('data', true)
    //                 .attr('transform', d => `translate(${xScale(+d.key)},${yScale(d.values.length)})`);
    //             enterSelection.append('circle')
    //                 .attr({
    //                     'cx': 0,
    //                     'cy': 0,
    //                     'r': 2
    //                 });
    //         }
    //     });
} ());
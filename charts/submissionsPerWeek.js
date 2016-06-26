var charting = charting || {};

(function () {
    'use strict';
    var _width;
    var _height;
    charting.submissionsPerWeek = (container, width, height) => {
        _width = width;
        _height = height;
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
        var chartGroup = container
            .append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);
        var chartWidth = width - marginLeft - marginRight;
        var chartHeight = height - marginTop - marginBottom;

        var plotGroup = chartGroup
            .append('g')
            .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
        var plotWidth = chartWidth - plotMargin.left - plotMargin.right;
        var plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;


        chartGroup.append('g')
            .classed('title', true)
            .attr('transform', `translate(${chartWidth / 2},${0})`)
            .append('text')
            .text('Number of submissions per week');

    }

} ());
var charting = charting || {};
(function () {
    'use strict';
    var marginBottom = 50;
    var marginTop = 50;
    var marginLeft = 50;
    var marginRight = 50;
    var _chartWidth,
        _chartHeight;
    charting.chartContainer = (container, width, height) => {
        var chartGroup = container
            .append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);
        _chartWidth = width - marginLeft - marginRight;
        _chartHeight = height - marginTop - marginBottom;
        return {
            width: () => _chartWidth,
            height: () => _chartHeight,
            group: () => chartGroup
        }
    }
} ());
var charting = charting || {};
(function () {
    'use strict';

    var _width,
        _height;
    charting.chartContainer = (container, width, height, margin, classed) => {
        var group = container
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .classed(classed, true);
        _width = width - margin.left - margin.right;
        _height = height - margin.top - margin.bottom;
        return {
            width: () => _width,
            height: () => _height,
            group: () => group
        }
    }
} ());
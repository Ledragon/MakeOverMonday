(function () {
    'use strict';
    d3.select('#container').append('rect')
        .attr({
            'x': 0,
            'y': 0,
            'width': 100,
            'height': 100
        })
        .style('fill', 'lightblue');
} ());
var charting = charting || {};
(function () {
    'use strict';
    var _scale;
    var _axis;
    var _axisGroup;
    charting.horizontalAxis = (container, width, height, orient) => {
        _scale = d3.scale.linear()
            .domain([0, 25])
            .range([0, width]);
        _axis = d3.svg.axis()
            .orient(orient)
            .scale(_scale);
        _axisGroup = container.append('g')
            .classed('axis', true)
            .attr('transform', `translate(${0},${height})`)
            .call(_axis);
        return {
            domain: (domain) => {
                _scale.domain(domain);
                _axisGroup.call(_axis);
            },
            scale: () => {
                return _scale;
            }
        }
    }
} ());
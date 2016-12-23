import * as d3 from 'd3';
var _scale;
var _axis;
var _axisGroup;
export function horizontalAxis(container, width, height, orient) {
    _scale = d3.scaleLinear()
        .domain([0, 25])
        .range([0, width]);
    _axis = d3.axisBottom(_scale);
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
import * as d3 from 'd3';
var _scale: d3.ScaleLinear<number, number>;
var _axis: d3.Axis<number>;
var _axisGroup: d3.Selection<any, any, any, any>;
export function horizontalAxis(container: d3.Selection<any, any, any, any>, width: number, height: number, orient: string) {
    _scale = d3.scaleLinear()
        .domain([0, 25])
        .range([0, width]);
    _axis = d3.axisBottom<number>(_scale);
    _axisGroup = container.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${0},${height})`)
        .call(_axis);
    return {
        domain: (domain: [number, number]) => {
            _scale.domain(domain);
            _axisGroup.call(_axis);
        },
        scale: () => {
            return _scale;
        }
    }
}
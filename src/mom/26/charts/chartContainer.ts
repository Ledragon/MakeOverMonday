import { IMargins } from '../../../charting/IMargins';
var _width: number;
var _height: number;
export function chartContainer(container: d3.Selection<any, any, any, any>, width: number, height: number, margin: IMargins, classed: string) {
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
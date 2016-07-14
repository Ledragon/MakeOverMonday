import {select, selectAll, Selection} from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

export class chart {
    constructor(container: Selection, private _width: number, private _height: number) {
        var group = container.append('g')
            .classed('chart-group', true);

        var xScale = scaleTime()
            .domain([new Date(2016, 7, 1), new Date(2016, 7, 2)])
            .range([0, this._width]);
        var xAxis = axisBottom(xScale);
        var xAxisGroup = group.append('g')
            .classed('horizontal axis', true)
            .call(xAxis);
        // xAxis.call(xAxisGroup);
        
    }
}
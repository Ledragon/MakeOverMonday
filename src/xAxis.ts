import {Selection} from 'd3-selection';
import { scaleLinear, Linear} from 'd3-scale';
import { axisBottom, Axis } from 'd3-axis';

export class xAxis {
    private _scale: Linear<any>;
    private _group: Selection;
    private _axis: Axis;

    constructor(container: Selection, private _width: number, private _height: number) {
        var xScale = scaleLinear()
            .domain([0, 1])
            .range([0, this._width]);
        var xAxis = axisBottom(xScale);
        var xAxisGroup = container.append('g')
            .classed('horizontal axis', true)
            .attr('transform', `translate(${0},${this._height})`)
            .call(xAxis);

        this._scale = xScale;
        this._group = xAxisGroup;
        this._axis = xAxis;
    }

    update(domain: [number, number]): void{
        this._scale.domain(domain);
        this._group.call(this._axis);
    }
}
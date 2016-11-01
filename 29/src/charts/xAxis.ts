import {Selection} from 'd3-selection';
import {  scaleTime, Time} from 'd3-scale';
import { axisBottom, Axis } from 'd3-axis';
import { timeParse } from 'd3-time-format';
import { extent } from 'd3-array';
import { dataFormat } from '../typings-custom/dataFormat';


export class xAxis {
    private _scale: Time;
    private _group: Selection;
    private _axis: Axis;

    constructor(container: Selection, private _width: number, private _height: number) {
        var xScale = scaleTime()
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

    update(data: Array<dataFormat>): void {
        var domain = data.map(d => d.date);
        this._scale.domain(extent(domain));
        this._group.call(this._axis);
    }

    scale(): Time {
        return this._scale;
    }
}
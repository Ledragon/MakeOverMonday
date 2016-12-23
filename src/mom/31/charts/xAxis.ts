import {Selection} from 'd3-selection';
import {  scaleLinear, Linear} from 'd3-scale';
import { axisBottom, Axis } from 'd3-axis';
import { extent } from 'd3-array';
import { format } from 'd3-format';

import { dataFormat } from '../typings-custom/dataFormat';


export class xAxis {
    private _scale: Linear<number>;
    private _group: Selection;
    private _axis: Axis;

    constructor(container: Selection, private _width: number, private _height: number) {
        var xScale = scaleLinear<number>()
            .range([0, this._width]);
        var fmt = format('0')
        var xAxis = axisBottom(xScale)
            .tickFormat(d => fmt(d));
        var xAxisGroup = container.append('g')
            .classed('horizontal axis', true)
            .attr('transform', `translate(${0},${this._height})`)
            .call(xAxis);

        this._scale = xScale;
        this._group = xAxisGroup;
        this._axis = xAxis;
    }

    update(data: Array<dataFormat>): void {
        var domain = data.map(d => d.year);
        this._scale.domain(extent(domain));
        this._group.call(this._axis);
    }

    scale(): Linear<number> {
        return this._scale;
    }
}
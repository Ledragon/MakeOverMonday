import {Selection} from 'd3-selection';
import { scaleLinear, Linear} from 'd3-scale';
import { axisLeft, Axis } from 'd3-axis';
import { max } from 'd3-array';
import { nest } from 'd3-collection';
import { dataFormat } from '../typings-custom/dataFormat';

export class yAxis {
    private _scale: Linear<number>;
    private _group: Selection;
    private _axis: Axis;
    private _valueFunction = (d: dataFormat) => d.total;

    constructor(container: Selection, private _width: number, private _height: number) {
        var scale = scaleLinear<number>()
            .range([this._height, 0]);
        var axis = axisLeft(scale);
        var axisGroup = container.append('g')
            .classed('horizontal axis', true)
            .attr('transform', `translate(${0},${0})`)
            .call(axis);

        this._scale = scale;
        this._group = axisGroup;
        this._axis = axis;
    }

    valueFunction(fct: (d: dataFormat) => number): void {
        this._valueFunction = fct;
    }

    update(data: Array<dataFormat>): void {
        var maxValue = max(data, d => this._valueFunction(d));
        this._scale.domain([0, maxValue]).nice();
        this._group.call(this._axis);
    }

    scale(): Linear<number> {
        return this._scale;
    }
}
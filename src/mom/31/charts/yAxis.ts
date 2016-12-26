import { Selection } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { axisLeft, Axis } from 'd3-axis';
import { max } from 'd3-array';
import { nest } from 'd3-collection';

export class yAxis {
    private _scale: ScaleLinear<number, number>;
    private _group: Selection<any, any, any, any>;
    private _axis: Axis<any>;
    private _valueFunction = (d: any) => d.total;

    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
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

    valueFunction(fct: (d: any) => number): void {
        this._valueFunction = fct;
    }

    update(data: Array<any>): void {
        var maxValue = max(data, d => this._valueFunction(d));
        this._scale.domain([0, maxValue]).nice();
        this._group.call(this._axis);
    }

    scale(): ScaleLinear<number, number> {
        return this._scale;
    }
}
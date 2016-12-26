import { Selection } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { axisLeft, Axis } from 'd3-axis';
import { max } from 'd3-array';
import { nest } from 'd3-collection';
import { IDataFormat } from '../../../models/IDataFormat';


export class yAxis {
    private _scale: ScaleLinear<number, number>;
    private _group: Selection<any, any, any, any>;
    private _axis: Axis<any>;

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

    update(data: IDataFormat<any>): void {
        var byYear = nest<any>()
            .key(d => d.date.getFullYear().toString())
            .entries(data);
        var maxValue = max(byYear, d => d.values.length);
        this._scale.domain([0, maxValue]).nice();
        this._group.call(this._axis);
    }

    scale(): ScaleLinear<number, number> {
        return this._scale;
    }
}
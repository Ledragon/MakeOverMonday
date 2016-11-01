import {Selection} from 'd3-selection';
import { scaleLinear, Linear} from 'd3-scale';
import { axisLeft, Axis } from 'd3-axis';
import { extent } from 'd3-array';
import { dataFormat } from './models/dataFormat';


export class yAxis {
    private _scale: Linear<number>;
    private _group: Selection;
    private _axis: Axis;

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

    update(data: Array<dataFormat>): void {
        var domain = extent(data, d => +d.Mentions);
        this._scale.domain(domain).nice();
        this._group.call(this._axis);
    }

    scale(): Linear<number> {
        return this._scale;
    }
}
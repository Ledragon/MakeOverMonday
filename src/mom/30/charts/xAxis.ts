import { Selection } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { axisBottom, Axis } from 'd3-axis';
import { extent } from 'd3-array';
import { format } from 'd3-format';

import { dataFormat } from '../dataFormat';
import { IDataFormat } from '../../../models/IDataFormat';


export class xAxis {
    private _scale: ScaleLinear<number, number>;
    private _group: Selection<any, any, any, any>;
    private _axis: Axis<any>;

    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
        var xScale = scaleLinear<number>()
            .range([0, this._width]);
        var fmt = format('0')
        var xAxis = axisBottom(xScale)
            .tickFormat((d:any) => fmt(d));
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

    scale(): ScaleLinear<number, number> {
        return this._scale;
    }
}
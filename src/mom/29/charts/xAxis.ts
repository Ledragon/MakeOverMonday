import { Selection } from 'd3-selection';
import { scaleTime, ScaleTime } from 'd3-scale';
import { axisBottom, Axis } from 'd3-axis';
import { timeParse } from 'd3-time-format';
import { extent } from 'd3-array';
import { IDataFormat } from '../../../models/IDataFormat';


export class xAxis {
    private _scale: ScaleTime<any, any>;
    private _group: Selection<any, any, any, any>;
    private _axis: Axis<any>;

    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
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

    update(data: IDataFormat<any>): void {
        var domain = data.map(d => d.date);
        this._scale.domain(extent(domain));
        this._group.call(this._axis);
    }

    scale(): ScaleTime<any, any> {
        return this._scale;
    }
}
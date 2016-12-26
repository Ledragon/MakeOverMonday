import { Selection } from 'd3-selection';
import { scaleBand, ScaleBand } from 'd3-scale';
import { axisBottom, Axis } from 'd3-axis';
import { dataFormat } from './models/dataFormat';


export class xAxis {
    private _scale: ScaleBand<string>;
    private _group: Selection<any, any, any, any>;
    private _axis: Axis<any>;

    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
        var xScale = scaleBand<string>()
            .range([0, this._width])
            .paddingInner(.5)
            .paddingOuter(0.3);
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
        var domain = data.map(d => d.Topic);
        this._scale.domain(domain);
        this._group.call(this._axis);
    }

    scale(): ScaleBand<string> {
        return this._scale;
    }
}
import { select, Selection } from 'd3-selection';
import { axisBottom, Axis } from 'd3-axis';
import { scaleLinear, ScaleLinear } from 'd3-scale';

export class horizontalLinearAxis {
    private _xScale: ScaleLinear<number, number>;
    private _xAxis: Axis<any>;
    private _xAxisGroup: Selection<any, any, any, any>;

    constructor(container: Selection<any, any, any, any>, width: number, height: number) {
        this._xScale = scaleLinear()
            .range([0, width]);
        this._xAxis = axisBottom(this._xScale);
        this._xAxisGroup = container.append('g')
            .classed('axis-group', true)
            .attr('transform', `translate(${0},${height})`);
    }

    update(domain: [number, number]): horizontalLinearAxis{
        this._xScale.domain(domain);
        this._xAxisGroup.call(this._xAxis);
        return this;
    }

    scale(value: number): number{
        return this._xScale(value);
    }
}
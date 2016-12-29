import * as d3 from 'd3';

export class LeftLinearAxis<T> {
    private _axis: d3.Axis<number>;
    private _scale: d3.ScaleLinear<number, number>;
    private _group: d3.Selection<SVGGElement, any, any, any>;

    constructor(container: d3.Selection<SVGElement, T, any, any>, private _width: number, private _height: number) {
        this._group = container.append<SVGGElement>('g')
            .classed('axis', true);
        this._scale = d3.scaleLinear<number, number>()
            .range([_height, 0]);
        this._axis = d3.axisLeft<number>(this._scale);
    }

    group(): d3.Selection<SVGGElement, any, any, any> {
        return this._group;
    }

    domain(value?: [number, number]): LeftLinearAxis<T> | any[] {
        if (arguments.length) {
            this._scale.domain(value).nice();
            this._group.call(this._axis);
            return this;
        }
        else {
            return this._scale.domain();
        }
    }
    
    scale(value: number): number{
        return this._scale(value);
    }
}
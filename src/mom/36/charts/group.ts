import * as d3 from 'd3';
import { IMargins } from './IMargins';

export class group {
    private _group: d3.Selection<any, any, any, any>;
    constructor(container: d3.Selection<any, any, any, any>, private _width: number, private _height: number, private _margins: IMargins, classed: string) {
        this._group = container.append('g')
            .classed(classed, true)
            .attr('transform', `translate(${this._margins.left},${this._margins.top})`);
    }
    width(): number {
        return this._width - this._margins.left - this._margins.right;
    }
    height(): number {
        return this._height - this._margins.top - this._margins.bottom;
    }
    group(): d3.Selection<any, any, any, any> {
        return this._group;
    }
}
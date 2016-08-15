import { select, Selection } from 'd3-selection';

export class container {
    private _margins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    private _width = 100;
    private _height = 50;
    private _group: any;

    constructor(container: any, width: number, height: number, classed: string, margins?: any) {
        this._width = width;
        this._height = height;
        if (margins) {
            this._margins = margins;
        }

        this._group = container.append('g')
            .classed(classed, true)
            .attr('transform', `translate(${this._margins.left},${this._margins.top})`);
    }

    width() {
        return this._width + this._margins.left + this._margins.right;
    }

    height() {
        return this._height + this._margins.top + this._margins.bottom;
    }

    group() {
        return this._group;
    }
}
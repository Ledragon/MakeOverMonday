import { container } from './container';
import { select, Selection } from 'd3-selection';

export class title {
    private _container: container;
    private _group: Selection<any, any, any, any>;
    constructor(c: any) {
        this._container = new container(c, 100, 30, 'title');
        this._group = this._container.group();
        this._group.append('text')
            .style('text-anchor', 'middle');
    }

    text(value: string): title {
        this._group.select('text')
            .text(value);
        return this;
    }

    width(): number {
        return this._container.width();
    }

    height(): number {
        return this._container.height();
    }
}
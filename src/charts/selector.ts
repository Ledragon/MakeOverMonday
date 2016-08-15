import { select, Selection } from 'd3-selection';
import { extent } from 'd3-array';

import { container } from './container';
import { horizontalLinearAxis } from './xAxis';

export class selector {
    private _group: Selection<any, any, any, any>;
    private _container: container;
    private _axis: horizontalLinearAxis;

    constructor(c: Selection<any, any, any, any>, width: number, height: number) {
        this._container = new container(c, width, height, 'selector');
        this._axis = new horizontalLinearAxis(this._container.group(), width - 20, 10);
    }

    update(data: Array<number>): selector {
        this._axis.update(extent(data));
        return this;
    }
}
import { Selection } from 'd3-selection';
import { sum, min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { formatPrefix } from 'd3-format';

export class statistics {
    private _selection: Selection<any, any, any, any>;
    constructor(selection: Selection<any, any, any, any>, width: number, height: number) {
        this._selection = selection.append('div')
            .classed('statistics', true);
        this._selection.append('p')
            .classed('total', true);
        this._selection.append('p')
            .classed('companies', true);
        this._selection.append('p')
            .classed('records-stolen', true);
    }

    update(data: Array<any>) {
        this._selection.select('.total')
            .text(`${data.length} data breaches between ${min(data, d => d.year)} and ${max(data, d => d.year)}`)
        this._selection.select('.companies')
            .text(`${nest().key(d => d.company).entries(data).length} companies involved`);
        this._selection.select('.records-stolen')
            .text(`${formatPrefix('.3',1e9)(sum(data, d => d.recordsStolen))} records stolen`);
    }
}
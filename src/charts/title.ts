import { Selection } from 'd3-selection';

export class title {
    private _group: Selection;
    constructor(container: Selection, width: number, height: number) {
        this._group = container.append('g')
            .classed('chart-title', true)
            .attr('transform', `translate(${width / 2},${0})`);
        
        this._group.append('text');
    }

    text(value: string): void{
        this._group.select('text').text(value);
    }
}
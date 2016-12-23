import { select, Selection } from 'd3-selection';
import { color } from './colorScale';


export class legend {
    private _group: Selection<any, any, any, any>;
    private _margins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }

    private _width = 100;
    private _height = 50;
    constructor(container: any) {
        this._group = container.append('g')
            .classed('legend-group', true)
            .attr('transform', `translate(${this._margins.left},${this._margins.top})`);
        this._group.append('rect')
            .classed('border', true)
            .attr('width', this._width)
            .attr('height', this._height)
            .style('fill', 'white')
            .style('stroke', 'darkgray');
    }

    width() {
        return this._width + this._margins.left + this._margins.right;
    }
    
    height() {
        return this._height + this._margins.top + this._margins.bottom;
    }

    update(data: Array<string>) {
        var dataBound = this._group.selectAll('.legend-item')
            .data(data);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', (d, i) => `translate(${0},${i * 20})`);
        enterSelection.append('rect')
            .attr('transform', `translate(${5},${5})`)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', (d, i) => color(i));
        enterSelection.append('text')
            .attr('transform', (d, i) => `translate(${20},${15})`)
            .text(d => d);
        this._height = data.length * 20;
        this._group.select('.border').attr('height', this._height);
    }
}
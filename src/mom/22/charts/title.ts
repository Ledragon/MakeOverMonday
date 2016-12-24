import * as d3 from 'd3';

export class title {
    constructor(container: d3.Selection<any, any, any, any>, width: number, text: string) {
        container.append('g')
            .classed('title', true)
            .attr('transform', `translate(${width / 2},30)`)
            .append('text')
            .text(text);
    }
}
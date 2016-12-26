import * as d3 from 'd3';
var _text: d3.Selection<any, any, any, any>;
export function title(container: d3.Selection<any, any, any, any>, width: number, height: number) {
    _text = container.append('g')
        .classed('title', true)
        .attr('transform', `translate(${width / 2},${0})`)
        .append('text');
    return {
        text: (text: string) => {
            _text.text(text);
        }
    }
}
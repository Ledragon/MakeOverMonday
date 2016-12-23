import * as d3 from 'd3';
    var _text;
    export function title(container, width, height) {
        _text = container.append('g')
            .classed('title', true)
            .attr('transform', `translate(${width / 2},${0})`)
            .append('text');
        return {
            text: (text) => {
                _text.text(text);
            }
        }
    }
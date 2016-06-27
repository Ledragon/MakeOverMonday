var charting = charting || {};
(function () {
    'use strict';
    var _text;
    charting.title = (container, width, height) => {
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
} ());
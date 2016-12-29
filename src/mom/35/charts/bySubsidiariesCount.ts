import { select, Selection } from 'd3-selection';
import { scaleBand, ScaleBand, scaleLinear, ScaleLinear } from 'd3-scale';
import { axisLeft, Axis } from 'd3-axis';
import { max } from 'd3-array';

import { LeftCategoricalAxis } from '../../../charting/LeftCategoricalAxis'

import { mappedFormat } from '../models/mapped';
import { blueScale } from './colorScale';


export function bySubsidiariesCount(container: Selection<any, any, any, any>, width: number, height: number) {
    var _chartMargin = 10;


    var _container: Selection<any, any, any, any>;
    var _margins = {
        top: 30,
        right: 10,
        bottom: 10,
        left: 160
    };

    var _xScale: ScaleLinear<number, number>;
    var _seriesGroup: Selection<any, any, any, any>;
    var _legendGroup: Selection<any, any, any, any>;
    var _valueFn: (d: mappedFormat) => number;
    var _titleGroup: Selection<any, any, any, any>;


    var gradient = container.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
    gradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', blueScale()(0))
    gradient.append('stop')
        .attr('offset', '100%')
        .style('stop-color', blueScale()(1))
    var chartGroup = container.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${_chartMargin},${_chartMargin})`);
    var plotWidth = width - 2 * _chartMargin;
    var plotHeight = height - 2 * _chartMargin;
    _container = chartGroup.append('g')
        .classed('plot', true)
        .attr('transform', `translate(${_margins.left},${_margins.top})`);
    let h = plotHeight - _margins.top - _margins.bottom;
    let w = plotWidth - _margins.left - _margins.right;
    _xScale = scaleLinear()
        .range([0, w]);

    let yAxis = new LeftCategoricalAxis(_container, w, h)
        .padding(0.5);

    _seriesGroup = _container.append('g')
        .classed('series-group', true);

    _titleGroup = chartGroup.append('g')
        .classed('title', true)
        .style('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2},${15})`)
        .append('text');
    var legendHeight = 15;
    var legendWidth = 150;
    let textWidth = 15;
    var legendGroup = chartGroup.append('g')
        .classed('legend', true)
        .attr('transform', `translate(${plotWidth - legendWidth - textWidth},${height - legendHeight - _margins.top})`);
    legendGroup.append('text')
        .classed('min', true)
        .text('0');
    legendGroup.append('rect')
        .attr('transform', `translate(${textWidth},${0})`)
        .attr('width', legendWidth - 2 * textWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#gradient)');

    legendGroup.append('text')
        .attr('transform', `translate(${legendWidth - textWidth},${0})`)
        .classed('max', true)
        .text('1');
    _legendGroup = legendGroup;



    function title(value: string) {
        _titleGroup.text(value);
        return this;
    }

    function value(value: (d: mappedFormat) => number) {
        _valueFn = value;
        return this;
    }


    function update(data: Array<mappedFormat>) {
        var sorted = data.sort((a, b) => _valueFn(b) - _valueFn(a)).slice(0, 30);
        var domain = sorted.map(d => d.company);
        yAxis.domain(domain);

        var xDomain = [0, max(sorted, _valueFn)];
        _xScale.domain(xDomain);

        var dataBound = _seriesGroup.selectAll('.series')
            .data(sorted);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', d => `translate(${0},${yAxis.scale(d.company)})`);
        var cs = scaleLinear()
            .domain(xDomain)
            .range([0, 1]);
        enterSelection
            .append('rect')
            .attr('width', (d: mappedFormat) => _xScale(_valueFn(d)))
            .attr('height', yAxis.bandWidth())
            .style('fill', d => blueScale()(cs(_valueFn(d))));
        _legendGroup.select('.max')
            .text(xDomain[1]);
    }



    return {
        update: update,
        valueFn: value,
        title: title
    };
}
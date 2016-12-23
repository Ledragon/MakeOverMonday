import { Selection, select, selectAll } from 'd3-selection';
import { scaleBand, scaleLinear, ScaleBand, ScaleLinear } from 'd3-scale';
import { Nest, nest } from 'd3-collection';
import { Axis, axisLeft } from 'd3-axis';
import { extent } from 'd3-array';
import { dataFormat } from '../dataFormat';
import { colorScale } from './colorScale';

export class countByRace {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    private _plotMargins = {
        top: 50,
        bottom: 20,
        left: 100,
        right: 20
    };
    private _xScale: ScaleLinear<any, any>;

    private _yScale: ScaleBand<string>;
    private _yAxis: Axis<any>;
    private _yAxisGroup: Selection<any, any, any, any>;
    // private _yAxis: yAxis;

    private _seriesGroup: Selection<any, any, any, any>;
    private _plotHeight: number;

    private _colorScale: colorScale;

    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
        const chartGroup = container.append('g')
            .classed('chart-group', true);

        var chartWidth = this._width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = this._height - this._chartMargins.top - this._chartMargins.bottom;

        // chartGroup.append('text')
        //     .classed('title', true)
        //     .attr('transform', `translate(${chartWidth / 2},${15})`)
        //     .text('Number of lawnmakers taking about topics');

        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;
        this._xScale = scaleLinear<number>()
            .range([0, plotWidth]);
        this._yScale = scaleBand<string>()
            .range([plotHeight, 0])
            .paddingInner(0.1);
        this._yAxis = axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.append('g')
            .classed('y-axis', true);
        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);


        this._plotHeight = plotHeight;

        this._colorScale = new colorScale();
    }

    update(data: Array<dataFormat>) {
        var byRace = nest<dataFormat>()
            .key(d => d.race)
            .entries(data)
            .sort((a, b) => a.values.length - b.values.length);

        this._yScale.domain(byRace.map(d => d.key));
        this._yAxisGroup.call(this._yAxis);
        var domain = extent(byRace, d => d.values.length)
        this._xScale.domain(domain);
        this._colorScale.domain(domain);
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(byRace);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', d => `translate(${0},${this._yScale(d.key)})`);
        var bandWidth = this._yScale.bandwidth();
        enterSelection.append('rect')
            .attr('y', 0)
            .attr('width', d => this._xScale(d.values.length))
            .attr('height', bandWidth)
            .style('fill', d => this._colorScale.color(d.values.length));
        enterSelection.append('text')
            .attr('x', d => this._xScale(d.values.length) + 5)
            .attr('y', 11)
            .text(d => d.values.length)
            .style('font-size', '10px')
    }
}
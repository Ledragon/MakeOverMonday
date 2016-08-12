import { select, Selection } from 'd3-selection';
import { axisLeft, axisBottom, Axis } from 'd3-axis';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { extent, max, sum } from 'd3-array';
import { nest } from 'd3-collection';
import { line } from 'd3-shape';
import { schemePaired, schemeAccent, interpolateBlues } from 'd3-scale-chromatic';

export class countryRank {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }
    private _plotMargins = {
        top: 10,
        bottom: 10,
        left: 50,
        right: 10
    }

    private _xScale: ScaleLinear<number, number>;
    private _xAxis: Axis<any>;
    private _xAxisGroup: Selection<any, any, any, any>;

    private _yScale: ScaleLinear<number, number>;
    private _yAxis: Axis<any>;
    private _yAxisGroup: Selection<any, any, any, any>;

    private _seriesGroup: Selection<any, any, any, any>;
    constructor(container: Selection<any, any, any, any>, width: number, height: number) {

        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = height - this._chartMargins.top - this._chartMargins.bottom;

        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;

        this._xScale = scaleLinear()
            .range([0, plotWidth]);
        this._xAxis = axisBottom(this._xScale);
        this._xAxisGroup = plotGroup.append('g')
            .classed('axis-group', true)
            .attr('transform', `translate(${0},${plotHeight})`);

        this._yScale = scaleLinear()
            .range([plotHeight, 0]);
        this._yAxis = axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.append('g')
            .classed('axis-group', true);

        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
    }


    update(data: Array<any>): void {
        this._xScale.domain(extent(data, d => d.edition));
        this._xAxisGroup.call(this._xAxis);

        this._yScale
            .domain([0, max(data, d => d.total)])
            .nice();
        this._yAxisGroup.call(this._yAxis);

        var byCountry = nest<any>()
            .key(d => d.country)
            .entries(data)
            .sort((a, b) => sum<any>(b.values, v => v.total) - sum<any>(a.values, v => v.total))
            .splice(0, 10);
        let lineGenerator = line<any>()
            .x(d => this._xScale(d.edition))
            .y(d => this._yScale(d.total));

        var dataBound = this._seriesGroup.selectAll('.series')
            .data(byCountry);
        dataBound
            .exit()
            .remove();
        dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .append('path')
            .attr('d', d => lineGenerator(d.values))
            .style('stroke', (d, i) => schemePaired[i]);
        
    }

}
import { select, selectAll, Selection } from 'd3-selection';
import { scaleLinear, scaleTime, ScaleLinear, ScaleTime } from 'd3-scale';
import { axisBottom, axisLeft, Axis } from 'd3-axis';
import { extent, max } from 'd3-array';
import { nest } from 'd3-collection';
import { format } from 'd3-format';

export class chart {
    private _selection: Selection<any, any, any, any>;
    private _xAxis: Axis<number>;
    private _xAxisGroup: Selection<any, any, any, any>;
    private _xScale: ScaleLinear<number, number>;
    private _radiusScale: ScaleLinear<number, number>;
    private _yScale: ScaleLinear<number, number>;
    constructor(selection: Selection<any, any, any, any>, width: number, height: number) {
        this._selection = selection.append('g')
            .classed('chart', true);
        let plotMargins = {
            top: 50,
            bottom: 50,
            left: 50,
            right: 10
        };
        var plotGroup = this._selection.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);
        plotGroup.append('g')
            .classed('data-container', true);
        this._xAxisGroup = plotGroup.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(${0},${0})`);
        this._xScale = scaleLinear<number, number>()
            .range([0, height - plotMargins.top - plotMargins.bottom]);
        this._xAxis = axisLeft<number>(this._xScale);
        this._radiusScale = scaleLinear()
            .range([2, 30]);
        this._yScale = scaleLinear()
            .range([30, width - plotMargins.left - plotMargins.right]);
    }

    update(data: Array<any>) {
        this._xScale.domain(extent(data, d => d.year));
        this._xAxisGroup.call(this._xAxis);
        this._radiusScale
            .domain(extent(data, d => d.recordsStolen));
        let byYear = nest().key(d => d.year).entries(data);
        this._yScale.domain([0, max(byYear, d => d.values.length)]);
        let enterSelection = this._selection.select('.data-container')
            .selectAll('.year')
            .data(byYear)
            .enter()
            .append('g')
            .classed('year', true)
            .attr('transform', d => `translate(${0},${this._xScale(+d.key)})`);
        let dataPoints = enterSelection.selectAll('.data-point')
            .data(d => d.values)
            .enter()
            .append('g')
            .classed('data-point', true)
            .attr('transform', (d, i) => `translate(${this._yScale(i)},${0})`)
            .on('mouseenter', function (d, i) {
                select(this)
                    .select('.legend')
                    .style('visibility', 'visible');
            }).on('mouseleave', function (d, i) {
                select(this)
                    .select('.legend')
                    .style('visibility', 'hidden');
            });
        dataPoints.append('circle')
            // .attr('cx', (d, i) => this._yScale(i))
            // .attr('cy', (d, i) => i * 15)
            .attr('r', d => this._radiusScale(d.recordsStolen));
        let legend = dataPoints
            .append('g')
            .classed('legend', true)
            .style('visibility', 'hidden')
        legend.append('rect')
            .attr('width', 200)
            .attr('height', 40)
            .attr('transform', `translate(${-100},${0})`)
            .style('fill', 'rgb(200,200,200)');
        legend.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 15)
            .text(d => d.company);
        legend.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 35)
            .text(d => `${format('.0s')(d.recordsStolen)} records stolen`);


    }
}
import { select, Selection } from 'd3-selection';
import { axisLeft, axisBottom, Axis } from 'd3-axis';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { extent, max, sum } from 'd3-array';
import { nest } from 'd3-collection';
import { line, area, stack } from 'd3-shape';
// import { schemePaired, schemeAccent, interpolateBlues } from 'd3-scale-chromatic';

import { color } from './colorScale';
import { legend } from './legend';
import { title } from './title';

export class countryRank {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }
    private _plotMargins = {
        top: 10,
        bottom: 25,
        left: 50,
        right: 10
    }


    private _plotHeight: number;
    private _xScale: ScaleLinear<number, number>;
    private _xAxis: Axis<any>;
    private _xAxisGroup: Selection<any, any, any, any>;

    private _yScale: ScaleLinear<number, number>;
    private _yAxis: Axis<any>;
    private _yAxisGroup: Selection<any, any, any, any>;

    private _seriesGroup: Selection<any, any, any, any>;
    private _legendGroup: Selection<any, any, any, any>;
    private _legend: legend;

    private _width: number;
    private _height: number;

    constructor(container: Selection<any, any, any, any>, width: number, height: number) {
        this._width = width;
        this._height = height;
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = this.width();
        var chartHeight = this.height();
        // chartGroup.append('rect')
        //     .attr('width', chartWidth)
        //     .attr('height', chartHeight)
        //     .style('fill', 'pink');

        this._legendGroup = chartGroup.append('g')
            .classed('legendGroup-group', true);
        this._legend = new legend(this._legendGroup);
        var titleGroup = chartGroup.append('g')
            .classed('title-group', true);
        var t = new title(titleGroup)
            .text('Best performing countries');

        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top + t.height()})`);

        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right - this._legend.width();
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom - t.height();
        titleGroup
          .attr('transform', `translate(${plotWidth/2},${20})`)
        // plotGroup.append('rect')
        //     .attr('width', plotWidth)
        //     .attr('height', plotHeight)
        //     .style('fill', 'lightblue');
        this._legendGroup.attr('transform', `translate(${chartWidth - this._legend.width()},${chartHeight / 2 - this._legend.height() / 2})`)
        this._plotHeight = plotHeight;
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

    private width(): number {

        return this._width - this._chartMargins.left - this._chartMargins.right;
    }
    private height(): number {

        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    }

    update(data: Array<any>): void {
        this._xScale.domain(extent(data, d => d.edition));
        this._xAxisGroup.call(this._xAxis);


        var byCountry = nest<any>()
            .key(d => d.country)
            .entries(data)
            .sort((a, b) => sum<any>(b.values, v => v.total) - sum<any>(a.values, v => v.total))
            .splice(0, 10);
        var byYear = nest<any>()
            .key(d => d.edition)
            .entries(data);
        let lineGenerator = line<any>()
            .x(d => this._xScale(d.edition))
            .y(d => this._yScale(d.total));

        var toto: any = [];
        byYear.forEach((c, i) => {
            var result: any = {};
            result.edition = c.key;
            c.values.forEach((v: any) => {
                result[v.country] = v.total;
            });
            toto.push(result);
        });

        var countryNames = byCountry.map(d => d.key);
        let stackGenerator = stack<any, any, string>()
            .keys(countryNames);
        let stacked = stackGenerator(toto);
        console.log(stacked)
        this._yScale
            // .domain([0, max(data, d => d.total)])
            .domain([0, 450])
            .nice();
        this._yAxisGroup.call(this._yAxis);

        // console.log(stackGenerator(filtered))

        let areaGenerator = area<any>()
            .x(d => {
                let x = this._xScale(+d.data.edition);
                return x;
            })
            .y0((d, i) => {
                let y0 = isNaN(d[0]) ? this._yScale(0) : this._yScale(d[0]);
                return y0;
            })
            .y1((d, i) => {
                let y1: number = isNaN(d[1]) ? this._yScale(d[0]) : this._yScale(d[1]);
                return y1;
            });
        // .y1(d => d[1]);
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(stacked);
        dataBound
            .exit()
            .remove();
        dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .append('path')
            .attr('d', d => {
                return areaGenerator(d);
            })
            .style('fill', (d, i) => color(i));

        this._legend.update(countryNames);
        this._legendGroup.attr('transform', `translate(${this.width() - this._legend.width()},${this.height() / 2 - this._legend.height() / 2})`)
    }

}
import * as d3 from 'd3';

import { title } from './title';
import { IHistory } from '../IHistory';

export class histogram {

    private _marginLeft = 50;
    private _marginRight = 20;
    private _marginTop = 40;
    private _marginBottom = 40;
    private _container: d3.Selection<any, any, any, any>;
    private _histogram: d3.HistogramGenerator<IHistory, any>;
    private _xScale: d3.ScaleLinear<any, any>;
    private _yScale: d3.ScaleLinear<any, any>;
    private _yAxis: d3.Axis<any>;
    private _yAxisGroup: d3.Selection<any, any, any, any>;
    private _seriesGroup: d3.Selection<any, any, any, any>;

    constructor(container: string, width: number, height: number) {
        this._container = d3.select('#' + container)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .classed('chart', true)
            .attr('transform', `translate(${this._marginLeft},${0})`);

        var plotArea = this._container.append('g')
            .classed('chart-container', true)
            .attr('transform', `translate(${0},${this._marginTop})`);

        this.initAxis(plotArea, height);
        this.initXAxis(width);
        this.initHistogram();
        this._seriesGroup = plotArea.append('g')
            .classed('series', true);
        new title(this._container, width, 'Number of famous people');
    }

    private initHistogram() {
        this._histogram = d3.histogram<IHistory, any>()
            .thresholds(50)
            .value(d => d.Birthyear);
    }

    private initAxis(container: d3.Selection<any, any, any, any>, height: number) {
        this._yScale = d3.scaleLinear()
            .range([0, height - this._marginTop - this._marginBottom]);

        this._yAxis = d3.axisLeft(this._yScale)
        // .tickFormat(d3.timeFormat('YYYY'));
        this._yAxisGroup = container.append('g')
            .classed('axis', true);
    }

    private initXAxis(width: number) {
        this._xScale = d3.scaleLinear()
            .range([0, width - this._marginLeft - this._marginRight]);
    }

    update(data: Array<IHistory>) {
        var yearsExtent = d3.extent(data, d => +d.Birthyear);
        // var delta = Math.ceil((yearsExtent[1] - yearsExtent[0]) / 100);
        this._histogram
        // .bins(delta)
        // .thresholds(yearsExtent);
        var split = this._histogram(data);
        console.log(split)
        this._xScale.domain([0, d3.max(split, d => d.length)]);
        this._yScale.domain(yearsExtent);
        this._yAxisGroup.call(this._yAxis);
        var dataBound = this._seriesGroup.selectAll('.bin')
            .data(split);
        dataBound.exit()
            .remove();
        dataBound.enter()
            .append('g')
            .classed('bin', true)
            .attr('transform', (d: any) => `translate(${0},${this._yScale(d3.min(d, (dd: any) => +dd.Birthyear))})`)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 5)
            .style('fill', '#A6CFD5')
            .transition()
            .attr('width', (d: any) => {
                return this._xScale(d.length)
            });
        dataBound
            .attr('transform', (d: any) => `translate(${0},${this._yScale(d.x0)})`)
            .select('rect')
            .transition()
            .attr('width', (d: any) => {
                return this._xScale(d.length)
            }
            );
    }
}
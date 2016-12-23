import { select, Selection } from 'd3-selection';
import { axisLeft, axisBottom, Axis } from 'd3-axis';
import { scaleLinear, ScaleLinear, scaleBand, ScaleBand } from 'd3-scale';

import { dataFormat } from './dataFormat';

export class pane {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }
    private _plotMargins = {
        top: 10,
        bottom: 10,
        left: 120,
        right: 10
    }

    private _yScale: ScaleBand<string>;
    private _yAxis: Axis<any>;
    private _yAxisGroup: Selection<any, any, any, any>;

    private _seriesGroup: Selection<any, any, any, any>;

    private _width: number;
    private _height: number;
    private _plotWidth:number;
    private _plotHeight: number;

    constructor(container: Selection<any, any, any, any>, width: number, height: number) {
        this._width = width;
        this._height = height;
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = this.width();
        var chartHeight = this.height();


        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        this._plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;// - this._legend.width();
        this._plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;// - t.height();

        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
        
        this._yScale = scaleBand()
            .range([this._plotHeight, 0]);
        this._yAxis = axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.append('g')
            .classed('y-axis', true);
    }

    private width(): number {

        return this._width - this._chartMargins.left - this._chartMargins.right;
    }
    private height(): number {

        return this._height - this._chartMargins.top - this._chartMargins.bottom;
    }

    update(data: Array<dataFormat>) {
        let height = this._plotHeight / data.length;
        this._yScale.domain(data.map(d => d.product));
        this._yAxisGroup.call(this._yAxis);
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(data);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', (d, i) => `translate(${0},${this._yScale(d.product)})`);

    }
}
import { Selection, selectAll } from 'd3-selection';
import { nest } from 'd3-collection';
import { xAxis } from './xAxis';
import { yAxis } from './yAxis';
import { colorScale } from './colorScale';
import { IDataFormat } from '../../../models/IDataFormat';

export class evolution {
    private _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    private _plotMargins = {
        top: 50,
        bottom: 20,
        left: 50,
        right: 20
    };

    private _xAxis: xAxis;
    private _yAxis: yAxis;

    private _seriesGroup: Selection<any, any, any, any>;
    private _plotHeight: number;
    constructor(container: Selection<any, any, any, any>, private _width: number, private _height: number) {
        var chartGroup = container.append('g')
            .classed('chart-group', true)
            .attr('transform', `translate(${this._chartMargins.left},${this._chartMargins.top})`);

        var chartWidth = this._width - this._chartMargins.left - this._chartMargins.right;
        var chartHeight = this._height - this._chartMargins.top - this._chartMargins.bottom;

        var plotGroup = chartGroup.append('g')
            .classed('plot-group', true)
            .attr('transform', `translate(${this._plotMargins.left},${this._plotMargins.top})`);

        var plotWidth = chartWidth - this._plotMargins.left - this._plotMargins.right;
        var plotHeight = chartHeight - this._plotMargins.top - this._plotMargins.bottom;
        this._plotHeight = plotHeight;
        this.initxAxis(plotGroup, plotWidth, plotHeight);
        this.inityAxis(plotGroup, plotWidth, plotHeight);

        this._seriesGroup = plotGroup.append('g')
            .classed('series-group', true);
    }

    private initxAxis(container: Selection<any, any, any, any>, width: number, height: number) {
        this._xAxis = new xAxis(container, width, height);
    }

    private inityAxis(container: Selection<any, any, any, any>, width: number, height: number) {
        this._yAxis = new yAxis(container, width, height);
    }

    update(data: IDataFormat<any>) {
        var byYear = nest<any>()
            .key(d => d.date.getFullYear().toString())
            .entries(data);
        this._xAxis.update(data);
        this._yAxis.update(data);

        var color = new colorScale().color(0.5);
        var dataBound = this._seriesGroup.selectAll('.series')
            .data(byYear);
        dataBound
            .exit()
            .remove();
        var enterSelelection = dataBound
            .enter()
            .append('g')
            .classed('series', true);
        enterSelelection.append('circle')
            .attr('r', 3)
            .attr('cx', d => this._xAxis.scale()(new Date(+d.key, 0, 0)))
            .attr('cy', d => this._yAxis.scale()(d.values.length))
            .style('fill', color);
    }
}
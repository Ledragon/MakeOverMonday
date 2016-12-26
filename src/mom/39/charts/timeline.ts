import { select, Selection } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { extent, max } from 'd3-array';
import { line } from 'd3-shape';

import { group } from './pieces/group';
import { horizontalLinearAxis } from './pieces/xAxis';

export class timeChart {
    private _xAxis: horizontalLinearAxis;
    private _years: Array<number>;
    private _plotGroup: group;
    private _yScale: ScaleLinear<number, number>;
    private _yAxis: any;
    private _yAxisGroup: any;

    constructor(container: Selection<any, any, any, any>, width: number, height: number) {
        let timeChart = container.append('g')
            .classed('time-chart', true);

        let chartGroup = new group(timeChart, width, height, { top: 0, bottom: 0, left: 0, right: 0 }, 'chart-group');
        let plotGroup = new group(chartGroup.group(), chartGroup.width(), chartGroup.height(),
            { top: 20, bottom: 30, left: 100, right: 30 }, 'plot-group')

        this._xAxis = new horizontalLinearAxis(plotGroup.group(), plotGroup.width(), plotGroup.height());

        this._yScale = scaleLinear()
            .domain([0, 1])
            .range([plotGroup.height(), 0])
        this._yAxis = axisLeft(this._yScale);
        this._yAxisGroup = plotGroup.group().append('g')
            .classed('axis', true)
            .call(this._yAxis);
        this._plotGroup = plotGroup;
        this._plotGroup
            .append('g')
            .classed('series-group', true);
        //TODO legend
    }

    updateYears(value: Array<number>): void {
        this._xAxis.update(extent(value));
        this._years = value;
    }

    update(data: Array<any>) {
        var merged: Array<any> = [].concat.apply([], data.map(d => d.values));
        var maxY = max(merged, d => d.value);
        this._yScale.domain([0, maxY]).nice();
        this._yAxisGroup.call(this._yAxis)
        let generator = line<any>()
            .x((d, i) => this._xAxis.scale(d.year))
            .y((d, i) => this._yScale(d.value))

        var dataBound = this._plotGroup.group()
            .select('.series-group')
            .selectAll('.series')
            .data(data);
        dataBound.exit()
            .remove();
        var paths = dataBound.enter()
            .append('g')
            .attr('data-name', d => d.name)
            .classed('series', true)
            .append('path')
            .attr('d', d => {
                return generator(d.values);
            })
            .style('stroke', d => d.color);
        dataBound
            .attr('data-name', d => d.name)
            .select('path')
            .attr('d', d => {
                return generator(d.values);
            })
            .style('stroke', d => d.color);
    }
}
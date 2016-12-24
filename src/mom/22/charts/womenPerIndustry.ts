import * as d3 from 'd3';

import { title } from './title';
import { IHistory } from '../IHistory';

export class womenPerIndustry {
    private _marginTop = 50;
    private _marginBotom = 10;
    private _marginLeft = 150;
    private _marginRight = 20;
    private _chartHeight: number;
    private _chartWidth: number;
    private _container: d3.Selection<any, any, any, any>;
    private _plotArea: d3.Selection<any, any, any, any>;
    private _barsGroup: d3.Selection<any, any, any, any>;
    private _ordinalAxisGroup: d3.Selection<any, any, any, any>;
    private _ordinalAxis: d3.Axis<any>;
    private _ordinalScale: d3.ScaleBand<any>;

    private _yScale: d3.ScaleLinear<any, any>;

    constructor(containerId: string, width: number, height: number) {
        this._container = d3.select(`#${containerId}`)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .classed('chart', true);

        this._plotArea = this._container.append('g')
            .classed('bar', true)
            .attr('transform', `translate(${this._marginLeft}, ${this._marginTop})`)
        new title(this._container, width, 'Famous people per industry');
        this._chartHeight = height - this._marginBotom - this._marginTop;
        this._chartWidth = width - this._marginLeft - this._marginRight;
        this.initOrdinalScale(this._plotArea);
        this.initYScale(this._plotArea);
        this._barsGroup = this._plotArea.append('g')
            .classed('bars', true);
    }

    private initOrdinalScale(container: d3.Selection<any, any, any, any>) {
        this._ordinalScale = d3.scaleBand()
            .range([0, this._chartHeight]);
        this._ordinalAxis = d3.axisLeft(this._ordinalScale);
        this._ordinalAxisGroup = container.append('g')
            .classed('axis', true);
    }

    private initYScale(container: d3.Selection<any, any, any, any>) {
        this._yScale = d3.scaleLinear()
            .range([0, this._chartWidth]);
    }

    update(data: Array<IHistory>) {
        var nested = d3.nest()
            .key((d: IHistory) => d.Industry)
            .entries(data);

        this._yScale.domain(d3.extent(nested, d => d.values.length).reverse())
        this._ordinalScale.domain(nested.map(d => d.key));
        this._ordinalAxisGroup.call(this._ordinalAxis);
        this.updateBars(nested);
    }

    private updateBars(nested: Array<{ key: string, values: Array<any> }>) {
        var rectHeight = this._ordinalScale.bandwidth() / 2;

        var dataBound = this._barsGroup
            .selectAll('g.data')
            .data(nested);
        dataBound.exit()
            .remove();
        var enterSelection = dataBound.enter()
            .append('g')
            .classed('data', true)
            .attr('transform', d => `translate(${0},${this._ordinalScale(d.key) + rectHeight / 2})`);
        enterSelection.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .style('fill', '#26408B')
            .transition()
            .attr('width', d => this._yScale(d.values.length))
            .attr('height', rectHeight);
        dataBound
            .attr('transform', d => `translate(${0},${this._ordinalScale(d.key) + rectHeight / 2})`)
            .select('rect')
            .transition()
            .attr('width', d => this._yScale(d.values.length))
            .attr('height', rectHeight);
    }

}
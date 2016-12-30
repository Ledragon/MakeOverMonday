import * as d3 from 'd3';

import { title } from '../../../charting/title';

import { IHistory } from '../IHistory';

export class viewPerYearOfBirth {
    private _marginTop = 50;
    private _marginBottom = 40;
    private _marginLeft = 50;
    private _marginRight = 30;
    private _container: d3.Selection<any, any, any, any>;

    private _scale: d3.ScaleLinear<any, any>;
    private _axis: d3.Axis<any>;
    private _axisGroup: d3.Selection<any, any, any, any>;

    private _yScale: d3.ScaleLinear<any, any>;
    private _yAxis: d3.Axis<any>;
    private _yAxisGroup: d3.Selection<any, any, any, any>;

    private _pathGenerator: d3.Line<any>;
    private _pathGroup: d3.Selection<any, any, any, any>;

    private _preparedData: any;

    constructor(containerId: string, private _width: number, private _height: number) {
        this._container = d3.select(`#${containerId}`)
            .attr('width', this._width)
            .attr('height', _height)
            .append('g')
            .classed('chart', true);


        var container = this._container.append('g')
            .classed('chart-container', true)
            .attr('transform', `translate(${this._marginLeft},${this._marginTop})`);
        this.initXAxis(container);
        this.initYAxis(container);
        this.initPathGenerator(container);
        new title(this._container, this._width, this._height)
            .text('Total number of views according to birth year');
    }

    private initXAxis(container: d3.Selection<any, any, any, any>) {
        this._scale = d3.scaleLinear()
            .range([0, this._width - this._marginLeft - this._marginRight]);
        this._axis = d3.axisBottom(this._scale);
        this._axisGroup = container.append('g')
            .classed('axis', true)
            .attr('transform', `translate(${0},${this._height - this._marginBottom - this._marginTop})`)
    }

    private initYAxis(container: d3.Selection<any, any, any, any>) {
        this._yScale = d3.scaleLinear()
            .range([this._height - this._marginBottom - this._marginTop, 0]);
        this._yAxis = d3.axisLeft(this._yScale)
            .tickFormat(d3.format('s'));
        this._yAxisGroup = container.append('g')
            .classed('axis', true);
    }

    private initPathGenerator(container: d3.Selection<any, any, any, any>) {
        this._pathGenerator = d3.line<any>()
            .x(d => this._scale(d.Birthyear))
            .y(d => this._yScale(+(d['Total Page Views'].replace(/,/g, ''))))
        this._pathGroup = container.append('g')
            .append('path')
            .style('fill', 'transparent')
            .style('stroke', '#C2E7D9')
            .style('stroke-width', '1px')
    }

    update(data: Array<any>): void {
        var years = data.map(d => +d.Birthyear)
            .sort((a, b) => a - b);
        var mapped = data.map(d => +(d['Total Page Views'].replace(/,/g, '')));
        this._scale.domain(d3.extent(years));
        this._axisGroup.call(this._axis);

        this._yScale.domain(d3.extent(mapped));
        this._yAxisGroup.call(this._yAxis);

        var prepared = data.filter(d => !!d.Birthyear)
            .sort((a, b) => a.Birthyear - b.Birthyear);
        this._pathGroup
            .attr('d', this._pathGenerator(prepared));
        this._preparedData = prepared;
    }

}

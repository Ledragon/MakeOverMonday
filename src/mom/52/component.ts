import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { IDataFormat } from '../../models/IDataFormat';

import { BottomCategoricalAxis } from '../../charting/BottomCategoricalAxis'
import { LeftLinearAxis } from '../../charting/LeftLinearAxis'

export var mom52 = {
    name: 'mom52',
    component: {
        templateUrl: 'mom/52/template.html',
        controller: ['csvService', (csvService: ICsvService) => new controller(csvService)]
    }
}

class controller {
    private _width = 1080;
    private _height = 480;
    private _plotMargins = {
        top: 30,
        bottom: 30,
        left: 50,
        right: 180
    };
    private _plotGroup: d3.Selection<SVGGElement, any, any, any>;
    private _plotWidth: number;
    private _plotHeight: number;
    private _xAxis: BottomCategoricalAxis<any>;
    private _yAxis: LeftLinearAxis<any>;

    private _seriesContainer: d3.Selection<any, any, any, any>;
    private _overlayContainer: d3.Selection<any, any, any, any>;
    private _legend: d3.Selection<any, any, any, any>;
    private _lineGenerator: d3.Line<any>;

    static $inject = ['csvService'];
    constructor(private _csvService: ICsvService) {
        let p = plot.plot('#chart', this._width, this._height, this._plotMargins);
        this._plotGroup = p.group();
        this._plotHeight = p.height();
        this._plotWidth = p.width();
    }


    parseFunction = (d: any) => {
        let res = [];
        for (var key in d) {
            if (key !== 'Product Family') {
                res.push({
                    year: parseInt(key),
                    value: parseFloat(d[key])
                });
            }
        }
        return {
            productFamily: d['Product Family'],
            values: res
        }
    }

    $onInit() {
        this._xAxis = new BottomCategoricalAxis(this._plotGroup, this._plotWidth, this._plotHeight);
        this._yAxis = new LeftLinearAxis(this._plotGroup, this._plotWidth, this._plotHeight);
        this._lineGenerator = d3.line<any>()
            .x((d: any) => this._xAxis.scale(d.year.toString()) + this._xAxis.bandWidth() / 2)
            .y((d: any) => this._yAxis.scale(d.value));

        this._seriesContainer = this._plotGroup.append('g')
            .classed('series-list', true);
        this._overlayContainer = this._seriesContainer.append('g')
            .classed('overlay', true);
        this._overlayContainer.append('path')
            .style('fill', 'none')
            .style('stroke', 'blue');

        let legendWidth = 150;
        let legendHeight = 20 * 15;

        this._legend = d3.select('svg')
            .append('g')
            .classed('legend', true)
            .attr('transform', `translate(${this._plotWidth + this._plotMargins.left},${this._height / 2 - legendHeight / 2})`);
        this._legend.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'none')
            .style('stroke', 'darkgrey');


        const fileName = 'mom/52/data/data.csv';
        this._csvService.read<any>(fileName, this.update.bind(this), this.parseFunction);

    }
    private update(data: IDataFormat<any>) {
        this._xAxis.domain(d3.range(2006, 2017, 1).map(d => d.toString()));
        this._yAxis.domain([0, d3.max(data[data.length - 1].values, (d: any) => d.value)]);

        let bandWidth = this._xAxis.bandWidth();

        let seriesGroup = this._seriesContainer
            .selectAll('.series')
            .data(data.filter(d => d.productFamily === 'Totals'))
            .enter()
            .append('g')
            .classed('series', true);
        seriesGroup.selectAll('circle')
            .data(d => d.values)
            .enter().append('circle')
            .attr('r', 5)
            .attr('cx', (d: any) => this._xAxis.scale(d.year.toString()) + bandWidth / 2)
            .attr('cy', (d: any) => this._yAxis.scale(d.value))
            .style('fill', 'green');
        var self = this;
        let items = this._legend.selectAll('.legend-item')
            .data(data.filter(d => d.productFamily !== 'Totals'))
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', (d, i) => `translate(${5},${i * 15})`)
            .on('click', function (d: any, i) {
                d3.selectAll('.highlight').classed('highlight', false);
                d3.select(this).classed('highlight', true);
                self._overlayContainer
                    .select('path')
                    .attr('d', self._lineGenerator(d.values));
            });
        items.append('text')
            .attr('y', 10)
            .text(d => d.productFamily);
    };

}
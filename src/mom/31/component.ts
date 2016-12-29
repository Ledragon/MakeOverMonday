import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { BottomCategoricalAxis } from '../../charting/BottomCategoricalAxis';
import { LeftCategoricalAxis } from '../../charting/LeftCategoricalAxis';
import { ICsvService } from '../../services/csvService';

export var mom31 = {
    name: 'mom31',
    component: {
        templateUrl: 'mom/31/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const _width = 960;
    const _height = 480;
    const _chartMargins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    const _plotMargins = {
        top: 20,
        bottom: 20,
        left: 150,
        right: 20
    };
    var svg = d3.select('#chart')
        .append('svg')
        .attr('width', _width)
        .attr('height', _height);

    var chartGroup = svg.append('g')
        .classed('chart-group', true)
        .attr('transform', `translate(${_chartMargins.left},${_chartMargins.top})`);

    var chartWidth = _width - _chartMargins.left - _chartMargins.right;
    var chartHeight = _height - _chartMargins.top - _chartMargins.bottom;

    var plotGroup: d3.Selection<SVGGElement, any, any, any> = <d3.Selection<SVGGElement, any, any, any>>chartGroup.append('g')
        .classed('plot-group', true)
        .attr('transform', `translate(${_plotMargins.left},${_plotMargins.top})`);

    var plotWidth = chartWidth - _plotMargins.left - _plotMargins.right;
    var plotHeight = chartHeight - _plotMargins.top - _plotMargins.bottom;

    let xAxis = new BottomCategoricalAxis(plotGroup, plotWidth, plotHeight);

    let yAxis = new LeftCategoricalAxis(plotGroup, plotWidth, plotHeight);

    let seriesScale = d3.scaleLinear<number>()
        .range([0, 15]);
    let seriesGroup = plotGroup.append('g');


    const fileName = 'mom/31/data/Not Saying Groin.csv';
    csvService.read<any>(fileName, update);

    function update(data: IDataFormat<any>) {
        var labels = data.columns.filter(d => d !== 'Phrase' && d !== 'Total');

        var phrases = data.map(d => d['Phrase']);
        let byPhrase = d3.nest<any>()
            .key(d => d['Phrase'])
            .entries(data)
            .map(d => {
                let tmp = d.values;
                let result = [];
                for (var key in tmp[0]) {
                    result.push({
                        key: key,
                        value: +tmp[0][key]
                    })
                }
                return {
                    key: d.key,
                    values: result.filter(d => labels.indexOf(d.key) >= 0)
                }
            });
        var values = [].concat.apply([], byPhrase.map(d => d.values)).map((d: any) => d.value);
        seriesScale.domain(d3.extent(values));
        xAxis.domain(labels);
        yAxis.domain(phrases);
        const yBandWidth = yAxis.bandWidth();
        var dataBound = seriesGroup.selectAll('.seriesGroup')
            .data(byPhrase);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('seriesGroup', true)
            .attr('transform', (d, i) => {
                return `translate(${0},${yAxis.scale(d.key) + yBandWidth / 2})`
            });
        enterSelection.append('line')
            .classed('gridline', true)
            .attr('x1', 0)
            .attr('x2', plotWidth);
        enterSelection
            .selectAll('g')
            .data(d => d.values)
            .enter()
            .append('circle')
            .style('fill', '#824670')
            .attr('cx', d => xAxis.scale(d.key) + xAxis.bandWidth() / 2)
            // .attr('cy', yScale.bandwidth() / 2)
            .attr('r', d => seriesScale(d.value))
    };
}

interface IDataFormat<T> extends Array<T> {
    columns: Array<string>;
}
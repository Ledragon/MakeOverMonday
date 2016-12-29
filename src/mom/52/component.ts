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
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 1080;
    const height = 480;
    let plotMargins = {
        top: 30,
        bottom: 30,
        left: 50,
        right: 180
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();

    let parseFunction = (d: any) => {
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

    const fileName = 'mom/52/data/data.csv';
    csvService.read<any>(fileName, update, parseFunction);
    var xAxis = new BottomCategoricalAxis(plotGroup, plotWidth, plotHeight);
    let yAxis = new LeftLinearAxis(plotGroup, plotWidth, plotHeight);
    let lineGenerator = d3.line<any>()
        .x((d: any) => xAxis.scale(d.year.toString()) + xAxis.bandWidth() / 2)
        .y((d: any) => yAxis.scale(d.value));

    let seriesContainer = plotGroup.append('g')
        .classed('series-list', true);
    let overlayContainer = seriesContainer.append('g')
        .classed('overlay', true);
    overlayContainer.append('path')
        .style('fill', 'none')
        .style('stroke', 'blue');

    let legendWidth = 150;
    let legendHeight = 20 * 15;

    let legend = d3.select('svg')
        .append('g')
        .classed('legend', true)
        .attr('transform', `translate(${plotWidth + plotMargins.left},${height / 2 - legendHeight / 2})`);
    legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'none')
        .style('stroke', 'darkgrey');

    function update(data: IDataFormat<any>) {
        // console.log(data)
        // let columns = data.columns.splice(1, data.columns.length - 1)
        // let layout = d3.stack<any>()
        //     .keys(d3.range(2006, 2017, 1).map(d => d.toString()));
        // let series = layout(data);
        // console.log(series)
        xAxis.domain(d3.range(2006, 2017, 1).map(d => d.toString()));
        yAxis.domain([0, d3.max(data[data.length - 1].values, (d: any) => d.value)]);

        let bandWidth = xAxis.bandWidth();

        let seriesGroup = seriesContainer
            .selectAll('.series')
            .data(data.filter(d => d.productFamily === 'Totals'))
            .enter()
            .append('g')
            .classed('series', true);
        seriesGroup.selectAll('circle')
            .data(d => d.values)
            .enter().append('circle')
            .attr('r', 5)
            .attr('cx', (d: any) => xAxis.scale(d.year.toString()) + bandWidth / 2)
            .attr('cy', (d: any) => yAxis.scale(d.value))
            .style('fill', 'green');

        let items = legend.selectAll('.legend-item')
            .data(data.filter(d => d.productFamily !== 'Totals'))
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', (d, i) => `translate(${5},${i * 15})`)
            .on('click', function (d: any, i) {
                d3.selectAll('.highlight').classed('highlight', false);
                d3.select(this).classed('highlight', true);
                overlayContainer.select('path')
                    .attr('d', lineGenerator(d.values));
            });
        items.append('text')
            .attr('y', 10)
            .text(d => d.productFamily);
    };

}
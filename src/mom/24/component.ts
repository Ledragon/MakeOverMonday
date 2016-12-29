import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { LeftLinearAxis } from '../../charting/LeftLinearAxis';
import { BottomCategoricalAxis } from '../../charting/BottomCategoricalAxis';
import { ICsvService } from '../../services/csvService';

export var mom24 = {
    name: 'mom24',
    component: {
        templateUrl: 'mom/24/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 480;
    let plotMargins = {
        top: 50,
        bottom: 30,
        left: 80,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();
    let xAxis = new BottomCategoricalAxis(plotGroup, plotWidth, plotHeight)
        .padding(0.5);
    let yAxis = new LeftLinearAxis(plotGroup, plotWidth, plotHeight)
        .format('2.0%')
        .domain([0, 0.5]);

    let seriesGroup = plotGroup.append('g')
        .classed('series-group', true);
    const fileName = 'mom/24/data/Female Corporate Talent Pipeline.csv';
    csvService.read<any>(fileName, update, parseFunction);

    let legend = d3.select('svg')
        .append('g')
        .classed('legend', true)
        .attr('transform', `translate(${plotWidth},${plotMargins.top})`);
    legend.append('rect')
        .style('fill', 'none')
        .style('stroke', 'lightgray')
        .attr('width', 65)
        .attr('height', 40);
    function update(data: Array<any>) {
        const colors = ['#99d8c9', '#2ca25f'];

        xAxis.domain(data.map(d => d.level));
        let domain = ['2012', '2015'];
        let subScale = d3.scaleBand()
            .domain(domain)
            .range([0, xAxis.bandWidth()]);
        var dataBound = seriesGroup.selectAll('.series')
            .data(data);
        dataBound
            .exit()
            .remove();
        let enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', (d) => `translate(${xAxis.scale(d.level)},${0})`);
        enterSelection.append('rect')
            .attr('class', d => 'y' + d.year)
            .attr('x', d => subScale(d.year))
            .attr('y', d => yAxis.scale(d.female))
            .attr('width', xAxis.bandWidth() / 2)
            .attr('height', d => yAxis.scale(0) - yAxis.scale(d.female));

        var items = legend.selectAll('.legend-item')
            .data(domain);
        items
            .exit()
            .remove();
        let enterItems = items
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', (d, i) => `translate(${5},${i * 20+5})`);
        enterItems.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', (d, i) => colors[i])
        enterItems.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .text(d => d);
    };

    function parseFunction(d: any): any {
        return {
            year: d.Year,
            level: d.Level,
            female: parseFloat(d.Female.replace('%', '')) / 100
        };
    }
}
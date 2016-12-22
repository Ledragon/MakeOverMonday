import * as d3 from 'd3';
import { interpolateGreens } from 'd3-scale-chromatic';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom45 = {
    name: 'mom45',
    component: {
        templateUrl: 'mom/45/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    let width = 600;
    let height = 800;
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

    const fileName = 'mom/45/data/Restaurant_Inspection_Scores.csv';
    csvService.read(fileName, update, parseFunction);

    function update(data: Array<any>) {
        let byYear = d3.nest<Idata>()
            .key(d => d.date.getFullYear().toString())
            .entries(data)
            .sort((a, b) => parseInt(a.key) - parseInt(b.key));

        let current = byYear[1];
        d3.select('svg')
            .selectAll('.plot')
            .data(byYear)
            .enter()
            .each(function (d, i) {
                let group = d3.select(this)
                    .append('g')
                    .attr('transform', `translate(${0},${i * height / 4})`)
                drawPlot(group, width, height / 4, d);
            })

    };
}
let parser = d3.timeParse('%d-%m-%y');


function drawPlot(container: any, width: number, height: number, current: any) {


    let histGenerator = d3.histogram<Idata, any>()
        .value((d: Idata) => d.score)
        .thresholds(d3.range(0, 100, 1));

    let parser = d3.timeParse('%d-%m-%y');
    let colorScale = d3.scaleLinear()
        .range([0, 1]);

    container.append('g')
        .classed('title', true)
        .attr('transform', `translate(${width / 2},${30})`)
        .append('text')
        .text(current.key);
    let plotMargins = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    };
    let plotGroup = container.append('g')
        .classed('plot', true)
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

    let plotWidth = width - plotMargins.left - plotMargins.right;
    let plotHeight = height - plotMargins.top - plotMargins.bottom;
    var binned = histGenerator(current.values);

    let xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, plotWidth])
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = plotGroup.append('g')
        .classed('axis', true)
        .call(xAxis)
        .attr('transform', `translate(${0},${plotHeight})`);
    let yScale = d3.scaleLinear()
        .domain(d3.extent(binned, b => b.length))
        .range([plotHeight, 0]);

    let seriesGroup = plotGroup.append('g')
        .classed('series-group', true);
    colorScale.domain(yScale.domain());
    var dataBound = seriesGroup.selectAll('.seriesGroup')
        .data(binned);
    dataBound
        .exit()
        .remove();
    let enterSelection = dataBound
        .enter()
        .append('g')
        .classed('seriesGroup', true)
        .attr('transform', (d: any) => `translate(${xScale(d.x0)},${0})`);
    var rect = enterSelection.append('rect')
        .attr('x', 0)
        .attr('y', d => yScale(d.length))
        .attr('width', 5)
        .attr('height', d => plotHeight - yScale(d.length))
        .style('fill', d => interpolateGreens(colorScale(d.length)));

}

function parseFunction(d: any) {
    return {
        restaurant: d['Restaurant Name'],
        date: parser(d['Inspection Date']),
        score: parseFloat(d['Score'])
    }
}

interface Idata {
    restaurant: string;
    date: Date;
    score: number;
}
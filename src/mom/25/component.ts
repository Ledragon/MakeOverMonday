import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { interpolateGreens } from 'd3-scale-chromatic';

export var mom25 = {
    name: 'mom25',
    component: {
        templateUrl: 'mom/25/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    let radius = 250;
    const width = 800;
    let plotMargins = {
        top: radius + 20,
        bottom: 20,
        left: radius + 20,
        right: 20
    };
    const height = width - plotMargins.right;

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();
    let legendWidth = 200;
    let legendHeight = 380;
    let legend = d3.select('svg')
        .append('g')
        .classed('legend', true)
        .attr('transform', `translate(${plotMargins.left + radius + plotMargins.right},${plotHeight / 2 - legendHeight / 2+20})`)

    legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight);
    let legendItems = legend.append('g')
        .classed('legend-items', true)
        .attr('transform', `translate(${5},${5})`);
    
    let pieLayout = d3.pie<any>()
        .value(d => d.crimes);

    let parseFunction = (d: any) => {
        return {
            crimes: parseInt(d['Crimes']),
            category: d['Category']
        };
    }

    const fileName = 'mom/25/data/Theft in Japan.csv';
    csvService.read<any>(fileName, update, parseFunction);

    let colorScale = d3.scaleLinear<any, any>()
        .range(['#e5f5f9', '#2ca25f'])
        .interpolate(d3.interpolateHcl);
    let arcGenerator = d3.arc<any, any>()
        .innerRadius(0)
        .outerRadius(radius);
    function update(data: Array<any>) {
        colorScale.domain(d3.extent(data, d => d.crimes));
        let pied = pieLayout(data.sort((a, b) => b.crimes - a.crimes));
        console.log(pied)
        plotGroup.selectAll('.arc')
            .data(pied)
            .enter()
            .append('g')
            .classed('arc', true)
            .append('path')
            .attr('d', d => arcGenerator(d))
            .style('fill', d => colorScale(d.value));
        let itemHeight = 20;
        let items = legendItems.selectAll('.legend-item')
            .data(pied)
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', (d, i) => `translate(${0},${i * 20})`);
        items.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', d => colorScale(d.value));
        items.append('text')
            .attr('transform', `translate(${13},${8})`)
            .text(d => d.data.category);

    };
}
import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

export var mom43 = {
    name: 'mom43',
    component: {
        templateUrl: 'mom/43/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 480;
    let radius = 130;

    const fileName = 'mom/43/data/US Debt.csv';
    csvService.read<any>(fileName, update);

    function update(data: Array<any>) {
        let radius = 130;

        let mapped = data.map(d => parseFloat(d.Debt));
        let p = d3.pie()(mapped);
        let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        let colors = ['#2ca25f', '#99d8c9']
        let svg = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .selectAll('.arc')
            .data(p)
            .enter()
            .append('path')
            .classed('arc', true)
            .attr('d', (d:any) => arcGenerator.startAngle(d.startAngle).endAngle(d.endAngle)(d))
            .style('fill', (d, i) => colors[i]);
        let items = svg.append('g')
            .classed('legend', true)
            .attr('transform', `translate(${280},${350})`)
            .selectAll('.legend-item')
            .data(['US', 'Rest of the world'])
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', (d, i) => `translate(${0},${i * 20})`);
        items.append('text')
            .attr('x', 15)
            .text(d => d)
        items.append('rect')
            .attr('y', -8)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', (d, i) => colors[i]);
    };
}
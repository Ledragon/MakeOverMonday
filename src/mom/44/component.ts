import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import * as _ from 'lodash';

export var mom44 = {
    name: 'mom44',
    component: {
        templateUrl: 'mom/44/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 600;

    let plotMargins = {
        top: 30,
        bottom: 30,
        left: 150,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();


    const fileName = 'mom/44/data/Scottish Index of Multiple Deprivation 2012.csv';
    csvService.read<any>(fileName, update);
let radius = 130;

    function update(data: Array<any>) {
        let authorities = _.chain(data).map(d => d['Local Authority Name']).uniq().value();
    let authorityScale = d3.scaleBand<any>()
        .range([0, plotHeight])
        .domain(authorities);
    let authoritiesAxis = d3.axisLeft(authorityScale);
    let authorityAxisGroup = plotGroup.append('g')
        .classed('axis', true);
    authorityAxisGroup.call(authoritiesAxis);

    let rankScale = d3.scaleLinear()
        .range([0, plotWidth])
        .domain([0, d3.max(data, d => parseFloat(d['Overall SIMD 2012 Rank']))]);
    let rankAxis = d3.axisTop(rankScale);
    let rankAxisGroup = plotGroup.append('g')
        .classed('axis', true);
    rankAxisGroup.call(rankAxis);

    let seriesGroup = plotGroup.append('g')
        .classed('series-group', true);
    let dataBound = seriesGroup.selectAll('.series')
        .data(data);
    dataBound.exit().remove();
    let enterSelection = dataBound.enter()
        .append('g')
        .classed('series', true);
    let colorScale = d3.scaleLinear()
        .range([0, 1])
        .domain(rankScale.domain());    
    enterSelection.append('circle')
        .attr('r', 2)
        .attr('cx', d => rankScale(parseFloat(d['Overall SIMD 2012 Rank'])))
        .attr('cy', d => authorityScale(d['Local Authority Name']) + authorityScale.bandwidth() / 2)
        .style('fill', d=>interpolateRdYlBu(colorScale(parseFloat(d['Overall SIMD 2012 Rank']))));
    };
}
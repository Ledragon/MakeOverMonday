import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { submissionsPerWeek } from './charts/submissionsPerWeek';
import { numberOfSubmissionsDistribution } from './charts/numberOfSubmissionsDistribution';
import * as moment from 'moment';

export var mom26 = {
    name: 'mom26',
    component: {
        templateUrl: 'mom/26/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 700;
    const height = 480;


    var container = d3.select('#global')
        .select('svg')
        .attr('width', width)
        .attr('height', height);
    var spw = submissionsPerWeek(container, width, height);

    var nd = d3.select('#global')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var distribution = numberOfSubmissionsDistribution(nd, width, height);

    var statistics = d3.select('#statistics')
        .style('width', '300px')
        .append('div')

    let parseFunction = (d) => {
        return {
            pinterestBoard: d['Pinterest Board'],
            pinboardUrl: d['Pinboard URL'],
            imageUrl: d['Image URL'],
            description: d.Description,
            pinNote: d['Pin Note'],
            originalLink: d['Original Link'],
            name: d['Name'],
            week: +d.Week,
            datePinned: moment(d['Date Pinned'], 'DD-MM-YY HH:mm')
        }
    };

    const fileName = 'mom/26/data/Makeover Monday.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        spw.update(data);
        distribution.update(data);

        statistics.append('h2')
            .text('submissions');
        statistics.append('span')
            .text(data.length);

        statistics.append('h2')
            .text('Participants');
        var byName = d3.nest()
            .key(d => d.name)
            .entries(data);
        statistics.append('span')
            .text(byName.length);

        var sorted = byName.map(d => {
            return {
                name: d.key,
                submissions: d.values.length
            };
        })
            .sort((a, b) => d3.descending(a.submissions, b.submissions))
            .splice(0, 20);
        var subWidth = 300;
        var subHeight = 400;
        var svg = d3.select('#statistics').append('svg')
            .attr('width', subWidth)
            .attr('height', subHeight)

        submissionsByPerson(svg, sorted, subWidth, subHeight);

        spw.dispatch.on('clicked', d => {
            console.log(d)
            d3.select('#weekNumber')
                .select('h4')
                .text(`Week ${d.key} - ${d.values.length} submissions`);
            var sorted = d.values.sort((a, b) => d3.ascending(a.name, b.name));
            var bound = d3.select('#weeks')
                .selectAll('div')
                .data(sorted);
            bound.exit().remove();
            var enter = bound.enter()
                .append('div')
                .classed('miniature', true)
                .append('a')

                .attr('target', '_blank')
                .attr('href', d => d.imageUrl);
            bound.select('a')
                .attr('target', '_blank')
                .attr('href', d => d.imageUrl);
            enter.append('span').text(d => d.name);
            bound.select('span').text(d => d.name);

            enter.append('div')
                .classed('thumbnail', true)
                .style('background-image', d => `url("${d.imageUrl}")`)
            bound.select('.thumbnail')
                .style('background-image', d => `url("${d.imageUrl}")`)
        });
    }
}


function submissionsByPerson(container: d3.Selection<any, any, any, any>, data: Array<any>, width: number, height: number) {
    var marginTop = 30;
    container
        .append('g')
        .attr('transform', `translate(${width / 2},${20})`)
        .style('text-anchor', 'middle')
        .append('text')
        .text('Top submitters')
        ;
    var group = container.append('g')
        .attr('transform', `translate(${120},${marginTop})`);
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.submissions)])
        .range([0, width - 140]);

    var yScale = d3.scaleBand<any>()
        .domain(data.map(d => d.name))
        .range([0, height - marginTop])
        .padding(0.5);
    var yAxis = d3.axisLeft(yScale);
    var yAxisGroup = group.append('g')
        .classed('axis', true)
        .call(yAxis);
    var rectHeight = yScale.bandwidth()
    var enterSelection = group.selectAll('g.person')
        .data(data)
        .enter()
        .append('g')
        .classed('person', true)
        .attr('transform', d => `translate(${0},${yScale(d.name)})`);
    enterSelection.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', d => xScale(d.submissions), )
        .attr('height', rectHeight)
        .style('fill', '#2ca25f')
    enterSelection.append('text')
        .attr('y', rectHeight)
        .attr('x', d => xScale(d.submissions) - 20)
        .style('fill', 'white')
        .style('font-size', '12px')
        .text(d => d.submissions);
}
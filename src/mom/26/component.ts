import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { submissionsPerWeek } from './charts/submissionsPerWeek';
import * as moment from 'moment';

export var mom26 = {
    name: 'mom26',
    component: {
        templateUrl: 'mom/26/template.html',
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

    var container = d3.select('#chart')
    .select('svg')
        .attr('width', width)
        .attr('height', height);
    var spw = submissionsPerWeek(container, width, height);

    var nd = d3.select('#global')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    // var distribution = charting.numberOfSubmissionsDistribution(nd, width, height);

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
                // distribution.update(data);

                // statistics.append('h2')
                //     .text('submissions');
                // statistics.append('span')
                //     .text(data.length);

                // statistics.append('h2')
                //     .text('Participants');
                // var byName = d3.nest()
                //     .key(d => d.name)
                //     .entries(data);
                // statistics.append('span')
                //     .text(byName.length);

                // var sorted = byName.map(d => {
                //     return {
                //         name: d.key,
                //         submissions: d.values.length
                //     };
                // })
                //     .sort((a, b) => d3.descending(a.submissions, b.submissions))
                //     .splice(0, 20);
                // var subWidth = 300;
                // var subHeight = 400;
                // var svg = d3.select('#statistics').append('svg')
                //     .attr({
                //         'width': subWidth,
                //         height: subHeight
                //     });

                // submissionsByPerson(svg, sorted, subWidth, subHeight);

                spw.dispatch.on('clicked', d => {
                    d3.select('#weekNumber').select('h4').text(`Week ${d.key} - ${d.values.length} submissions`)
                    var sorted = d.values.sort((a, b) => d3.ascending(a.name, b.name));
                    var bound = d3.select('#weeks')
                        .selectAll('div')
                        .data(sorted);
                    bound.exit().remove();
                    var enter = bound.enter()
                        .append('div')
                        .classed('miniature', true)
                        .append('a');
                    bound.select('a').attr({
                        'target': '_blank',
                        href: d => d.imageUrl
                    })
                    enter.append('span');
                    bound.select('span').text(d => d.name);

                    enter.append('div')
                        .classed('thumbnail', true)
                    bound.select('.thumbnail')
                        .style('background-image', d => `url("${d.imageUrl}")`)
    };
}
}
(function () {
    'use strict';
    var width = 800;
    var height = 600;

    var container = d3.select('svg');
    var submissionsPerWeek = charting.submissionsPerWeek(container, width, height);

    var nd = d3.select('#global')
        .append('svg')
        .attr({
            'width': width,
            'height': height
        });
    var distribution = charting.numberOfSubmissionsDistribution(nd, width, height);





    d3.csv('data/Makeover Monday.csv',
        (d) => {
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
        },
        (error, data) => {
            if (error) {
                console.error(error);
            } else {
                submissionsPerWeek.update(data);
                distribution.update(data);

                submissionsPerWeek.dispatch.on('clicked', d => {
                    d3.select('#weekNumber').select('h4').text(`Week ${d.key}`)
                    var sorted = d.values.sort((a, b) => a - b);
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
                    // enter.append('img')
                    //     .classed('thumbnail', true)
                    // bound.select('.thumbnail')
                    //     .attr('src', d => `${d.imageUrl}`)
                })
            }
        });
} ());
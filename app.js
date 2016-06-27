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
            }
        });
} ());
(function () {
    'use strict';

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
                datePinned: d['Date Pinned']
            }
        },
        (error, data) => {
            if (error) {
                console.error(error);
            } else {
                console.log(data);
                d3.nest()
                    .key(d => d.Week);
            }
        });
} ());
"use strict";
var d3 = require('../d3');
var movies_1 = require('./charts/movies');
// read('data/Alan Rickman.csv', data => {
//     let parsed: Array<any> = [];
//     data.forEach((d: any) => {
//         parsed.push({
//             date: new Date(d.Date),
//             title: d.Title,
//             studio: d.Studio,
//             adjustedGross: +(d[' Adjusted Gross '].trim().split(',').join('')),
//             lifetimeGross: +(d[' Lifetime Gross '].trim().split(',').join('')),
//             theatres: +(d['Theatres'].trim().split(',').join('')),
//             opening: d['Opening'] ? +(d[' Opening '].trim().split(',').join('')) : null,
//             openingTheatres: d['Opening Theatres'] ? +(d['Opening Theatres'].trim().split(',').join('')) : null,
//             rank: d['Rank'] ? +(d['Rank'].trim().split(',').join('')) : null,
//             cameo: d['Cameo'],
//             tomatometerScore: +d['TomatometerScore'],
//             audienceScore: +d['AudienceScore'],
//         });
//     });
// })
d3.json('data/Movies.json', function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        var width = 800;
        var height = 800;
        var container = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        console.log(data);
        movies_1.movies(container, width, height, data.data);
    }
});
//# sourceMappingURL=app.js.map
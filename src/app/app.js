"use strict";
var dataService_1 = require('./services/dataService');
dataService_1.read('data/Alan Rickman.csv', function (data) {
    console.log(data.columns);
    var parsed = [];
    data.forEach(function (d) {
        parsed.push({
            date: new Date(d.Date),
            title: d.Title,
            studio: d.Studio,
            adjustedGross: +(d[' Adjusted Gross '].trim().split(',').join('')),
            lifetimeGross: +(d[' Lifetime Gross '].trim().split(',').join('')),
            theatres: +(d['Theatres'].trim().split(',').join('')),
            opening: d['Opening'] ? +(d[' Opening '].trim().split(',').join('')) : null,
            openingTheatres: d['Opening Theatres'] ? +(d['Opening Theatres'].trim().split(',').join('')) : null,
            rank: d['Rank'] ? +(d['Rank'].trim().split(',').join('')) : null,
            cameo: d['Cameo'],
            tomatometerScore: +d['TomatometerScore'],
            audienceScore: +d['AudienceScore'],
        });
    });
    console.log(parsed);
});
//# sourceMappingURL=app.js.map
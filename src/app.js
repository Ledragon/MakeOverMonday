"use strict";
var d3_selection_1 = require('d3-selection');
var d3_request_1 = require('d3-request');
var countryRanks_1 = require('./charts/countryRanks');
var w = 800;
var h = 600;
var countryRankSvg = d3_selection_1.select('#countryRank')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);
var rank = new countryRanks_1.countryRank(countryRankSvg, w, h);
d3_request_1.csv('data/Olympic Medal Table.csv', function (d) {
    return {
        edition: +d.Edition,
        rank: +d.Rank,
        country: d.Country,
        countryGroup: d['Country Group'],
        gold: +d.Gold,
        silver: +d.Silver,
        bronze: +d.Bronze,
        total: +d.Total
    };
}, function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        rank.update(data);
    }
});
//# sourceMappingURL=app.js.map
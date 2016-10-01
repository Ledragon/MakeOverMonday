"use strict";
var d3_request_1 = require('d3-request');
var d3_selection_1 = require('d3-selection');
d3_request_1.csv('data/Global Peach Index.csv', function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        var countries = data.map(function (d) { return d.Country; });
        d3_selection_1.select('#countries')
            .selectAll('.country')
            .data(countries)
            .enter()
            .append('div')
            .on('click', function (d) {
            var sel = d3_selection_1.select(this);
            var hasClass = sel.classed('highlight');
            sel.classed('highlight', !hasClass);
        })
            .text(function (d) { return d; });
        d3_request_1.json('data/world.json', function (e, d) {
            console.log(d);
        });
    }
});
//# sourceMappingURL=app.js.map
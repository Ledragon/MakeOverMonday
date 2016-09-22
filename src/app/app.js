"use strict";
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
d3_request_1.csv('data/Data Breaches.csv', function (d) {
    return {
        year: +d.Year,
        company: d.Entity,
        recordsStolen: +d['Records Stolen'],
        recordsLost: +d['Records Lost']
    };
}, function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(data);
        // var desc = descending((a,b)=>a.
        var byCompany = d3_collection_1.nest()
            .key(function (d) { return d.year.toString(); })
            .entries(data)
            .sort(function (a, b) { return b.values.length - a.values.length; });
        console.log(byCompany);
    }
});
//# sourceMappingURL=app.js.map
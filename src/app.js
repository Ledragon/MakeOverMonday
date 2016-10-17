"use strict";
var d3_request_1 = require('d3-request');
var d3_collection_1 = require('d3-collection');
var d3_array_1 = require('d3-array');
d3_request_1.csv('data/data.csv', function (error, data) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(data.columns);
        var bySurveyDate = d3_collection_1.nest()
            .key(function (d) { return d['Survey Date']; })
            .entries(data);
        var byCountry2012 = d3_collection_1.nest()
            .key(function (d) { return d.Country; })
            .entries(bySurveyDate[0].values);
        console.log(byCountry2012);
        var mapped = byCountry2012.map(function (d) {
            return {
                country: d.key,
                total: d3_array_1.sum(d.values, function (v) { return parseFloat(v.TOTAL); }),
                verySatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Very satisfied']); }),
                ratherSatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Rather satisfied']); }),
                ratherUnsatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Rather unsatisfied']); }),
                notAtAllSatisfied: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Not at all satisfied']); }),
                dontKnow: d3_array_1.sum(d.values, function (v) { return parseFloat(v['Don\'t know']); }),
            };
        });
    }
});
//# sourceMappingURL=app.js.map
/// <reference path="histogram.ts" />
/// <reference path="map.ts" />
/// <reference path="womenPerIndustry.ts" />
/// <reference path="viewPerYearOfBirth.ts" />
/// <reference path="IHistory.d.ts" />

(function () {
    var width = 800;
    var height = 450;
    var histogram = new app.histogram('histogram', width, height);
    var map = new app.map('map', width, height);
    var perYear = new app.viewPerYearOfBirth('perYear', width, height);
    var perIndustry = new app.womenPerIndustry('other', width, height);
    d3.csv('data/History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            histogram.update(data);
            map.update(data);
            perIndustry.update(data);
            perYear.update(data);
        }
    });
} ());
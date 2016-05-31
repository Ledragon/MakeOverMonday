/// <reference path="histogram.ts" />
/// <reference path="map.ts" />
/// <reference path="womenPerIndustry.ts" />
/// <reference path="viewPerYearOfBirth.ts" />

(function () {
    var width = 800;
    var height = 450;
    d3.csv('History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            histogram('histogram', width, height, data);
            map('map', width, height, data);
            womenPerIndustry('other', width, height, data)
            var perYear = new app.viewPerYearOfBirth('perYear', width, height);
            perYear.update(data);
        }
    });
}());
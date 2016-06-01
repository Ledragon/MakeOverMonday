/// <reference path="histogram.ts" />
/// <reference path="map.ts" />
/// <reference path="womenPerIndustry.ts" />
/// <reference path="viewPerYearOfBirth.ts" />
/// <reference path="IHistory.d.ts" />

(function () {
    var width = 800;
    var height = 450;
    d3.csv('data/History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            var histogram = new app.histogram('histogram', width, height);
            histogram.update(data);
//            map('map', width, height, data);
            var map = new app.map('map', width, height);     
            map.update(data);
            womenPerIndustry('other', width, height, data)
            var perYear = new app.viewPerYearOfBirth('perYear', width, height);
            perYear.update(data);
        }
    });
}());
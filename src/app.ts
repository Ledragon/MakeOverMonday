/// <reference path="histogram.ts" />
/// <reference path="brush.ts" />
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
    var brush = new app.brush('brush', 1606, 50);
    d3.csv('data/History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            brush.update(data);
            var filtered = data;//.filter(d => +d.Birthyear > 1500);
            refresh(filtered);
            brush.dispatch().on('brushed', extent => {

                var filtered = data.filter(d => +d.Birthyear >= extent[0] && +d.Birthyear <= extent[1]);//.filter(d => +d.Birthyear > 1500);
                console.log(filtered);
                refresh(filtered);
            })
        }
    });

    function refresh(data) {
        histogram.update(data);
        map.update(data);
        perIndustry.update(data);
        perYear.update(data);
    }
} ());
(function () {
    var width = 800;
    var height = 450;
    var histogram = new app.histogram('histogram', width, height);
    var map = new app.map('map', width, height, 'data/world.json');
    var perYear = new app.viewPerYearOfBirth('perYear', width, height);
    var perIndustry = new app.womenPerIndustry('other', width, height);
    var brush = new app.brush('brush', 1606, 50);
    d3.csv('data/History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            brush.update(data);
            refresh(data);
            brush.dispatch().on('brushed', extent => {
                var filtered = data.filter(function (d) {
                    return +d.Birthyear >= extent[0] && +d.Birthyear <= extent[1];
                }); 
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
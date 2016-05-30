function map(container, width, height) {
    d3.csv('History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            d3.select(`#${container}`)
                .append('g')
                .classed('map', true);
            var nested = d3.nest()
                .key(d => d['Continent Name'])
                .entries(data);
            console.log(nested);
        }
    });
}

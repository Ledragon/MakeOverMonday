function histogram(container, width, height, data) {
    // console.log(data);
    var marginLeft = 50;
    var marginRight = 20;
    var marginTop = 20;
    var marginBottom = 40;
    // var width = 800;
    // var height = 600;
    var filtered = data //.filter(d => d['Dead or Alive'] === 'Dead')
        .sort(function (a, b) { return a.Birthyear - b.Birthyear; });
    var chart = d3.select('#' + container)
        .attr({
        width: width,
        height: height
    })
        .append('g')
        .classed('chart', true)
        .attr('transform', "translate(" + marginLeft + "," + marginTop + ")");
    var yScale = d3.time.scale()
        .range([0, height - marginTop - marginBottom])
        .domain([-3500, 2000]);
    var axis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(d3.format('YYYY'));
    var axisGroup = chart.append('g')
        .classed('axis', true)
        .call(axis);
    var histogram = d3.layout.histogram()
        .bins(55)
        .range([-3500, 2000])
        .value(function (d) { return d.Birthyear; });
    var split = histogram(data);
    var xScale = d3.scale.linear()
        .range([0, width - marginLeft - marginRight])
        .domain([0, 6000]);
    // console.log(split)
    chart.append('g')
        .classed('series', true)
        .selectAll('.bin')
        .data(split)
        .enter()
        .append('g')
        .classed('bin', true)
        .attr('transform', function (d) { return ("translate(" + 0 + "," + yScale(d.x) + ")"); })
        .append('rect')
        .attr({
        'x': 0,
        'y': 0,
        'height': 5,
        'width': function (d) {
            return xScale(d.y);
        }
    })
        .style('fill', '#A6CFD5');
    chart.append('g')
        .classed('title', true)
        .attr('transform', "translate(" + width / 2 + ",10)")
        .append('text')
        .text('Number of famous people by century');
}
/// <reference path="histogram.ts" />
(function () {
    var width = 800;
    var height = 450;
    d3.csv('data/History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        }
        else {
            histogram('histogram', width, height, data);
            map('map', width, height, data);
            womenPerIndustry('other', width, height, data);
        }
    });
}());

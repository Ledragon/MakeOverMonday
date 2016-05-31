function histogram(container, width, height, data) {
    // console.log(data);
    var marginLeft = 50;
    var marginRight = 20;
    var marginTop = 40;
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
        .attr('transform', "translate(" + marginLeft + "," + 0 + ")");
    var plotArea = chart.append('g')
        .classed('chart-container', true)
        .attr('transform', "translate(" + 0 + "," + marginTop + ")");
    var yScale = d3.time.scale()
        .range([0, height - marginTop - marginBottom])
        .domain([-3500, 2000]);
    var axis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(d3.format('YYYY'));
    var axisGroup = plotArea.append('g')
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
    plotArea.append('g')
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
    // chart.append('g')
    //     .classed('title', true)
    //     .attr('transform', `translate(${width / 2},10)`)
    //     .append('text')
    title(chart, width, 'Number of famous people by century');
}
function map(container, width, height, data) {
    var map = d3.select("#" + container)
        .attr({
        width: width,
        height: height
    })
        .append('g')
        .classed('map', true);
    //.attr('transform', 'translate(0,50)');
    map.append('g')
        .classed('title', true)
        .attr('transform', "translate(" + width / 2 + ",30)")
        .append('text')
        .text('Number of famous people by country');
    var key = 'Country Name';
    var nested = d3.nest()
        .key(function (d) { return d[key]; })
        .entries(data.filter(function (d) { return d[key] && d[key] !== "Unknown"; }));
    d3.json('world.json', function (error, geo) {
        if (error) {
            console.error(error);
        }
        else {
            var countries = map.append('g')
                .classed('countries', true)
                .attr('transform', 'translate(0,50)');
            // var extent = d3.extent(nested, n => n.values.length);
            var extent = [0, 1600]; //d3.extent(nested, n => n.values.length);
            var color = d3.scale.linear()
                .domain(extent)
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')]);
            var projection = d3.geo.mercator()
                .translate([width / 2, height / 2])
                .scale(height / 6);
            var pathGenerator = d3.geo.path().projection(projection);
            countries.selectAll('path')
                .data(geo.features)
                .enter()
                .append('path')
                .attr('d', pathGenerator)
                .style('fill', function (d, i) {
                var lowerCase = d.properties.name.toLowerCase();
                var index = nested.find(function (el) { return el.key.toLowerCase() === lowerCase; });
                var value = index ? index.values.length : 0;
                var c = color(value);
                return c;
            });
            var legend = map.append('g')
                .classed('legend', true)
                .attr('transform', "translate(10," + (height - 40) + ")");
            var step = 100;
            var range = d3.range(extent[0], extent[1] + step, step);
            legend
                .append('g')
                .selectAll('rect')
                .data(range)
                .enter()
                .append('rect')
                .attr({
                'x': function (d, i) { return i * 10; },
                'y': 0,
                'width': 10,
                'height': 10
            })
                .style({
                'fill': function (d) { return color(d); }
            });
            var legnedText = legend.append('g')
                .attr('transform', 'translate(0,25)');
            legnedText.append('text')
                .style({
                'text-anchor': 'middle'
            })
                .text(extent[0]);
            legnedText.append('text')
                .attr({
                'x': range.length * 10
            })
                .style({
                'text-anchor': 'middle'
            })
                .text(extent[1]);
        }
    });
}
//     });
// }
function womenPerIndustry(container, width, height, data) {
    var marginTop = 50;
    var marginBotom = 10;
    var marginLeft = 150;
    var marginRight = 20;
    var chart = d3.select("#" + container)
        .attr({
        width: width,
        height: height
    })
        .append('g')
        .classed('chart', true);
    title(chart, width, 'Women per industry');
    var women = data.filter(function (d) { return d['Gender'] === 'Female'; });
    var nested = d3.nest()
        .key(function (d) { return d.Industry; })
        .entries(women);
    var chartHeight = height - marginBotom - marginTop;
    var chartWidth = width - marginLeft - marginRight;
    var ordinalScale = d3.scale.ordinal()
        .domain(nested.map(function (d) { return d.key; }))
        .rangeBands([0, chartHeight]);
    var yScale = d3.scale.linear()
        .domain(d3.extent(nested, function (d) { return d.values.length; }).reverse())
        .range([0, chartWidth]);
    var enterSelection = chart.append('g')
        .classed('bar', true)
        .attr('transform', "translate(" + marginLeft + ", " + marginTop + ")")
        .selectAll('g.data')
        .data(nested)
        .enter()
        .append('g')
        .classed('data', true)
        .attr('transform', function (d) { return ("translate(" + 0 + "," + ordinalScale(d.key) + ")"); });
    enterSelection.append('rect')
        .attr({
        x: 0,
        y: 0,
        width: function (d) { return yScale(d.values.length); },
        height: 10
    })
        .style('fill', '#26408B');
    var oridnalAxis = d3.svg.axis()
        .orient('left')
        .scale(ordinalScale);
    chart.append('g')
        .classed('axis', true)
        .attr('transform', "translate(" + marginLeft + "," + marginTop + ")")
        .call(oridnalAxis);
}
// function title(container, width, height) {
//     container.append('g')
//         .classed('title', true)
//         .attr('transform', `translate(${width / 2}, 40)`)
//         .append('text')
//         .classed('title', true)
//         .text('Women per industry');
// } 
var app;
(function (app) {
    var viewPerYearOfBirth = (function () {
        function viewPerYearOfBirth(containerId, _width, _height) {
            this._width = _width;
            this._height = _height;
            this._marginTop = 50;
            this._marginBottom = 50;
            this._marginLeft = 50;
            this._marginRight = 20;
            this._container = d3.select("#" + containerId)
                .attr({
                'width': this._width,
                'height': _height
            })
                .append('g')
                .classed('chart', true)
                .attr('transform', "translate(" + this._marginLeft + "," + 0 + ")");
        }
        viewPerYearOfBirth.prototype.update = function (data) {
            var container = this._container.append('g')
                .classed('chart-container', true)
                .attr('transform', "translate(" + 0 + "," + this._marginTop + ")");
            var years = data.map(function (d) { return +d.Birthyear; })
                .sort(function (a, b) { return a - b; });
            var scale = d3.scale.linear()
                .domain(d3.extent(years))
                .range([0, this._width - this._marginLeft - this._marginRight]);
            var axis = d3.svg.axis()
                .scale(scale);
            var axisGroup = container.append('g')
                .classed('axis', true)
                .attr('transform', "translate(" + 0 + "," + (this._height - this._marginBottom - this._marginTop) + ")")
                .call(axis);
            var pointsGroup = this.drawPoints(container, data, scale);
            var chartXScale = d3.scale.linear()
                .domain(d3.extent(years))
                .range([0, this._width - this._marginLeft - this._marginRight]);
            var viewsChart = container.append('g')
                .classed('data-chart', true);
            var mapped = data.map(function (d) { return +(d['Total Page Views'].replace(/,/g, '')); });
            var chartYScale = d3.scale.linear()
                .range([this._height - this._marginBottom - this._marginTop - 25, 0])
                .domain(d3.extent(mapped));
            var yAxis = d3.svg.axis()
                .orient('left')
                .scale(chartYScale)
                .tickFormat(d3.format('s'));
            var yAxisGroup = viewsChart.append('g')
                .classed('axis', true)
                .attr('transform', "translate(" + 0 + "," + 0 + ")")
                .call(yAxis);
            var pathGenerator = d3.svg.line()
                .x(function (d) { return chartXScale(d.Birthyear); })
                .y(function (d) { return chartYScale(+(d['Total Page Views'].replace(/,/g, ''))); })
                .interpolate('basis');
            var prepared = data.filter(function (d) { return !!d.Birthyear; })
                .sort(function (a, b) { return a.Birthyear - b.Birthyear; });
            var pathGroup = container.append('g')
                .append('path')
                .style({
                'fill': 'transparent',
                'stroke': '#C2E7D9',
                'stroke-width': '1px'
            })
                .attr('d', pathGenerator(prepared));
            var brush = this.drawBrush(scale);
            pointsGroup.append('g')
                .classed('brush', true)
                .call(brush)
                .selectAll('rect')
                .attr({
                'height': 25,
                'y': -10
            });
            brush.on('brush', function (d, i) {
                console.log(brush.extent());
                if (!brush.empty()) {
                    chartXScale.domain(brush.extent());
                    axisGroup.call(axis);
                    pathGroup
                        .attr('d', pathGenerator(prepared));
                }
            });
            title(this._container, this._width, 'Total number of views according to birth year');
        };
        viewPerYearOfBirth.prototype.drawPoints = function (container, data, scale) {
            var colors = d3.scale.ordinal()
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')])
                .domain(["Female", 'Male']);
            var pointsGroup = container.append('g')
                .classed('points', true)
                .attr('transform', "translate(" + 0 + "," + (this._height - this._marginTop - this._marginBottom - 15) + ")");
            pointsGroup.append('rect')
                .attr({
                'x': 0,
                'y': 0,
                width: this._width - this._marginLeft - this._marginRight,
                height: 25,
                'transform': 'translate(0,-10)'
            })
                .style({
                'fill': 'transparent',
                'stroke': 'darkgray',
                'stroke-width': '1px'
            });
            pointsGroup
                .selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr({
                'cx': function (d) { return scale(d.Birthyear); },
                'cy': 0,
                'r': 2
            })
                .style({
                'fill': function (d) {
                    var color = colors(d.Gender);
                    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                }
            });
            return pointsGroup;
        };
        viewPerYearOfBirth.prototype.drawPath = function (data, scale, chartYScale, pathGenerator) {
            // var pathGenerator = d3.svg.line()
            //     .x(d => scale(d.Birthyear))
            //     .y(d => chartYScale(+(d['Total Page Views'].replace(/,/g, ''))))
            //     .interpolate('basis');
            var pathGroup = this._container.append('g')
                .append('path')
                .style({
                'fill': 'transparent',
                'stroke': '#C2E7D9',
                'stroke-width': '1px'
            })
                .attr('d', pathGenerator(data.filter(function (d) { return !!d.Birthyear; })
                .sort(function (a, b) { return a.Birthyear - b.Birthyear; })));
            return pathGroup;
        };
        viewPerYearOfBirth.prototype.drawBrush = function (scale) {
            var brush = d3.svg.brush()
                .x(scale)
                .on('brush', function (d, i) {
                console.log(brush.extent());
            });
            return brush;
        };
        return viewPerYearOfBirth;
    }());
    app.viewPerYearOfBirth = viewPerYearOfBirth;
})(app || (app = {}));
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
        }
        else {
            histogram('histogram', width, height, data);
            map('map', width, height, data);
            womenPerIndustry('other', width, height, data);
            var perYear = new app.viewPerYearOfBirth('perYear', width, height);
            perYear.update(data);
        }
    });
}());
function raw(container, width, height) {
    d3.csv('data/History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        }
        else {
            var marginLeft = 20;
            var marginRight = 20;
            var marginTop = 40;
            var marginBottom = 0;
            var filtered = data
                .sort(function (a, b) { return a.Birthyear - b.Birthyear; });
            var chart = d3.select('#' + container)
                .attr('height', height)
                .attr('width', width)
                .append('g')
                .classed('chart', true)
                .attr('transform', "translate(" + marginLeft + "," + marginTop + ")");
            var scale = d3.time.scale()
                .range([0, width - marginLeft - marginRight])
                .domain([new Date(-3500, 0, 0), new Date(2000, 0, 0)]);
            var yScale = d3.scale.linear()
                .range([0, height - marginTop - marginBottom])
                .domain([0, data.length]);
            var axis = d3.svg.axis()
                .scale(scale)
                .orient('top')
                .tickFormat(d3.time.format('%Y'));
            var axisGroup = chart.append('g')
                .classed('axis', true)
                .call(axis);
            var persons = chart
                .selectAll('g.person')
                .data(filtered)
                .enter()
                .append('g')
                .classed('person', true)
                .attr('transform', function (d, i) { return 'translate(0,' + yScale(i) + ')'; });
            // persons
            //     .append('text')
            //     .attr({
            //         'y': 10
            //     })
            //     .text(d => d.Name + ' (' + d.Birthyear + '-' + d.To + ')');
            persons
                .append('circle')
                .attr({
                'cx': function (d) { return scale(new Date(d.Birthyear, 0, 0)); },
                'y': 0,
                r: 2
            })
                .style('fill', 'blue');
        }
    });
}
function title(container, width, text) {
    container.append('g')
        .classed('title', true)
        .attr('transform', "translate(" + width / 2 + ",30)")
        .append('text')
        .text(text);
}

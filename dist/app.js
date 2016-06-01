var app;
(function (app) {
    var title = (function () {
        function title(container, width, text) {
            container.append('g')
                .classed('title', true)
                .attr('transform', "translate(" + width / 2 + ",30)")
                .append('text')
                .text(text);
        }
        return title;
    }());
    app.title = title;
})(app || (app = {}));
/// <reference path="title.ts" />
var app;
(function (app) {
    var histogram = (function () {
        function histogram(container, width, height) {
            this._marginLeft = 50;
            this._marginRight = 20;
            this._marginTop = 40;
            this._marginBottom = 40;
            this._container = d3.select('#' + container)
                .attr({
                width: width,
                height: height
            })
                .append('g')
                .classed('chart', true)
                .attr('transform', "translate(" + this._marginLeft + "," + 0 + ")");
            var plotArea = this._container.append('g')
                .classed('chart-container', true)
                .attr('transform', "translate(" + 0 + "," + this._marginTop + ")");
            this.initAxis(plotArea, height);
            this.initXAxis(width);
            this.initHistogram();
            this._seriesGroup = plotArea.append('g')
                .classed('series', true);
            new app.title(this._container, width, 'Number of famous people');
        }
        histogram.prototype.initHistogram = function () {
            this._histogram = d3.layout.histogram()
                .bins(50)
                .value(function (d) { return d.Birthyear; });
        };
        histogram.prototype.initAxis = function (container, height) {
            this._yScale = d3.time.scale()
                .range([0, height - this._marginTop - this._marginBottom]);
            this._yAxis = d3.svg.axis()
                .scale(this._yScale)
                .orient('left')
                .tickFormat(d3.format('YYYY'));
            this._yAxisGroup = container.append('g')
                .classed('axis', true);
        };
        histogram.prototype.initXAxis = function (width) {
            this._xScale = d3.scale.linear()
                .range([0, width - this._marginLeft - this._marginRight]);
        };
        histogram.prototype.update = function (data) {
            var _this = this;
            var yearsExtent = d3.extent(data, function (d) { return +d.Birthyear; });
            // var delta = Math.ceil((yearsExtent[1] - yearsExtent[0]) / 100);
            this._histogram
                .range(function (d, i) { return yearsExtent; });
            var split = this._histogram(data);
            this._xScale.domain([0, d3.max(split, function (d) { return d.y; })]);
            this._yScale.domain(yearsExtent);
            this._yAxisGroup.call(this._yAxis);
            var dataBound = this._seriesGroup.selectAll('.bin')
                .data(split);
            dataBound.exit()
                .remove();
            dataBound.enter()
                .append('g')
                .classed('bin', true)
                .attr('transform', function (d) { return ("translate(" + 0 + "," + _this._yScale(d.x) + ")"); })
                .append('rect')
                .attr({
                'x': 0,
                'y': 0,
                'height': 5,
            })
                .style('fill', '#A6CFD5');
            dataBound.select('rect')
                .transition()
                .attr({
                'width': function (d) {
                    return _this._xScale(d.y);
                }
            });
        };
        return histogram;
    }());
    app.histogram = histogram;
})(app || (app = {}));
var app;
(function (app) {
    var brush = (function () {
        function brush(containerId, _width, _height) {
            this._width = _width;
            this._height = _height;
            this._marginTop = 5;
            this._marginBottom = 30;
            this._marginLeft = 20;
            this._marginRight = 20;
            this._container = d3.select("#" + containerId)
                .attr({
                'width': this._width,
                'height': _height
            })
                .append('g')
                .classed('chart', true)
                .attr('transform', "translate(" + this._marginLeft + "," + this._marginTop + ")");
            this.initPoints(this._container);
            this.initBrush(this._container);
            this.initAxisGroup(this._container);
            this._dispatch = d3.dispatch('brushed');
        }
        brush.prototype.dispatch = function () {
            return this._dispatch;
        };
        brush.prototype.initPoints = function (container) {
            this._genderColorScale = d3.scale.ordinal()
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')])
                .domain(["Female", 'Male']);
            this._pointsGroup = container.append('g')
                .classed('points', true)
                .attr('transform', "translate(" + 0 + "," + 10 + ")");
        };
        brush.prototype.initBrush = function (container) {
            var _this = this;
            this._brushGroup = container.append('g')
                .classed('brush', true);
            this._brushScale = d3.scale.linear()
                .range([0, this._width - this._marginLeft - this._marginRight]);
            this._brush = d3.svg.brush()
                .x(this._brushScale)
                .on('brush', function (d, i) {
                if (!_this._brush.empty()) {
                    _this._dispatch.brushed(_this._brush.extent());
                }
            });
        };
        brush.prototype.initAxisGroup = function (container) {
            this._axis = d3.svg.axis()
                .scale(this._brushScale);
            this._axisGroup = container.append('g')
                .classed('axis', true)
                .attr('transform', "translate(" + 0 + "," + (this._height - this._marginBottom) + ")");
        };
        brush.prototype.update = function (data) {
            this._brushScale.domain(d3.extent(data, function (d) { return +d.Birthyear; }));
            this.updatePoints(data);
            this._brushGroup.call(this._brush)
                .selectAll('rect')
                .attr({
                'height': this._height - this._marginBottom,
            });
            this._axisGroup.call(this._axis);
        };
        brush.prototype.updatePoints = function (data) {
            var _this = this;
            this._pointsGroup
                .selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr({
                'cx': function (d) { return _this._brushScale(+d.Birthyear); },
                'cy': 0,
                'r': 2
            })
                .style({
                'fill': function (d) {
                    var color = _this._genderColorScale(d.Gender);
                    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                }
            });
        };
        return brush;
    }());
    app.brush = brush;
})(app || (app = {}));
/// <reference path="title.ts" />
var app;
(function (app) {
    var map = (function () {
        function map(containerId, width, height) {
            this._container = d3.select("#" + containerId)
                .attr({
                width: width,
                height: height
            })
                .append('g')
                .classed('map', true);
            new app.title(this._container, width, 'Number of famous people by country');
            var countries = this._container
                .append('g')
                .classed('countries', true)
                .attr('transform', 'translate(0,50)');
            // var extent: [number, number] = [0, 1600];
            this._color = d3.scale.linear()
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')]);
            this.initMap(countries, width, height);
            this.initLegend(this._container, width, height);
        }
        map.prototype.initMap = function (container, width, height) {
            var _this = this;
            var projection = d3.geo.mercator()
                .translate([width / 2, height / 2])
                .scale(height / 6);
            var pathGenerator = d3.geo.path().projection(projection);
            d3.json('data/world.json', function (error, geo) {
                if (error) {
                    console.error(error);
                }
                else {
                    _this._countries = container.selectAll('path')
                        .data(geo.features)
                        .enter()
                        .append('path')
                        .attr('d', pathGenerator)
                        .style('fill', 'lightgray');
                    if (_this._data) {
                        _this._countries
                            .style('fill', function (d, i) {
                            var lowerCase = d.properties.name.toLowerCase();
                            var index = _this._data.find(function (el) { return el.key.toLowerCase() === lowerCase; });
                            var value = index ? index.values.length : 0;
                            var c = _this._color(value);
                            return c;
                        });
                    }
                }
            });
        };
        map.prototype.initLegend = function (container, width, height) {
            var _this = this;
            this._legendGroup = container.append('g')
                .classed('legend', true)
                .attr('transform', "translate(10," + (height - 40) + ")");
            var step = 1;
            var range = d3.range(0, 10 + step, step);
            var extent = d3.extent(range);
            this._color.domain(d3.extent(range));
            this._legendGroup
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
                'fill': function (d) { return _this._color(d); }
            });
            var legnedText = this._legendGroup.append('g')
                .attr('transform', 'translate(0,25)');
            legnedText.append('text')
                .classed('first', true)
                .style({
                'text-anchor': 'middle'
            });
            legnedText.append('text')
                .classed('last', true)
                .attr({
                'x': range.length * 10
            })
                .style({
                'text-anchor': 'middle'
            });
        };
        map.prototype.update = function (data) {
            var _this = this;
            var key = 'Country Name';
            var nested = d3.nest()
                .key(function (d) { return d[key]; })
                .entries(data.filter(function (d) { return d[key] && d[key] !== "Unknown"; }));
            this._data = nested;
            var extent = d3.extent(nested, function (d) { return d.values.length; });
            this._color.domain(extent);
            this._legendGroup.select('.first').text(extent[0]);
            this._legendGroup.select('.last').text(extent[1]);
            if (this._countries) {
                this._countries
                    .style('fill', function (d, i) {
                    var lowerCase = d.properties.name.toLowerCase();
                    var index = nested.find(function (el) { return el.key.toLowerCase() === lowerCase; });
                    var value = index ? index.values.length : 0;
                    var c = _this._color(value);
                    return c;
                });
            }
        };
        return map;
    }());
    app.map = map;
})(app || (app = {}));
/// <reference path="title.ts" />
var app;
(function (app) {
    var womenPerIndustry = (function () {
        function womenPerIndustry(containerId, width, height) {
            this._marginTop = 50;
            this._marginBotom = 10;
            this._marginLeft = 150;
            this._marginRight = 20;
            this._container = d3.select("#" + containerId)
                .attr({
                width: width,
                height: height
            })
                .append('g')
                .classed('chart', true);
            this._plotArea = this._container.append('g')
                .classed('bar', true)
                .attr('transform', "translate(" + this._marginLeft + ", " + this._marginTop + ")");
            new app.title(this._container, width, 'Famous people per industry');
            this._chartHeight = height - this._marginBotom - this._marginTop;
            this._chartWidth = width - this._marginLeft - this._marginRight;
            this.initOrdinalScale(this._plotArea);
            this.initYScale(this._plotArea);
            this._barsGroup = this._plotArea.append('g')
                .classed('bars', true);
        }
        womenPerIndustry.prototype.initOrdinalScale = function (container) {
            this._ordinalScale = d3.scale.ordinal()
                .rangeBands([0, this._chartHeight]);
            this._ordinalAxis = d3.svg.axis()
                .orient('left')
                .scale(this._ordinalScale);
            this._ordinalAxisGroup = container.append('g')
                .classed('axis', true);
        };
        womenPerIndustry.prototype.initYScale = function (container) {
            this._yScale = d3.scale.linear()
                .range([0, this._chartWidth]);
        };
        womenPerIndustry.prototype.update = function (data) {
            var nested = d3.nest()
                .key(function (d) { return d.Industry; })
                .entries(data);
            this._yScale.domain(d3.extent(nested, function (d) { return d.values.length; }).reverse());
            this._ordinalScale.domain(nested.map(function (d) { return d.key; }));
            this._ordinalAxisGroup.call(this._ordinalAxis);
            this.updateBars(nested);
        };
        womenPerIndustry.prototype.updateBars = function (nested) {
            var _this = this;
            var dataBound = this._barsGroup
                .selectAll('g.data')
                .data(nested);
            dataBound.exit()
                .remove();
            var enterSelection = dataBound.enter()
                .append('g')
                .classed('data', true)
                .attr('transform', function (d) { return ("translate(" + 0 + "," + _this._ordinalScale(d.key) + ")"); });
            enterSelection.append('rect')
                .attr({
                x: 0,
                y: function (d) { return _this._ordinalScale(d.key); },
                height: 10
            })
                .style('fill', '#26408B');
            dataBound.select('rect')
                .transition()
                .attr({
                width: function (d) { return _this._yScale(d.values.length); }
            });
        };
        return womenPerIndustry;
    }());
    app.womenPerIndustry = womenPerIndustry;
})(app || (app = {}));
/// <reference path="title.ts" />
var app;
(function (app) {
    var viewPerYearOfBirth = (function () {
        function viewPerYearOfBirth(containerId, _width, _height) {
            this._width = _width;
            this._height = _height;
            this._marginTop = 50;
            this._marginBottom = 40;
            this._marginLeft = 50;
            this._marginRight = 30;
            this._container = d3.select("#" + containerId)
                .attr({
                'width': this._width,
                'height': _height
            })
                .append('g')
                .classed('chart', true);
            var container = this._container.append('g')
                .classed('chart-container', true)
                .attr('transform', "translate(" + this._marginLeft + "," + this._marginTop + ")");
            this.initXAxis(container);
            this.initYAxis(container);
            this.initPathGenerator(container);
            // this.initPoints(container);
            new app.title(this._container, this._width, 'Total number of views according to birth year');
            // this.initBrush(this._pointsGroup);
        }
        viewPerYearOfBirth.prototype.initXAxis = function (container) {
            this._scale = d3.scale.linear()
                .range([0, this._width - this._marginLeft - this._marginRight]);
            this._axis = d3.svg.axis()
                .scale(this._scale);
            this._axisGroup = container.append('g')
                .classed('axis', true)
                .attr('transform', "translate(" + 0 + "," + (this._height - this._marginBottom - this._marginTop) + ")");
        };
        viewPerYearOfBirth.prototype.initYAxis = function (container) {
            this._yScale = d3.scale.linear()
                .range([this._height - this._marginBottom - this._marginTop, 0]);
            this._yAxis = d3.svg.axis()
                .orient('left')
                .scale(this._yScale)
                .tickFormat(d3.format('s'));
            this._yAxisGroup = container.append('g')
                .classed('axis', true);
        };
        viewPerYearOfBirth.prototype.initPathGenerator = function (container) {
            var _this = this;
            this._pathGenerator = d3.svg.line()
                .x(function (d) { return _this._scale(d.Birthyear); })
                .y(function (d) { return _this._yScale(+(d['Total Page Views'].replace(/,/g, ''))); })
                .interpolate('basis');
            this._pathGroup = container.append('g')
                .append('path')
                .style({
                'fill': 'transparent',
                'stroke': '#C2E7D9',
                'stroke-width': '1px'
            });
        };
        viewPerYearOfBirth.prototype.update = function (data) {
            var years = data.map(function (d) { return +d.Birthyear; })
                .sort(function (a, b) { return a - b; });
            var mapped = data.map(function (d) { return +(d['Total Page Views'].replace(/,/g, '')); });
            this._scale.domain(d3.extent(years));
            this._axisGroup.call(this._axis);
            this._yScale.domain(d3.extent(mapped));
            this._yAxisGroup.call(this._yAxis);
            var prepared = data.filter(function (d) { return !!d.Birthyear; })
                .sort(function (a, b) { return a.Birthyear - b.Birthyear; });
            this._pathGroup
                .attr('d', this._pathGenerator(prepared));
            this._preparedData = prepared;
        };
        return viewPerYearOfBirth;
    }());
    app.viewPerYearOfBirth = viewPerYearOfBirth;
})(app || (app = {}));
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
        }
        else {
            brush.update(data);
            var filtered = data; //.filter(d => +d.Birthyear > 1500);
            refresh(filtered);
            brush.dispatch().on('brushed', function (extent) {
                var filtered = data.filter(function (d) { return +d.Birthyear >= extent[0] && +d.Birthyear <= extent[1]; }); //.filter(d => +d.Birthyear > 1500);
                console.log(filtered);
                refresh(filtered);
            });
        }
    });
    function refresh(data) {
        histogram.update(data);
        map.update(data);
        perIndustry.update(data);
        perYear.update(data);
    }
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
//# sourceMappingURL=app.js.map
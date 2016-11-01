"use strict";
var d3_scale_1 = require('d3-scale');
var d3_axis_1 = require('d3-axis');
var d3_array_1 = require('d3-array');
var colorScale_1 = require('./colorScale');
function bySubsidiariesCount(container, width, height) {
    var _chartMargin = 10;
    var _container;
    var _margins = {
        top: 30,
        right: 10,
        bottom: 10,
        left: 160
    };
    var _xScale;
    var _yScale;
    var _yAxis;
    var _yAxisGroup;
    var _seriesGroup;
    var _legendGroup;
    var _valueFn;
    var _titleGroup;
    var gradient = container.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
    gradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', colorScale_1.blueScale()(0));
    gradient.append('stop')
        .attr('offset', '100%')
        .style('stop-color', colorScale_1.blueScale()(1));
    var chartGroup = container.append('g')
        .classed('chart', true)
        .attr('transform', "translate(" + _chartMargin + "," + _chartMargin + ")");
    var plotWidth = width - 2 * _chartMargin;
    var plotHeight = height - 2 * _chartMargin;
    _container = chartGroup.append('g')
        .classed('plot', true)
        .attr('transform', "translate(" + _margins.left + "," + _margins.top + ")");
    var h = plotHeight - _margins.top - _margins.bottom;
    var w = plotWidth - _margins.left - _margins.right;
    _xScale = d3_scale_1.scaleLinear()
        .range([0, w]);
    _yScale = d3_scale_1.scaleBand()
        .range([0, h])
        .padding(0.5);
    _yAxisGroup = _container.append('g')
        .classed('vertical-axis', true);
    _yAxis = d3_axis_1.axisLeft(_yScale);
    _seriesGroup = _container.append('g')
        .classed('series-group', true);
    _titleGroup = chartGroup.append('g')
        .classed('title', true)
        .style('text-anchor', 'middle')
        .attr('transform', "translate(" + width / 2 + "," + 15 + ")")
        .append('text');
    var legendHeight = 15;
    var legendWidth = 150;
    var textWidth = 15;
    var legendGroup = chartGroup.append('g')
        .classed('legend', true)
        .attr('transform', "translate(" + (plotWidth - legendWidth - textWidth) + "," + (height - legendHeight - _margins.top) + ")");
    legendGroup.append('text')
        .classed('min', true)
        .text('0');
    legendGroup.append('rect')
        .attr('transform', "translate(" + textWidth + "," + 0 + ")")
        .attr('width', legendWidth - 2 * textWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#gradient)');
    legendGroup.append('text')
        .attr('transform', "translate(" + (legendWidth - textWidth) + "," + 0 + ")")
        .classed('max', true)
        .text('1');
    _legendGroup = legendGroup;
    function title(value) {
        _titleGroup.text(value);
        return this;
    }
    function value(value) {
        _valueFn = value;
        return this;
    }
    function update(data) {
        var sorted = data.sort(function (a, b) { return _valueFn(b) - _valueFn(a); }).slice(0, 30);
        var domain = sorted.map(function (d) { return d.company; });
        _yScale.domain(domain);
        _yAxisGroup.call(_yAxis);
        var xDomain = [0, d3_array_1.max(sorted, _valueFn)];
        _xScale.domain(xDomain);
        var dataBound = _seriesGroup.selectAll('.series')
            .data(sorted);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('series', true)
            .attr('transform', function (d) { return ("translate(" + 0 + "," + _yScale(d.company) + ")"); });
        var cs = d3_scale_1.scaleLinear()
            .domain(xDomain)
            .range([0, 1]);
        enterSelection
            .append('rect')
            .attr('width', function (d) { return _xScale(_valueFn(d)); })
            .attr('height', _yScale.bandwidth())
            .style('fill', function (d) { return colorScale_1.blueScale()(cs(_valueFn(d))); });
        _legendGroup.select('.max')
            .text(xDomain[1]);
    }
    return {
        update: update,
        valueFn: value,
        title: title
    };
}
exports.bySubsidiariesCount = bySubsidiariesCount;
//# sourceMappingURL=bySubsidiariesCount.js.map
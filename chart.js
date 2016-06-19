(function () {
    'use strict';
    d3.chart = function (container, width, height) {
        var marginBottom = 50;
        var marginTop = 20;
        var marginLeft = 50;
        var marginRight = 50;
        var plotMargin = {
            top: 50,
            left: 0,
            right: 0,
            bottom: 0
        };
        var chartGroup = container
            .append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);
        var chartWidth = width - marginLeft - marginRight;
        var chartHeight = height - marginTop - marginBottom;
        var plotGroup = chartGroup
            .append('g')
            .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
        var plotWidth = chartWidth - plotMargin.left - plotMargin.right;
        var plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;

        var xAxisGroup = plotGroup.append('g')
            .classed('axis', true)
            .attr('transform', `translate(${0},${plotHeight})`);
        var xScale = d3.scale.ordinal()
            .rangeBands([0, plotWidth]);
        var xAxis = d3.svg.axis()
            .orient('bottom')
            .scale(xScale);

        var yScale = d3.scale.linear()
            .domain([0, 1])
            .range([plotHeight, 0]);
        var yAxis = d3.svg.axis()
            .orient('left')
            .tickFormat(d3.format('%'))
            .scale(yScale);
        var yAxisGroup = plotGroup.append('g')
            .classed('axis', true)
            .call(yAxis);
        return {
            update: function (data) {
                xScale.domain(data.map(d => d.level));
                xAxisGroup.call(xAxis);

                var seriesGroup = plotGroup.append('g')
                    .classed('series', true);
                var items = seriesGroup.selectAll('.item')
                    .data(data)
                    .enter()
                    .append('g')
                    .classed('item', true);
                items.append('rect')
                    .style('fill', 'pink')
                    .attr({
                        'x': d => xScale(d.level),
                        'y': d => yScale(d.female),
                        'width': xScale.rangeBand(),
                        height: d => plotHeight - yScale(d.female)
                    });
                items.append('rect')
                    .style('fill', 'lightblue')
                    .attr({
                        'x': d => xScale(d.level),
                        'y': 0,
                        'width': xScale.rangeBand(),
                        height: d => yScale(d.female)
                    });
            }
        }
    }
} ());
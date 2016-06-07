(function () {
    var width = 800;
    var height = 600;
    marginBottom = 50;
    marginTop = 20;
    marginLeft = 50;
    marginRight = 50;
    var plotMargin = {
        top: 50,
        left: 0,
        right: 0,
        bottom: 0
    };
    'use strict';
    var chartGroup = d3.select('svg')
        .append('g')
        .attr('transform', `translate(${marginLeft},${marginTop})`);
    var chartWidth = width - marginLeft - marginRight;
    var chartHeight = height - marginTop - marginBottom;
    var plotGroup = chartGroup
        .append('g')
        .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
    var plotWidth = chartWidth - plotMargin.left - plotMargin.right;
    var plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;

    chartGroup.append('g')
        .classed('title', true)
        .attr('transform', `translate(${width/2},${10})`)
        .append('text')
        .text('Facebook energy consumption');
    d3.csv('Facebook Energy Sources.csv',
        function (d) {
            return {
                year: +d.Year,
                energySource: d['Energy Source'],
                amount: +(d.Amount.replace('%', '')) / 100
            }
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                var test = d3.nest()
                    .key((d) => d.year)
                    .entries(data);

                var x0 = d3.scale.ordinal()
                    .domain(test.map(d => d.key))
                    .rangeRoundBands([0, plotWidth], 0.1);

                var xAxis = d3.svg.axis().scale(x0);
                var xAxisGroup = plotGroup
                    .append('g')
                    .attr('transform', `translate(0,${plotHeight})`);
                xAxisGroup.call(xAxis);
                var sources = d3.nest()
                    .key((d) => d.energySource)
                    .entries(data);
                var sourceNames = sources.map(d => d.key);
                var x1 = d3.scale.ordinal()
                    .domain(sourceNames)
                    .rangeRoundBands([0, x0.rangeBand()]);

                var yScale = d3.scale.linear()
                    .domain([0, 1])
                    .range([plotHeight, 0])

                var yAxis = d3.svg.axis()
                    .orient('left')
                    .tickFormat(d3.format('2.0%'))
                    .scale(yScale);
                var yAxisGroup = plotGroup.append('g')
                    .classed('axis', true)
                    .call(yAxis);

                var c10 = d3.scale.category10()
                    .domain(sourceNames);
                var seriesGroup = plotGroup.append('g')
                    .classed('chart-group', true);
                var enterSelection = seriesGroup.selectAll('.series')
                    .data(test)
                    .enter()
                    .append('g')
                    .classed('series', true)
                    .attr('transform', d => `translate(${x0(d.key)},${0})`);
                enterSelection.selectAll('rect')
                    .data(d => d.values)
                    .enter()
                    .append('rect')
                    .attr({
                        'x': d => x1(d.energySource),
                        'y': d => yScale(d.amount),
                        'height': d => plotHeight - yScale(d.amount),
                        'width': x1.rangeBand()
                    })
                    .style('fill', d => c10(d.energySource));

                var legend = plotGroup.append('g')
                    .classed('legend', true)
                    .attr('transform', (d, i) => `translate(${width - 200 - marginRight},${0})`);
                legend.append('rect')
                    .attr({
                        'x': 0,
                        'y': 0,
                        'width': 200,
                        'height': 110
                    })
                    .style({
                        'fill': 'rgb(250,250,250)',
                        // 'stroke': 'black'
                    })
                var les = legend.selectAll('.item')
                    .data(sourceNames)
                    .enter()
                    .append('g')
                    .classed('item', true)
                    .attr('transform', (d, i) => `translate(${10},${i * 20 + 10})`);
                les.append('rect')
                    .attr({
                        x: 0,
                        y: 0,
                        width: 10,
                        height: 10
                    })
                    .style('fill', d => c10(d));
                les.append('text')
                    .attr('transform', (d, i) => `translate(${15},${10})`)
                    .text(d => d)
            }
        })
} ());
var charting = charting || {};

(function () {
    'use strict';
    var _width;
    var _height;

    var xScale, xAxis, xAxisGroup;
    var yScale, yAxis, yAxisGroup;

    var seriesGroup;
    var dispatch = d3.dispatch('clicked');

    charting.submissionsPerWeek = (container, width, height) => {
        _width = width;
        _height = height;
        var chartMargins = {
            top: 50,
            left: 50,
            right: 50,
            bottom: 50
        };

        var chartContainer = charting.chartContainer(container, width, height, chartMargins,
            'chart');

        var chartGroup = chartContainer.group();
        var chartWidth = chartContainer.width();
        var chartHeight = chartContainer.height();
        initPlot(chartGroup, chartWidth, chartHeight);
        initTitle(chartGroup, chartWidth, chartHeight);

        return {
            update: update,
            dispatch: dispatch
        }
    }

    function initTitle(container, width, height) {
        var title = charting.title(container, width, height);
        title.text('Number of submissions per week');
    }

    function initPlot(container, width, height) {
        var plotMargin = {
            top: 40,
            left: 0,
            right: 0,
            bottom: 0
        };
        var plotContainer = charting.chartContainer(container, width, height, plotMargin, 'plot');
        var plotGroup = plotContainer.group();
        var plotWidth = plotContainer.width();
        var plotHeight = plotContainer.height();

        initxScale(plotGroup, plotWidth, plotHeight);
        inityScale(plotGroup, plotWidth, plotHeight);

        seriesGroup = plotGroup.append('g')
            .classed('series', true);
    }

    function initxScale(container, width, height) {
        xAxis = charting.horizontalAxis(container, width, height, 'bottom');
    }

    function inityScale(container, width, height) {
        yScale = d3.scale.linear()
            .domain([0, 1])
            .range([height, 0]);
        yAxis = d3.svg.axis()
            .orient('left')
            .scale(yScale);
        yAxisGroup = container.append('g')
            .classed('axis', true)
            .call(yAxis);
    }

    function update(data) {
        var byWeek = d3.nest()
            .key(d => d.week)
            .entries(data);

        xAxis.domain([0, d3.max(byWeek, w => +w.key)]);
        var xScale = xAxis.scale();

        yScale.domain([0, d3.max(byWeek, w => +w.values.length)]);
        yAxisGroup.call(yAxis);

        var dataBound = seriesGroup
            .selectAll('.data')
            .data(byWeek);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('data', true)
            .attr('transform', d => `translate(${xScale(+d.key)},${yScale(d.values.length)})`);
        enterSelection.append('circle')
            .attr({
                'cx': 0,
                'cy': 0,
                'r': 4
            })
            .style('fill', '#2ca25f')
            .on('click', d => {
                dataBound.select('circle').style({
                    'fill': '#2ca25f',
                    'stroke':'none'
                })
                d3.select(d3.event.currentTarget).style({
                    'fill': '#e5f5f9',
                    'stroke': '#2ca25f'
                })
                dispatch.clicked(d);

            });
    }

} ());
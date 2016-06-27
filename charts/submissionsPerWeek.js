var charting = charting || {};

(function () {
    'use strict';
    var _width;
    var _height;

    var xScale, xAxis, xAxisGroup;
    var yScale, yAxis, yAxisGroup;

    var seriesGroup;
    charting.submissionsPerWeek = (container, width, height) => {
        _width = width;
        _height = height;
        var marginBottom = 50;
        var marginTop = 50;
        var marginLeft = 50;
        var marginRight = 50;
        var plotMargin = {
            top: 40,
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

        initTitle(chartGroup, chartWidth, chartHeight)
        initxScale(plotGroup, plotWidth, plotHeight);
        inityScale(plotGroup, plotWidth, plotHeight);

        seriesGroup = plotGroup.append('g')
            .classed('series', true);

        return {
            update: update
        }

    }

    function initTitle(container, width, height) {
        var title = charting.title(container, width, height);
        title.text('Number of submissions per week');
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

        var dataBound = seriesGroup.selectAll('.data')
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
                'r': 2
            });
    }

} ());
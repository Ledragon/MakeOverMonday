var charting = charting || {};

(function () {
    'use strict';
    var _width;
    var _height;

    var xScale, xAxis, xAxisGroup;
    var yScale, yAxis, yAxisGroup;

    var seriesGroup;

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
    var plotWidth, plotHeight;

    var colorScale;

    charting.numberOfSubmissionsDistribution = (container, width, height) => {
        _width = width;
        _height = height;
        var chartGroup = container
            .append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);
        var chartWidth = width - marginLeft - marginRight;
        var chartHeight = height - marginTop - marginBottom;

        var plotGroup = chartGroup
            .append('g')
            .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
        plotWidth = chartWidth - plotMargin.left - plotMargin.right;
        plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;

        initTitle(chartGroup, chartWidth, chartHeight)
        initxScale(plotGroup, plotWidth, plotHeight);
        inityScale(plotGroup, plotWidth, plotHeight);

        seriesGroup = plotGroup.append('g')
            .classed('series', true);
        colorScale = d3.scale.linear()
            .range(['#e5f5f9', '#2ca25f'])
            .interpolate(d3.interpolateHcl);
        return {
            update: update
        }

    }

    function initTitle(container, width, height) {
        var title = charting.title(container, width, height);
        title.text('Submission frequency');
    }

    function initxScale(container, width, height) {
        xScale = d3.scale.linear()
            .domain([0, 25])
            .range([0, width]);
        xAxis = d3.svg.axis()
            .orient('bottom')
            .scale(xScale);
        xAxisGroup = container.append('g')
            .classed('axis', true)
            .attr('transform', `translate(${0},${height})`)
            .call(xAxis);
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
        var byPerson = d3.nest()
            .key(d => d.name)
            .entries(data);
        var count = byPerson.map(d => d.values.length);
        var byCount = d3.nest()
            .key(d => d)
            .entries(count);
        xScale.domain([0, d3.max(byCount, d => +d.key)]);
        xAxisGroup.call(xAxis);

        yScale.domain([0, d3.max(byCount, d => d.values.length)]).nice();
        yAxisGroup.call(yAxis);
        colorScale.domain(d3.extent(byCount, d => d.values.length));
        var dataBound = seriesGroup.selectAll('.data')
            .data(byCount);
        dataBound
            .exit()
            .remove();
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('data', true)
            .attr('transform', d => `translate(${xScale(+d.key)},${yScale(d.values.length)})`);
        enterSelection.append('rect')
            .attr({
                'x': -10,
                'y': 0,
                'width': 20,
                'height': d => plotHeight - yScale(d.values.length)
            })
            .style('fill', d => colorScale(d.values.length));
    }

} ());
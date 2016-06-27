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
        var chartContainer = charting.chartContainer(container, width, height, {
            top: 50,
            left: 50,
            right: 50,
            bottom: 50
        },
            'chart');
        var chartGroup = chartContainer.group();
        var chartWidth = chartContainer.width();
        var chartHeight = chartContainer.height();

        var plotContainer = charting.chartContainer(chartGroup, chartWidth, chartHeight, plotMargin, 'plot');
        var plotGroup = plotContainer.group();
        plotWidth = plotContainer.width();
        plotHeight = plotContainer.height();

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
        xAxis = charting.horizontalAxis(container, width, height, 'bottom');
    }

    function inityScale(container, width, height) {
        // yAxis = charting.linearAxis(container, width, height, 'left');
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

        xAxis.domain([0, d3.max(byCount, d => +d.key)]);
        var xScale = xAxis.scale();

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
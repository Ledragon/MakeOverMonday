(function () {
    'use strict';
    d3.chart = function (container, width, height) {
        var marginBottom = 50;
        var marginTop = 50;
        var marginLeft = 50;
        var marginRight = 50;
        var plotMargin = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        var chartGroup = container
            .append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);
        var chartWidth = width - marginLeft - marginRight;
        var chartHeight = height - marginTop - marginBottom;
        var rect = chartGroup.append('rect')
            .attr({
                'x': 0,
                'y': 0,
                'width': chartWidth,
                'height': chartHeight
            })
            .style({
                'fill': 'transparent',
                stroke: 'darkGray'
            });
        var plotGroup = chartGroup
            .append('g')
            .attr('transform', `translate(${plotMargin.left},${plotMargin.top})`);
        var plotWidth = chartWidth - plotMargin.left - plotMargin.right;
        var plotHeight = chartHeight - plotMargin.top - plotMargin.bottom;

        var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(200)
        // .startAngle(0)
        // .endAngle(d => d.percentage);
        var arcGroup = plotGroup.append('g')
            .classed('arc', true)
            .attr('transform', `translate(${250},${250})`);


        var colorScale = d3.scale.category10();

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) { return d.percentage; });

        return {
            update: function (data) {
                var domain = data.map(d => d.category);
                colorScale.domain(domain);
                arcGroup.selectAll('path')
                    .data(pie(data))
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .style('fill', d => colorScale(d.data.category));

                var legendGroup = chartGroup.append('g')
                    .classed('legend', true)
                    .attr('transform', `translate(${470},${50})`);
                var rect = legendGroup.append('rect')
                    .attr({
                        'x': 0,
                        'y': 0,
                        'width': 200,
                        'height': 400,
                    })
                    .style('fill', 'transparent')
                    .style('stroke', 'lightgray');
                var itemsGroup = legendGroup.append('g')
                  .attr('transform', `translate(${5},${10})`)
                var dataBound = itemsGroup.selectAll('.item')
                    .data(data)
                    .enter()
                    .append('g')
                    .classed('item', true)
                    .attr('transform', (d, i) => `translate(${0},${i * 20})`);
                dataBound.append('rect')
                    .attr({
                        'x': 0,
                        'y': 0,
                        'width': 10,
                        'height': 10
                    })
                    .style('fill', d => colorScale(d.category));
                dataBound.append('text')
                      .attr('transform', `translate(${15},${10})`)
                    .text(d => d.category);
            }
        }
    }
} ());
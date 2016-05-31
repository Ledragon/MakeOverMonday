function womenPerIndustry(container, width, height, data) {
    var marginTop = 50;
    var marginBotom = 50;
    var marginLeft = 20;
    var marginRight = 20;
    var chart = d3.select(`#${container}`)
        .attr({
            width: width,
            height: height
        })
        .append('g')
        .classed('chart', true);

    title(chart, width, height);

    var women = data.filter(d => d['Gender'] === 'Female');
    var nested = d3.nest()
        .key(d => d.Industry)
        .entries(women);

    var xScale = d3.scale.ordinal()
        .domain(nested.map(d => d.key))
        .rangeBands([0, width - marginLeft - marginRight]);

    var chartHeight = height - marginBotom - marginTop;
    var yScale = d3.scale.linear()
        .domain(d3.extent(nested, d => d.values.length).reverse())
        .range([chartHeight, 0]);

    var enterSelection = chart.append('g')
        .classed('bar', true)
        .attr('transform', `translate(${marginLeft}, ${marginTop})`)
        .selectAll('g.data')
        .data(nested)
        .enter()
        .append('g')
        .classed('data', true)
        .attr('transform', d=>`translate(${xScale(d.key)},${0})`);
    enterSelection.append('rect')
        .attr({
            x: 0,
            y: d => chartHeight - yScale(d.values.length),
            width: 10,
            height: d => yScale(d.values.length)
        })
        .style('fill', '#26408B');

    var xAxis = d3.svg.axis()
        .scale(xScale);
    chart.append('g')
        .classed('axis', true)
        .attr('transform',`translate(0,${height-marginBotom})`)
        .call(xAxis);
}

function title(container, width, height) {
    container.append('g')
        .classed('title', true)
        .attr('transform', `translate(${width / 2}, 40)`)
        .append('text')
        .classed('title', true)
        .text('Women per industry');
}
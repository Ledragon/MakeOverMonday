function womenPerIndustry(container, width, height, data) {
    var marginTop = 50;
    var marginBotom = 10;
    var marginLeft = 150;
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

    var chartHeight = height - marginBotom - marginTop;
    var chartWidth = width - marginLeft - marginRight;

    var ordinalScale = d3.scale.ordinal()
        .domain(nested.map(d => d.key))
        .rangeBands([0, chartHeight]);

    var yScale = d3.scale.linear()
        .domain(d3.extent(nested, d => d.values.length).reverse())
        .range([0, chartWidth]);

    var enterSelection = chart.append('g')
        .classed('bar', true)
        .attr('transform', `translate(${marginLeft}, ${marginTop})`)
        .selectAll('g.data')
        .data(nested)
        .enter()
        .append('g')
        .classed('data', true)
        .attr('transform', d => `translate(${0},${ordinalScale(d.key)})`);
    enterSelection.append('rect')
        .attr({
            x: 0,
            y: 0,
            width: d => yScale(d.values.length),
            height: 10
        })
        .style('fill', '#26408B');

    var oridnalAxis = d3.svg.axis()
        .orient('left')
        .scale(ordinalScale);
    chart.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${marginLeft},${marginTop})`)
        .call(oridnalAxis);
}

function title(container, width, height) {
    container.append('g')
        .classed('title', true)
        .attr('transform', `translate(${width / 2}, 40)`)
        .append('text')
        .classed('title', true)
        .text('Women per industry');
}
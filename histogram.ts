function histogram(container: string, width: number, height: number, data) {

    // console.log(data);
    var marginLeft = 50;
    var marginRight = 20;
    var marginTop = 40;
    var marginBottom = 40;
    // var width = 800;
    // var height = 600;
    var filtered = data//.filter(d => d['Dead or Alive'] === 'Dead')
        .sort((a, b) => a.Birthyear - b.Birthyear);
    var chart = d3.select('#' + container)
        .attr({
            width: width,
            height: height
        })
        // .attr('height', filtered.length * 5)
        .append('g')
        .classed('chart', true)
        .attr('transform', `translate(${marginLeft},${0})`);
    var plotArea = chart.append('g')
        .classed('chart-container', true)  
        .attr('transform', `translate(${0},${marginTop})`);
    var yScale = d3.time.scale()
        .range([0, height - marginTop - marginBottom])
        .domain([-3500, 2000]);

    var axis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(d3.format('YYYY'));
    var axisGroup = plotArea.append('g')
        .classed('axis', true)
        .call(axis);
    var histogram = d3.layout.histogram()
        .bins(55)
        .range([-3500, 2000])
        .value(d => d.Birthyear);
    var split = histogram(data);
    var xScale = d3.scale.linear()
        .range([0, width - marginLeft - marginRight])
        .domain([0, 6000]);
    // console.log(split)
    plotArea.append('g')
        .classed('series', true)
        .selectAll('.bin')
        .data(split)
        .enter()
        .append('g')
        .classed('bin', true)
        .attr('transform', (d: any) => `translate(${0},${yScale(d.x)})`)
        .append('rect')
        .attr({
            'x': 0,
            'y': 0,
            'height': 5,
            'width': (d: any) => {
                return xScale(d.y)
            }
        })
        .style('fill', '#A6CFD5');

    // chart.append('g')
    //     .classed('title', true)
    //     .attr('transform', `translate(${width / 2},10)`)
    //     .append('text')
    title(chart, width,'Number of famous people by century')
}
function histogram(container, width, height) {
    d3.csv('History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            // console.log(data);
            var marginLeft = 50;
            var marginRight = 20;
            var marginTop = 20;
            var marginBottom = 40;
            // var width = 800;
            // var height = 600;
            var filtered = data//.filter(d => d['Dead or Alive'] === 'Dead')
                .sort((a, b) => a.Birthyear - b.Birthyear);
            var chart = d3.select('#'+container)
                // .attr('height', filtered.length * 5)
                .append('g')
                .classed('chart', true)
                .attr('transform', `translate(${marginLeft},${marginTop})`);

            var yScale = d3.time.scale()
                .range([0, height - marginTop - marginBottom])
                .domain([-3500, 2000]);

            var axis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickFormat(d3.format('YYYY'));
            var axisGroup = chart.append('g')
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
            chart.append('g')
                .classed('series', true)
                .selectAll('.bin')
                .data(split)
                .enter()
                .append('g')
                .classed('bin', true)
                .attr('transform', d => `translate(${0},${yScale(d.x)})`)
                .append('rect')
                .attr({
                    'x': 0,
                    'y': 0,
                    'height': 5,
                    'width': d => {
                        return xScale(d.y)
                    }
                });

            chart.append('g')
                .classed('title', true)
                .attr('transform', `translate(${width/2},10)`)
                .append('text')
                .text('Number of famous people by century')
        }
    });
}
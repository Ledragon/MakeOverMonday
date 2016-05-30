function raw(container, width, height) {
    d3.csv('History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            var marginLeft = 20;
            var marginRight = 20;
            var marginTop = 40;
            var marginBottom = 0;

            var filtered = data
                .sort((a, b) => a.Birthyear - b.Birthyear);

            var chart = d3.select('#'+container)
                .attr('height', height)
                .attr('width', width)
                .append('g')
                .classed('chart', true)
                .attr('transform', `translate(${marginLeft},${marginTop})`);

            var scale = d3.time.scale()
                .range([0, width - marginLeft - marginRight])
                .domain([new Date(-3500, 0, 0), new Date(2000, 0, 0)]);
            var yScale = d3.scale.linear()
                .range([0, height - marginTop - marginBottom])
                .domain([0, data.length]);
            var axis = d3.svg.axis()
                .scale(scale)
                .orient('top')
                .tickFormat(d3.time.format('%Y'));
            var axisGroup = chart.append('g')
                .classed('axis', true)
                .call(axis);

            var persons = chart
                .selectAll('g.person')
                .data(filtered)
                .enter()
                .append('g')
                .classed('person', true)
                .attr('transform', (d, i) => 'translate(0,' + yScale(i) + ')');
            // persons
            //     .append('text')
            //     .attr({
            //         'y': 10
            //     })
            //     .text(d => d.Name + ' (' + d.Birthyear + '-' + d.To + ')');
            persons
                .append('circle')
                .attr({
                    'cx': d => scale(new Date(d.Birthyear, 0, 0)),
                    'y': 0,
                    r: 2
                })
                .style('fill', 'blue');
        }
    });
}
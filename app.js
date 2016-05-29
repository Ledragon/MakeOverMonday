d3.csv('History of Famous People.csv', function (error, data) {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
        var filtered = data.filter(d => d['Dead or Alive'] === 'Dead');
        var chart = d3.select('#container')
            .append('g')
            .classed('chart', true);
        var scale = d3.time.scale()
            .range([120, 800])
            .domain([-1000, 3000]);
        var persons = chart.selectAll('g.person')
            .data(filtered)
            .enter()
            .append('g')
            .classed('person', true)
            .attr('transform', (d, i) => 'translate(0,' + i * 30 + ')');
        persons
            .append('text')
            .attr({
                'y': 10
            })
            .text(d => d.Name);
        persons
            .append('rect')
            .attr({
                'x': d => scale(d.Birthyear),
                width: d => scale(d.To - d.Birthyear),
                height:30
            })
            .style('fill','beige');
    }
});

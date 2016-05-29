d3.csv('History of Famous People.csv', function (error, data) {
    if (error) {
        console.error(error);
    } else {
        // console.log(data);
        var filtered = data.filter(d => d['Dead or Alive'] === 'Dead')
            .sort((a, b) => a.Birthyear - b.Birthyear);
        var chart = d3.select('#container')
            .attr('height', filtered.length * 30)
            .append('g')
            .classed('chart', true);
        var scale = d3.time.scale()
            .range([120, 800])
            .domain([-3500, 2000]);
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
            .text(d => d.Name + '(' + d.Birthyear + '-' + d.To + ')');
        persons
            .append('rect')
            .attr({
                'x': d => scale(d.Birthyear),
                'y':3,
                width: d => scale(d.To)-scale(d.Birthyear),
                height: 24
            })
            .style('fill', 'beige');
    }
});

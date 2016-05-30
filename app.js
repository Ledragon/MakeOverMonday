var width = 800;
var height = 600;
function raw() {
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

            var chart = d3.select('#container')
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
// raw();

function histogram() {
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
            var chart = d3.select('#histogram')
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
                .attr({
                    'text-anchor': 'middle'
                })
                .style('font-size','1.2em')
                .text('Number of famous people by century')
        }
    });
}
histogram();
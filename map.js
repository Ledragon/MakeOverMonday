function map(container, width, height) {
    d3.csv('History of Famous People.csv', function (error, data) {
        if (error) {
            console.error(error);
        } else {
            var map = d3.select(`#${container}`)
                .append('g')
                .classed('map', true);
                //.attr('transform', 'translate(0,50)');
            map.append('g')
                .classed('title', true)
                .attr('transform', `translate(${width/2},30)`)
                .append('text')                
                .text('Number of famous people by country');
            var key = 'Country Name';
            var nested = d3.nest()
                .key(d => d[key])
                .entries(data.filter(d => d[key] && d[key] !== "Unknown"));
            d3.json('world.json', function (error, geo) {
                if (error) {
                    console.error(error);
                } else {
                    var countries = map.append('g')
                        .classed('countries', true)
                        .attr('transform', 'translate(0,50)');

                    // var extent = d3.extent(nested, n => n.values.length);
                    var extent = [0, 1600];//d3.extent(nested, n => n.values.length);
                    var color = d3.scale.linear()
                        .domain(extent)
                        .interpolate(d3.interpolateHcl)
                        .range([d3.rgb('#F0F7F4'), d3.rgb('#3C493F')]);
                    var projection = d3.geo.mercator()
                        .translate([width / 2, height / 2])
                        .scale(width / 8);
                    var pathGenerator = d3.geo.path().projection(projection);
                    countries.selectAll('path')
                        .data(geo.features)
                        .enter()
                        .append('path')
                        .attr('d', pathGenerator)
                        .style('fill', (d, i) => {
                            var lowerCase = d.properties.name.toLowerCase();
                            var index = nested.find(el => el.key.toLowerCase() === lowerCase);
                            var value = index ? index.values.length : 0;
                            var c = color(value);
                            return c;
                        });

                    var legend = map.append('g')
                        .classed('legend', true)
                        .attr('transform', `translate(10,${height - 40})`);
                    var step = 100;
                    var range = d3.range(extent[0], extent[1] + step, step);
                    legend
                        .append('g')
                        .selectAll('rect')
                        .data(range)
                        .enter()
                        .append('rect')
                        .attr({
                            'x': (d, i) => i * 10,
                            'y': 0,
                            'width': 10,
                            'height': 10
                        })
                        .style({
                            'fill': d => color(d)
                        });
                    var legnedText = legend.append('g')
                        .attr('transform', 'translate(0,25)');
                    legnedText.append('text')
                        .style({
                            'text-anchor': 'middle'
                        })
                        .text(extent[0]);

                    legnedText.append('text')
                        .attr({
                            'x': range.length * 10
                        })
                        .style({
                            'text-anchor': 'middle'
                        })
                        .text(extent[1]);
                }
            });
        }
    });
}

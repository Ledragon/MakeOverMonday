import { select } from 'd3-selection';
import { queue } from 'd3-queue';
import { csv, json } from 'd3-request';
import { geoAlbersUsa } from 'd3-geo';
import { nest } from 'd3-collection';
import { scaleBand } from 'd3-scale';
import { axisLeft } from 'd3-axis';
let width = 1900;
let height = 780;
let container = select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

let margins = {
    top: 20,
    bottom: 20,
    left: 150,
    right: 20
};

var q = queue()
    .defer(csv, 'data/Votamatic.csv')
    .defer(json, 'data/us.geo.json');
q.awaitAll((error, responses) => {
    if (error) {
        console.error(error);
    }
    else {
        let byCountry = nest()
            .key(d => d.State)
            .entries(responses[0]);

        let scale = scaleBand()
            .range([0, height - margins.top - margins.bottom])
            .domain(byCountry.map(d => d.key));
        let leftAxis = axisLeft(scale);

        container.append('g')
            .classed('left-axis', true)
            .attr('transform', `translate(${margins.left},${margins.top})`)
            .call(leftAxis);
    }
})
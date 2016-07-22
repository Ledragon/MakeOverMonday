import { Selection, select, selectAll } from 'd3-selection';
import { GeoPath, geoPath, geoMercator, geoAlbersUsa } from 'd3-geo';
// import { scaleSequential, Sequential } from 'd3-scale';
// import { interpolateReds, interpolateGreens } from 'd3-scale-chromatic';
import { json } from 'd3-request';
import { dispatch } from 'd3-dispatch';
import { D3Nest, nest } from 'd3-collection';
import {max, scan } from 'd3-array';
import { dataFormat } from './typings-custom/dataFormat';
import { colorScale } from './colorScale';

export class map {
    private _group: Selection;
    private _colorScale: colorScale;
    private _dispatch;
    constructor(container: Selection, private _width: number, private _height: number) {
        this._group = container.append('g')
            .classed('map', true);
        this._dispatch = dispatch('loaded');
        var proj = geoAlbersUsa()
            .translate([this._width / 2, this._height / 2])
            // .center([-98, 40])
            // .center([4.35,50])
            .scale(this._width);
        this._group.append('g')
            .classed('title', true)
              .attr('transform', `translate(${this._width/2},${40})`)
            .append('text')
            .text('Number of sentence to death by state')
        this._colorScale = new colorScale();
        var path = geoPath().projection(proj);
        json('data/us-states.json', (error, data: any) => {
            if (error) {
                console.error(error);
            } else {
                this._group.append('g')
                    .selectAll('.country')
                    .data(data.features)
                    .enter()
                    .append('path')
                    .classed('country', true)
                    .attr('d', path);
                this._dispatch.call('loaded', this);
            }
        });
    }

    update(data: Array<dataFormat>) {
        var byState = nest()
            .key((d: dataFormat) => d.state)
            .entries(data);
        this._colorScale.domain([0, max(byState, d => d.values.length)]);
        this._group.selectAll('.country')
            .style('fill', d => {
                var current = byState.filter(s => s.key === d.properties.name);
                return current.length > 0 ? this._colorScale.color(current[0].values.length) : this._colorScale.color(0);
            });
    }

    dispatch() {
        return this._dispatch;
    }
}
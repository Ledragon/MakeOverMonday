import { Selection, select, selectAll } from 'd3-selection';
import { GeoPath, geoPath, geoMercator, geoAlbersUsa } from 'd3-geo';
import { json } from 'd3-request';
import { dispatch } from 'd3-dispatch';
import { Nest, nest } from 'd3-collection';
import { max, range } from 'd3-array';

import { colorScale } from './colorScale';

export class map {
    private _group: Selection<any,any,any,any>;
    private _colorScale: colorScale;
    private _dispatch:any;
    private _colorScaleLegend: Selection<any, any,any,any>;
    constructor(container: Selection<any,any,any,any>, private _width: number, private _height: number) {
        this._group = container.append('g')
            .classed('map', true);
        this._dispatch = dispatch('loaded');
        var proj = geoAlbersUsa()
            .translate([this._width / 2, this._height / 2])
            // .center([-98, 40])
            // .center([4.35,50])
            .scale(this._width);
        this._colorScale = new colorScale();
        this._colorScaleLegend = this._group.append('g')
            .classed('color-legend', true)
            .attr('transform', `translate(${this._width-200},${this._height-50})`);
        this._colorScaleLegend.append('text')
            .attr('transform', `translate(${0},${12})`)
            .text('0');
        this._colorScaleLegend
            .append('text')
            .attr('id', 'max')
            .text('1')
            .attr('transform', `translate(${130},${12})`);
        var r = range(0, 1, 0.01);
        var rectWidth = 100 / r.length;
        this._colorScaleLegend
            .selectAll('rect')
            .data(r)
            .enter()
            .append('rect')
            .attr('width', rectWidth)
            .attr('height', 15)
            .style('fill', d => this._colorScale.color(d))
            .attr('transform', (d, i) => `translate(${i * rectWidth + 20},${0})`)
        // this._group.append('g')
        //     .classed('title', true)
        //       .attr('transform', `translate(${this._width/2},${40})`)
        //     .append('text')
        //     .text('Number of sentence to death by state')
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

    update(byState: Array<any>) {
        // var byState = nest()
        //     .key((d: any) => d.state)
        //     .entries(data);
        var maxValue = max(byState, d => d.values.length)
        this._colorScale.domain([0, maxValue]);
        this._colorScaleLegend.select('#max')
            .text(maxValue.toString());
        this._group.selectAll('.country')
            .style('fill', (d:any) => {
                var current = byState.filter(s => s.key === d.properties.name);
                return current.length > 0 ? this._colorScale.color(current[0].values.length) : this._colorScale.color(0);
            });
    }

    dispatch() {
        return this._dispatch;
    }

    on(event: string, callback: (d: any, i: number) => void): void{
        this._dispatch.on(event, callback);
    }
}
import * as d3 from 'd3';

import { title } from '../../../charting/title';
import { IHistory } from '../IHistory';

export class map {
    private _container: d3.Selection<any, any, any, any>;
    private _countries: d3.Selection<any, any, any, any>;
    private _legendGroup: d3.Selection<any, any, any, any>;
    private _color: any;

    private _data: any;

    constructor(containerId: string, width: number, height: number, mapFile: string) {
        this._container = d3.select(`#${containerId}`)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .classed('map', true);
        new title(this._container, width, height)
            .text('Number of famous people by country');
        var countries = this._container
            .append('g')
            .classed('countries', true)
            .attr('transform', 'translate(0,50)');
        // var extent: [number, number] = [0, 1600];
        this._color = d3.scaleLinear<any>()
            // .domain(extent)
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb('#C2E7D9'), d3.rgb('#0D0221')]);
        this.initMap(countries, width, height, mapFile);
        this.initLegend(this._container, width, height);

    }

    private initMap(container: d3.Selection<any, any, any, any>, width: number, height: number, mapFile: string) {
        var projection = d3.geoMercator()
            .translate([width / 2, height / 2])
            .scale(height / 6);
        var pathGenerator = d3.geoPath().projection(projection);
        d3.json(mapFile, (error, geo: any) => {
            if (error) {
                console.error(error);
            } else {
                this._countries = container.selectAll('path')
                    .data(geo.features)
                    .enter()
                    .append('path')
                    .attr('d', pathGenerator)
                    .style('fill', 'lightgray');
                if (this._data) {
                    this._countries
                        .style('fill', (d, i) => {
                            var lowerCase = d.properties.name.toLowerCase();
                            var index = this._data.find((el: any) => el.key.toLowerCase() === lowerCase);
                            var value = index ? index.values.length : 0;
                            var c = this._color(value);
                            return c;
                        });
                }
            }
        });
    }

    private initLegend(container: d3.Selection<any, any, any, any>, width: number, height: number) {
        this._legendGroup = container.append('g')
            .classed('legend', true)
            .attr('transform', `translate(10,${height - 40})`);
        var step = 1;
        var range = d3.range(0, 10 + step, step);
        var extent = d3.extent(range);
        this._color.domain(d3.extent(range));
        this._legendGroup
            .append('g')
            .selectAll('rect')
            .data(range)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * 10, )
            .attr('y', 0, )
            .attr('width', 10, )
            .attr('height', 10)
            .style('fill', (d: any) => this._color(d));
        var legnedText = this._legendGroup.append('g')
            .attr('transform', 'translate(0,25)');
        legnedText.append('text')
            .classed('first', true)
            .style('text-anchor', 'middle');

        legnedText.append('text')
            .classed('last', true)
            .attr('x', range.length * 10)
            .style('text-anchor', 'middle');
    }

    update(data: IHistory[]) {
        var key = 'Country Name';
        var nested = <NestedArray<any>>d3.nest<any>()
            .key(d => d[key])
            .entries(data.filter(d => d[key] && d[key] !== "Unknown"));
        this._data = nested;
        var extent = d3.extent(nested, d => d.values.length);
        this._color.domain(extent);
        this._legendGroup.select('.first').text(extent[0]);
        this._legendGroup.select('.last').text(extent[1]);
        if (this._countries) {
            this._countries
                .style('fill', (d, i) => {
                    var lowerCase = d.properties.name.toLowerCase();
                    var index = nested.find((el: any) => el.key.toLowerCase() === lowerCase);
                    var value = index ? index.values.length : 0;
                    var c = this._color(value);
                    return c;
                });
        }
    }
}

interface NestedArray<T> extends Array<T> {
    find: (predicate: (el: T) => boolean) => T;
}


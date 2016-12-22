import * as d3 from 'd3';
import { IMargins } from './IMargins';

var _plotGroup;
var _plotWidth: number;
var _plotHeight: number;

export function plot(selector: string, width: number, height: number, margins: IMargins) {
    let svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    let plotMargins = margins;
    let plotGroup = svg.append('g')
        .classed('plot', true)
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

    let plotWidth = width - plotMargins.left - plotMargins.right;
    let plotHeight = height - plotMargins.top - plotMargins.bottom;
    _plotWidth = plotWidth;
    _plotHeight = plotHeight;
    return plotGroup;
}

export function width() {
    return _plotWidth;
}
export function height() {
    return _plotHeight;
}
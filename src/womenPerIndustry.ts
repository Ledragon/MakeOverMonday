/// <reference path="title.ts" />
module app {
    export class womenPerIndustry {
        private _marginTop = 50;
        private _marginBotom = 10;
        private _marginLeft = 150;
        private _marginRight = 20;
        private _chartHeight: number;
        private _chartWidth: number;
        private _container: d3.Selection<any>;
        private _plotArea: d3.Selection<any>;
        private _barsGroup: d3.Selection<any>;
        private _ordinalAxisGroup: d3.Selection<any>;
        private _ordinalAxis: d3.svg.Axis;
        private _ordinalScale: d3.scale.Ordinal<any, any>;

        private _yScale: d3.scale.Linear<any, any>;

        constructor(containerId: string, width: number, height: number) {
            this._container = d3.select(`#${containerId}`)
                .attr({
                    width: width,
                    height: height
                })
                .append('g')
                .classed('chart', true);

            this._plotArea = this._container.append('g')
                .classed('bar', true)
                .attr('transform', `translate(${this._marginLeft}, ${this._marginTop})`)
            new app.title(this._container, width, 'Women per industry');
            this._chartHeight = height - this._marginBotom - this._marginTop;
            this._chartWidth = width - this._marginLeft - this._marginRight;
            this.initOrdinalScale(this._plotArea);
            this.initYScale(this._plotArea);
            this._barsGroup = this._plotArea.append('g')
                .classed('bars', true);
        }

        private initOrdinalScale(container: d3.Selection<any>) {
            this._ordinalScale = d3.scale.ordinal()
                .rangeBands([0, this._chartHeight]);
            this._ordinalAxis = d3.svg.axis()
                .orient('left')
                .scale(this._ordinalScale);
            this._ordinalAxisGroup = container.append('g')
                .classed('axis', true);
        }

        private initYScale(container: d3.Selection<any>) {
            this._yScale = d3.scale.linear()
                .range([0, this._chartWidth]);
        }

        update(data: Array<IHistory>) {
            var women = data.filter(d => d['Gender'] === 'Female');
            var nested = d3.nest()
                .key((d: app.IHistory) => d.Industry)
                .entries(women);

            this._yScale.domain(d3.extent(nested, d => d.values.length).reverse())
            this._ordinalScale.domain(nested.map(d => d.key));
            this._ordinalAxisGroup.call(this._ordinalAxis);
            this.updateBars(nested);
        }

        private updateBars(nested: Array<{ key: string, values: Array<any> }>) {
            var enterSelection = this._barsGroup
                .selectAll('g.data')
                .data(nested)
                .enter()
                .append('g')
                .classed('data', true)
                .attr('transform', d => `translate(${0},${this._ordinalScale(d.key)})`);
            enterSelection.append('rect')
                .attr({
                    x: 0,
                    y: 0,
                    width: d => this._yScale(d.values.length),
                    height: 10
                })
                .style('fill', '#26408B');
        }

    }
}
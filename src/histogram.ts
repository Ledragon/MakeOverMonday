module app {
    export class histogram {

        private _marginLeft = 50;
        private _marginRight = 20;
        private _marginTop = 40;
        private _marginBottom = 40;
        private _container: d3.Selection<any>;
        private _histogram: d3.layout.Histogram<number>;
        private _xScale: d3.scale.Linear<any, any>;
        private _yScale: d3.time.Scale<any, any>;
        private _seriesGroup: d3.Selection<any>;

        constructor(container: string, width: number, height: number) {
            this._container = d3.select('#' + container)
                .attr({
                    width: width,
                    height: height
                })
                .append('g')
                .classed('chart', true)
                .attr('transform', `translate(${this._marginLeft},${0})`);

            var plotArea = this._container.append('g')
                .classed('chart-container', true)
                .attr('transform', `translate(${0},${this._marginTop})`);

            this.initAxis(plotArea, height);
            this.initXAxis(width);
            this.initHistogram();
            this._seriesGroup = plotArea.append('g')
                .classed('series', true);
            title(this._container, width, 'Number of famous people by century')
        }

        private initHistogram() {
            this._histogram = d3.layout.histogram()
                .bins(55)
                .range([-3500, 2000])
                .value(d => d.Birthyear);
        }

        private initAxis(container: d3.Selection<any>, height: number) {
            this._yScale = d3.time.scale()
                .range([0, height - this._marginTop - this._marginBottom])
                .domain([-3500, 2000]);

            var axis = d3.svg.axis()
                .scale(this._yScale)
                .orient('left')
                .tickFormat(d3.format('YYYY'));
            var axisGroup = container.append('g')
                .classed('axis', true)
                .call(axis);
        }

        private initXAxis(width: number) {
            this._xScale = d3.scale.linear()
                .range([0, width - this._marginLeft - this._marginRight])
                .domain([0, 6000]);
        }

        update(data) {
            var split = this._histogram(data);

            this._seriesGroup.selectAll('.bin')
                .data(split)
                .enter()
                .append('g')
                .classed('bin', true)
                .attr('transform', (d: any) => `translate(${0},${this._yScale(d.x)})`)
                .append('rect')
                .attr({
                    'x': 0,
                    'y': 0,
                    'height': 5,
                    'width': (d: any) => {
                        return this._xScale(d.y)
                    }
                })
                .style('fill', '#A6CFD5');
        }
    }
}
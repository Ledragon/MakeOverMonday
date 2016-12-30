import * as d3 from 'd3';

import { LinearLinearChart } from '../../../charting/LinearLinearChart';

import { IHistory } from '../IHistory';

export class viewPerYearOfBirth {
    private _chart: LinearLinearChart<IHistory>;
    private _preparedData: any;

    constructor(containerId: string, private _width: number, private _height: number) {
        this._chart = new LinearLinearChart<IHistory>(containerId, _width, _height)
            .x(d => d.Birthyear)
            .y(d => +(d['Total Page Views'].replace(/,/g, '')))
            .title('Total number of views according to birth year');
    }

    update(data: Array<IHistory>): void {
        var years = data.map(d => +d.Birthyear)
            .sort((a, b) => a - b);
        var mapped = data.map(d => +(d['Total Page Views'].replace(/,/g, '')));
        
        var prepared = data.filter(d => !!d.Birthyear)
            .sort((a, b) => a.Birthyear - b.Birthyear);
        this._chart.update(prepared, d3.extent(years), d3.extent(mapped));
        this._preparedData = prepared;
    }
}

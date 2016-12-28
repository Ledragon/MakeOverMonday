import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';

import { IDataFormat } from '../../models/IDataFormat';

import { BottomCategoricalAxis } from '../../charting/bottomCategoricalAxis'
import { LeftLinearAxis } from '../../charting/LeftLinearAxis'

export var mom52 = {
    name: 'mom52',
    component: {
        templateUrl: 'mom/52/template.html',
        controller: controller
    }
}

function controller(csvService: ICsvService) {
    const width = 960;
    const height = 480;
    let plotMargins = {
        top: 50,
        bottom: 30,
        left: 80,
        right: 30
    };

    let p = plot.plot('#chart', width, height, plotMargins);
    let plotGroup = p.group();
    let plotHeight = p.height();
    let plotWidth = p.width();

    let parseFunction = (d: any) => {
        return {
            productFamily: d['Product Family'],
            2006: parseFloat(d['2006']),
            2007: parseFloat(d['2007']),
            2008: parseFloat(d['2008']),
            2009: parseFloat(d['2009']),
            2010: parseFloat(d['2010']),
            2011: parseFloat(d['2011']),
            2012: parseFloat(d['2012']),
            2013: parseFloat(d['2013']),
            2014: parseFloat(d['2014']),
            2015: parseFloat(d['2015']),
            2016: parseFloat(d['2016']),
        }
    }
    const fileName = 'mom/52/data/data.csv';
    csvService.read<any>(fileName, update, parseFunction);
    var xAxis = new BottomCategoricalAxis(plotGroup, plotWidth, plotHeight);
    let yAxis = new LeftLinearAxis(plotGroup, plotWidth, plotHeight);

    function update(data: IDataFormat<any>) {
        let columns = data.columns.splice(1, data.columns.length - 1)
        let layout = d3.stack<any>()
            .keys(columns);
        let series = layout(data);
        console.log(series)
        xAxis.domain(columns);
        yAxis.domain([0, 1]);
    };

}
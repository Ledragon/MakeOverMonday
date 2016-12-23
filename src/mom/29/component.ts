import * as d3 from 'd3';
import * as plot from '../../charting/plotFactory';
import { ICsvService } from '../../services/csvService';


import { dataFormat } from './dataFormat';
import { countByRace } from './charts/countByRace';
import { map } from './charts/map';
import { evolution } from './charts/evolution';
export var mom29 = {
    name: 'mom29',
    component: {
        templateUrl: 'mom/29/template.html',
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

    var byRace = createCountByRace();
    var bycountry = createMap();
    var evolution = createEvolution();
    var parser = d3.timeParse('%d-%m-%y');
    let parseFunction = (d: any) => {
        return {
            age: +d.Age,
            date: parser(d.Date),
            name: d.Name,
            county: d.County,
            federal: d.Federal === 'Yes',
            foreignNational: d['Foreing National'] === 'Yes',
            juvenile: d.Juvenile === 'Yes',
            method: d.Method,
            race: d.Race,
            sex: d.Sex,
            state: d.StateLong,
            region: d.Region
        };
    };
    const fileName = 'mom/29/data/The Next to Die2.csv';
    csvService.read<any>(fileName, update, parseFunction);

    function update(data: Array<any>) {
        byRace.update(data);
        bycountry.update(data);

        bycountry.dispatch().on('loaded', () => {
            bycountry.update(data);
        });
        evolution.update(data);
        d3.select('#count')
            .text(data.length.toString());
    };
}


function createCountByRace(): countByRace {
    var width = 350;
    var height = 200;
    var byRaceContainer = d3.select('#countByRace')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var byRace = new countByRace(byRaceContainer, width, height);
    return byRace;
}

function createMap(): map {
    var width = 500;
    var height = 3 / 4 * width;
    var container = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var result = new map(container, width, height);
    return result;
}

function createEvolution(): evolution {
    var div = d3.select('#evolution');
    var width = 900;
    var height = 300;
    var container = div
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var result = new evolution(container, width, height);
    return result;
}

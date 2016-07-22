import { csv } from 'd3-request';
import { dataFormat } from './typings-custom/dataFormat';
import { countByRace } from './charts/countByRace';
import { map } from './charts/map';
import {select} from 'd3-selection';

function app() {
    var byRace = createCountByRace();
    var bycountry = createMap();
    csv<any, dataFormat>('data/The Next To Die2.csv', d => {
        return {
            age: +d.Age,
            date: d.Date,
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
    }, (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            byRace.update(data);
            bycountry.update(data);

            bycountry.dispatch().on('loaded', () => {
                bycountry.update(data);
            });
        }
    })
}

function createCountByRace(): countByRace {
    var width = 400;
    var height = 200;
    var byRaceContainer = select('#countByRace')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var byRace = new countByRace(byRaceContainer, width, height);
    return byRace;
}

function createMap(): map {
    var width = 600;
    var height = 3 / 4 * width;
    var container = select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var result = new map(container, width, height);
    return result;
}


app();
import { csv } from 'd3-request';
import { dataFormat } from './typings-custom/dataFormat';
import { countByRace } from './charts/countByRace';
import {select} from 'd3-selection';

function app() {
    var byRace = createCountByRace();

    csv<any, dataFormat>('data/The Next To Die.csv', d => {
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
            state: d.State,
            region: d.Region
        };
    }, (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            byRace.update(data);
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


app();
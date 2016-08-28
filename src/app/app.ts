import { read } from './services/dataService';
import { rawData } from './models/data';
const filePath = 'data/Malaria.csv';

read(filePath, update);

function update(data: Array<rawData>) {
    console.log(data);
}
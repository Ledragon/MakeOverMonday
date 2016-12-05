import { csv } from 'd3-request';
import { select, Selection } from 'd3-selection';

csv('data/data.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});
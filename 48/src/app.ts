import * as d3 from 'd3';

d3.csv('data/Inequality.csv', (error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});
import * as d3 from 'd3';
d3.csv('data/Inequality.csv', (error: any, data: Array<any>) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});
import { csv } from 'd3-request';

csv<any>('data/Restaurant_Inspection_Scores.csv', (d: any) => {
    return {
        restaurant: d.Restaurant
    }
}, (error, data) => {
    if (error) {
        console.error(error)
    } else {
        console.log(data);
    }
})
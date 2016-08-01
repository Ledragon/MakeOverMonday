import { csv } from 'd3-request';
import {select,selectAll} from 'd3-selection';
import { nest } from 'd3-collection';

import { dataFormat } from './typings-custom/dataFormat';
import { evolution } from './charts/evolution';

function app() {
    csv<dataFormat>('data/Not Saying Groin.csv', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(data);
        }
    })
}

app();
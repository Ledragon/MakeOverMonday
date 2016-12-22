import * as d3 from 'd3';
export class CsvService {
    read(path: string, callback: (data: any) => void) {
        d3.csv(path, (error, data) => {
            if (error) {
                console.error(error);
            } else {
                callback(data);
            }
        });
    }
}
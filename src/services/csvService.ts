import * as d3 from 'd3';
export class CsvService implements ICsvService{
    read<T>(path: string, callback: (data: IDataFormat<T>) => void, parseFunction?: (d: any) => any) {
        d3.csv(path,
            parseFunction ? parseFunction : (d: any) => d as any,
            (error: any, data: IDataFormat<T>) => {
                if (error) {
                    console.error(error);
                } else {
                    callback(data);
                }
            });
    }
}

export interface ICsvService {
    read<T>(path: string, callback: (data: IDataFormat<T>) => void, parseFunction?: (d: any) => any): void;
}


interface IDataFormat<T> extends Array<T> {
    columns: string[];
}
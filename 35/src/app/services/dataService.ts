import { csv } from 'd3-request';
let _data: Array<any>;
export function read(filePath: string, callback: (data: any) => void, errorCallback?: (error: any) => void): void {
    if (!_data) {
        csv(filePath, function (error, data) {
            if (error) {
                console.error(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            } else {
                _data = data;
                callback(data);
            }
        });
    } else{
        callback(_data)
    }    
}
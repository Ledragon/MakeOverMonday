"use strict";
var d3_request_1 = require('d3-request');
var _data;
function read(filePath, callback, errorCallback) {
    if (!_data) {
        d3_request_1.csv(filePath, function (error, data) {
            if (error) {
                console.error(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            }
            else {
                _data = data;
                callback(data);
            }
        });
    }
    else {
        callback(_data);
    }
}
exports.read = read;
//# sourceMappingURL=dataService.js.map
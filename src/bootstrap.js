System.register(['d3-selection', 'd3-request'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var d3_selection_1, d3_request_1;
    function bootstrap() {
        d3_selection_1.select('#container')
            .append('div')
            .text('hello world');
        d3_request_1.csv('data/Orlando Mass Shooting.csv', function (error, data) {
            if (error) {
                console.error(error);
            }
            else {
                console.log(data);
            }
        });
    }
    exports_1("bootstrap", bootstrap);
    return {
        setters:[
            function (d3_selection_1_1) {
                d3_selection_1 = d3_selection_1_1;
            },
            function (d3_request_1_1) {
                d3_request_1 = d3_request_1_1;
            }],
        execute: function() {
        }
    }
});
